-- Migration: High-Density Catalog Seed - Session 5 (Fruits, Citrus & Aquatics)
-- Created on 2026-08-31
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'Creed', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'creed');
INSERT INTO public.brands (name, country) SELECT 'Xerjoff', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'xerjoff');
INSERT INTO public.brands (name, country) SELECT 'Tom Ford', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'tom ford');
INSERT INTO public.brands (name, country) SELECT 'Acqua di Parma', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'acqua di parma');
INSERT INTO public.brands (name, country) SELECT 'Jo Malone', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'jo malone');
INSERT INTO public.brands (name, country) SELECT 'Roja Parfums', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'roja parfums');
INSERT INTO public.brands (name, country) SELECT 'Vilhelm Parfumerie', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'vilhelm parfumerie');
INSERT INTO public.brands (name, country) SELECT 'Byredo', 'Sweden' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'byredo');
INSERT INTO public.brands (name, country) SELECT 'Atelier Cologne', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'atelier cologne');
INSERT INTO public.brands (name, country) SELECT 'Stephane Humbert Lucas 777', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'stephane humbert lucas 777');
INSERT INTO public.brands (name, country) SELECT 'Goldfield & Banks', 'Australia' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'goldfield & banks');
INSERT INTO public.brands (name, country) SELECT 'Maison Francis Kurkdjian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'maison francis kurkdjian');
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'by kilian');
INSERT INTO public.brands (name, country) SELECT 'Hermès', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'hermès' OR lower(name) = 'hermes');
INSERT INTO public.brands (name, country) SELECT 'Heeley', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'heeley');
INSERT INTO public.brands (name, country) SELECT 'Diptyque', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'diptyque');

-- 2. Ensure Target Notes Exist via Exact Category Lookups (No Wildcards)
-- Citrus & Fresh / Aquatic Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'ليمون', 'Citron', 'Lemon', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lemon');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'برغموت', 'Bergamote', 'Bergamot', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'bergamot');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'ليمون أخضر / لايم', 'Lime', 'Lime', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lime');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'يوسفي / مندرين', 'Mandarine', 'Mandarin', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'mandarin');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'جريب فروت', 'Pamplemousse', 'Grapefruit', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'grapefruit');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'برتقال دموي', 'Orange Sanguine', 'Blood Orange', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'blood orange');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'برتقال مر', 'Orange Amère', 'Bitter Orange', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'bitter orange');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'يوزو', 'Yuzu', 'Yuzu', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'yuzu');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'كليمنتين', 'Clémentine', 'Clementine', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'clementine');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'أترج / كيدرات', 'Cédrat', 'Citron', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'citron');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'ملح البحر', 'Sel de Mer', 'Sea Salt', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'sea salt');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'نيرولي', 'Néroli', 'Neroli', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'neroli');

-- Fruits
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'أناناس', 'Ananas', 'Pineapple', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'pineapple');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'مانجو', 'Mangue', 'Mango', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'mango');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'خوخ', 'Pêche', 'Peach', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'peach');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'كرز / كرز حامض', 'Cerise / Griotte', 'Sour Cherry', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'sour cherry');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'جوز الهند', 'Noix de Coco', 'Coconut', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'coconut');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'كشمش أسود', 'Cassis', 'Blackcurrant', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'blackcurrant');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'كمثرى', 'Poire', 'Pear', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'pear');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'تين', 'Figue', 'Fig', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'fig');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'توت العليق / بلاك بيري', 'Mûre', 'Blackberry', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'blackberry');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'باشن فروت / فاكهة زهرة الآلام', 'Fruit de la Passion', 'Passionfruit', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'passionfruit');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'بطيخ / شمام', 'Melon', 'Melon', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'melon');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'برقوق', 'Prune', 'Plum', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'plum');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fruity' LIMIT 1), 'ليتشي', 'Litchi', 'Lychee', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lychee');

