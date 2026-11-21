-- ============================================================================
-- SESSION 1: STRICT DATABASE ISOLATION & RLS (SUPABASE)
-- Migration: 20260902000000_strict_database_isolation_rls.sql
-- Objective:
--   1. Create standalone `public.shops` table decoupled from `auth.users(id)`.
--   2. Link `public.admins` profile table to `public.shops(id)` via `shop_id`.
--   3. Ensure `public.perfumes` has a strict `shop_id UUID NOT NULL` column
--      referencing `public.shops(id)`.
--   4. Ensure `public.notes` has a `shop_id UUID NULL` column referencing
--      `public.shops(id)` (NULL = global master catalog, UUID = client-specific custom note).
--   5. Implement strict Supabase Row Level Security (RLS) policies on
--      `public.perfumes` ("Isolated Shop Perfumes") and `public.notes`
--      ("Global and Local Notes") using JWT claims / profile lookup / request header
--      (NO `shop_id = auth.uid()` comparisons).
--   6. Refactor `public.match_perfumes` RPC signature to require `p_shop_id UUID`
--      and enforce `WHERE p.shop_id = p_shop_id` across all queries.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE STANDALONE `public.shops` TABLE & BACKFILL EXISTING TENANTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read shops" ON public.shops;
CREATE POLICY "Public read shops"
ON public.shops
FOR SELECT
USING (true);

-- Ensure the primary master shop exists in `public.shops`
INSERT INTO public.shops (id, name)
VALUES ('fbae2651-c18f-4682-99ef-2827c00044ff'::uuid, 'ParfumWorld Master Catalog')
ON CONFLICT (id) DO NOTHING;

-- Backfill any existing shop_ids already present in tenant tables into `public.shops`
INSERT INTO public.shops (id, name)
SELECT DISTINCT p.shop_id, COALESCE(
    (SELECT ss.value FROM public.store_settings ss WHERE ss.shop_id = p.shop_id AND ss.key = 'store_name' LIMIT 1),
    'Partner Perfume Shop'
)
FROM public.perfumes p
WHERE p.shop_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.shops (id, name)
SELECT DISTINCT ss.shop_id, COALESCE(
    (SELECT s2.value FROM public.store_settings s2 WHERE s2.shop_id = ss.shop_id AND s2.key = 'store_name' LIMIT 1),
    'Partner Perfume Shop'
)
FROM public.store_settings ss
WHERE ss.shop_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Link `public.admins` profile table to `public.shops(id)`
ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES public.shops(id) ON DELETE CASCADE;

UPDATE public.admins
SET shop_id = 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid
WHERE shop_id IS NULL;

-- ----------------------------------------------------------------------------
-- 2. STRICT `shop_id UUID NOT NULL` ON `public.perfumes` -> `public.shops(id)`
-- ----------------------------------------------------------------------------
ALTER TABLE public.perfumes
  ADD COLUMN IF NOT EXISTS shop_id uuid;

-- Backfill any legacy rows missing shop_id to the master shop UUID before enforcing NOT NULL
UPDATE public.perfumes
SET shop_id = 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid
WHERE shop_id IS NULL;

-- Drop legacy auth.users(id) foreign key constraint and link to public.shops(id)
ALTER TABLE public.perfumes
  DROP CONSTRAINT IF EXISTS perfumes_shop_id_fkey;

ALTER TABLE public.perfumes
  ADD CONSTRAINT perfumes_shop_id_fkey
  FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE RESTRICT;

ALTER TABLE public.perfumes
  ALTER COLUMN shop_id DROP DEFAULT,
  ALTER COLUMN shop_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_perfumes_shop_id ON public.perfumes(shop_id);

-- Also decouple auxiliary tenant tables from auth.users(id) -> public.shops(id)
ALTER TABLE public.store_settings
  DROP CONSTRAINT IF EXISTS store_settings_shop_id_fkey;
ALTER TABLE public.store_settings
  ALTER COLUMN shop_id DROP DEFAULT;
