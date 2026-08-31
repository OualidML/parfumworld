-- Migration: High-Density Catalog Seed - Session 1 (Greens, Herbs & Beverages)
-- Created on 2026-08-30
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'By Kilian');
INSERT INTO public.brands (name, country) SELECT 'Maison Martin Margiela', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Maison Martin Margiela');
INSERT INTO public.brands (name, country) SELECT 'Byredo', 'Sweden' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Byredo');
INSERT INTO public.brands (name, country) SELECT 'Tom Ford', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Tom Ford');
INSERT INTO public.brands (name, country) SELECT 'Penhaligon''s', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Penhaligon''s');
INSERT INTO public.brands (name, country) SELECT 'L''Artisan Parfumeur', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'L''Artisan Parfumeur');
INSERT INTO public.brands (name, country) SELECT 'Mugler', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Mugler');
INSERT INTO public.brands (name, country) SELECT 'Frapin', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Frapin');
INSERT INTO public.brands (name, country) SELECT 'Commodity', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Commodity');
INSERT INTO public.brands (name, country) SELECT 'Chabaud', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Chabaud');
INSERT INTO public.brands (name, country) SELECT 'Montale', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Montale');
INSERT INTO public.brands (name, country) SELECT 'Xerjoff', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Xerjoff');
INSERT INTO public.brands (name, country) SELECT 'Baruti', 'Netherlands' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Baruti');
INSERT INTO public.brands (name, country) SELECT 'Nasomatto', 'Netherlands' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Nasomatto');
INSERT INTO public.brands (name, country) SELECT 'Diptyque', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Diptyque');
INSERT INTO public.brands (name, country) SELECT 'Sisley', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Sisley');
INSERT INTO public.brands (name, country) SELECT 'Creed', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Creed');
INSERT INTO public.brands (name, country) SELECT 'Elizabeth Arden', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Elizabeth Arden');
INSERT INTO public.brands (name, country) SELECT 'Nishane', 'Turkey' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Nishane');
INSERT INTO public.brands (name, country) SELECT 'Armani', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Armani');
INSERT INTO public.brands (name, country) SELECT 'Lush', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Lush');
INSERT INTO public.brands (name, country) SELECT 'Guerlain', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Guerlain');
INSERT INTO public.brands (name, country) SELECT 'Hermès', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Hermès');
INSERT INTO public.brands (name, country) SELECT 'Chanel', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Chanel');
INSERT INTO public.brands (name, country) SELECT 'Demeter', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Demeter');
INSERT INTO public.brands (name, country) SELECT 'Aesop', 'Australia' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Aesop');
INSERT INTO public.brands (name, country) SELECT 'Le Labo', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Le Labo');
INSERT INTO public.brands (name, country) SELECT 'Comme des Garçons', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Comme des Garçons');
INSERT INTO public.brands (name, country) SELECT 'Jo Malone', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Jo Malone');
INSERT INTO public.brands (name, country) SELECT 'Memo Paris', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Memo Paris');

