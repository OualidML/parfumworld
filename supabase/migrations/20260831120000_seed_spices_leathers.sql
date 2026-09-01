-- Migration: High-Density Catalog Seed - Session 4 (Spices, Leathers & Animalics)
-- Created on 2026-08-31
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'Tom Ford', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'tom ford');
INSERT INTO public.brands (name, country) SELECT 'Frederic Malle', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'frederic malle');
INSERT INTO public.brands (name, country) SELECT 'Initio Parfums Privés', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'initio parfums privés');
INSERT INTO public.brands (name, country) SELECT 'Amouage', 'Oman' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'amouage');
INSERT INTO public.brands (name, country) SELECT 'Zoologist', 'Canada' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'zoologist');
INSERT INTO public.brands (name, country) SELECT 'Papillon Artisan Perfumes', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'papillon artisan perfumes');
INSERT INTO public.brands (name, country) SELECT 'Maison Francis Kurkdjian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'maison francis kurkdjian');
INSERT INTO public.brands (name, country) SELECT 'MEMO Paris', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'memo paris');
INSERT INTO public.brands (name, country) SELECT 'Mancera', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'mancera');
INSERT INTO public.brands (name, country) SELECT 'Byredo', 'Sweden' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'byredo');
INSERT INTO public.brands (name, country) SELECT 'Serge Lutens', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'serge lutens');
INSERT INTO public.brands (name, country) SELECT 'Nasomatto', 'Netherlands' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'nasomatto');
INSERT INTO public.brands (name, country) SELECT 'Christian Dior', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'christian dior');
INSERT INTO public.brands (name, country) SELECT 'Parfums de Marly', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'parfums de marly');
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'by kilian');
INSERT INTO public.brands (name, country) SELECT 'L''Artisan Parfumeur', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'l''artisan parfumeur');
INSERT INTO public.brands (name, country) SELECT 'Xerjoff', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'xerjoff');
INSERT INTO public.brands (name, country) SELECT 'Creed', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'creed');
INSERT INTO public.brands (name, country) SELECT 'Penhaligon''s', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'penhaligon''s');
INSERT INTO public.brands (name, country) SELECT 'Diptyque', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'diptyque');
INSERT INTO public.brands (name, country) SELECT 'Le Labo', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'le labo');
INSERT INTO public.brands (name, country) SELECT 'Maison Crivelli', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'maison crivelli');
INSERT INTO public.brands (name, country) SELECT 'Montale', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'montale');
INSERT INTO public.brands (name, country) SELECT 'Roja Parfums', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'roja parfums');
INSERT INTO public.brands (name, country) SELECT 'Etat Libre d''Orange', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'etat libre d''orange');
INSERT INTO public.brands (name, country) SELECT 'Francesca Bianchi', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'francesca bianchi');
INSERT INTO public.brands (name, country) SELECT 'Guerlain', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'guerlain');

-- 2. Ensure Target Notes Exist via Exact Category Lookups (No Wildcards)
-- Spices
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'زعفران', 'Safran', 'Saffron', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'saffron');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'كمون', 'Cumin', 'Cumin', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cumin');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'فلفل وردي', 'Poivre Rose', 'Pink Pepper', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'pink pepper');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'فلفل أسود', 'Poivre Noir', 'Black Pepper', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'black pepper');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'جوزة الطيب', 'Noix de Muscade', 'Nutmeg', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'nutmeg');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'كراوية', 'Carvi', 'Caraway', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'caraway');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'كزبرة', 'Coriandre', 'Coriander', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'coriander');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'قرنفل', 'Clou de Girofle', 'Clove', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'clove');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'قرفة', 'Cannelle', 'Cinnamon', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cinnamon');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'بهارات مشكلة', 'Épices', 'Spices', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'spices');

-- Leathers & Animalics
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'جلد', 'Cuir', 'Leather', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'leather');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'جلد مدبوغ / سويد', 'Daim / Suede', 'Suede', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'suede');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'زباد', 'Civette', 'Civet', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'civet');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'قندس / كاستوريوم', 'Castoréum', 'Castoreum', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'castoreum');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'عنبر الحوت', 'Ambre Gris', 'Ambergris', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'ambergris');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'أمبریت', 'Ambrette', 'Ambrette', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'ambrette');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'شمع العسل', 'Cire d''Abeille', 'Beeswax', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'beeswax');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'حيراسيوم', 'Hyraceum', 'Hyraceum', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'hyraceum');

-- Ouds & Woods
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'عود', 'Bois de Oud', 'Agarwood (Oud)', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'agarwood (oud)');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب الغاياك', 'Bois de Gaïac', 'Guaiac Wood', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'guaiac wood');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب الأرز', 'Bois de Cèdre', 'Cedarwood', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cedarwood');

