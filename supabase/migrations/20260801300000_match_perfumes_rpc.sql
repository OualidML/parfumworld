-- Create matching RPC function for perfume matching algorithm
CREATE OR REPLACE FUNCTION match_perfumes(user_note_ids uuid[])
RETURNS TABLE (
    id uuid,
    brand_id uuid,
    brand_name text,
    brand_logo_url text,
    name text,
    gender gender_type,
    concentration concentration_type,
    price numeric,
    volume_ml integer,
    family text,
    season_tags text[],
    occasion_tags text[],
    in_stock boolean,
    is_dupe_of text,
    image_url text,
    description_ar text,
    description_fr text,
    description_en text,
    match_score numeric,
    matching_note_ids uuid[],
    all_note_ids uuid[]
) SECURITY DEFINER AS $$
DECLARE
    total_selected_notes int;
    has_full_match boolean := false;
BEGIN
    total_selected_notes := array_length(user_note_ids, 1);
    IF total_selected_notes IS NULL OR total_selected_notes = 0 THEN
        RETURN;
    END IF;

    -- Check if any perfume has all user selected notes (i.e. 100% match)
    SELECT EXISTS (
        SELECT 1 
        FROM perfume_notes pn
        WHERE pn.note_id = ANY(user_note_ids)
        GROUP BY pn.perfume_id
        HAVING COUNT(DISTINCT pn.note_id) = total_selected_notes
    ) INTO has_full_match;

    -- Log search query event to search_analytics (for dashboard telemetry)
    INSERT INTO search_analytics (note_ids, resulted_in_match)
    VALUES (user_note_ids, has_full_match);

    RETURN QUERY
    WITH perfume_notes_agg AS (
        SELECT 
            pn.perfume_id,
            array_agg(pn.note_id) as all_notes,
            array_agg(pn.note_id) FILTER (WHERE pn.note_id = ANY(user_note_ids)) as matching_notes
        FROM perfume_notes pn
        GROUP BY pn.perfume_id
    )
    SELECT 
        p.id,
        p.brand_id,
        b.name as brand_name,
        b.logo_url as brand_logo_url,
        p.name,
        p.gender,
        p.concentration,
        p.price,
        p.volume_ml,
        p.family,
        p.season_tags,
        p.occasion_tags,
        p.in_stock,
        p.is_dupe_of,
        p.image_url,
        p.description_ar,
        p.description_fr,
        p.description_en,
        ROUND((coalesce(array_length(pna.matching_notes, 1), 0)::numeric / total_selected_notes::numeric) * 100.0, 2) as match_score,
        coalesce(pna.matching_notes, '{}'::uuid[]) as matching_note_ids,
        coalesce(pna.all_notes, '{}'::uuid[]) as all_note_ids
    FROM perfumes p
    JOIN brands b ON p.brand_id = b.id
    JOIN perfume_notes_agg pna ON p.id = pna.perfume_id
    WHERE coalesce(array_length(pna.matching_notes, 1), 0) > 0
    ORDER BY match_score DESC, p.name ASC;
END;
$$ LANGUAGE plpgsql;