-- 3. Helper Function for Perfume Seeding
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
    SELECT id INTO v_brand_id FROM public.brands WHERE lower(name) = lower(p_brand_name) LIMIT 1;
    IF v_brand_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Avoid Duplications
    SELECT id INTO v_perfume_id FROM public.perfumes 
    WHERE lower(name) = lower(p_name) AND brand_id = v_brand_id AND shop_id = v_shop_id LIMIT 1;

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

-- 4. Seed Perfumes and Notes
DO $$
DECLARE
    p_id uuid;
BEGIN
    -- 1. Aventus
    p_id := seed_perfume_helper('Creed', 'Aventus', 'male', 'edp', 495.00, 100, 'Fruity', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'Legendary fruity chypre with smoky pineapple, bergamot, blackcurrant, and birch.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pineapple' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Blackcurrant' OR name_en ILIKE 'Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Ambergris' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Virgin Island Water
    p_id := seed_perfume_helper('Creed', 'Virgin Island Water', 'unisex', 'edp', 470.00, 100, 'Fresh', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'Tropical paradise of coconut water, fresh lime, white bergamot, and sweet sugar cane rum.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Coconut' OR name_en ILIKE 'Lime' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Ylang-Ylang' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sugar' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Millesime Imperial
    p_id := seed_perfume_helper('Creed', 'Millesime Imperial', 'unisex', 'edp', 470.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A royal marine symphony of crisp sea salt, sparkling citrus, and luscious juicy melon.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sea Salt' OR name_en ILIKE 'Fruity Notes' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sea Water' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Erba Pura
    p_id := seed_perfume_helper('Xerjoff', 'Erba Pura', 'unisex', 'edp', 250.00, 100, 'Fruity', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Casual'], true, 'An intoxicating basket of sun-drenched Sicilian citrus, sweet exotic fruits, and white musk.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Fruity Notes' OR name_en ILIKE 'Melon' OR name_en ILIKE 'Peach' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. XJ 1861 Renaissance
    p_id := seed_perfume_helper('Xerjoff', '1861 Renaissance', 'unisex', 'edp', 260.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Authentic Italian heritage bursting with sparkling Amalfi lemon, fresh mint, and petitgrain.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Tangerine' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Rose' OR name_en ILIKE 'Lily-of-the-Valley' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Torino21
    p_id := seed_perfume_helper('Xerjoff', 'Torino21', 'unisex', 'edp', 210.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Electrifying aromatic freshness featuring crisp garden mint, lemon, basil, and thyme.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Basil' OR name_en ILIKE 'Thyme' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Blackcurrant' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Bitter Peach
    p_id := seed_perfume_helper('Tom Ford', 'Bitter Peach', 'unisex', 'edp', 395.00, 50, 'Fruity', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Night', 'Casual'], true, 'An intoxicating ripe peach nectar spiked with blood orange, dark rum, and rich cognac.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Peach' OR name_en ILIKE 'Blood Orange' OR name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Lost Cherry
    p_id := seed_perfume_helper('Tom Ford', 'Lost Cherry', 'unisex', 'edp', 395.00, 50, 'Fruity', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal', 'Casual'], true, 'A luscious journey into black cherry liqueur, bitter almond, Turkish rose, and Peru balsam.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sour Cherry' OR name_en ILIKE 'Almond' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Plum' OR name_en ILIKE 'Rose' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. Neroli Portofino
    p_id := seed_perfume_helper('Tom Ford', 'Neroli Portofino', 'unisex', 'edp', 295.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Captures the cool breezes, sparkling water, and lush foliage of the Italian Riviera.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Bitter Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Neroli' OR name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Ambrette' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Mandarino di Amalfi
    p_id := seed_perfume_helper('Tom Ford', 'Mandarino di Amalfi', 'unisex', 'edp', 295.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A tranquil effervescence of Italian mandarin, lemon, mint, and wild wildflowers.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mandarin' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Mint' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Black Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. Fico di Amalfi
    p_id := seed_perfume_helper('Acqua di Parma', 'Blu Mediterraneo Fico di Amalfi', 'unisex', 'edt', 165.00, 150, 'Fruity', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Breathtaking landscape of Amalfi with sweet fig nectar, grapefruit, and cedarwood.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Citron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Fig' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Colonia
    p_id := seed_perfume_helper('Acqua di Parma', 'Colonia', 'unisex', 'edc', 165.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Timeless Italian sophistication blending sunny Sicilian citrus with lavender and rosemary.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Sweet Orange' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Rosemary' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. Arancia di Capri
    p_id := seed_perfume_helper('Acqua di Parma', 'Blu Mediterraneo Arancia di Capri', 'unisex', 'edt', 165.00, 150, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A relaxing and sunny tribute to Capri with sweet orange, mandarin, and petitgrain.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Caramel' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Wood Sage & Sea Salt
    p_id := seed_perfume_helper('Jo Malone', 'Wood Sage & Sea Salt', 'unisex', 'edc', 160.00, 100, 'Fresh', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Waves breaking white against sea cliffs, fresh sea air, mineral salt, and woody sage.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ambrette' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sea Salt' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sage' OR name_en ILIKE 'Sea Water' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. English Pear & Freesia
    p_id := seed_perfume_helper('Jo Malone', 'English Pear & Freesia', 'female', 'edc', 160.00, 100, 'Fruity', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'The sensuous freshness of just-ripe King William pears wrapped in a bouquet of white freesias.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pear' OR name_en ILIKE 'Melon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Rhubarb' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Lime Basil & Mandarin
    p_id := seed_perfume_helper('Jo Malone', 'Lime Basil & Mandarin', 'unisex', 'edc', 160.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Peppery basil and aromatic white thyme bring an unexpected twist to the scent of limes.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lime' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Basil' OR name_en ILIKE 'Thyme' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Blackberry & Bay
    p_id := seed_perfume_helper('Jo Malone', 'Blackberry & Bay', 'female', 'edc', 160.00, 100, 'Fruity', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'Childhood memories of blackberry picking with tart blackberry juice and fresh bay leaves.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Blackberry' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Bay Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Elysium Pour Homme
    p_id := seed_perfume_helper('Roja Parfums', 'Elysium Pour Homme', 'male', 'parfum', 345.00, 100, 'Fresh', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'An ultra-fresh explosion of grapefruit, lime, blackcurrant, vetiver, and ambergris.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Lime' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Blackcurrant' OR name_en ILIKE 'Apple' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambergris' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Mango Skin
    p_id := seed_perfume_helper('Vilhelm Parfumerie', 'Mango Skin', 'unisex', 'edp', 250.00, 100, 'Fruity', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Ripe juicy mango, blackberries, and black pepper with warm vanilla and patchouli.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mango' OR name_en ILIKE 'Blackberry' OR name_en ILIKE 'Black Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Sugar' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Pulp
    p_id := seed_perfume_helper('Byredo', 'Pulp', 'unisex', 'edp', 290.00, 100, 'Fruity', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An exuberant riot of sweet ripe figs, red apples, blackcurrant, and praline.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Blackcurrant' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Fig' OR name_en ILIKE 'Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Peach' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Bal d'Afrique
    p_id := seed_perfume_helper('Byredo', 'Bal d''Afrique', 'unisex', 'edp', 290.00, 100, 'Fresh', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Casual'], true, 'Vibrant African marigold, sparkling Amalfi lemon, blackcurrant, and Moroccan cedarwood.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Blackcurrant' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. Orange Sanguine
    p_id := seed_perfume_helper('Atelier Cologne', 'Orange Sanguine', 'unisex', 'edc', 145.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Photorealistic fresh-cut blood orange and bitter Seville orange with geranium and sandalwood.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Blood Orange' OR name_en ILIKE 'Bitter Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Geranium' OR name_en ILIKE 'Black Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Clémentine California
    p_id := seed_perfume_helper('Atelier Cologne', 'Clémentine California', 'unisex', 'edc', 145.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Sunny California dream of sweet clementine, Italian mandarin, juniper, and vetiver.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Clementine' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Juniper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Basil' OR name_en ILIKE 'Star Anise' OR name_en ILIKE 'Black Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. God of Fire
    p_id := seed_perfume_helper('Stephane Humbert Lucas 777', 'God of Fire', 'unisex', 'parfum', 245.00, 50, 'Fruity', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Casual'], true, 'Exotic sweet mango, vibrant lemon, pink pepper, ginger, and magnetic dry amber oud.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mango' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Ginger' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Coumarin' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Pacific Rock Moss
    p_id := seed_perfume_helper('Goldfield & Banks', 'Pacific Rock Moss', 'unisex', 'parfum', 190.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A distinctive aquatic aroma inspired by waves crashing on Australian coastal rocks.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Sea Water' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sage' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Sunset Hour
    p_id := seed_perfume_helper('Goldfield & Banks', 'Sunset Hour', 'unisex', 'parfum', 190.00, 100, 'Fruity', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Heavenly Australian desert peach, mandarin, raspberry, and creamy sandalwood.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Peach' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Raspberry' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Ginger' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Aqua Celestia
    p_id := seed_perfume_helper('Maison Francis Kurkdjian', 'Aqua Celestia', 'unisex', 'edt', 225.00, 70, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An escape into pure celestial blue with lime, English cool mint, and blackcurrant.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lime' OR name_en ILIKE 'Mint' OR name_en ILIKE 'Blackcurrant' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Hedione' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Aqua Universalis
    p_id := seed_perfume_helper('Maison Francis Kurkdjian', 'Aqua Universalis', 'unisex', 'edt', 225.00, 70, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'The sensation of clean luminous air with bergamot, Sicilian lemon, and white lily.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lily-of-the-Valley' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Woody Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Moonlight in Heaven
    p_id := seed_perfume_helper('By Kilian', 'Moonlight in Heaven', 'unisex', 'edp', 290.00, 50, 'Fruity', ARRAY['Spring', 'Summer'], ARRAY['Night', 'Casual'], true, 'An exotic moonlit secret of juicy sweet mango, coconut rice, and sparkling grapefruit.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mango' OR name_en ILIKE 'Coconut' OR name_en ILIKE 'Rice' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Apple Brandy on the Rocks
    p_id := seed_perfume_helper('By Kilian', 'Apple Brandy on the Rocks', 'unisex', 'edp', 290.00, 50, 'Fruity', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Night', 'Casual'], true, 'Icy apple liqueur blend with crisp green apple, bergamot, cedarwood, and ambroxan.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Apple' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rum' OR name_en ILIKE 'Pineapple' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambroxan' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Un Jardin sur le Nil
    p_id := seed_perfume_helper('Hermès', 'Un Jardin sur le Nil', 'unisex', 'edt', 150.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An impressionistic stroll along the Nile featuring green mango, lotus, and calamus.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mango' OR name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Tomato Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lotus' OR name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Cinnamon' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Eau d'Orange Verte
    p_id := seed_perfume_helper('Hermès', 'Eau d''Orange Verte', 'unisex', 'edc', 130.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'The founding cologne of Hermès bursting with green citrus, orange zest, mint, and oakmoss.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Blackcurrant' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oakmoss' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. Sel Marin
    p_id := seed_perfume_helper('Heeley', 'Sel Marin', 'unisex', 'edp', 180.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Authentic cool sea breeze with sun-bleached driftwood, sea salt, lemon, and vetiver.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sea Salt' OR name_en ILIKE 'Sea Water' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Oyedo
    p_id := seed_perfume_helper('Diptyque', 'Oyedo', 'unisex', 'edt', 175.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An invigorating tribute to ancient Edo with tangy yuzu, green mandarin, and cool mint.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Yuzu' OR name_en ILIKE 'Mandarin' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Thyme' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Woody Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Ilio
    p_id := seed_perfume_helper('Diptyque', 'Ilio', 'unisex', 'edt', 175.00, 100, 'Fruity', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'Sunny Mediterranean summer capturing prickly pear, bergamot, iris, and jasmine.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Prickly Pear' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