ALTER TABLE public.store_settings
  ADD CONSTRAINT store_settings_shop_id_fkey
  FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE RESTRICT;

ALTER TABLE public.search_analytics
  DROP CONSTRAINT IF EXISTS search_analytics_shop_id_fkey;
ALTER TABLE public.search_analytics
  ALTER COLUMN shop_id DROP DEFAULT;
ALTER TABLE public.search_analytics
  ADD CONSTRAINT search_analytics_shop_id_fkey
  FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;

ALTER TABLE public.perfume_alternatives
  DROP CONSTRAINT IF EXISTS perfume_alternatives_shop_id_fkey;
ALTER TABLE public.perfume_alternatives
  ALTER COLUMN shop_id DROP DEFAULT;
ALTER TABLE public.perfume_alternatives
  ADD CONSTRAINT perfume_alternatives_shop_id_fkey
  FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;

-- ----------------------------------------------------------------------------
-- 3. HYBRID `shop_id UUID NULL` ON `public.notes` -> `public.shops(id)`
--    (NULL = global master catalog, UUID = client-specific custom note)
-- ----------------------------------------------------------------------------
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS shop_id uuid;

ALTER TABLE public.notes
  ALTER COLUMN shop_id DROP DEFAULT,
  ALTER COLUMN shop_id DROP NOT NULL;

ALTER TABLE public.notes
  DROP CONSTRAINT IF EXISTS notes_shop_id_fkey;

ALTER TABLE public.notes
  ADD CONSTRAINT notes_shop_id_fkey
  FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_notes_shop_id ON public.notes(shop_id);

-- Update handle_new_user() trigger so new shop_owner signups create a dedicated row in `public.shops`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    r RECORD;
    new_shop_id uuid;
    new_perfume_id uuid;
BEGIN
    IF new.raw_user_meta_data->>'role' = 'shop_owner' THEN
        new_shop_id := COALESCE(
            NULLIF(new.raw_app_meta_data->>'shop_id', '')::uuid,
            NULLIF(new.raw_user_meta_data->>'shop_id', '')::uuid,
            gen_random_uuid()
        );

        -- Register shop in public.shops first
        INSERT INTO public.shops (id, name)
        VALUES (new_shop_id, COALESCE(new.raw_user_meta_data->>'shop_name', 'My Perfume Shop'))
        ON CONFLICT (id) DO NOTHING;

        -- Link admin profile to the new shop_id
        INSERT INTO public.admins (id, shop_id)
        VALUES (new.id, new_shop_id)
        ON CONFLICT (id) DO UPDATE SET shop_id = EXCLUDED.shop_id;

        -- Sync shop_id into auth.users raw_app_meta_data so JWT claims carry app_metadata.shop_id
        UPDATE auth.users
        SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('shop_id', new_shop_id::text, 'app_metadata_shop_id', new_shop_id::text)
        WHERE id = new.id;

        -- Auto-seed default store settings for the new tenant
        INSERT INTO public.store_settings (shop_id, key, value, description) VALUES
        (new_shop_id, 'store_name', COALESCE(new.raw_user_meta_data->>'shop_name', 'My Perfume Shop'), 'The name of the perfume boutique'),
        (new_shop_id, 'store_slogan', 'Premium Scents Explorer', 'The promotional slogan/subheading of the boutique'),
        (new_shop_id, 'whatsapp_number', '+212600000000', 'WhatsApp phone number for order processing redirection'),
        (new_shop_id, 'google_maps_link', 'https://maps.google.com', 'Google Maps link to physical store location')
        ON CONFLICT (shop_id, key) DO NOTHING;

        -- Clone all perfumes and notes mapping from Master Shop
        FOR r IN SELECT * FROM public.perfumes WHERE shop_id = 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid LOOP
            new_perfume_id := gen_random_uuid();

            INSERT INTO public.perfumes (
                id, brand_id, name, gender, concentration, price, volume_ml, family,
                season_tags, occasion_tags, in_stock, is_dupe_of, image_url,
                description_ar, description_fr, description_en, shop_id
            ) VALUES (
                new_perfume_id, r.brand_id, r.name, r.gender, r.concentration, r.price, r.volume_ml, r.family,
                r.season_tags, r.occasion_tags, r.in_stock, r.is_dupe_of, r.image_url,
                r.description_ar, r.description_fr, r.description_en, new_shop_id
            );

            INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
            SELECT new_perfume_id, note_id, layer
            FROM public.perfume_notes
            WHERE perfume_id = r.id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 4. STRICT SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
