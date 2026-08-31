-- Migration: High-Density Catalog Seed - Session 2 (Tea Collection, White Flowers, Resins & Balsams)
-- Created on 2026-08-31
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'Bvlgari', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Bvlgari');
INSERT INTO public.brands (name, country) SELECT 'Creed', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Creed');
INSERT INTO public.brands (name, country) SELECT 'Jo Malone', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Jo Malone');
INSERT INTO public.brands (name, country) SELECT 'L''Artisan Parfumeur', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'L''Artisan Parfumeur');
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'By Kilian');
INSERT INTO public.brands (name, country) SELECT 'State of Mind', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'State of Mind');
INSERT INTO public.brands (name, country) SELECT 'Hermès', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Hermès');
INSERT INTO public.brands (name, country) SELECT 'Serge Lutens', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Serge Lutens');
INSERT INTO public.brands (name, country) SELECT 'Tom Ford', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Tom Ford');
INSERT INTO public.brands (name, country) SELECT 'Gucci', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Gucci');
INSERT INTO public.brands (name, country) SELECT 'Diptyque', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Diptyque');
INSERT INTO public.brands (name, country) SELECT 'Chanel', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Chanel');
INSERT INTO public.brands (name, country) SELECT 'Guerlain', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Guerlain');
INSERT INTO public.brands (name, country) SELECT 'Chantecaille', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Chantecaille');
INSERT INTO public.brands (name, country) SELECT 'Van Cleef & Arpels', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Van Cleef & Arpels');
INSERT INTO public.brands (name, country) SELECT 'Frederic Malle', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Frederic Malle');
INSERT INTO public.brands (name, country) SELECT 'Armani', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Armani');
INSERT INTO public.brands (name, country) SELECT 'Comme des Garçons', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Comme des Garçons');
INSERT INTO public.brands (name, country) SELECT 'Amouage', 'Oman' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Amouage');
INSERT INTO public.brands (name, country) SELECT 'Prada', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Prada');
INSERT INTO public.brands (name, country) SELECT 'Byredo', 'Sweden' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Byredo');
INSERT INTO public.brands (name, country) SELECT 'Ormonde Jayne', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Ormonde Jayne');
INSERT INTO public.brands (name, country) SELECT 'Tauer', 'Switzerland' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Tauer');
INSERT INTO public.brands (name, country) SELECT 'Penhaligon''s', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Penhaligon''s');
INSERT INTO public.brands (name, country) SELECT 'Memo Paris', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Memo Paris');

-- 2. Ensure Target Notes Exist via Dynamic Category Lookups
-- Tea Collection
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'الشاي الأخضر', 'Thé Vert', 'Green Tea', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Green Tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'الشاي الأسود', 'Thé Noir', 'Black Tea', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Black Tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'شاي الماتشا', 'Matcha', 'Matcha Tea', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Matcha Tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'الشاي الأبيض', 'Thé Blanc', 'White Tea', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'White Tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'الشاي الأزرق', 'Thé Bleu', 'Blue Tea', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Blue Tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE '%Spicy%' OR name_en ILIKE '%Herbal%' LIMIT 1), 'الشاي الأحمر', 'Thé Rouge', 'Red Tea', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Red Tea');

-- White Flowers
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ياسمين كبير الزهر', 'Jasmin Grandiflorum', 'Grandiflorum Jasmine', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Grandiflorum Jasmine');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ياسمين سامباك', 'Jasmin Sambac', 'Sambac Jasmine', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Sambac Jasmine');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زهر البرتقال', 'Fleur d''Oranger', 'Orange Blossom', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Orange Blossom');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'الغاردينيا', 'Gardénia', 'Gardenia', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Gardenia');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'الفرنجيباني', 'Frangipanier', 'Frangipani', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Frangipani');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زهرة التياري', 'Fleur de Tiaré', 'Tiare Flower', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Tiare Flower');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'الزنبق', 'Lys', 'Lily', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Lily');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ستيفانوتس', 'Stéphanotis', 'Stephanotis', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Stephanotis');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'صريمة الجدي', 'Chèvrefeuille', 'Honeysuckle', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Honeysuckle');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'الداتورا', 'Datura', 'Datura', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Datura');

