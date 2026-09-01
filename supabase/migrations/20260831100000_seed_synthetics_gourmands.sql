-- Migration: High-Density Catalog Seed - Session 3 (Synthetic, Abstract & Gourmands)
-- Created on 2026-08-31
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Note Categories Exist
INSERT INTO public.note_categories (family, name_ar, name_fr, name_en, icon_name)
SELECT 'Synthetic', 'اصطناعي/مجرد', 'Synthétique', 'Synthetic & Abstract', 'sparkles'
WHERE NOT EXISTS (SELECT 1 FROM public.note_categories WHERE name_en = 'Synthetic & Abstract');

-- 2. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'Escentric Molecules', 'Germany' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Escentric Molecules');
INSERT INTO public.brands (name, country) SELECT 'Le Labo', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Le Labo');
INSERT INTO public.brands (name, country) SELECT 'Zoologist', 'Canada' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Zoologist');
INSERT INTO public.brands (name, country) SELECT 'Etat Libre d''Orange', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Etat Libre d''Orange');
INSERT INTO public.brands (name, country) SELECT 'Maison Martin Margiela', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Maison Martin Margiela');
INSERT INTO public.brands (name, country) SELECT 'Demeter', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Demeter');
INSERT INTO public.brands (name, country) SELECT 'Clean', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Clean');
INSERT INTO public.brands (name, country) SELECT 'Comme des Garçons', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Comme des Garçons');
INSERT INTO public.brands (name, country) SELECT 'L''Artisan Parfumeur', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'L''Artisan Parfumeur');
INSERT INTO public.brands (name, country) SELECT 'Giardini di Toscana', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Giardini di Toscana');
INSERT INTO public.brands (name, country) SELECT 'Kerosene', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Kerosene');
INSERT INTO public.brands (name, country) SELECT 'Xerjoff', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Xerjoff');
INSERT INTO public.brands (name, country) SELECT 'Montale', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Montale');
INSERT INTO public.brands (name, country) SELECT 'Maison Mataha', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Maison Mataha');
INSERT INTO public.brands (name, country) SELECT 'Serge Lutens', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Serge Lutens');
INSERT INTO public.brands (name, country) SELECT 'Lush', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Lush');
INSERT INTO public.brands (name, country) SELECT 'Profumum Roma', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Profumum Roma');
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'By Kilian');
INSERT INTO public.brands (name, country) SELECT 'Akro', 'United Kingdom' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Akro');
INSERT INTO public.brands (name, country) SELECT 'Theodoros Kalotinis', 'Greece' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Theodoros Kalotinis');
INSERT INTO public.brands (name, country) SELECT 'Indult', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Indult');
INSERT INTO public.brands (name, country) SELECT 'Chabaud', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE name = 'Chabaud');

-- 3. Ensure Target Notes Exist via Dynamic Category Lookups
-- Synthetic & Abstract Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'أيزو إي سوبر', 'Iso E Super', 'Iso E Super', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Iso E Super');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'أمبروكسان', 'Ambroxan', 'Ambroxan', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Ambroxan');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'كالون', 'Calone', 'Calone', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Calone');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'كاشميران', 'Cashmeran', 'Cashmeran', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Cashmeran');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'هيديون', 'Hedione', 'Hedione', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Hedione');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'كومارين', 'Coumarine', 'Coumarin', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Coumarin');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'نوتات معدنية', 'Notes Métalliques', 'Metallic notes', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Metallic notes');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'ماء البحر', 'Eau de Mer', 'Sea Water', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Sea Water');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'أوزون', 'Ozone', 'Ozone', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Ozone');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'مطر', 'Pluie', 'Rain', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Rain');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'صبغة التربة', 'Teinture de Sol', 'Soil Tincture', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Soil Tincture');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'بيترشور', 'Pétrichor', 'Petrichor', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Petrichor');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'الصلصال', 'Argile', 'Clay', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Clay');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'ورق', 'Papier', 'Paper', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Paper');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'حبر', 'Encre', 'Ink', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Ink');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'بارود', 'Poudre à Canon', 'Gunpowder', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Gunpowder');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'دخان', 'Fumée', 'Smoke', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Smoke');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Synthetic & Abstract' LIMIT 1), 'دم', 'Sang', 'Blood', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Blood');

-- Gourmand Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'سكر بني', 'Sucre Roux', 'Brown Sugar', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Brown Sugar');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'مارشميلو', 'Guimauve', 'Marshmallow', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Marshmallow');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'بشار / بوبكورن', 'Pop-corn', 'Popcorn', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Popcorn');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'غزل البنات', 'Barbe à Papa', 'Cotton Candy', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Cotton Candy');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'سكر', 'Sucre', 'Sugar', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Sugar');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'توفي', 'Toffee', 'Toffee', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Toffee');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'شراب القيقب', 'Sirop d''Érable', 'Maple Syrup', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Maple Syrup');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'بسكويت', 'Biscuit', 'Biscuit', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Biscuit');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'زبدة', 'Beurre', 'Butter', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE name_en = 'Butter');