--    (Zero `shop_id = auth.uid()` comparisons — strictly resolved via JWT claims,
--     `public.admins` profile lookup, or passed `x-shop-id` request header)
-- ----------------------------------------------------------------------------
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Remove permissive public-read policies that bypassed tenant isolation
DROP POLICY IF EXISTS "Public read perfumes" ON public.perfumes;
DROP POLICY IF EXISTS "Allow public read perfumes" ON public.perfumes;
DROP POLICY IF EXISTS "Tenant isolation: perfumes" ON public.perfumes;
DROP POLICY IF EXISTS "Isolated Shop Perfumes" ON public.perfumes;
DROP POLICY IF EXISTS "Tenant write perfumes" ON public.perfumes;

DROP POLICY IF EXISTS "Public read notes" ON public.notes;
DROP POLICY IF EXISTS "Public authenticated read notes" ON public.notes;
DROP POLICY IF EXISTS "Allow public read notes" ON public.notes;
DROP POLICY IF EXISTS "Global and Local Notes" ON public.notes;
DROP POLICY IF EXISTS "Tenant write notes" ON public.notes;

-- Policy 4A: Strictly isolate `perfumes` SELECT by resolved tenant `shop_id`
CREATE POLICY "Isolated Shop Perfumes"
ON public.perfumes
FOR SELECT
USING (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1),
    NULLIF(current_setting('request.headers', true)::json->>'x-shop-id', '')::uuid,
    NULLIF(current_setting('app.current_shop_id', true), '')::uuid
  )
);

-- Policy 4B: Authenticated write policies on `perfumes` via JWT `app_metadata.shop_id` or `admins` profile lookup
CREATE POLICY "Tenant write perfumes"
ON public.perfumes
FOR ALL
TO authenticated
USING (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
)
WITH CHECK (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
);

-- Policy 4C: Allow reading global master notes (`shop_id IS NULL`) OR the active tenant's private notes
CREATE POLICY "Global and Local Notes"
ON public.notes
FOR SELECT
USING (
  shop_id IS NULL
  OR shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1),
    NULLIF(current_setting('request.headers', true)::json->>'x-shop-id', '')::uuid,
    NULLIF(current_setting('app.current_shop_id', true), '')::uuid
  )
);

-- Policy 4D: Allow authenticated shop admins to INSERT/UPDATE/DELETE only their shop's custom notes
CREATE POLICY "Tenant write notes"
ON public.notes
FOR ALL
TO authenticated
USING (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
)
WITH CHECK (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
);

-- ----------------------------------------------------------------------------
-- 5. REFACTOR `match_perfumes` RPC TO STRICTLY REQUIRE `p_shop_id UUID`
-- ----------------------------------------------------------------------------
-- Drop legacy overloads so PostgREST resolves a single unambiguous signature
DROP FUNCTION IF EXISTS public.match_perfumes(uuid[]);
DROP FUNCTION IF EXISTS public.match_perfumes(uuid[], uuid[]);
DROP FUNCTION IF EXISTS public.match_perfumes(uuid[], uuid[], uuid);

