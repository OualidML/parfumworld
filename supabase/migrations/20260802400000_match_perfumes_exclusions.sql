-- Overwrite existing match_perfumes RPC to support note exclusions (excluded_note_ids)

CREATE OR REPLACE FUNCTION match_perfumes(
    user_note_ids uuid[],
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
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    WITH perfume_note_counts AS (
        SELECT 
            pn.perfume_id,
            array_agg(pn.note_id) as all_notes,
            -- get notes that are in user_note_ids
            array_agg(pn.note_id) filter (where pn.note_id = ANY(user_note_ids)) as matched_notes
        FROM perfume_notes pn
        GROUP BY pn.perfume_id
    )
    SELECT 
        p.id,
        p.brand_id,
        b.name as brand_name,
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
        COALESCE(pnc.matched_notes, '{}'::uuid[]) as matching_note_ids,
        pnc.all_notes as all_note_ids,
        -- Match score calculations
        CASE 
            WHEN array_length(user_note_ids, 1) IS NULL OR array_length(user_note_ids, 1) = 0 THEN 0.0
            ELSE ROUND((coalesce(array_length(pnc.matched_notes, 1), 0)::numeric / array_length(user_note_ids, 1)::numeric) * 100.0, 1)
        END as match_score
    FROM perfumes p
    JOIN brands b ON p.brand_id = b.id
    JOIN perfume_note_counts pnc ON p.id = pnc.perfume_id
    -- Exclude perfumes that have ANY note in excluded_note_ids
    WHERE NOT EXISTS (
        SELECT 1 
        FROM perfume_notes pn 
        WHERE pn.perfume_id = p.id AND pn.note_id = ANY(excluded_note_ids)
    )
    ORDER BY match_score DESC, p.price ASC;
END;
$$ LANGUAGE plpgsql;
