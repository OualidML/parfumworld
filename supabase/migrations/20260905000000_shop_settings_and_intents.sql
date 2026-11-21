-- ============================================================================
-- SESSION 11: SHOP SETTINGS SCHEMA, LOGO STORAGE & SECURE MULTI-TENANT RPCS
-- Migration: 20260905000000_shop_settings_and_intents.sql
-- Objective:
--   1. Safely extend `public.shops` with dynamic branding, contact, and social columns.
--   2. Create `public.whatsapp_order_intents` with strict multi-tenant RLS
--      (anonymous clients cannot SELECT, UPDATE, or DELETE rows directly).
--   3. Create `SECURITY DEFINER` RPCs (`SET search_path = public`):
--      - `get_shop_public_profile(p_shop_id uuid)`
--      - `update_shop_settings(p_shop_id uuid, p_payload jsonb)`
--      - `log_whatsapp_intent(p_shop_id uuid, p_perfume_id uuid, p_perfume_name text)`
--      - `get_pending_whatsapp_intents(p_shop_id uuid)`
--      - `resolve_whatsapp_intent(p_shop_id uuid, p_intent_id uuid, p_action text)`
--   4. Configure the `shop-logos` Supabase Storage bucket (2MB limit, PNG/JPEG/WEBP)
--      with public read and tenant-scoped authenticated admin write/delete policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: EXTEND `public.shops` SAFELY
-- ----------------------------------------------------------------------------
ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS shop_name text NOT NULL DEFAULT 'ParfumWorld',
  ADD COLUMN IF NOT EXISTS slogan text DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram_handle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_handle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_handle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_url text DEFAULT '';

-- Backfill branding columns from existing `public.store_settings` key-value rows if the table exists
DO $$
BEGIN
  IF to_regclass('public.store_settings') IS NOT NULL THEN
    UPDATE public.shops s
    SET
      shop_name = COALESCE(
        NULLIF((SELECT ss.value FROM public.store_settings ss WHERE ss.shop_id = s.id AND ss.key = 'store_name' LIMIT 1), ''),
        NULLIF(s.name, ''),
        s.shop_name
      ),
      slogan = COALESCE(
        (SELECT ss.value FROM public.store_settings ss WHERE ss.shop_id = s.id AND ss.key = 'store_slogan' LIMIT 1),
        s.slogan,
        ''
      ),
      whatsapp_number = COALESCE(
        NULLIF(
          regexp_replace(
            COALESCE((SELECT ss.value FROM public.store_settings ss WHERE ss.shop_id = s.id AND ss.key = 'whatsapp_number' LIMIT 1), ''),
            '[^0-9]',
            '',
            'g'
          ),
          ''
        ),
        s.whatsapp_number,
        ''
      ),
      location_url = COALESCE(
        (SELECT ss.value FROM public.store_settings ss WHERE ss.shop_id = s.id AND ss.key = 'google_maps_link' LIMIT 1),
        s.location_url,
        ''
      );
  ELSE
    UPDATE public.shops s
    SET shop_name = COALESCE(NULLIF(s.name, ''), s.shop_name);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- STEP 2: ADMIN OWNERSHIP VERIFICATION HELPERS
-- ----------------------------------------------------------------------------

-- Boolean helper safe for RLS policy expressions (never throws on non-matching rows)
DROP FUNCTION IF EXISTS public.is_shop_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_shop_admin(p_shop_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_jwt_shop_id text;
BEGIN
  IF v_uid IS NULL OR p_shop_id IS NULL THEN
    RETURN false;
  END IF;

  v_jwt_shop_id := COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', ''),
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')
  );

  IF v_jwt_shop_id IS NOT NULL
     AND v_jwt_shop_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     AND v_jwt_shop_id::uuid = p_shop_id THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.id = v_uid
      AND a.shop_id = p_shop_id
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.is_shop_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_shop_admin(uuid) TO authenticated;

-- Strict assertion helper for RPCs (raises 42501 when unauthorized, returns true when authorized)
DROP FUNCTION IF EXISTS public.assert_shop_admin(uuid);