-- Resins & Balsams
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'اللبان', 'Oliban', 'Olibanum', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Olibanum');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'الكوبال', 'Copal', 'Copal', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Copal');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'الإليمي', 'Élémi', 'Elemi', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Elemi');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'ستيراكس', 'Styrax', 'Styrax', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Styrax');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'بلسم بيرو', 'Baume du Pérou', 'Peru Balsam', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Peru Balsam');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'بلسم تولو', 'Baume de Tolu', 'Tolu Balsam', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Tolu Balsam');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'أوبوبوناكس', 'Opoponax', 'Oopoponax', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Opoponax');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' OR name_en ILIKE '%Ambery%' LIMIT 1), 'المصطكى', 'Mastic', 'Mastic', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Mastic');

-- 3. Populate perfumes table (35 unique perfumes mapped to shop owner UUID)
CREATE OR REPLACE FUNCTION seed_perfume_helper(
    p_brand_name text,
    p_name text,
    p_gender gender_type,
    p_concentration concentration_type,
    p_price numeric,
    p_volume_ml integer,
    p_family text,
    p_seasons text[],
    p_occasions text[],
    p_in_stock boolean,
    p_desc_en text,
    p_image_url text
) RETURNS uuid AS $$
DECLARE
    v_brand_id uuid;
    v_perfume_id uuid;
    v_shop_id uuid := 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid;
BEGIN
    SELECT id INTO v_brand_id FROM public.brands WHERE name = p_brand_name LIMIT 1;
    IF v_brand_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Avoid Duplications
    SELECT id INTO v_perfume_id FROM public.perfumes 
    WHERE name = p_name AND brand_id = v_brand_id AND shop_id = v_shop_id LIMIT 1;

    IF v_perfume_id IS NULL THEN
        INSERT INTO public.perfumes (
            brand_id, name, gender, concentration, price, volume_ml, family, 
            season_tags, occasion_tags, in_stock, description_en, image_url, shop_id
        ) VALUES (
            v_brand_id, p_name, p_gender, p_concentration, p_price, p_volume_ml, p_family, 
            p_seasons, p_occasions, p_in_stock, p_desc_en, p_image_url, v_shop_id
        ) RETURNING id INTO v_perfume_id;
    END IF;

    RETURN v_perfume_id;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    p_id uuid;
