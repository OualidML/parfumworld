-- Migration: High-Density Catalog Seed - Session 6 (Modern Masterpieces & Blue Fragrances)
-- Created on 2026-08-31
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure Brands Exist
INSERT INTO public.brands (name, country) SELECT 'Chanel', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'chanel');
INSERT INTO public.brands (name, country) SELECT 'Christian Dior', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'christian dior');
INSERT INTO public.brands (name, country) SELECT 'Yves Saint Laurent', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'yves saint laurent');
INSERT INTO public.brands (name, country) SELECT 'Giorgio Armani', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'giorgio armani');
INSERT INTO public.brands (name, country) SELECT 'Maison Francis Kurkdjian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'maison francis kurkdjian');
INSERT INTO public.brands (name, country) SELECT 'Parfums de Marly', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'parfums de marly');
INSERT INTO public.brands (name, country) SELECT 'Marc-Antoine Barrois', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'marc-antoine barrois');
INSERT INTO public.brands (name, country) SELECT 'Hermès', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'hermès' OR lower(name) = 'hermes');
INSERT INTO public.brands (name, country) SELECT 'Viktor&Rolf', 'Netherlands' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'viktor&rolf' OR lower(name) = 'viktor & rolf');
INSERT INTO public.brands (name, country) SELECT 'Jean Paul Gaultier', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'jean paul gaultier');
INSERT INTO public.brands (name, country) SELECT 'Mugler', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'mugler' OR lower(name) = 'thierry mugler');
INSERT INTO public.brands (name, country) SELECT 'Tom Ford', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'tom ford');
INSERT INTO public.brands (name, country) SELECT 'Nishane', 'Turkey' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'nishane');
INSERT INTO public.brands (name, country) SELECT 'Xerjoff', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'xerjoff');
INSERT INTO public.brands (name, country) SELECT 'Prada', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'prada');
INSERT INTO public.brands (name, country) SELECT 'Bvlgari', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'bvlgari');
INSERT INTO public.brands (name, country) SELECT 'Versace', 'Italy' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'versace');
INSERT INTO public.brands (name, country) SELECT 'Creed', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'creed');
INSERT INTO public.brands (name, country) SELECT 'Byredo', 'Sweden' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'byredo');
INSERT INTO public.brands (name, country) SELECT 'By Kilian', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'by kilian');
INSERT INTO public.brands (name, country) SELECT 'Maison Martin Margiela', 'France' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'maison martin margiela');
INSERT INTO public.brands (name, country) SELECT 'Amouage', 'Oman' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'amouage');
INSERT INTO public.brands (name, country) SELECT 'Le Labo', 'United States' WHERE NOT EXISTS (SELECT 1 FROM public.brands WHERE lower(name) = 'le labo');

-- 2. Ensure Missing Notes Exist via Exact Category Lookups (No Wildcards)
-- Woody Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'أكيغالاوود', 'Akigalawood', 'Akigalawood', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'akigalawood');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب العنبر', 'Bois d''Ambre', 'Amberwood', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'amberwood');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'شجر البتولا', 'Bouleau', 'Birch', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'birch');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'راتنج التنوب', 'Résine de Sapin', 'Fir', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'fir');

-- Floral Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'إمورتيل / الخالدة', 'Immortelle', 'Immortelle', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'immortelle');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'أوسمانثوس', 'Osmanthus', 'Osmanthus', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'osmanthus');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'فاوانيا', 'Pivoine', 'Peony', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'peony');

-- Spicy Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'فلفل إفرنجي / بيمنتو', 'Piment', 'Pimento', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'pimento');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'يانسون نجمي', 'Anis Étoilé', 'Star Anise', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'star anise');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'عرقسوس', 'Réglisse', 'Licorice', 'base' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'licorice');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'ورق الغار', 'Feuille de Laurier', 'Bay Leaf', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'bay leaf');

