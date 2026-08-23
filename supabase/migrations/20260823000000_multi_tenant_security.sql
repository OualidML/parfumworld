-- Multi-Tenant security and data isolation migration script
-- Created on 2026-08-23

-- 1. Non-Destructive Column Additions with Cascade and Restrict settings
ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT;
ALTER TABLE search_analytics ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE perfume_alternatives ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT;

-- Set default values to automatically capture authenticated user UUID on insert
ALTER TABLE perfumes ALTER COLUMN shop_id SET DEFAULT auth.uid();
ALTER TABLE search_analytics ALTER COLUMN shop_id SET DEFAULT auth.uid();
ALTER TABLE perfume_alternatives ALTER COLUMN shop_id SET DEFAULT auth.uid();
ALTER TABLE store_settings ALTER COLUMN shop_id SET DEFAULT auth.uid();

-- 2. Explicit Legacy Data Backfill
-- Enforces that all existing database records belong to the primary shop owner's UUID
DO $$ 
DECLARE     
    first_owner_id uuid := 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid;  
BEGIN     
    IF first_owner_id IS NOT NULL THEN         
        UPDATE perfumes SET shop_id = first_owner_id WHERE shop_id IS NULL;         
        UPDATE search_analytics SET shop_id = first_owner_id WHERE shop_id IS NULL;         
        UPDATE perfume_alternatives SET shop_id = first_owner_id WHERE shop_id IS NULL;         
        UPDATE store_settings SET shop_id = first_owner_id WHERE shop_id IS NULL;     
    END IF; 
END $$;

-- 3. Enforce NOT NULL & Composite Constraints
ALTER TABLE perfumes ALTER COLUMN shop_id SET NOT NULL;
ALTER TABLE search_analytics ALTER COLUMN shop_id SET NOT NULL;
ALTER TABLE perfume_alternatives ALTER COLUMN shop_id SET NOT NULL;

ALTER TABLE store_settings DROP CONSTRAINT IF EXISTS store_settings_pkey;
ALTER TABLE store_settings ALTER COLUMN shop_id SET NOT NULL;
ALTER TABLE store_settings ADD CONSTRAINT store_settings_pkey PRIMARY KEY (shop_id, key);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_notes ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public read perfumes" ON perfumes;
DROP POLICY IF EXISTS "Allow admin write perfumes" ON perfumes;
DROP POLICY IF EXISTS "Tenant isolation: perfumes" ON perfumes;

DROP POLICY IF EXISTS "Allow public insert search_analytics" ON search_analytics;
DROP POLICY IF EXISTS "Allow admin read search_analytics" ON search_analytics;
DROP POLICY IF EXISTS "Allow admin write search_analytics" ON search_analytics;
DROP POLICY IF EXISTS "Tenant isolation: search_analytics" ON search_analytics;

DROP POLICY IF EXISTS "Allow public read access to store settings" ON store_settings;
DROP POLICY IF EXISTS "Allow admin write access to store settings" ON store_settings;
DROP POLICY IF EXISTS "Tenant isolation: store_settings" ON store_settings;

DROP POLICY IF EXISTS "Allow public read perfume_alternatives" ON perfume_alternatives;
DROP POLICY IF EXISTS "Allow admin write perfume_alternatives" ON perfume_alternatives;
DROP POLICY IF EXISTS "Tenant isolation: perfume_alternatives" ON perfume_alternatives;

DROP POLICY IF EXISTS "Allow CRUD for owners" ON wishlists;
DROP POLICY IF EXISTS "User isolation: wishlists" ON wishlists;

DROP POLICY IF EXISTS "Allow public read perfume_notes" ON perfume_notes;
DROP POLICY IF EXISTS "Allow admin write perfume_notes" ON perfume_notes;
DROP POLICY IF EXISTS "Tenant isolation: perfume_notes" ON perfume_notes;

DROP POLICY IF EXISTS "Allow public read note_categories" ON note_categories;
DROP POLICY IF EXISTS "Allow admin write note_categories" ON note_categories;
DROP POLICY IF EXISTS "Public authenticated read note_categories" ON note_categories;

DROP POLICY IF EXISTS "Allow public read notes" ON notes;
DROP POLICY IF EXISTS "Allow admin write notes" ON notes;
DROP POLICY IF EXISTS "Public authenticated read notes" ON notes;

DROP POLICY IF EXISTS "Allow public read brands" ON brands;
DROP POLICY IF EXISTS "Allow admin write brands" ON brands;
DROP POLICY IF EXISTS "Public authenticated read brands" ON brands;

-- 6. Create Tenant RLS Policies
CREATE POLICY "Tenant isolation: perfumes" ON perfumes FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);
CREATE POLICY "Tenant isolation: search_analytics" ON search_analytics FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);
CREATE POLICY "Tenant isolation: store_settings" ON store_settings FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);
CREATE POLICY "Tenant isolation: perfume_alternatives" ON perfume_alternatives FOR ALL TO authenticated USING (auth.uid() = shop_id) WITH CHECK (auth.uid() = shop_id);
CREATE POLICY "User isolation: wishlists" ON wishlists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tenant isolation: perfume_notes" ON perfume_notes FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM perfumes WHERE perfumes.id = perfume_notes.perfume_id AND perfumes.shop_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM perfumes WHERE perfumes.id = perfume_notes.perfume_id AND perfumes.shop_id = auth.uid()));