CREATE OR REPLACE FUNCTION public.match_perfumes(
    user_note_ids uuid[],
    p_shop_id uuid,
    excluded_note_ids uuid[] DEFAULT '{}'::uuid[]
)
RETURNS TABLE (
    id uuid,
    brand_id uuid,
    brand_name text,
    name text,
    gender gender_type,
    concentration concentration_type,
    price numeric,
    volume_ml integer,
    family text,
    in_stock boolean,
    is_dupe_of text,
    image_url text,
    description_ar text,
    description_en text,
    description_fr text,
    matching_note_ids uuid[],
    all_note_ids uuid[],
    match_score numeric
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_selected_notes int := array_length(user_note_ids, 1);
    has_full_match boolean := false;
BEGIN
    -- Strict guard: p_shop_id is mandatory
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant isolation';
    END IF;

    IF total_selected_notes IS NULL OR total_selected_notes = 0 THEN
        RETURN;
    END IF;

    -- Check if any perfume belonging to p_shop_id has all selected notes
    SELECT EXISTS (
        SELECT 1
        FROM public.perfume_notes pn
        JOIN public.perfumes p ON pn.perfume_id = p.id
        JOIN public.notes n ON pn.note_id = n.id
        WHERE p.shop_id = p_shop_id
          AND (n.shop_id IS NULL OR n.shop_id = p_shop_id)
          AND pn.note_id = ANY(user_note_ids)
        GROUP BY pn.perfume_id
        HAVING COUNT(DISTINCT pn.note_id) = total_selected_notes
    ) INTO has_full_match;

    -- Log tenant-scoped search analytics
    INSERT INTO public.search_analytics (note_ids, resulted_in_match, shop_id)
    VALUES (user_note_ids, COALESCE(has_full_match, false), p_shop_id);

    -- Core matching query strictly isolated by p.shop_id = p_shop_id
    RETURN QUERY
    WITH perfume_note_counts AS (
        SELECT
            pn.perfume_id,
            array_agg(pn.note_id) AS all_notes,
            array_agg(pn.note_id) FILTER (WHERE pn.note_id = ANY(user_note_ids)) AS matched_notes
        FROM public.perfume_notes pn
        JOIN public.perfumes p ON pn.perfume_id = p.id
        JOIN public.notes n ON pn.note_id = n.id
        WHERE p.shop_id = p_shop_id
          AND (n.shop_id IS NULL OR n.shop_id = p_shop_id)
        GROUP BY pn.perfume_id
    )
    SELECT
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.name,
        p.gender,
        p.concentration,
        p.price,
        p.volume_ml,
        p.family,
        p.in_stock,
        p.is_dupe_of,
        p.image_url,
        p.description_ar,
        p.description_en,
        p.description_fr,
        COALESCE(pnc.matched_notes, '{}'::uuid[]) AS matching_note_ids,
        pnc.all_notes AS all_note_ids,
        CASE
            WHEN total_selected_notes IS NULL OR total_selected_notes = 0 THEN 0.0
            ELSE ROUND(
                (COALESCE(array_length(pnc.matched_notes, 1), 0)::numeric / total_selected_notes::numeric) * 100.0,
                1
            )
        END AS match_score
    FROM public.perfumes p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN perfume_note_counts pnc ON p.id = pnc.perfume_id
    WHERE p.shop_id = p_shop_id
      AND COALESCE(array_length(pnc.matched_notes, 1), 0) > 0
      AND NOT EXISTS (
          SELECT 1
          FROM public.perfume_notes pn
          WHERE pn.perfume_id = p.id
            AND pn.note_id = ANY(excluded_note_ids)
      )
    ORDER BY match_score DESC, p.price ASC;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 6. TENANT-SCOPED ADMIN ANALYTICS RLS & RPCs (NO `auth.uid()` CONFLATION)
-- ----------------------------------------------------------------------------
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: search_analytics" ON public.search_analytics;
DROP POLICY IF EXISTS "Isolated Shop Search Analytics" ON public.search_analytics;

CREATE POLICY "Isolated Shop Search Analytics"
ON public.search_analytics
FOR ALL
TO authenticated
USING (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
)
WITH CHECK (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
);

-- Drop legacy analytics RPC signatures that lacked `p_shop_id` and compared `shop_id = auth.uid()`
DROP FUNCTION IF EXISTS public.get_top_searched_notes(int);
DROP FUNCTION IF EXISTS public.get_failed_searches(int);
DROP FUNCTION IF EXISTS public.get_out_of_stock_demand();

-- 6A. Top 10 Searched Notes strictly scoped to `p_shop_id`
CREATE OR REPLACE FUNCTION public.get_top_searched_notes(
    p_shop_id uuid,
    days_count int DEFAULT 30
)
RETURNS TABLE (
    note_id uuid,
    name_ar text,
    name_en text,
    name_fr text,
    layer text,
    search_count bigint
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant analytics isolation';
    END IF;

    RETURN QUERY
    SELECT
        n.id AS note_id,
        n.name_ar,
        n.name_en,
        n.name_fr,
        n.layer::text,
        count(*)::bigint AS search_count
    FROM public.search_analytics sa,
         unnest(sa.note_ids) AS searched_note_id
    JOIN public.notes n ON n.id = searched_note_id
    WHERE sa.shop_id = p_shop_id
      AND (n.shop_id IS NULL OR n.shop_id = p_shop_id)
      AND sa.created_at >= now() - (days_count || ' days')::interval
    GROUP BY n.id, n.name_ar, n.name_en, n.name_fr, n.layer
    ORDER BY search_count DESC, n.name_en ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 6B. Zero-Match Searches strictly scoped to `p_shop_id`
CREATE OR REPLACE FUNCTION public.get_failed_searches(
    p_shop_id uuid,
    limit_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    note_ids uuid[],
    created_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant analytics isolation';
    END IF;

    RETURN QUERY
    SELECT
        sa.id,
        sa.note_ids,
        sa.created_at
    FROM public.search_analytics sa
    WHERE sa.shop_id = p_shop_id
      AND sa.resulted_in_match = false
    ORDER BY sa.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 6C. Most Matched Out-of-Stock Perfumes strictly scoped to `p_shop_id`
CREATE OR REPLACE FUNCTION public.get_out_of_stock_demand(
    p_shop_id uuid
)
RETURNS TABLE (
    perfume_id uuid,
    perfume_name text,
    brand_name text,
    search_count bigint
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant analytics isolation';
    END IF;

    RETURN QUERY
    SELECT
        p.id AS perfume_id,
        p.name AS perfume_name,
        b.name AS brand_name,
        count(DISTINCT sa.id)::bigint AS search_count
    FROM public.perfumes p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.perfume_notes pn ON p.id = pn.perfume_id
    JOIN public.search_analytics sa ON pn.note_id = ANY(sa.note_ids)
    WHERE p.shop_id = p_shop_id
      AND sa.shop_id = p_shop_id
      AND p.in_stock = false
    GROUP BY p.id, p.name, b.name
    ORDER BY search_count DESC, p.name ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 6D. Most Matched Perfumes (In-Stock & Overall Match Popularity) strictly scoped to `p_shop_id`
CREATE OR REPLACE FUNCTION public.get_most_matched_perfumes(
    p_shop_id uuid,
    limit_count int DEFAULT 10
)
RETURNS TABLE (
    perfume_id uuid,
    perfume_name text,
    brand_name text,
    in_stock boolean,
    match_count bigint
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant analytics isolation';
    END IF;

    RETURN QUERY
    SELECT
        p.id AS perfume_id,
        p.name AS perfume_name,
        b.name AS brand_name,
        p.in_stock,
        count(DISTINCT sa.id)::bigint AS match_count
    FROM public.perfumes p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.perfume_notes pn ON p.id = pn.perfume_id
    JOIN public.search_analytics sa ON pn.note_id = ANY(sa.note_ids)
    WHERE p.shop_id = p_shop_id
      AND sa.shop_id = p_shop_id
    GROUP BY p.id, p.name, b.name, p.in_stock
    ORDER BY match_count DESC, p.name ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