-- Fresh & Mineral Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'نوتات معدنية', 'Notes Minérales', 'Mineral Notes', 'middle' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'mineral notes');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'نوتات بحرية', 'Notes Marines', 'Sea Notes', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'sea notes');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer) 
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Fresh' LIMIT 1), 'ألدهيدات', 'Aldéhydes', 'Aldehydes', 'top' 
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'aldehydes');

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
    -- 1. Bleu de Chanel (EDP)
    p_id := seed_perfume_helper('Chanel', 'Bleu de Chanel Eau de Parfum', 'male', 'edp', 170.00, 100, 'Woody', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'An aromatic woody fragrance with captivating trail of citrus, mint, incense, and cedar.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Mint' OR name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Jasmine' OR name_en ILIKE 'Melon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Sauvage (EDP)
    p_id := seed_perfume_helper('Christian Dior', 'Sauvage Eau de Parfum', 'male', 'edp', 160.00, 100, 'Fresh', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Casual', 'Formal'], true, 'A sensual interpretation with juicy Calabrian bergamot, Sichuan pepper, and intoxicating vanilla.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sichuan Pepper' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Star Anise' OR name_en ILIKE 'Nutmeg' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambroxan' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Sauvage Elixir
    p_id := seed_perfume_helper('Christian Dior', 'Sauvage Elixir', 'male', 'parfum', 250.00, 60, 'Spicy', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An extraordinarily concentrated fragrance steeped in the iconic freshness with an intoxicating spicy heart.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lavender' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Licorice' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Y (EDP)
    p_id := seed_perfume_helper('Yves Saint Laurent', 'Y Eau de Parfum', 'male', 'edp', 155.00, 100, 'Fresh', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Casual'], true, 'Bold apple, fresh ginger, and sage meet deep sensual tonka bean and amberwood.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Apple' OR name_en ILIKE 'Ginger' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sage' OR name_en ILIKE 'Juniper' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Olibanum' ON CONFLICT DO NOTHING;
    END IF;

    -- 5. La Nuit de l'Homme
    p_id := seed_perfume_helper('Yves Saint Laurent', 'La Nuit de l''Homme', 'male', 'edt', 135.00, 100, 'Spicy', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Romantic', 'Formal'], true, 'A veil of mystery and explosive spicy cardamom with cedar and fresh lavender.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Caraway' ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Acqua di Giò Profumo
    p_id := seed_perfume_helper('Giorgio Armani', 'Acqua di Giò Profumo', 'male', 'parfum', 170.00, 75, 'Fresh', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Formal'], true, 'Profound aquatic freshness echoing the intensity of volcanic rock and sea depths.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Sea Notes' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rosemary' OR name_en ILIKE 'Sage' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Incense' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 7. Baccarat Rouge 540 (EDP)
    p_id := seed_perfume_helper('Maison Francis Kurkdjian', 'Baccarat Rouge 540', 'unisex', 'edp', 325.00, 70, 'Oriental', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Formal'], true, 'Luminous and sophisticated breezy jasmine, radiant saffron, ambergris, and cedar.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Saffron' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Amberwood' OR name_en ILIKE 'Ambergris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Fir' ON CONFLICT DO NOTHING;
    END IF;

    -- 8. Grand Soir
    p_id := seed_perfume_helper('Maison Francis Kurkdjian', 'Grand Soir', 'unisex', 'edp', 240.00, 70, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An unforgettable Parisian night dressed in warm benzoin, cistus labdanum, and rich tonka bean.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Labdanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Benzoin' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 9. Layton
    p_id := seed_perfume_helper('Parfums de Marly', 'Layton', 'unisex', 'edp', 350.00, 125, 'Oriental', ARRAY['Autumn', 'Winter', 'Spring'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'A captivating fragrance blending crisp green apple, lavender, vanilla, and precious woods.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Apple' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Geranium' OR name_en ILIKE 'Violet' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Guaiac Wood' ON CONFLICT DO NOTHING;
    END IF;

    -- 10. Delina
    p_id := seed_perfume_helper('Parfums de Marly', 'Delina', 'female', 'edp', 375.00, 75, 'Floral', ARRAY['Spring', 'Summer'], ARRAY['Day', 'Formal', 'Romantic'], true, 'Charming and modern floral bouquet of Turkish rose, lychee, rhubarb, and sensual vanilla.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lychee' OR name_en ILIKE 'Rhubarb' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Nutmeg' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Peony' OR name_en ILIKE 'Musk' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cashmeran' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Incense' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 11. Herod
    p_id := seed_perfume_helper('Parfums de Marly', 'Herod', 'male', 'edp', 350.00, 125, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Royally spiced gourmand tobacco infused with cinnamon, osmanthus, and Madagascar vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Incense' OR name_en ILIKE 'Osmanthus' OR name_en ILIKE 'Labdanum' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 12. Carlisle
    p_id := seed_perfume_helper('Parfums de Marly', 'Carlisle', 'unisex', 'edp', 375.00, 125, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Sensual wave of green apple, warm nutmeg, rich tonka bean, and dark patchouli.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Nutmeg' OR name_en ILIKE 'Green Apple' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 13. Ganymede
    p_id := seed_perfume_helper('Marc-Antoine Barrois', 'Ganymede', 'unisex', 'edp', 215.00, 100, 'Woody', ARRAY['All Seasons'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'Futuristic and crystalline leather mineral aura with mandarin, violet, and akigalawood.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mandarin' OR name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet' OR name_en ILIKE 'Osmanthus' OR name_en ILIKE 'Mineral Notes' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Akigalawood' OR name_en ILIKE 'Immortelle' ON CONFLICT DO NOTHING;
    END IF;

    -- 14. Tuxedo
    p_id := seed_perfume_helper('Yves Saint Laurent', 'Tuxedo', 'unisex', 'edp', 290.00, 125, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'The matte texture of smoked patchouli enveloped in luminous spices and ambergris.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Violet Leaf' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Coriander' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Rose' OR name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Lily-of-the-Valley' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Ambergris' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 15. Terre d'Hermès (EDT)
    p_id := seed_perfume_helper('Hermès', 'Terre d''Hermès', 'male', 'edt', 145.00, 100, 'Woody', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Formal', 'Casual'], true, 'Mineral and woody structure anchoring bitter orange, grapefruit, pepper, and vetiver.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Orange' OR name_en ILIKE 'Grapefruit' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Pelargonium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Benzoin' ON CONFLICT DO NOTHING;
    END IF;

    -- 16. Spicebomb Extreme
    p_id := seed_perfume_helper('Viktor&Rolf', 'Spicebomb Extreme', 'male', 'edp', 150.00, 90, 'Spicy', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'An explosive fiery detonation of black pepper, saffron, cinnamon, tobacco, and bourbon vanilla.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Pimento' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Cumin' OR name_en ILIKE 'Saffron' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 17. Le Male Le Parfum
    p_id := seed_perfume_helper('Jean Paul Gaultier', 'Le Male Le Parfum', 'male', 'edp', 140.00, 125, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Romantic', 'Casual'], true, 'A charismatic captain with intense cardamom, iris, lavender, and rich vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Oriental Notes' OR name_en ILIKE 'Woody Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 18. Ultra Male
    p_id := seed_perfume_helper('Jean Paul Gaultier', 'Ultra Male', 'male', 'edt', 130.00, 125, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Sweet, seductive blend of juicy pear, black vanilla, cinnamon, and mint.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pear' OR name_en ILIKE 'Lavender' OR name_en ILIKE 'Mint' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Caraway' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 19. Alien
    p_id := seed_perfume_helper('Mugler', 'Alien', 'female', 'edp', 160.00, 90, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal', 'Romantic'], true, 'A magnetic solar floral talisman radiant with Indian jasmine sambac, cashmeran, and white amber.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Woody Notes' OR name_en ILIKE 'Cashmeran' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 20. Angel
    p_id := seed_perfume_helper('Mugler', 'Angel', 'female', 'edp', 160.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'The revolutionary mother of all gourmands with patchouli, caramel, chocolate, and cotton candy.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cotton Candy' OR name_en ILIKE 'Coconut' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Blackberry' OR name_en ILIKE 'Plum' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Patchouli' OR name_en ILIKE 'Chocolate' OR name_en ILIKE 'Caramel' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 21. Tobacco Vanille
    p_id := seed_perfume_helper('Tom Ford', 'Tobacco Vanille', 'unisex', 'edp', 295.00, 50, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Opulent, warm, and iconic artisanal scent inspired by an English gentleman’s club.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Spices' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Cocoa' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Dried Fruits' OR name_en ILIKE 'Woody Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 22. Oud Wood
    p_id := seed_perfume_helper('Tom Ford', 'Oud Wood', 'unisex', 'edp', 295.00, 50, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'Exotic rosewood and cardamom give way to a smoky blend of rare oud wood, sandalwood, and vetiver.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Agarwood (Oud)' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Amber' ON CONFLICT DO NOTHING;
    END IF;

    -- 23. Hacivat
    p_id := seed_perfume_helper('Nishane', 'Hacivat', 'unisex', 'parfum', 280.00, 100, 'Chypre', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Night', 'Formal', 'Casual'], true, 'An uplifting chypre tribute to elegance and love of art with pineapple, bergamot, and oakmoss.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pineapple' OR name_en ILIKE 'Grapefruit' OR name_en ILIKE 'Bergamot' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Oakmoss' OR name_en ILIKE 'Woody Notes' ON CONFLICT DO NOTHING;
    END IF;

    -- 24. Ani
    p_id := seed_perfume_helper('Nishane', 'Ani', 'unisex', 'parfum', 280.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'A world-famous vanilla masterpiece spiced with ginger, bergamot, blackcurrant, and cardamom.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ginger' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Pink Pepper' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Blackcurrant' OR name_en ILIKE 'Cardamom' OR name_en ILIKE 'Rose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Benzoin' OR name_en ILIKE 'Ambergris' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Musk' ON CONFLICT DO NOTHING;
    END IF;

    -- 25. Naxos
    p_id := seed_perfume_helper('Xerjoff', 'XJ 1861 Naxos', 'unisex', 'edp', 260.00, 100, 'Gourmand', ARRAY['Autumn', 'Winter'], ARRAY['Day', 'Night', 'Formal'], true, 'Mediterranean soul celebrating Sicily with bright citrus, sweet honey, tobacco, and vanilla.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lavender' OR name_en ILIKE 'Bergamot' OR name_en ILIKE 'Lemon' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Honey' OR name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Cashmeran' OR name_en ILIKE 'Jasmine' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Vanilla' ON CONFLICT DO NOTHING;
    END IF;

    -- 26. Dior Homme Intense
    p_id := seed_perfume_helper('Christian Dior', 'Dior Homme Intense', 'male', 'edp', 160.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal', 'Romantic'], true, 'Noble powdery Tuscan iris and ambrette seed enhanced by Virginia cedarwood and vetiver.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lavender' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Ambrette' OR name_en ILIKE 'Pear' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 27. Prada L'Homme
    p_id := seed_perfume_helper('Prada', 'Prada L''Homme', 'male', 'edt', 130.00, 100, 'Woody', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Formal', 'Casual'], true, 'The quintessential clean luxury scent with airy iris, neroli, cardamom, and amber.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Neroli' OR name_en ILIKE 'Black Pepper' OR name_en ILIKE 'Cardamom' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Iris' OR name_en ILIKE 'Violet' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Amber' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 28. Man In Black
    p_id := seed_perfume_helper('Bvlgari', 'Bvlgari Man In Black', 'male', 'edp', 145.00, 100, 'Oriental', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'An intense neo-oriental signature of spiced rum, vibrant leather, iris, and benzoin.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Spices' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Leather' OR name_en ILIKE 'Iris' OR name_en ILIKE 'Tuberose' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tonka Bean' OR name_en ILIKE 'Benzoin' OR name_en ILIKE 'Guaiac Wood' ON CONFLICT DO NOTHING;
    END IF;

    -- 29. Eros
    p_id := seed_perfume_helper('Versace', 'Eros Eau de Parfum', 'male', 'edp', 125.00, 100, 'Fresh', ARRAY['All Seasons'], ARRAY['Night', 'Casual'], true, 'A radiant luminous halo of Italian lemon, mint, candied apple, and sensual vanilla.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Mint' OR name_en ILIKE 'Apple' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Mandarin' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Ambroxan' OR name_en ILIKE 'Geranium' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Patchouli' OR name_en ILIKE 'Leather' ON CONFLICT DO NOTHING;
    END IF;

    -- 30. Green Irish Tweed
    p_id := seed_perfume_helper('Creed', 'Green Irish Tweed', 'male', 'edp', 470.00, 100, 'Fougère', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Formal', 'Casual'], true, 'A timeless classic reminiscent of an emerald stroll through the lush Irish countryside.', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Lemon' OR name_en ILIKE 'Iris' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet Leaf' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Ambergris' OR name_en ILIKE 'Sandalwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 31. Mojave Ghost
    p_id := seed_perfume_helper('Byredo', 'Mojave Ghost', 'unisex', 'edp', 290.00, 100, 'Floral', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Casual'], true, 'A soulful woody composition inspired by the resilient ghost flower of the Mojave Desert.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Ambrette' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Violet' OR name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Magnolia' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Musk' OR name_en ILIKE 'Amber' OR name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
    END IF;

    -- 32. Intoxicated
    p_id := seed_perfume_helper('By Kilian', 'Intoxicated', 'unisex', 'edp', 290.00, 50, 'Spicy', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Formal'], true, 'Rich cup of Turkish coffee spiced with crushing green cardamom, nutmeg, and cinnamon.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Cardamom' OR name_en ILIKE 'Coffee' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cinnamon' OR name_en ILIKE 'Nutmeg' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vanilla' OR name_en ILIKE 'Tonka Bean' ON CONFLICT DO NOTHING;
    END IF;

    -- 33. Jazz Club
    p_id := seed_perfume_helper('Maison Martin Margiela', 'Jazz Club', 'male', 'edt', 160.00, 100, 'Woody', ARRAY['Autumn', 'Winter'], ARRAY['Night', 'Casual'], true, 'Heady cocktails, rich cigars, and leather armchairs in an intimate Brooklyn jazz club.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Lemon' OR name_en ILIKE 'Neroli' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Sage' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Tobacco' OR name_en ILIKE 'Vanilla' OR name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

    -- 34. Reflection Man
    p_id := seed_perfume_helper('Amouage', 'Reflection Man', 'male', 'edp', 360.00, 100, 'Floral', ARRAY['Spring', 'Summer', 'Autumn'], ARRAY['Day', 'Formal', 'Casual'], true, 'Distinctive refined white floral elegance with rosemary, red pepper berries, neroli, and orris.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Rosemary' OR name_en ILIKE 'Pink Pepper' OR name_en ILIKE 'Petitgrain' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Jasmine' OR name_en ILIKE 'Neroli' OR name_en ILIKE 'Iris' OR name_en ILIKE 'Ylang-Ylang' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Sandalwood' OR name_en ILIKE 'Cedarwood' OR name_en ILIKE 'Vetiver' OR name_en ILIKE 'Patchouli' ON CONFLICT DO NOTHING;
    END IF;

    -- 35. Thé Matcha 26
    p_id := seed_perfume_helper('Le Labo', 'Thé Matcha 26', 'unisex', 'edp', 230.00, 50, 'Fresh', ARRAY['All Seasons'], ARRAY['Day', 'Casual'], true, 'An introverted and deep tea scent with matcha accord, creamy fig, bitter orange, and cedarwood.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400');
    IF p_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'top' FROM public.notes WHERE name_en ILIKE 'Matcha Tea' OR name_en ILIKE 'Fig' OR name_en ILIKE 'Bitter Orange' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'middle' FROM public.notes WHERE name_en ILIKE 'Cedarwood' ON CONFLICT DO NOTHING;
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer) SELECT p_id, id, 'base' FROM public.notes WHERE name_en ILIKE 'Vetiver' ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS seed_perfume_helper(text, text, gender_type, concentration_type, numeric, integer, text, text[], text[], boolean, text, text);