-- 4. Populate perfumes table (35 unique perfumes mapped to shop owner UUID)
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
    v_shop uuid := 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid;
BEGIN
    -- 1. Molecule 01
    p_id := seed_perfume_helper('Escentric Molecules', 'Molecule 01', 'unisex', 'edt', 135.00, 100, 'Synthetic', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Features only the chemical Iso E Super. A velvety, clean wood note.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Iso E Super' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Molecule 02
    p_id := seed_perfume_helper('Escentric Molecules', 'Molecule 02', 'unisex', 'edt', 135.00, 100, 'Synthetic', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Features only the chemical Ambroxan, a mineral-like warmth.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambroxan' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Another 13
    p_id := seed_perfume_helper('Le Labo', 'Another 13', 'unisex', 'edp', 220.00, 50, 'Synthetic', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'An addictive dirty-sweet musk created around ambroxan.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pear' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambroxan' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Zoologist Squid
    p_id := seed_perfume_helper('Zoologist', 'Squid', 'unisex', 'parfum', 165.00, 60, 'Synthetic', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Evokes the deep ocean with black ink and salty sea air.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sea Water' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ink' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambergris' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. Tyrannosaurus Rex
    p_id := seed_perfume_helper('Zoologist', 'Tyrannosaurus Rex', 'unisex', 'parfum', 175.00, 60, 'Woody', ARRAY['Winter'], ARRAY['Night', 'Formal'], true, 'An apocalyptic, smoky combination of gunpowder and molten resins.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Gunpowder' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Smoke' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Metallic notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Sécrétions Magnifiques
    p_id := seed_perfume_helper('Etat Libre d''Orange', 'Sécrétions Magnifiques', 'unisex', 'edp', 110.00, 50, 'Synthetic', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'A notorious concept perfume representing metallic blood, milk, and adrenaline.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sea Water' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Blood' OR name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Metallic notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Fat Electrician
    p_id := seed_perfume_helper('Etat Libre d''Orange', 'Fat Electrician', 'male', 'edp', 110.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Sweet vetiver paired with chestnut and sweet vanilla.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Olive Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Chestnut' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Zoologist Bat
    p_id := seed_perfume_helper('Zoologist', 'Bat', 'unisex', 'parfum', 165.00, 60, 'Green', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'Evokes a damp limestone cave with soil tincture and banana.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Soil Tincture' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Myrrh' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. By the Fireplace
    p_id := seed_perfume_helper('Maison Martin Margiela', 'By the Fireplace', 'unisex', 'edt', 145.00, 100, 'Gourmand', ARRAY['Winter'], ARRAY['Night', 'Casual'], true, 'Warm chestnuts, sweet vanilla, and a distinct smoky logs accord.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Chestnut' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Smoke' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Demeter Petrichor
    p_id := seed_perfume_helper('Demeter', 'Petrichor', 'unisex', 'edc', 35.00, 120, 'Synthetic', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Photorealistic scent of rain hitting warm soil.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Rain' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Petrichor' OR name_en ILIKE 'Clay' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Soil Tincture' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. Demeter Rain
    p_id := seed_perfume_helper('Demeter', 'Rain', 'unisex', 'edc', 35.00, 120, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'An airy ozone and wet rain droplets fragrance.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ozone' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rain' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Clean Rain
    p_id := seed_perfume_helper('Clean', 'Rain', 'female', 'edp', 75.00, 60, 'Fresh', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'A soft, clean breeze of rain combined with soft white lily.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ozone' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rain' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. CDG Odeur 53
    p_id := seed_perfume_helper('Comme des Garçons', 'Odeur 53', 'unisex', 'edt', 140.00, 200, 'Synthetic', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'An abstract blend of clay, hot metal, and copier paper.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Metallic notes' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Clay' OR name_en ILIKE 'Paper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Hermann à mes Côtés
    p_id := seed_perfume_helper('Etat Libre d''Orange', 'Hermann à mes Côtés me Paraissait une Ombre', 'unisex', 'edp', 110.00, 100, 'Synthetic', ARRAY['Spring', 'Autumn'], ARRAY['Day', 'Casual'], true, 'An eerie geosmin rose fragrance representing petrichor.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Galbanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Petrichor' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. Passage d'Enfer
    p_id := seed_perfume_helper('L''Artisan Parfumeur', 'Passage d''Enfer', 'unisex', 'edt', 150.00, 100, 'Woody', ARRAY['Autumn', 'Spring'], ARRAY['Day', 'Casual'], true, 'Spiritual white incense, lily, and clean white musk.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lily' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Incense' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Bianco Latte
    p_id := seed_perfume_helper('Giardini di Toscana', 'Bianco Latte', 'unisex', 'edp', 150.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Sweet milk, honey, and caramel, vanilla pastry.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Coumarin' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Unknown Pleasures
    p_id := seed_perfume_helper('Kerosene', 'Unknown Pleasures', 'unisex', 'edp', 150.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Bergamot, honey, waffle cone, caramel, and vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Lira
    p_id := seed_perfume_helper('Xerjoff', 'Casamorati Lira', 'female', 'edp', 290.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Blood orange, cinnamon, jasmine, sweet caramel, and vanilla.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Italica
    p_id := seed_perfume_helper('Xerjoff', 'Casamorati Italica', 'unisex', 'edp', 290.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Creamy milk, sweet almond, saffron, and toffee.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Almond' OR name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Toffee' OR name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Chocolate Greedy
    p_id := seed_perfume_helper('Montale', 'Chocolate Greedy', 'unisex', 'edp', 140.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Warm roasted coffee, rich cocoa, and vanilla biscuit.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cocoa' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Escapade Gourmande
    p_id := seed_perfume_helper('Maison Mataha', 'Escapade Gourmande', 'unisex', 'edp', 195.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Pure brown sugar, vanilla, and warm tonka bean.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Brown Sugar' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. Un Bois Vanille
    p_id := seed_perfume_helper('Serge Lutens', 'Un Bois Vanille', 'female', 'edp', 180.00, 75, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Bitter almond, warm coconut, beeswax, and vanilla wood.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Almond' OR name_en ILIKE 'Coconut' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Let the Good Times Roll
    p_id := seed_perfume_helper('Lush', 'Let the Good Times Roll', 'unisex', 'edp', 85.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Mouthwatering warm caramel popcorn accord.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Popcorn' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. Acqua e Zucchero
    p_id := seed_perfume_helper('Profumum Roma', 'Acqua e Zucchero', 'unisex', 'edp', 275.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Mouthwatering cotton candy, vanilla, and orange blossom.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cotton Candy' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Orange Blossom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Vanilla Cake
    p_id := seed_perfume_helper('Montale', 'Vanilla Cake', 'unisex', 'edp', 140.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Milk, almond, meringue, and Madagascar vanilla.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Milk' OR name_en ILIKE 'Almond' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Princess
    p_id := seed_perfume_helper('By Kilian', 'I Don''t Need A Prince By My Side To Be A Princess', 'female', 'edp', 135.00, 50, 'Gourmand', ARRAY['Spring', 'Autumn'], ARRAY['Day', 'Casual'], true, 'Ginger, green tea, marshmallow, and sweet vanilla.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ginger' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Green Tea' OR name_en ILIKE 'Marshmallow' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Delizia di Marshmallow
    p_id := seed_perfume_helper('Demeter', 'Marshmallow', 'unisex', 'edc', 35.00, 120, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'A warm fluffy marshmallow and sugar syrup scent.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sugar' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Marshmallow' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Kerosene Follow
    p_id := seed_perfume_helper('Kerosene', 'Follow', 'unisex', 'edp', 150.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Casual'], true, 'Authentic coffee, cocoa, and maple syrup latte.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Maple Syrup' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Honey I Washed the Kids
    p_id := seed_perfume_helper('Lush', 'Honey I Washed the Kids', 'female', 'edp', 85.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Honey, butter toffee, and clean vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Toffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Akro Awake
    p_id := seed_perfume_helper('Akro', 'Awake', 'unisex', 'edp', 160.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Incredibly strong roasted coffee, cardamom, and hazelnut.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Hazelnut' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Bouquet Ideale
    p_id := seed_perfume_helper('Xerjoff', 'Casamorati Bouquet Ideale', 'female', 'edp', 290.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Spiced cinnamon, cashmere wood, vanilla, and coumarin.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cinnamon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cashmeran' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Coumarin' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Lemon Tart
    p_id := seed_perfume_helper('Theodoros Kalotinis', 'Lemon Tart', 'unisex', 'edp', 90.00, 50, 'Gourmand', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Casual'], true, 'Realistic lemon cream, butter cookies, and vanilla sugar.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Butter' OR name_en ILIKE 'Sugar' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. Sweet Oriental Dream
    p_id := seed_perfume_helper('Montale', 'Sweet Oriental Dream', 'female', 'edp', 140.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Sweet rose, almonds, honey loukhoum, and vanilla.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Almond' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Tihota
    p_id := seed_perfume_helper('Indult', 'Tihota', 'unisex', 'edp', 220.00, 50, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'An exceptional photorealistic vanilla sugar pod and clean musk.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sugar' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'White Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Lait de Biscuit
    p_id := seed_perfume_helper('Chabaud', 'Lait de Biscuit', 'unisex', 'edt', 110.00, 100, 'Gourmand', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'Evokes butter biscuits, warm milk, caramel, and vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Milk' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Biscuit' OR name_en ILIKE 'Caramel' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