-- Global Shared Reference Tables (Read-Only for Client APIs)
CREATE POLICY "Public authenticated read note_categories" ON note_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public authenticated read notes" ON notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public authenticated read brands" ON brands FOR SELECT TO authenticated USING (true);

-- 7. Trigger for Automated Admin and Settings Provisioning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$ 
BEGIN   
    INSERT INTO public.admins (id) VALUES (new.id) ON CONFLICT (id) DO NOTHING;      
    
    INSERT INTO public.store_settings (shop_id, key, value, description) VALUES     
        (new.id, 'store_name', 'My Perfume Shop', 'The name of the boutique'),     
        (new.id, 'store_slogan', 'Premium Scents Explorer', 'Store slogan'),     
        (new.id, 'whatsapp_number', '+212600000000', 'WhatsApp order redirection number'),     
        (new.id, 'google_maps_link', 'https://maps.google.com', 'Store location URL')   
    ON CONFLICT (shop_id, key) DO NOTHING;      
    
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Functions Refactored to SECURITY INVOKER
CREATE OR REPLACE FUNCTION get_top_searched_notes(days_count int DEFAULT 30)
RETURNS TABLE (note_id uuid, name_ar text, name_en text, name_fr text, layer text, search_count bigint)
SECURITY INVOKER AS $$ 
BEGIN     
    RETURN QUERY     
    SELECT n.id, n.name_ar, n.name_en, n.name_fr, n.layer::text, count(*)::bigint     
    FROM search_analytics sa, unnest(sa.note_ids) as searched_note_id     
    JOIN notes n ON n.id = searched_note_id     
    WHERE sa.shop_id = auth.uid()       
      AND sa.created_at >= now() - (days_count || ' days')::interval     
    GROUP BY n.id, n.name_ar, n.name_en, n.name_fr, n.layer     
    ORDER BY count(*) DESC, n.name_en ASC     
    LIMIT 10; 
END; 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_failed_searches(limit_count int DEFAULT 50)
RETURNS TABLE (
    id uuid,
    note_ids uuid[],
    created_at timestamp with time zone
) SECURITY INVOKER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.note_ids,
        sa.created_at
    FROM search_analytics sa
    WHERE sa.shop_id = auth.uid()
      AND sa.resulted_in_match = false
    ORDER BY sa.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_out_of_stock_demand()
RETURNS TABLE (
    perfume_id uuid,
    perfume_name text,
    brand_name text,
    search_count bigint
) SECURITY INVOKER AS $$
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
    WHERE p.shop_id = auth.uid()
      AND sa.shop_id = auth.uid()
      AND p.in_stock = false
    GROUP BY p.id, p.name, b.name
    ORDER BY search_count DESC, p.name ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION match_perfumes(user_note_ids uuid[], excluded_note_ids uuid[] DEFAULT '{}'::uuid[])
RETURNS TABLE (
    id uuid, brand_id uuid, brand_name text, name text, gender gender_type,
    concentration concentration_type, price numeric, volume_ml integer, family text,
    in_stock boolean, is_dupe_of text, image_url text, description_ar text,
    description_en text, description_fr text, matching_note_ids uuid[], all_note_ids uuid[], match_score numeric
) SECURITY INVOKER AS $$ 
DECLARE     
    total_selected_notes int := array_length(user_note_ids, 1);     
    has_full_match boolean := false; 
BEGIN     
    IF total_selected_notes IS NOT NULL AND total_selected_notes > 0 THEN         
        SELECT EXISTS (             
            SELECT 1 FROM perfume_notes pn             
            JOIN perfumes p ON pn.perfume_id = p.id             
            WHERE pn.note_id = ANY(user_note_ids) AND p.shop_id = auth.uid()             
            GROUP BY pn.perfume_id             
            HAVING COUNT(DISTINCT pn.note_id) = total_selected_notes         
        ) INTO has_full_match;          
        
        INSERT INTO search_analytics (note_ids, resulted_in_match, shop_id)         
        VALUES (user_note_ids, COALESCE(has_full_match, false), auth.uid());     
    END IF;      
    
    RETURN QUERY     
    WITH perfume_note_counts AS (         
        SELECT pn.perfume_id, array_agg(pn.note_id) as all_notes,                
               array_agg(pn.note_id) FILTER (WHERE pn.note_id = ANY(user_note_ids)) as matched_notes         
        FROM perfume_notes pn         
        JOIN perfumes p ON pn.perfume_id = p.id         
        WHERE p.shop_id = auth.uid()         
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
    WHERE p.shop_id = auth.uid()       
      AND NOT EXISTS (           
          SELECT 1 FROM perfume_notes pn WHERE pn.perfume_id = p.id AND pn.note_id = ANY(excluded_note_ids)       
      )     
    ORDER BY match_score DESC, p.price ASC; 
END; 
$$ LANGUAGE plpgsql;
