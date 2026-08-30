-- Migration file: Import external perfumes and map notes transactional RPC
-- Created on 2026-08-30

CREATE OR REPLACE FUNCTION public.import_external_perfume(
    p_name text,
    p_brand text,
    p_description_en text,
    p_image_url text,
    p_top_notes text[],
    p_heart_notes text[],
    p_base_notes text[]
)
RETURNS uuid SECURITY DEFINER AS $$
DECLARE
    v_brand_id uuid;
    v_perfume_id uuid;
    v_note_name text;
    v_note_id uuid;
    v_category_id uuid;
    v_layer note_layer;
    v_note_array text[];
    i int;
BEGIN
    -- 1. Security Check: Must be an authenticated administrator (shop owner)
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only registered shop owners can import perfumes.';
    END IF;

    -- 2. Resolve or Create Brand
    SELECT id INTO v_brand_id FROM public.brands WHERE lower(name) = lower(p_brand);
    IF v_brand_id IS NULL THEN
        INSERT INTO public.brands (name, country)
        VALUES (p_brand, 'Imported')
        RETURNING id INTO v_brand_id;
    END IF;

    -- 3. Insert Perfume record (shop_id is bound to auth.uid() representing the calling tenant)
    INSERT INTO public.perfumes (
        brand_id, name, gender, concentration, price, volume_ml, family, 
        season_tags, occasion_tags, in_stock, image_url, description_en, shop_id
    ) VALUES (
        v_brand_id, p_name, 'unisex', 'edp', 0.0, 100, 'Imported',
        '{"All Seasons"}'::text[], '{"All Occasions"}'::text[], true, p_image_url, p_description_en, auth.uid()
    )
    RETURNING id INTO v_perfume_id;

    -- 4. Dynamically resolve a fallback category ID for newly created notes
    SELECT id INTO v_category_id FROM public.note_categories WHERE name_en ILIKE '%Other%' OR name_en ILIKE '%Floral%' LIMIT 1;
    IF v_category_id IS NULL THEN
        SELECT id INTO v_category_id FROM public.note_categories LIMIT 1;
    END IF;

    -- 5. Process notes for each layer
    FOR i IN 1..3 LOOP
        IF i = 1 THEN
            v_note_array := p_top_notes;
            v_layer := 'top'::note_layer;
        ELSIF i = 2 THEN
            v_note_array := p_heart_notes;
            v_layer := 'middle'::note_layer;
        ELSE
            v_note_array := p_base_notes;
            v_layer := 'base'::note_layer;
        END IF;

        IF v_note_array IS NOT NULL THEN
            FOREACH v_note_name IN ARRAY v_note_array LOOP
                v_note_name := trim(v_note_name);
                IF v_note_name <> '' THEN
                    -- Check if note exists globally
                    SELECT id INTO v_note_id FROM public.notes WHERE lower(name_en) = lower(v_note_name);
                    
                    -- If not, create it in global notes
                    IF v_note_id IS NULL THEN
                        INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
                        VALUES (v_category_id, v_note_name, v_note_name, v_note_name, v_layer)
                        RETURNING id INTO v_note_id;
                    END IF;

                    -- Map note to perfume with conflict safety
                    INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
                    VALUES (v_perfume_id, v_note_id, v_layer)
                    ON CONFLICT (perfume_id, note_id) DO NOTHING;
                END IF;
            END LOOP;
        END IF;
    END LOOP;

    RETURN v_perfume_id;
END;
$$ LANGUAGE plpgsql;