-- Resins
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'لبان ذكر', 'Oliban', 'Olibanum', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'olibanum');

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
    -- 1. Tuscan Leather
    p_id := seed_perfume_helper('Tom Ford', 'Tuscan Leather', 'unisex', 'edp', 295.00, 50, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An iconic raw yet refined leather scent with raspberry and saffron.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Thyme' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Olibanum' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Suede' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Ombré Leather
    p_id := seed_perfume_helper('Tom Ford', 'Ombré Leather', 'unisex', 'edp', 205.00, 100, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Tactile floral leather draped in warm amber and patchouli.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Musc Ravageur
    p_id := seed_perfume_helper('Frederic Malle', 'Musc Ravageur', 'unisex', 'edp', 280.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'A sensual and unapologetic amber animalic musk wrapped in cinnamon and cloves.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Clove' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Oud for Greatness
    p_id := seed_perfume_helper('Initio Parfums Privés', 'Oud for Greatness', 'unisex', 'edp', 390.00, 90, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Majestic natural agarwood infused with lavender, saffron, and nutmeg.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Lavender' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. Epic Man
    p_id := seed_perfume_helper('Amouage', 'Epic Man', 'male', 'edp', 360.00, 100, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'An opulent smoky spice and oud journey evoking the ancient Silk Road.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Saffron' OR name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Caraway' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Myrrh' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Memoir Man
    p_id := seed_perfume_helper('Amouage', 'Memoir Man', 'male', 'edp', 360.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Dark, brooding absinthe, frankincense, leather, and oakmoss.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Basil' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Zoologist Civet
    p_id := seed_perfume_helper('Zoologist', 'Civet', 'unisex', 'parfum', 175.00, 60, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'A vintage chypre featuring civet, warm spices, carnation, and leather.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Spices' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Carnation' OR name_en ILIKE 'Tuberose' OR name_en ILIKE 'Ylang-Ylang' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Civet' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Zoologist Camel
    p_id := seed_perfume_helper('Zoologist', 'Camel', 'unisex', 'parfum', 175.00, 60, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Rich dried fruits, frankincense, myrrh, civet, and oud.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Dried Fruits' OR name_en ILIKE 'Frankincense' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Clove' OR name_en ILIKE 'Myrrh' OR name_en ILIKE 'Honey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Civet' OR name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. Anubis
    p_id := seed_perfume_helper('Papillon Artisan Perfumes', 'Anubis', 'unisex', 'edp', 190.00, 50, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Deep leather, sacred Egyptian incense, suede, and saffron.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Suede' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Lotus' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Myrrh' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Oud Satin Mood
    p_id := seed_perfume_helper('Maison Francis Kurkdjian', 'Oud Satin Mood', 'unisex', 'edp', 300.00, 70, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Sumptuous blend of natural oud, Turkish rose, violet, and vanilla.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Violet' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Benzoin' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. African Leather
    p_id := seed_perfume_helper('MEMO Paris', 'African Leather', 'unisex', 'edp', 310.00, 75, 'Leather', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Day', 'Night', 'Casual'], true, 'Spicy warm leather bursting with cardamom, saffron, cumin, and vetiver.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Saffron' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cumin' OR name_en ILIKE 'Geranium' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Red Tobacco
    p_id := seed_perfume_helper('Mancera', 'Red Tobacco', 'unisex', 'edp', 180.00, 120, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Casual'], true, 'An explosive spicy powerhouse with cinnamon, oud, saffron, and rich tobacco.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Saffron' OR name_en ILIKE 'Nutmeg' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Guaiac Wood' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. Black Saffron
    p_id := seed_perfume_helper('Byredo', 'Black Saffron', 'unisex', 'edp', 290.00, 100, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Casual'], true, 'Crisp juniper berries, golden Kashmiri saffron, black violet, and dark leather.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Violet' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Raspberry' OR name_en ILIKE 'Cashmeran' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Muscs Koublaï Khän
    p_id := seed_perfume_helper('Serge Lutens', 'Muscs Koublaï Khän', 'unisex', 'edp', 230.00, 75, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'A legendary intense animalic musk featuring civet, castoreum, costus, and cumin.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Caraway' OR name_en ILIKE 'Coriander' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Civet' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Ambrette' OR name_en ILIKE 'Beeswax' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. Duro
    p_id := seed_perfume_helper('Nasomatto', 'Duro', 'male', 'parfum', 185.00, 30, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An uncompromising, raw, masculine statement of leather and dark woods.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Spices' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Guaiac Wood' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Noir de Noir
    p_id := seed_perfume_helper('Tom Ford', 'Noir de Noir', 'unisex', 'edp', 295.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Dark oriental floral collision of black rose, black truffle, patchouli, and oud.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Agarwood (Oud)' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Fahrenheit
    p_id := seed_perfume_helper('Christian Dior', 'Fahrenheit', 'male', 'edt', 130.00, 100, 'Woody', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Day', 'Night', 'Casual'], true, 'Pioneering violet leaf and nutmeg accord married with leather and cedarwood.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet Leaf' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Godolphin
    p_id := seed_perfume_helper('Parfums de Marly', 'Godolphin', 'male', 'edp', 320.00, 125, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Majestic Tuscan-style leather sweetened with saffron, rose, iris, and amber.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Thyme' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Straight to Heaven
    p_id := seed_perfume_helper('By Kilian', 'Straight to Heaven', 'male', 'edp', 290.00, 50, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'An addictive potion of Martinican rum, rich dried fruits, nutmeg, and patchouli.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Dried Fruits' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Dzing!
    p_id := seed_perfume_helper('L''Artisan Parfumeur', 'Dzing!', 'unisex', 'edt', 160.00, 100, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'A playful magical circus aroma featuring soft leather, ginger, caramel, and castoreum.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Toffee' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Interlude 53
    p_id := seed_perfume_helper('Amouage', 'Interlude 53', 'male', 'parfum', 500.00, 100, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'An ultra-concentrated 53% dosage of balsamic resins, oregano, leather, and smoky oud.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Oregano' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Opoponax' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. Alexandria II
    p_id := seed_perfume_helper('Xerjoff', 'Alexandria II', 'unisex', 'parfum', 380.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Prestigious Laotian oud laced with crisp lavender, cinnamon, and creamy sandalwood.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Zefiro
    p_id := seed_perfume_helper('Xerjoff', '1861 Zefiro', 'unisex', 'edp', 260.00, 100, 'Spicy', ARRAY['Spring', 'Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'Tribute to Rome featuring smoky incense, cardamom, cinnamon, and honeyed iris.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Elemi' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Carnation' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Honey' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. Royal Oud
    p_id := seed_perfume_helper('Creed', 'Royal Oud', 'unisex', 'edp', 495.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'An aristocratic Parisian wood masterpiece blending pink pepper, angelica, cedar, and oud.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Galbanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Halfeti
    p_id := seed_perfume_helper('Penhaligon''s', 'Halfeti', 'unisex', 'edp', 280.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Intoxicating black rose infused with saffron, cardamom, nutmeg, leather, and oud.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Eau Duelle (EDP)
    p_id := seed_perfume_helper('Diptyque', 'Eau Duelle', 'unisex', 'edp', 230.00, 75, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'A dark Bourbon vanilla spiced with pink pepper, juniper, cardamom, and frankincense.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Juniper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Frankincense' OR name_en ILIKE 'Black Tea' OR name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Santal 33
    p_id := seed_perfume_helper('Le Labo', 'Santal 33', 'unisex', 'edp', 230.00, 50, 'Woody', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Casual'], true, 'The cult-classic smoky Australian sandalwood, cardamom, violet, and leather.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Violet' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Ambergris' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Oud Maracujá
    p_id := seed_perfume_helper('Maison Crivelli', 'Oud Maracujá', 'unisex', 'parfum', 290.00, 50, 'Leather', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Night', 'Formal'], true, 'Luminous passionfruit contrasting with deep smoky leather and oud.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Arabians Tonka
    p_id := seed_perfume_helper('Montale', 'Arabians Tonka', 'unisex', 'edp', 160.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'A tribute to the Arabic horse with fiery saffron, intense oud, tonka bean, and sugar cane.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Sugar' OR name_en ILIKE 'Amber' OR name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Danger Pour Homme
    p_id := seed_perfume_helper('Roja Parfums', 'Danger Pour Homme', 'male', 'parfum', 485.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An intoxicating aromatic oriental packed with cumin, castoreum, clove, leather, and woods.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Lily-of-the-Valley' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cumin' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Clove' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Ambergris' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Rien
    p_id := seed_perfume_helper('Etat Libre d''Orange', 'Rien', 'unisex', 'edp', 160.00, 100, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An intense second skin of smoky incense, caraway, black pepper, leather, and patchouli.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Caraway' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Leather' OR name_en ILIKE 'Rose' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Oakmoss' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Zoologist Hyrax
    p_id := seed_perfume_helper('Zoologist', 'Hyrax', 'unisex', 'parfum', 175.00, 60, 'Oriental', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'An audacious animalic explosion featuring African stone hyraceum, castoreum, and civet.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Saffron' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Hyraceum' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Civet' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Benzoin' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. The Lover's Tale
    p_id := seed_perfume_helper('Francesca Bianchi', 'The Lover''s Tale', 'unisex', 'parfum', 145.00, 30, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'A secret intimate romance captured in heavy castoreum, civet, leather, and buttery orris.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mimosa' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Peach' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Castoreum' OR name_en ILIKE 'Civet' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Cuir Beluga
    p_id := seed_perfume_helper('Guerlain', 'Cuir Beluga', 'unisex', 'edp', 380.00, 100, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'An ultra-luxurious, supple white suede draped in intoxicating Guerlain vanilla.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Aldehydes' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Suede' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Cuir Mauresque
    p_id := seed_perfume_helper('Serge Lutens', 'Cuir Mauresque', 'unisex', 'edp', 230.00, 75, 'Leather', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Moorish leather perfumed with cinnamon, nutmeg, clove, civet, orange blossom, and amber.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Caraway' OR name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Clove' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Civet' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
