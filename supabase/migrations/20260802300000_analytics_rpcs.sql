-- Create statistics query helper functions for the admin dashboard panel

-- 1. Top 10 searched notes in the last N days
CREATE OR REPLACE FUNCTION get_top_searched_notes(days_count int DEFAULT 30)
RETURNS TABLE (
    note_id uuid,
    name_ar text,
    name_en text,
    name_fr text,
    layer text,
    search_count bigint
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id as note_id,
        n.name_ar,
        n.name_en,
        n.name_fr,
        n.layer::text,
        count(*)::bigint as search_count
    FROM search_analytics sa,
         unnest(sa.note_ids) as searched_note_id
    JOIN notes n ON n.id = searched_note_id
    WHERE sa.created_at >= now() - (days_count || ' days')::interval
    GROUP BY n.id, n.name_ar, n.name_en, n.name_fr, n.layer
    ORDER BY search_count DESC, n.name_en ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 2. Searches with no 100% matches (failed searches)
CREATE OR REPLACE FUNCTION get_failed_searches(limit_count int DEFAULT 50)
RETURNS TABLE (
    id uuid,
    note_ids uuid[],
    created_at timestamp with time zone
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.note_ids,
        sa.created_at
    FROM search_analytics sa
    WHERE sa.resulted_in_match = false
    ORDER BY sa.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Demand for out-of-stock perfumes
-- Ranks perfumes (in_stock = false) by count of searches containing their notes
CREATE OR REPLACE FUNCTION get_out_of_stock_demand()
RETURNS TABLE (
    perfume_id uuid,
    perfume_name text,
    brand_name text,
    search_count bigint
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as perfume_id,
        p.name as perfume_name,
        b.name as brand_name,
        count(sa.id)::bigint as search_count
    FROM perfumes p
    JOIN brands b ON p.brand_id = b.id
    JOIN perfume_notes pn ON p.id = pn.perfume_id
    JOIN search_analytics sa ON pn.note_id = ANY(sa.note_ids)
    WHERE p.in_stock = false
    GROUP BY p.id, p.name, b.name
    ORDER BY search_count DESC, p.name ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;