-- 2. Ensure Target Notes Exist in Global Reference Table
-- Greens & Herbs Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '11111111-1111-1111-1111-111111111111'::uuid, 'ورق البنفسج', 'Feuille de Violette', 'Violet Leaf', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Violet Leaf');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '55555555-5555-5555-5555-555555555555'::uuid, 'ورق التين', 'Feuille de Figuier', 'Fig Leaf', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Fig Leaf');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '55555555-5555-5555-5555-555555555555'::uuid, 'ورق الطماطم', 'Feuille de Tomate', 'Tomato Leaf', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Tomato Leaf');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'اللبلاب', 'Lierre', 'Ivy', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Ivy');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الصبار', 'Aloès', 'Aloe Vera', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Aloe Vera');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'السرخس', 'Fougère', 'Fern', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Fern');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الخيزران', 'Bambou', 'Bamboo', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Bamboo');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'غلابانوم', 'Galbanum', 'Galbanum', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Galbanum');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الأوريغانو', 'Origan', 'Oregano', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Oregano');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '44444444-4444-4444-4444-444444444444'::uuid, 'النعناع الفلفلي', 'Menthe Poivrée', 'Peppermint', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Peppermint');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الطرخون', 'Estragon', 'Tarragon', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Tarragon');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الشبت', 'Aneth', 'Dill', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Dill');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'المردقوش', 'Marjolaine', 'Marjoram', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Marjoram');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الميرمية الكلاري', 'Sauge Sclarée', 'Clary Sage', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Clary Sage');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الشيح', 'Armoise', 'Artemisia', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Artemisia');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الكافور', 'Eucalyptus', 'Eucalyptus', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Eucalyptus');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'الشاي الأسود', 'Thé Noir', 'Black Tea', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Black Tea');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'شاي الماتشا', 'Matcha', 'Matcha Tea', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Matcha Tea');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '44444444-4444-4444-4444-444444444444'::uuid, 'الفيربينا', 'Verveine', 'Verbena', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Verbena');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'شاي أولونغ', 'Thé Oolong', 'Oolong Tea', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Oolong Tea');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'شاي المتة', 'Maté', 'Mate Tea', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Mate Tea');
-- Beverage Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الرم', 'Rhum', 'Rum', 'base' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Rum');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الويسكي', 'Whisky', 'Whiskey', 'base' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Whiskey');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'البوربون', 'Bourbon', 'Bourbon', 'base' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Bourbon');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الكونياك', 'Cognac', 'Cognac', 'base' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Cognac');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الشمبانيا', 'Champagne', 'Champagne', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Champagne');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'النبيذ', 'Vin', 'Wine', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Wine');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الجن', 'Gin', 'Gin', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Gin');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الفودكا', 'Vodka', 'Vodka', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Vodka');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'الأفسنتين', 'Absinthe', 'Absinthe', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Absinthe');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '88888888-8888-8888-8888-888888888888'::uuid, 'التيكيلا', 'Tequila', 'Tequila', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Tequila');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'الأماريتو', 'Amaretto', 'Amaretto', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Amaretto');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'كوكا كولا', 'Coca-Cola', 'Coca-Cola', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Coca-Cola');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '44444444-4444-4444-4444-444444444444'::uuid, 'ليموناضة', 'Limonade', 'Lemonade', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Lemonade');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'إسبريسو', 'Espresso', 'Espresso', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Espresso');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '77777777-7777-7777-7777-777777777777'::uuid, 'كابوتشينو', 'Cappuccino', 'Cappuccino', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Cappuccino');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'الحليب', 'Lait', 'Milk', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Milk');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'قصب السكر', 'Canne à Sucre', 'Sugar Cane', 'top' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Sugar Cane');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'المشعير / المالت', 'Malt', 'Malt', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Malt');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'حليب اللوز', 'Lait d''Amande', 'Almond Milk', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Almond Milk');
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) SELECT '66666666-6666-6666-6666-666666666666'::uuid, 'المارشميلو', 'Guimauve', 'Marshmallow', 'middle' WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Marshmallow');

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
    -- 1. Angels' Share
    p_id := seed_perfume_helper('By Kilian', 'Angels'' Share', 'unisex', 'parfum', 235.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Cognac opening with hazelnut and warm oakwood.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cognac' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Oakwood' OR name_en ILIKE 'Hazelnut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Black Phantom
    p_id := seed_perfume_helper('By Kilian', 'Black Phantom', 'unisex', 'edp', 250.00, 50, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Special Occasion'], true, 'Rich rum combined with dark chocolate, espresso, and caramel.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Rum' OR name_en ILIKE 'Sugar Cane' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Espresso' OR name_en ILIKE 'Chocolate' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Caramel' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Jazz Club
    p_id := seed_perfume_helper('Maison Martin Margiela', 'Jazz Club', 'male', 'edt', 145.00, 100, 'Leathery', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'A combination of sweet rum, clary sage, and warm tobacco.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rum' OR name_en ILIKE 'Clary Sage' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Gypsy Water
    p_id := seed_perfume_helper('Byredo', 'Gypsy Water', 'unisex', 'edp', 190.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Fresh juniper berries and pine needles with a soft woody base.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Gin' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Pine Needles' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. Tobacco Oud
    p_id := seed_perfume_helper('Tom Ford', 'Tobacco Oud', 'unisex', 'edp', 295.00, 50, 'Woody', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'Smoky whiskey and warm rich oud notes.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Whiskey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tobacco' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oud' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Juniper Sling
    p_id := seed_perfume_helper('Penhaligon''s', 'Juniper Sling', 'unisex', 'edt', 170.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An olfactory tribute to London Dry Gin.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Gin' OR name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Black Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Fou d'Absinthe
    p_id := seed_perfume_helper('L''Artisan Parfumeur', 'Fou d''Absinthe', 'male', 'edp', 165.00, 100, 'Herbal', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'A wild forest blend centered around absinthe.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Absinthe' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ginger' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Pine Needles' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. A*Men Pure Malt
    p_id := seed_perfume_helper('Mugler', 'A*Men Pure Malt', 'male', 'edt', 120.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Created in honor of traditional peat-smoked scotch whiskey.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Whiskey' OR name_en ILIKE 'Malt' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. Frapin 1270
    p_id := seed_perfume_helper('Frapin', '1270', 'unisex', 'edp', 155.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Rich blend of cognac, cacao, and honey.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cognac' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cocoa' OR name_en ILIKE 'Honey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Commodity Milk
    p_id := seed_perfume_helper('Commodity', 'Milk', 'unisex', 'edp', 135.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'A warm milk and marshmallow signature scent.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Marshmallow' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. Lait Concentré
    p_id := seed_perfume_helper('Chabaud', 'Lait Concentré', 'unisex', 'edt', 110.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Sweet milk, coconut, and caramel memories.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Coconut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Intense Cafe
    p_id := seed_perfume_helper('Montale', 'Intense Cafe', 'unisex', 'edp', 140.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'An initial wave of coffee blended with beautiful red rose.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Floral notes' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Espresso' OR name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. Xerjoff Uden
    p_id := seed_perfume_helper('Xerjoff', 'Uden', 'male', 'parfum', 260.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Marine citrus contrasted with rich coffee and rum.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rum' OR name_en ILIKE 'Espresso' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Baruti Chai
    p_id := seed_perfume_helper('Baruti', 'Chai', 'unisex', 'parfum', 130.00, 30, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Authentic spiced black tea latte.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Cinnamon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Black Tea' OR name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. Nasomatto Baraonda
    p_id := seed_perfume_helper('Nasomatto', 'Baraonda', 'unisex', 'parfum', 165.00, 30, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Fragrance exploring a glass of single malt whiskey.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Whiskey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Philosykos
    p_id := seed_perfume_helper('Diptyque', 'Philosykos', 'unisex', 'edp', 175.00, 75, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Olfactory ode to the entire wild fig tree.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Fig Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Coconut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedar' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Eau de Campagne
    p_id := seed_perfume_helper('Sisley', 'Eau de Campagne', 'unisex', 'edt', 130.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An exceptional aroma of fresh tomato leaves and wild grasses.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Tomato Leaf' OR name_en ILIKE 'Basil' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Galbanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oakmoss' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Green Irish Tweed
    p_id := seed_perfume_helper('Creed', 'Green Irish Tweed', 'male', 'edp', 329.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal'], true, 'A classic walk through the Irish countryside with violet leaf.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Verbena' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Ambergris' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Elizabeth Arden Green Tea
    p_id := seed_perfume_helper('Elizabeth Arden', 'Green Tea', 'female', 'edt', 40.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An energizing and refreshing green tea citrus blend.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oakmoss' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Wulong Cha
    p_id := seed_perfume_helper('Nishane', 'Wulong Cha', 'unisex', 'parfum', 220.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Premium oolong tea fragrance with strong citrus top notes.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Oolong Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Fig' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Armani Privé Thé Yulong
    p_id := seed_perfume_helper('Armani', 'Thé Yulong', 'unisex', 'edt', 185.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Harmonious blend of black tea and green tea notes.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mandarin' OR name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Black Tea' OR name_en ILIKE 'Green Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. MMM Matcha Meditation
    p_id := seed_perfume_helper('Maison Martin Margiela', 'Matcha Meditation', 'unisex', 'edt', 145.00, 100, 'Gourmand', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An uplifting matcha green tea accord with sweet base.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Matcha Tea' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Lush Dirty
    p_id := seed_perfume_helper('Lush', 'Dirty', 'male', 'edp', 90.00, 100, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An invigorating fresh spearmint and tarragon body spray profile.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Spearmint' OR name_en ILIKE 'Tarragon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Neroli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Oakmoss' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. Herba Fresca
    p_id := seed_perfume_helper('Guerlain', 'Aqua Allegoria Herba Fresca', 'unisex', 'edt', 125.00, 125, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Grass, fresh mint, and green tea walk in the morning.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Green Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Lily of the Valley' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Un Jardin en Méditerranée
    p_id := seed_perfume_helper('Hermès', 'Un Jardin en Méditerranée', 'unisex', 'edt', 140.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A garden of light with fig leaves and cedarwood.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Fig Leaf' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cypress' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Premier Figuier
    p_id := seed_perfume_helper('L''Artisan Parfumeur', 'Premier Figuier', 'unisex', 'edt', 150.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Historically the first fig leaf perfume catalog entry.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Fig Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Almond Milk' OR name_en ILIKE 'Fig' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Coconut' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Cristalle
    p_id := seed_perfume_helper('Chanel', 'Cristalle', 'female', 'edp', 135.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal'], true, 'Elegant galbanum green fragrance from House of Chanel.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Galbanum' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Hyacinth' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oakmoss' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Kyoto
    p_id := seed_perfume_helper('Comme des Garçons', 'Kyoto', 'unisex', 'edt', 95.00, 50, 'Woody', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'Spiritual cypress wood, coffee, and incense elements.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cypress' OR name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cedar' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Demeter Tomato
    p_id := seed_perfume_helper('Demeter', 'Tomato', 'unisex', 'edc', 35.00, 120, 'Green', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'Photorealistic single-note tomato leaf aroma.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Tomato Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Notes' OR name_en ILIKE 'Tomato' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Aesop Tacit
    p_id := seed_perfume_helper('Aesop', 'Tacit', 'unisex', 'edp', 140.00, 50, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Fresh yuzu and dynamic basil leaf herbal notes.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Basil' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Rosemary' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Mandarino di Amalfi
    p_id := seed_perfume_helper('Tom Ford', 'Mandarino di Amalfi', 'unisex', 'edp', 250.00, 50, 'Fresh', ARRAY['Summer'], ARRAY['Day', 'Casual'], true, 'Mouthwatering citrus, fresh mint, and basil.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Basil' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Thé Noir 29
    p_id := seed_perfume_helper('Le Labo', 'Thé Noir 29', 'unisex', 'edp', 220.00, 50, 'Woody', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Day', 'Casual'], true, 'Deep fig and rich black tea leaf scent signature.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Fig' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cedar' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Black Tea' OR name_en ILIKE 'Tobacco' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. CDG Amazingreen
    p_id := seed_perfume_helper('Comme des Garçons', 'Amazingreen', 'unisex', 'edp', 125.00, 100, 'Green', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Fresh Ivy leaf and wet green pepper accord.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ivy' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Notes' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Jo Malone Wild Bluebell
    p_id := seed_perfume_helper('Jo Malone', 'Wild Bluebell', 'female', 'edc', 145.00, 100, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Light bluebell floral notes combined with white musk.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Floral notes' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lily of the Valley' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Irish Leather
    p_id := seed_perfume_helper('Memo Paris', 'Irish Leather', 'unisex', 'edp', 260.00, 75, 'Leathery', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Fresh juniper berries paired with rich mate tea and leather.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Juniper Berries' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Clary Sage' OR name_en ILIKE 'Mate Tea' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
