-- Migration file: Anonymous Customer Access and Security DEFINER RPC matching
-- Created on 2026-08-23

-- 1. Unlock Global Reference Tables for Public Read Access
DROP POLICY IF EXISTS "Public authenticated read note_categories" ON public.note_categories;
DROP POLICY IF EXISTS "Allow public read note_categories" ON public.note_categories;
CREATE POLICY "Public read note_categories" ON public.note_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public authenticated read notes" ON public.notes;
DROP POLICY IF EXISTS "Allow public read notes" ON public.notes;
CREATE POLICY "Public read notes" ON public.notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public authenticated read brands" ON public.brands;
DROP POLICY IF EXISTS "Allow public read brands" ON public.brands;
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);

-- 2. Modify Tenant Tables SELECT access to allow anonymous kiosk lookups
DROP POLICY IF EXISTS "Tenant isolation: perfumes" ON public.perfumes;
DROP POLICY IF EXISTS "Allow public read perfumes" ON public.perfumes;
CREATE POLICY "Public read perfumes" ON public.perfumes FOR SELECT USING (true);
CREATE POLICY "Tenant write perfumes" ON public.perfumes FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);

DROP POLICY IF EXISTS "Tenant isolation: store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow public read access to store settings" ON public.store_settings;
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Tenant write store_settings" ON public.store_settings FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);

DROP POLICY IF EXISTS "Tenant isolation: perfume_alternatives" ON public.perfume_alternatives;
DROP POLICY IF EXISTS "Allow public read perfume_alternatives" ON public.perfume_alternatives;
CREATE POLICY "Public read perfume_alternatives" ON public.perfume_alternatives FOR SELECT USING (true);
CREATE POLICY "Tenant write perfume_alternatives" ON public.perfume_alternatives FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);

DROP POLICY IF EXISTS "Tenant isolation: perfume_notes" ON public.perfume_notes;
DROP POLICY IF EXISTS "Allow public read perfume_notes" ON public.perfume_notes;
CREATE POLICY "Public read perfume_notes" ON public.perfume_notes FOR SELECT USING (true);
CREATE POLICY "Tenant write perfume_notes" ON public.perfume_notes FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM perfumes WHERE perfumes.id = perfume_notes.perfume_id AND perfumes.shop_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM perfumes WHERE perfumes.id = perfume_notes.perfume_id AND perfumes.shop_id = auth.uid()));

-- 3. Modify match_perfumes to execute as SECURITY DEFINER and filter by p_shop_id
CREATE OR REPLACE FUNCTION match_perfumes(
    user_note_ids uuid[],
    excluded_note_ids uuid[] DEFAULT '{}'::uuid[],
    p_shop_id uuid DEFAULT NULL
)
RETURNS TABLE (
    id uuid, brand_id uuid, brand_name text, name text, gender gender_type,
    concentration concentration_type, price numeric, volume_ml integer, family text,
    in_stock boolean, is_dupe_of text, image_url text, description_ar text,
    description_en text, description_fr text, matching_note_ids uuid[], all_note_ids uuid[], match_score numeric
) SECURITY DEFINER AS $$ 
DECLARE     
    total_selected_notes int := array_length(user_note_ids, 1);     
    has_full_match boolean := false; 
BEGIN     
    -- Fail early if shop_id is not provided
    IF p_shop_id IS NULL THEN
        RETURN;
    END IF;

    IF total_selected_notes IS NOT NULL AND total_selected_notes > 0 THEN         
        SELECT EXISTS (             
            SELECT 1 FROM perfume_notes pn             
            JOIN perfumes p ON pn.perfume_id = p.id             
            WHERE pn.note_id = ANY(user_note_ids) AND p.shop_id = p_shop_id             
            GROUP BY pn.perfume_id             
            HAVING COUNT(DISTINCT pn.note_id) = total_selected_notes         
        ) INTO has_full_match;          
        
        INSERT INTO search_analytics (note_ids, resulted_in_match, shop_id)         
        VALUES (user_note_ids, COALESCE(has_full_match, false), p_shop_id);     
    END IF;      
    
    RETURN QUERY     
    WITH perfume_note_counts AS (         
        SELECT pn.perfume_id, array_agg(pn.note_id) as all_notes,                
               array_agg(pn.note_id) FILTER (WHERE pn.note_id = ANY(user_note_ids)) as matched_notes         
        FROM perfume_notes pn         
        JOIN perfumes p ON pn.perfume_id = p.id         
        WHERE p.shop_id = p_shop_id         
        GROUP BY pn.perfume_id     
    )     
    SELECT p.id, p.brand_id, b.name, p.name, p.gender, p.concentration, p.price, p.volume_ml,            
           p.family, p.in_stock, p.is_dupe_of, p.image_url, p.description_ar, p.description_en, p.description_fr,            
           COALESCE(pnc.matched_notes, '{}'::uuid[]), pnc.all_notes,            
           CASE WHEN total_selected_notes IS NULL OR total_selected_notes = 0 THEN 0.0                 
                ELSE ROUND((coalesce(array_length(pnc.matched_notes, 1), 0)::numeric / total_selected_notes::numeric) * 100.0, 1)            
           END AS match_score     
    FROM perfumes p     
    JOIN brands b ON p.brand_id = b.id     
    JOIN perfume_note_counts pnc ON p.id = pnc.perfume_id     
    WHERE p.shop_id = p_shop_id       
      AND NOT EXISTS (           
          SELECT 1 FROM perfume_notes pn WHERE pn.perfume_id = p.id AND pn.note_id = ANY(excluded_note_ids)       
      )     
    ORDER BY match_score DESC, p.price ASC; 
END; 
$$ LANGUAGE plpgsql;
