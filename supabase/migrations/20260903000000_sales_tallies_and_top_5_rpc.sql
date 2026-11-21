-- ============================================================================
-- SESSION 5: VERIFIED SALES TALLY & INTERACTIVE TOP 5 CHART
-- Migration: 20260903000000_sales_tallies_and_top_5_rpc.sql
-- ============================================================================

-- 1. Create `public.sales_tallies` table
CREATE TABLE IF NOT EXISTS public.sales_tallies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    perfume_id uuid NOT NULL REFERENCES public.perfumes(id) ON DELETE CASCADE,
    sold_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_tallies_shop_date ON public.sales_tallies(shop_id, sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_tallies_shop_perfume ON public.sales_tallies(shop_id, perfume_id);

-- 2. Strictly Lock RLS to Authenticated Shop Admin
ALTER TABLE public.sales_tallies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin Select Sales Tallies" ON public.sales_tallies;
CREATE POLICY "Admin Select Sales Tallies"
ON public.sales_tallies
FOR SELECT
TO authenticated
USING (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
);

DROP POLICY IF EXISTS "Admin Insert Sales Tallies" ON public.sales_tallies;
CREATE POLICY "Admin Insert Sales Tallies"
ON public.sales_tallies
FOR INSERT
TO authenticated
WITH CHECK (
  shop_id = COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'shop_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::json->>'app_metadata_shop_id', '')::uuid,
    (SELECT a.shop_id FROM public.admins a WHERE a.id = auth.uid() LIMIT 1)
  )
);

-- 3. Create `get_top_5_sold(p_shop_id uuid, p_timeframe text)` RPC
DROP FUNCTION IF EXISTS public.get_top_5_sold(uuid, text);

CREATE OR REPLACE FUNCTION public.get_top_5_sold(
    p_shop_id uuid,
    p_timeframe text DEFAULT 'monthly'
)
RETURNS TABLE (
    perfume_name text,
    brand_name text,
    sales_count bigint
)
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_unit text;
BEGIN
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'p_shop_id is required for tenant isolation';
    END IF;

    CASE lower(trim(COALESCE(p_timeframe, 'monthly')))
        WHEN 'daily' THEN
            v_unit := 'day';
        WHEN 'weekly' THEN
            v_unit := 'week';
        WHEN 'monthly' THEN
            v_unit := 'month';
        ELSE
            v_unit := 'month';
    END CASE;

    RETURN QUERY
    SELECT
        p.name AS perfume_name,
        b.name AS brand_name,
        COUNT(st.id)::bigint AS sales_count
    FROM public.sales_tallies st
    JOIN public.perfumes p ON st.perfume_id = p.id
    JOIN public.brands b ON p.brand_id = b.id
    WHERE st.shop_id = p_shop_id
      AND p.shop_id = p_shop_id
      AND st.sold_at AT TIME ZONE 'Africa/Algiers' >= date_trunc(v_unit, now() AT TIME ZONE 'Africa/Algiers')
    GROUP BY p.id, p.name, b.name
    ORDER BY sales_count DESC, p.name ASC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;
