-- ============================================================================
-- SESSION 8: 3-DAY TRIAL SYSTEM & SHOP SUBSCRIPTION TRACKING
-- Migration: 20260904000000_shop_subscriptions.sql
-- Objective:
--   1. Add `subscription_status` ('trial' | 'active' | 'suspended') and
--      `trial_ends_at` (default now() + interval '3 days') to `public.shops`.
--   2. Grandfather existing shops to 'active' with a 100-year expiration window
--      while ensuring newly inserted shops default to a 3-day 'trial'.
--   3. Create `public.check_shop_access(p_shop_id uuid)` as SECURITY DEFINER
--      computing `is_locked` strictly on the server via Postgres `now()`.
-- ============================================================================

-- 1. Add subscription tracking columns to public.shops
ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'suspended')),
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '3 days');

-- 2. Grandfather all pre-existing shops as active
UPDATE public.shops
SET
  subscription_status = 'active',
  trial_ends_at = now() + interval '100 years'
WHERE subscription_status = 'trial';

-- 3. Server-side trial & subscription verification RPC (bypasses table RLS safely)
DROP FUNCTION IF EXISTS public.check_shop_access(uuid);

CREATE OR REPLACE FUNCTION public.check_shop_access(p_shop_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status text;
  v_trial_ends_at timestamptz;
  v_is_locked boolean;
BEGIN
  SELECT s.subscription_status, s.trial_ends_at
  INTO v_status, v_trial_ends_at
  FROM public.shops s
  WHERE s.id = p_shop_id;

  -- If no matching row exists in public.shops, never return NULL; lock access explicitly
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found', 'is_locked', true);
  END IF;

  -- Strictly evaluate expiration on the backend using server time now()
  v_is_locked := CASE
    WHEN v_status = 'active' THEN false
    WHEN v_status = 'suspended' THEN true
    WHEN v_status = 'trial' AND now() >= v_trial_ends_at THEN true
    ELSE false
  END;

  RETURN jsonb_build_object(
    'status', v_status,
    'is_locked', v_is_locked
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_shop_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_shop_access(uuid) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