CREATE OR REPLACE FUNCTION public.assert_shop_admin(p_shop_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_shop_id IS NULL THEN
    RAISE EXCEPTION 'p_shop_id is required' USING ERRCODE = '22023';
  END IF;

  IF NOT public.is_shop_admin(p_shop_id) THEN
    RAISE EXCEPTION 'Unauthorized: user does not administer this shop' USING ERRCODE = '42501';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.assert_shop_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assert_shop_admin(uuid) TO authenticated;

-- ----------------------------------------------------------------------------
-- STEP 3: PENDING WHATSAPP ORDER INTENTS TABLE & RLS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.whatsapp_order_intents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    perfume_id uuid NOT NULL REFERENCES public.perfumes(id) ON DELETE CASCADE,
    perfume_name text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dismissed')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_order_intents_shop_status
  ON public.whatsapp_order_intents(shop_id, status, created_at DESC);

ALTER TABLE public.whatsapp_order_intents ENABLE ROW LEVEL SECURITY;

-- Anonymous users have NO direct SELECT/UPDATE/DELETE policies on whatsapp_order_intents.
-- Authenticated shop admins can only access rows belonging to their own shop_id.
DROP POLICY IF EXISTS "Admin Select WhatsApp Order Intents" ON public.whatsapp_order_intents;
CREATE POLICY "Admin Select WhatsApp Order Intents"
ON public.whatsapp_order_intents
FOR SELECT
TO authenticated
USING (public.is_shop_admin(shop_id));

DROP POLICY IF EXISTS "Admin Update WhatsApp Order Intents" ON public.whatsapp_order_intents;
CREATE POLICY "Admin Update WhatsApp Order Intents"
ON public.whatsapp_order_intents
FOR UPDATE
TO authenticated
USING (public.is_shop_admin(shop_id))
WITH CHECK (public.is_shop_admin(shop_id));

-- ----------------------------------------------------------------------------
-- STEP 4: SECURE `SECURITY DEFINER` RPCS (`SET search_path = public`)
-- ----------------------------------------------------------------------------

-- 4.1 `get_shop_public_profile(p_shop_id uuid)` (GRANT to anon, authenticated)
DROP FUNCTION IF EXISTS public.get_shop_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_shop_public_profile(p_shop_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF p_shop_id IS NULL THEN
    RAISE EXCEPTION 'p_shop_id is required' USING ERRCODE = '22023';
  END IF;

  SELECT jsonb_build_object(
    'shop_name', COALESCE(NULLIF(s.shop_name, ''), NULLIF(s.name, ''), 'ParfumWorld'),
    'slogan', COALESCE(s.slogan, ''),
    'logo_url', s.logo_url,
    'whatsapp_number', COALESCE(s.whatsapp_number, ''),
    'location_url', COALESCE(s.location_url, ''),
    'instagram_handle', COALESCE(s.instagram_handle, ''),
    'instagram_url', COALESCE(s.instagram_url, ''),
    'facebook_handle', COALESCE(s.facebook_handle, ''),
    'facebook_url', COALESCE(s.facebook_url, ''),
    'tiktok_handle', COALESCE(s.tiktok_handle, ''),
    'tiktok_url', COALESCE(s.tiktok_url, '')
  )
  INTO v_result
  FROM public.shops s
  WHERE s.id = p_shop_id;

  IF v_result IS NULL THEN
    RETURN jsonb_build_object(
      'shop_name', 'ParfumWorld',
      'slogan', '',
      'logo_url', NULL,
      'whatsapp_number', '',
      'location_url', '',
      'instagram_handle', '',
      'instagram_url', '',
      'facebook_handle', '',
      'facebook_url', '',
      'tiktok_handle', '',
      'tiktok_url', ''
    );
  END IF;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_shop_public_profile(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shop_public_profile(uuid) TO anon, authenticated;

-- 4.2 `update_shop_settings(p_shop_id uuid, p_payload jsonb)` (GRANT to authenticated ONLY)
DROP FUNCTION IF EXISTS public.update_shop_settings(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.update_shop_settings(
    p_shop_id uuid,
    p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_name text;
  v_slogan text;
  v_logo_url text;
  v_whatsapp_number text;
  v_location_url text;
  v_instagram_handle text;
  v_instagram_url text;
  v_facebook_handle text;
  v_facebook_url text;
  v_tiktok_handle text;
  v_tiktok_url text;
BEGIN
  -- 1. Enforce multi-tenant admin ownership
  PERFORM public.assert_shop_admin(p_shop_id);

  IF p_payload IS NULL THEN
    RAISE EXCEPTION 'p_payload cannot be null' USING ERRCODE = '22023';
  END IF;

  -- 2. Extract and sanitize provided fields
  v_shop_name := trim(COALESCE(p_payload->>'shop_name', ''));
  v_slogan := trim(COALESCE(p_payload->>'slogan', ''));
  v_logo_url := NULLIF(trim(COALESCE(p_payload->>'logo_url', '')), '');
  v_whatsapp_number := regexp_replace(COALESCE(p_payload->>'whatsapp_number', ''), '[^0-9]', '', 'g');
  v_location_url := trim(COALESCE(p_payload->>'location_url', ''));
  v_instagram_handle := trim(COALESCE(p_payload->>'instagram_handle', ''));
  v_instagram_url := trim(COALESCE(p_payload->>'instagram_url', ''));
  v_facebook_handle := trim(COALESCE(p_payload->>'facebook_handle', ''));
  v_facebook_url := trim(COALESCE(p_payload->>'facebook_url', ''));
  v_tiktok_handle := trim(COALESCE(p_payload->>'tiktok_handle', ''));
  v_tiktok_url := trim(COALESCE(p_payload->>'tiktok_url', ''));

  -- 3. Allow NULL or empty string '' for URLs; enforce ^https?:// check ONLY when non-empty
  IF (p_payload ? 'logo_url') AND COALESCE(v_logo_url, '') <> '' AND v_logo_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Invalid logo_url: must start with http:// or https://' USING ERRCODE = '22023';
  END IF;

  IF (p_payload ? 'location_url') AND COALESCE(v_location_url, '') <> '' AND v_location_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Invalid location_url: must start with http:// or https://' USING ERRCODE = '22023';
  END IF;

  IF (p_payload ? 'instagram_url') AND COALESCE(v_instagram_url, '') <> '' AND v_instagram_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Invalid instagram_url: must start with http:// or https://' USING ERRCODE = '22023';
  END IF;

  IF (p_payload ? 'facebook_url') AND COALESCE(v_facebook_url, '') <> '' AND v_facebook_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Invalid facebook_url: must start with http:// or https://' USING ERRCODE = '22023';
  END IF;

  IF (p_payload ? 'tiktok_url') AND COALESCE(v_tiktok_url, '') <> '' AND v_tiktok_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Invalid tiktok_url: must start with http:// or https://' USING ERRCODE = '22023';
  END IF;

  -- 4. Partial-update safe UPDATE using JSONB key-existence checks (?) for every field
  UPDATE public.shops s
  SET
    shop_name = CASE
      WHEN p_payload ? 'shop_name' THEN COALESCE(NULLIF(v_shop_name, ''), s.shop_name)
      ELSE s.shop_name
    END,
    name = CASE
      WHEN p_payload ? 'shop_name' THEN COALESCE(NULLIF(v_shop_name, ''), s.name)
      ELSE s.name
    END,
    slogan = CASE
      WHEN p_payload ? 'slogan' THEN v_slogan
      ELSE s.slogan
    END,
    logo_url = CASE
      WHEN p_payload ? 'logo_url' THEN v_logo_url
      ELSE s.logo_url
    END,
    whatsapp_number = CASE
      WHEN p_payload ? 'whatsapp_number' THEN v_whatsapp_number
      ELSE s.whatsapp_number
    END,
    location_url = CASE
      WHEN p_payload ? 'location_url' THEN v_location_url
      ELSE s.location_url
    END,
    instagram_handle = CASE
      WHEN p_payload ? 'instagram_handle' THEN v_instagram_handle
      ELSE s.instagram_handle
    END,
    instagram_url = CASE
      WHEN p_payload ? 'instagram_url' THEN v_instagram_url
      ELSE s.instagram_url
    END,
    facebook_handle = CASE
      WHEN p_payload ? 'facebook_handle' THEN v_facebook_handle
      ELSE s.facebook_handle
    END,
    facebook_url = CASE
      WHEN p_payload ? 'facebook_url' THEN v_facebook_url
      ELSE s.facebook_url
    END,
    tiktok_handle = CASE
      WHEN p_payload ? 'tiktok_handle' THEN v_tiktok_handle
      ELSE s.tiktok_handle
    END,
    tiktok_url = CASE
      WHEN p_payload ? 'tiktok_url' THEN v_tiktok_url
      ELSE s.tiktok_url
    END
  WHERE s.id = p_shop_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Shop % not found', p_shop_id USING ERRCODE = 'P0002';
  END IF;

  RETURN public.get_shop_public_profile(p_shop_id);
END;
$$;

REVOKE ALL ON FUNCTION public.update_shop_settings(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_shop_settings(uuid, jsonb) TO authenticated;

-- 4.3 `log_whatsapp_intent(p_shop_id uuid, p_perfume_id uuid, p_perfume_name text)` (GRANT to anon, authenticated)
DROP FUNCTION IF EXISTS public.log_whatsapp_intent(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.log_whatsapp_intent(
    p_shop_id uuid,
    p_perfume_id uuid,
    p_perfume_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_verified_perfume_name text;
BEGIN
  IF p_shop_id IS NULL OR p_perfume_id IS NULL THEN
    RAISE EXCEPTION 'p_shop_id and p_perfume_id are required' USING ERRCODE = '22023';
  END IF;

  -- Validate that p_perfume_id strictly belongs to p_shop_id
  SELECT p.name
  INTO v_verified_perfume_name
  FROM public.perfumes p
  WHERE p.id = p_perfume_id
    AND p.shop_id = p_shop_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Perfume does not belong to the specified shop' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.whatsapp_order_intents (
    shop_id,
    perfume_id,
    perfume_name,
    status
  )
  VALUES (
    p_shop_id,
    p_perfume_id,
    COALESCE(NULLIF(trim(p_perfume_name), ''), v_verified_perfume_name),
    'pending'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.log_whatsapp_intent(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_whatsapp_intent(uuid, uuid, text) TO anon, authenticated;

-- 4.4 `get_pending_whatsapp_intents(p_shop_id uuid)` (GRANT to authenticated ONLY)
DROP FUNCTION IF EXISTS public.get_pending_whatsapp_intents(uuid);

CREATE OR REPLACE FUNCTION public.get_pending_whatsapp_intents(p_shop_id uuid)
RETURNS SETOF public.whatsapp_order_intents
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enforce multi-tenant admin ownership
  PERFORM public.assert_shop_admin(p_shop_id);

  RETURN QUERY
  SELECT woi.*
  FROM public.whatsapp_order_intents woi
  WHERE woi.shop_id = p_shop_id
    AND woi.status = 'pending'
  ORDER BY woi.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_pending_whatsapp_intents(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_pending_whatsapp_intents(uuid) TO authenticated;

-- 4.5 `resolve_whatsapp_intent(p_shop_id uuid, p_intent_id uuid, p_action text)` (GRANT to authenticated ONLY)
DROP FUNCTION IF EXISTS public.resolve_whatsapp_intent(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.resolve_whatsapp_intent(
    p_shop_id uuid,
    p_intent_id uuid,
    p_action text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized_action text := lower(trim(COALESCE(p_action, '')));
  v_perfume_id uuid;
BEGIN
  -- Enforce multi-tenant admin ownership
  PERFORM public.assert_shop_admin(p_shop_id);

  IF v_normalized_action NOT IN ('confirmed', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid action: must be confirmed or dismissed' USING ERRCODE = '22023';
  END IF;

  -- Atomic double-click protection: transition from 'pending' -> v_normalized_action FIRST
  UPDATE public.whatsapp_order_intents
  SET status = v_normalized_action
  WHERE id = p_intent_id
    AND shop_id = p_shop_id
    AND status = 'pending'
  RETURNING perfume_id INTO v_perfume_id;

  -- If already resolved (or not found), return immediately without touching sales_tallies
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- If confirmed, record a verified sale in public.sales_tallies (identical to Admin Confirm Sale flow)
  IF v_normalized_action = 'confirmed' THEN
    INSERT INTO public.sales_tallies (shop_id, perfume_id)
    VALUES (p_shop_id, v_perfume_id);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_whatsapp_intent(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_whatsapp_intent(uuid, uuid, text) TO authenticated;

-- ----------------------------------------------------------------------------
-- STEP 5: SUPABASE STORAGE BUCKET `shop-logos` & SAFE UUID-GUARDED POLICIES
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shop-logos',
  'shop-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public Read Policy for shop logos
DROP POLICY IF EXISTS "Public Read Shop Logos" ON storage.objects;
CREATE POLICY "Public Read Shop Logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'shop-logos');

-- Authenticated Admin Insert Policy scoped to folder `${shop_id}/` with safe UUID regex guard
DROP POLICY IF EXISTS "Admin Upload Shop Logos" ON storage.objects;
CREATE POLICY "Admin Upload Shop Logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN bucket_id = 'shop-logos'
      AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN public.is_shop_admin((storage.foldername(name))[1]::uuid)
    ELSE false
  END
);

-- Authenticated Admin Update Policy scoped to folder `${shop_id}/` with safe UUID regex guard
DROP POLICY IF EXISTS "Admin Update Shop Logos" ON storage.objects;
CREATE POLICY "Admin Update Shop Logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  CASE
    WHEN bucket_id = 'shop-logos'
      AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN public.is_shop_admin((storage.foldername(name))[1]::uuid)
    ELSE false
  END
)
WITH CHECK (
  CASE
    WHEN bucket_id = 'shop-logos'
      AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN public.is_shop_admin((storage.foldername(name))[1]::uuid)
    ELSE false
  END
);

-- Authenticated Admin Delete Policy scoped to folder `${shop_id}/` with safe UUID regex guard
DROP POLICY IF EXISTS "Admin Delete Shop Logos" ON storage.objects;
CREATE POLICY "Admin Delete Shop Logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  CASE
    WHEN bucket_id = 'shop-logos'
      AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN public.is_shop_admin((storage.foldername(name))[1]::uuid)
    ELSE false
  END
);

NOTIFY pgrst, 'reload schema';