BEGIN
    -- 1. Eau Parfumée au Thé Vert
    p_id := seed_perfume_helper('Bvlgari', 'Eau Parfumée au Thé Vert', 'unisex', 'edc', 105.00, 75, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Green tea and bergamot freshness with base notes of amber and cedarwood.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Silver Mountain Water
    p_id := seed_perfume_helper('Creed', 'Silver Mountain Water', 'unisex', 'edp', 320.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An olfactory signature evoking sparkling streams of water with green tea.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' OR name_en ILIKE 'Blackcurrant' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Earl Grey & Cucumber
    p_id := seed_perfume_helper('Jo Malone', 'Earl Grey & Cucumber', 'unisex', 'edc', 145.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A burst of bergamot, distinct of Earl Grey, and the cool succulence of cucumber.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cucumber' OR name_en ILIKE 'Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Thé pour un Été
    p_id := seed_perfume_helper('L''Artisan Parfumeur', 'Thé pour un Été', 'unisex', 'edt', 150.00, 100, 'Fresh', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'An icy green tea scent with fresh mint and jasmine.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Mint' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. Imperial Tea
    p_id := seed_perfume_helper('By Kilian', 'Imperial Tea', 'unisex', 'edp', 240.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal'], true, 'A pure, linear jasmine green tea extraction.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Green Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Eau Parfumée au Thé Bleu
    p_id := seed_perfume_helper('Bvlgari', 'Eau Parfumée au Thé Bleu', 'unisex', 'edc', 105.00, 75, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Lavender and oolong blue tea notes balanced with powdery iris.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lavender' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Blue Tea' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Eau Parfumée au Thé Noir
    p_id := seed_perfume_helper('Bvlgari', 'Eau Parfumée au Thé Noir', 'unisex', 'edc', 115.00, 75, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An intense, dark black tea profile with woody oud.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Black Tea' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oud' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Eau Parfumée au Thé Rouge
    p_id := seed_perfume_helper('Bvlgari', 'Eau Parfumée au Thé Rouge', 'unisex', 'edc', 105.00, 75, 'Oriental', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'A warm red rooibos tea accord combined with sweet fig.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Red Tea' OR name_en ILIKE 'Fig' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. Butterfly Mind
    p_id := seed_perfume_helper('State of Mind', 'Butterfly Mind', 'female', 'parfum', 210.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Uplifting white tea and cherry blossom floral blend.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'White Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Hazelnut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Voyage d'Hermès
    p_id := seed_perfume_helper('Hermès', 'Voyage d''Hermès', 'unisex', 'edt', 125.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Cardamom, fresh tea leaves, and green tones.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. A La Nuit
    p_id := seed_perfume_helper('Serge Lutens', 'A La Nuit', 'female', 'edp', 180.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Night'], true, 'Deep, photorealistic grandiflorum and sambac jasmine.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Grandiflorum Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sambac Jasmine' OR name_en ILIKE 'Honey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Datura Noir
    p_id := seed_perfume_helper('Serge Lutens', 'Datura Noir', 'unisex', 'edp', 180.00, 75, 'Floral', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Forbidden datura flower with sweet almond and coconut.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Datura' OR name_en ILIKE 'Coconut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tuberose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Almond' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. Jasmin Rouge
    p_id := seed_perfume_helper('Tom Ford', 'Jasmin Rouge', 'female', 'edp', 285.00, 50, 'Floral', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Spiced jasmine sambac with amber warmth.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Cinnamon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sambac Jasmine' OR name_en ILIKE 'Ylang-Ylang' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Gucci Bloom
    p_id := seed_perfume_helper('Gucci', 'Bloom', 'female', 'edp', 135.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Rich white floral garden of jasmine sambac, tuberose, and rangoon creeper.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sambac Jasmine' OR name_en ILIKE 'Tuberose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. Do Son
    p_id := seed_perfume_helper('Diptyque', 'Do Son', 'female', 'edp', 175.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Sea breeze and fresh tuberoses, orange blossoms, and jasmine.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tuberose' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Jo Malone Orange Blossom
    p_id := seed_perfume_helper('Jo Malone', 'Orange Blossom', 'unisex', 'edc', 145.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A shimmering garden oasis centered on clementine flower and orange blossom.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Clementine Flower' OR name_en ILIKE 'Citrus' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Lily' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Love, Don't Be Shy
    p_id := seed_perfume_helper('By Kilian', 'Love, Don''t Be Shy', 'female', 'edp', 265.00, 50, 'Gourmand', ARRAY['Spring', 'Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Sweet marshmallow and orange blossom opening.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Neroli' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Honeysuckle' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Marshmallow' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Chanel Gardenia
    p_id := seed_perfume_helper('Chanel', 'Gardenia', 'female', 'edp', 200.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal'], true, 'An exceptional gardenia white floral scent from Chanel.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Gardenia' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Coconut' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Terracotta Le Parfum
    p_id := seed_perfume_helper('Guerlain', 'Terracotta Le Parfum', 'female', 'edt', 105.00, 100, 'Floral', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'Sun-kissed tiare flower and coconut water.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Coconut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tiare Flower' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Frangipane
    p_id := seed_perfume_helper('Chantecaille', 'Frangipane', 'female', 'edp', 185.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Sweet frangipani blossoms coupled with rich vanilla.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Violet' OR name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Frangipani' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Gardénia Pétale
    p_id := seed_perfume_helper('Van Cleef & Arpels', 'Gardénia Pétale', 'female', 'edp', 160.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal'], true, 'A delicate gardenia captured in full bloom with jasmine and lily.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Gardenia' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Lily' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Green Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. Carnal Flower
    p_id := seed_perfume_helper('Frederic Malle', 'Carnal Flower', 'unisex', 'edp', 390.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Night', 'Formal'], true, 'Tuberose overload balanced with eucalyptus and coconut.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Eucalyptus' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tuberose' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Coconut' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Bois d'Encens
    p_id := seed_perfume_helper('Armani', 'Bois d''Encens', 'unisex', 'edp', 290.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'A tribute to the dark olibanum / frankincense of childhood memories.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Spices' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. Avignon
    p_id := seed_perfume_helper('Comme des Garçons', 'Avignon', 'unisex', 'edt', 95.00, 50, 'Woody', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'Incense, dark myrrh, patchouli, and olibanum.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Myrrh' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Incense' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Interlude Man
    p_id := seed_perfume_helper('Amouage', 'Interlude Man', 'male', 'edp', 360.00, 100, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'Smoky oregano, amber, and deep opoponax resin.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Oregano' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Opoponax' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Oud' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Sahara Noir
    p_id := seed_perfume_helper('Tom Ford', 'Sahara Noir', 'female', 'edp', 320.00, 50, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'Warm frankincense, amber, and benzoin resins.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Benzoin' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Ambre Sultan
    p_id := seed_perfume_helper('Serge Lutens', 'Ambre Sultan', 'unisex', 'edp', 180.00, 75, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Herbal coriander, oregano, amber, and copal resin.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Coriander' OR name_en ILIKE 'Oregano' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Copal' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Eau Duelle
    p_id := seed_perfume_helper('Diptyque', 'Eau Duelle', 'unisex', 'edp', 175.00, 75, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Spicy cardamom, frankincense, elemi, and black vanilla.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Elemi' OR name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Infusion d'Iris
    p_id := seed_perfume_helper('Prada', 'Infusion d''Iris', 'female', 'edp', 135.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Precious iris, galbanum, cedar, and mastic.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Galbanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mastic' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Shalimar
    p_id := seed_perfume_helper('Guerlain', 'Shalimar', 'female', 'edp', 135.00, 90, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Warm leather, iris, vanilla, and sweet opoponax.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Citrus' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Opoponax' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Byredo 1996
    p_id := seed_perfume_helper('Byredo', '1996', 'unisex', 'edp', 190.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Spiced juniper berries, black amber, and styrax.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Juniper Berries' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Violet' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Styrax' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Tolu
    p_id := seed_perfume_helper('Ormonde Jayne', 'Tolu', 'unisex', 'edp', 160.00, 120, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Bright orange blossom opening with a rich tolu balsam base.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Clary Sage' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Tolu Balsam' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. L'Air du Désert Marocain
    p_id := seed_perfume_helper('Tauer', 'L''Air du Désert Marocain', 'unisex', 'edt', 180.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Spiced cumin, dry woods, jasmine, and labdanum resin.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Coriander' OR name_en ILIKE 'Cumin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Labdanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Halfeti
    p_id := seed_perfume_helper('Penhaligon''s', 'Halfeti', 'unisex', 'edp', 225.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Spiced red rose, dark oud wood, and warm leather base notes.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Cypress' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Nutmeg' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oud' OR name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Tiger's Nest
    p_id := seed_perfume_helper('Memo Paris', 'Tiger''s Nest', 'unisex', 'edp', 260.00, 75, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Casual'], true, 'Spiced frankincense, tolu balsam, amber, and absinthe.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Absinthe' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Tolu Balsam' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
