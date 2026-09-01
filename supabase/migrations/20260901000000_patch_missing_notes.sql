-- Migration: Note Synchronization Patch
-- Created on 2026-09-01
-- Hardcoded target shop_id: 'fbae2651-c18f-4682-99ef-2827c00044ff'

-- 1. Ensure all supporting notes exist via Exact Category Lookups
-- Woody Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب الصندل', 'Bois de Santal', 'Sandalwood', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'sandalwood');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب الأرز', 'Bois de Cèdre', 'Cedarwood', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cedarwood');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'باتشولي', 'Patchouli', 'Patchouli', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'patchouli');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'نجيل الهند / فيتيفر', 'Vétiver', 'Vetiver', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'vetiver');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'طحلب السنديان / أوكموس', 'Mousse de Chêne', 'Oakmoss', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'oakmoss');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'نوتات خشبية', 'Notes Boisées', 'Woody Notes', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'woody notes');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Woody' LIMIT 1), 'خشب الورد', 'Bois de Rose', 'Rosewood', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'rosewood');

-- Gourmand / Sweet Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'فانيليا', 'Vanille', 'Vanilla', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'vanilla');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'حبوب التونكا', 'Fève Tonka', 'Tonka Bean', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'tonka bean');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'كستناء / كستنة', 'Châtaigne', 'Chestnut', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'chestnut');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'روم', 'Rhum', 'Rum', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'rum');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'كاكاو', 'Cacao', 'Cocoa', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cocoa');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'قهوة', 'Café', 'Coffee', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'coffee');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'عسل', 'Miel', 'Honey', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'honey');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'كراميل', 'Caramel', 'Caramel', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'caramel');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'شوكولاتة', 'Chocolat', 'Chocolate', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'chocolate');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'حليب', 'Lait', 'Milk', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'milk');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'فواكه مجففة', 'Fruits Secs', 'Dried Fruits', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'dried fruits');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'لوز', 'Amande', 'Almond', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'almond');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'بندق', 'Noisette', 'Hazelnut', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'hazelnut');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Gourmand' LIMIT 1), 'أرز', 'Riz', 'Rice', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'rice');

-- Floral Notes
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ورد', 'Rose', 'Rose', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'rose');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ياسمين', 'Jasmin', 'Jasmine', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'jasmine');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'خزامى / لافندر', 'Lavande', 'Lavender', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lavender');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'سوسن / آيريس', 'Iris', 'Iris', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'iris');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'بنفسج', 'Violette', 'Violet', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'violet');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'أوراق البنفسج', 'Feuille de Violette', 'Violet Leaf', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'violet leaf');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زهر البرتقال', 'Fleur d''Oranger', 'Orange Blossom', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'orange blossom');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'مسك الروم / توبيروز', 'Tubéreuse', 'Tuberose', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'tuberose');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'إيلنغ', 'Ylang-Ylang', 'Ylang-Ylang', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'ylang-ylang');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'إبرة الراعي / جيرانيوم', 'Géranium', 'Geranium', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'geranium');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زنبق الوادي', 'Muguet', 'Lily-of-the-Valley', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lily-of-the-valley');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زنبق', 'Lys', 'Lily', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lily');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'قرنفل زهرة', 'Oeillet', 'Carnation', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'carnation');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'ماغنوليا', 'Magnolia', 'Magnolia', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'magnolia');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'لوتس', 'Lotus', 'Lotus', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'lotus');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Floral' LIMIT 1), 'زهرة التبغ', 'Fleur de Tabac', 'Tobacco Blossom', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'tobacco blossom');

-- Spices & Herbs
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'هيل', 'Cardamome', 'Cardamom', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'cardamom');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'زنجبيل', 'Gingembre', 'Ginger', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'ginger');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'مريمية / سيج', 'Sauge', 'Sage', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'sage');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'إكليل الجبل / روزماري', 'Romarin', 'Rosemary', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'rosemary');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'ريحان / بازيليك', 'Basilic', 'Basil', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'basil');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'زعتر / تايم', 'Thym', 'Thyme', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'thyme');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'أوريجانو / صعتر', 'Origan', 'Oregano', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'oregano');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'شاي أسود', 'Thé Noir', 'Black Tea', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'black tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'شاي أخضر', 'Thé Vert', 'Green Tea', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'green tea');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Spicy' LIMIT 1), 'ماتشا', 'Matcha', 'Matcha Tea', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'matcha tea');

-- Resins & Orientals
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'عنبر', 'Ambre', 'Amber', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'amber');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'بخور / إنسنس', 'Encens', 'Incense', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'incense');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'مر', 'Myrrhe', 'Myrrh', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'myrrh');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'جاوي / بنزوين', 'Benjoin', 'Benzoin', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'benzoin');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'لابدانوم', 'Labdanum', 'Labdanum', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'labdanum');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'أوبوبوناكس', 'Opoponax', 'Opoponax', 'middle'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'opoponax');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'إيليمي', 'Élémi', 'Elemi', 'top'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'elemi');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'تبغ', 'Tabac', 'Tobacco', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'tobacco');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Oriental' LIMIT 1), 'نوتات شرقية', 'Notes Orientales', 'Oriental Notes', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'oriental notes');

-- Leathers & Musks
INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'مسك', 'Musc', 'Musk', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'musk');

INSERT INTO public.notes (category_id, name_ar, name_fr, name_en, layer)
SELECT (SELECT id FROM public.note_categories WHERE name_en ILIKE 'Leathery' LIMIT 1), 'مسك أبيض', 'Musc Blanc', 'White Musk', 'base'
WHERE NOT EXISTS (SELECT 1 FROM public.notes WHERE lower(trim(name_en)) = 'white musk');

-- 2. Helper function to safely link notes to perfumes under the target shop_id
CREATE OR REPLACE FUNCTION link_perfume_note(
    p_perfume_name text,
    p_note_name text,
    p_layer note_layer
) RETURNS void AS $$
DECLARE
    v_perfume_id uuid;
    v_note_id uuid;
    v_shop_id uuid := 'fbae2651-c18f-4682-99ef-2827c00044ff'::uuid;
BEGIN
    SELECT id INTO v_perfume_id FROM public.perfumes 
    WHERE lower(name) = lower(p_perfume_name) AND shop_id = v_shop_id LIMIT 1;
    
    SELECT id INTO v_note_id FROM public.notes 
    WHERE lower(trim(name_en)) = lower(trim(p_note_name)) LIMIT 1;
    
    IF v_perfume_id IS NOT NULL AND v_note_id IS NOT NULL THEN
        INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
        VALUES (v_perfume_id, v_note_id, p_layer)
        ON CONFLICT (perfume_id, note_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Execute Note Linking for All Target Fragrances
DO $$
BEGIN
    -- By the Fireplace
    PERFORM link_perfume_note('By the Fireplace', 'Chestnut', 'middle');
    PERFORM link_perfume_note('By the Fireplace', 'Vanilla', 'middle');
    PERFORM link_perfume_note('By the Fireplace', 'Smoke', 'base');
    PERFORM link_perfume_note('By the Fireplace', 'Pink Pepper', 'top');

    -- Epic Man
    PERFORM link_perfume_note('Epic Man', 'Pink Pepper', 'top');
    PERFORM link_perfume_note('Epic Man', 'Cardamom', 'top');
    PERFORM link_perfume_note('Epic Man', 'Saffron', 'top');
    PERFORM link_perfume_note('Epic Man', 'Nutmeg', 'top');
    PERFORM link_perfume_note('Epic Man', 'Caraway', 'top');
    PERFORM link_perfume_note('Epic Man', 'Myrrh', 'middle');
    PERFORM link_perfume_note('Epic Man', 'Geranium', 'middle');
    PERFORM link_perfume_note('Epic Man', 'Agarwood (Oud)', 'base');
    PERFORM link_perfume_note('Epic Man', 'Leather', 'base');
    PERFORM link_perfume_note('Epic Man', 'Castoreum', 'base');
    PERFORM link_perfume_note('Epic Man', 'Cedarwood', 'base');
    PERFORM link_perfume_note('Epic Man', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Epic Man', 'Patchouli', 'base');
    PERFORM link_perfume_note('Epic Man', 'Musk', 'base');

    -- Memoir Man
    PERFORM link_perfume_note('Memoir Man', 'Mint', 'top');
    PERFORM link_perfume_note('Memoir Man', 'Basil', 'top');
    PERFORM link_perfume_note('Memoir Man', 'Incense', 'middle');
    PERFORM link_perfume_note('Memoir Man', 'Lavender', 'middle');
    PERFORM link_perfume_note('Memoir Man', 'Rose', 'middle');
    PERFORM link_perfume_note('Memoir Man', 'Tobacco', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Leather', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Guaiac Wood', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Vetiver', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Oakmoss', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Amber', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Vanilla', 'base');
    PERFORM link_perfume_note('Memoir Man', 'Musk', 'base');

    -- Virgin Island Water
    PERFORM link_perfume_note('Virgin Island Water', 'Coconut', 'top');
    PERFORM link_perfume_note('Virgin Island Water', 'Lime', 'top');
    PERFORM link_perfume_note('Virgin Island Water', 'Bergamot', 'top');
    PERFORM link_perfume_note('Virgin Island Water', 'Mandarin', 'top');
    PERFORM link_perfume_note('Virgin Island Water', 'Ginger', 'middle');
    PERFORM link_perfume_note('Virgin Island Water', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Virgin Island Water', 'Ylang-Ylang', 'middle');
    PERFORM link_perfume_note('Virgin Island Water', 'Sugar', 'base');
    PERFORM link_perfume_note('Virgin Island Water', 'Rum', 'base');
    PERFORM link_perfume_note('Virgin Island Water', 'Musk', 'base');

    -- Sauvage Elixir
    PERFORM link_perfume_note('Sauvage Elixir', 'Cinnamon', 'top');
    PERFORM link_perfume_note('Sauvage Elixir', 'Nutmeg', 'top');
    PERFORM link_perfume_note('Sauvage Elixir', 'Cardamom', 'top');
    PERFORM link_perfume_note('Sauvage Elixir', 'Grapefruit', 'top');
    PERFORM link_perfume_note('Sauvage Elixir', 'Lavender', 'middle');
    PERFORM link_perfume_note('Sauvage Elixir', 'Licorice', 'base');
    PERFORM link_perfume_note('Sauvage Elixir', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Sauvage Elixir', 'Amber', 'base');
    PERFORM link_perfume_note('Sauvage Elixir', 'Patchouli', 'base');
    PERFORM link_perfume_note('Sauvage Elixir', 'Vetiver', 'base');

    -- Sauvage Eau de Parfum
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Bergamot', 'top');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Sichuan Pepper', 'middle');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Lavender', 'middle');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Star Anise', 'middle');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Nutmeg', 'middle');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Ambroxan', 'base');
    PERFORM link_perfume_note('Sauvage Eau de Parfum', 'Vanilla', 'base');

    -- Aventus
    PERFORM link_perfume_note('Aventus', 'Pineapple', 'top');
    PERFORM link_perfume_note('Aventus', 'Bergamot', 'top');
    PERFORM link_perfume_note('Aventus', 'Blackcurrant', 'top');
    PERFORM link_perfume_note('Aventus', 'Apple', 'top');
    PERFORM link_perfume_note('Aventus', 'Birch', 'middle');
    PERFORM link_perfume_note('Aventus', 'Patchouli', 'middle');
    PERFORM link_perfume_note('Aventus', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Aventus', 'Rose', 'middle');
    PERFORM link_perfume_note('Aventus', 'Musk', 'base');
    PERFORM link_perfume_note('Aventus', 'Oakmoss', 'base');
    PERFORM link_perfume_note('Aventus', 'Ambergris', 'base');
    PERFORM link_perfume_note('Aventus', 'Vanilla', 'base');

    -- Baccarat Rouge 540
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Saffron', 'top');
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Jasmine', 'top');
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Amberwood', 'middle');
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Ambergris', 'middle');
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Cedarwood', 'base');
    PERFORM link_perfume_note('Baccarat Rouge 540', 'Fir', 'base');

    -- Grand Soir
    PERFORM link_perfume_note('Grand Soir', 'Labdanum', 'top');
    PERFORM link_perfume_note('Grand Soir', 'Benzoin', 'middle');
    PERFORM link_perfume_note('Grand Soir', 'Tonka Bean', 'middle');
    PERFORM link_perfume_note('Grand Soir', 'Amber', 'base');
    PERFORM link_perfume_note('Grand Soir', 'Vanilla', 'base');

    -- Layton
    PERFORM link_perfume_note('Layton', 'Apple', 'top');
    PERFORM link_perfume_note('Layton', 'Lavender', 'top');
    PERFORM link_perfume_note('Layton', 'Bergamot', 'top');
    PERFORM link_perfume_note('Layton', 'Mandarin', 'top');
    PERFORM link_perfume_note('Layton', 'Geranium', 'middle');
    PERFORM link_perfume_note('Layton', 'Violet', 'middle');
    PERFORM link_perfume_note('Layton', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Layton', 'Vanilla', 'base');
    PERFORM link_perfume_note('Layton', 'Cardamom', 'base');
    PERFORM link_perfume_note('Layton', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Layton', 'Black Pepper', 'base');
    PERFORM link_perfume_note('Layton', 'Patchouli', 'base');
    PERFORM link_perfume_note('Layton', 'Guaiac Wood', 'base');

    -- Delina
    PERFORM link_perfume_note('Delina', 'Lychee', 'top');
    PERFORM link_perfume_note('Delina', 'Rhubarb', 'top');
    PERFORM link_perfume_note('Delina', 'Bergamot', 'top');
    PERFORM link_perfume_note('Delina', 'Nutmeg', 'top');
    PERFORM link_perfume_note('Delina', 'Rose', 'middle');
    PERFORM link_perfume_note('Delina', 'Peony', 'middle');
    PERFORM link_perfume_note('Delina', 'Musk', 'middle');
    PERFORM link_perfume_note('Delina', 'Vanilla', 'middle');
    PERFORM link_perfume_note('Delina', 'Cashmeran', 'base');
    PERFORM link_perfume_note('Delina', 'Cedarwood', 'base');
    PERFORM link_perfume_note('Delina', 'Incense', 'base');
    PERFORM link_perfume_note('Delina', 'Vetiver', 'base');

    -- Tobacco Vanille
    PERFORM link_perfume_note('Tobacco Vanille', 'Tobacco', 'top');
    PERFORM link_perfume_note('Tobacco Vanille', 'Spices', 'top');
    PERFORM link_perfume_note('Tobacco Vanille', 'Vanilla', 'middle');
    PERFORM link_perfume_note('Tobacco Vanille', 'Cocoa', 'middle');
    PERFORM link_perfume_note('Tobacco Vanille', 'Tonka Bean', 'middle');
    PERFORM link_perfume_note('Tobacco Vanille', 'Dried Fruits', 'base');
    PERFORM link_perfume_note('Tobacco Vanille', 'Woody Notes', 'base');

    -- Oud Wood
    PERFORM link_perfume_note('Oud Wood', 'Cardamom', 'top');
    PERFORM link_perfume_note('Oud Wood', 'Rosewood', 'top');
    PERFORM link_perfume_note('Oud Wood', 'Agarwood (Oud)', 'middle');
    PERFORM link_perfume_note('Oud Wood', 'Sandalwood', 'middle');
    PERFORM link_perfume_note('Oud Wood', 'Vetiver', 'middle');
    PERFORM link_perfume_note('Oud Wood', 'Tonka Bean', 'base');
    PERFORM link_perfume_note('Oud Wood', 'Vanilla', 'base');
    PERFORM link_perfume_note('Oud Wood', 'Amber', 'base');

    -- Ganymede
    PERFORM link_perfume_note('Ganymede', 'Mandarin', 'top');
    PERFORM link_perfume_note('Ganymede', 'Saffron', 'top');
    PERFORM link_perfume_note('Ganymede', 'Violet', 'middle');
    PERFORM link_perfume_note('Ganymede', 'Osmanthus', 'middle');
    PERFORM link_perfume_note('Ganymede', 'Mineral Notes', 'middle');
    PERFORM link_perfume_note('Ganymede', 'Akigalawood', 'base');
    PERFORM link_perfume_note('Ganymede', 'Immortelle', 'base');

    -- Terre d'Hermès
    PERFORM link_perfume_note('Terre d''Hermès', 'Orange', 'top');
    PERFORM link_perfume_note('Terre d''Hermès', 'Grapefruit', 'top');
    PERFORM link_perfume_note('Terre d''Hermès', 'Black Pepper', 'middle');
    PERFORM link_perfume_note('Terre d''Hermès', 'Pelargonium', 'middle');
    PERFORM link_perfume_note('Terre d''Hermès', 'Vetiver', 'base');
    PERFORM link_perfume_note('Terre d''Hermès', 'Cedarwood', 'base');
    PERFORM link_perfume_note('Terre d''Hermès', 'Patchouli', 'base');
    PERFORM link_perfume_note('Terre d''Hermès', 'Benzoin', 'base');

    -- Bianco Latte
    PERFORM link_perfume_note('Bianco Latte', 'Milk', 'top');
    PERFORM link_perfume_note('Bianco Latte', 'Honey', 'middle');
    PERFORM link_perfume_note('Bianco Latte', 'Caramel', 'middle');
    PERFORM link_perfume_note('Bianco Latte', 'Vanilla', 'base');
    PERFORM link_perfume_note('Bianco Latte', 'Coumarin', 'base');

    -- Lost Cherry
    PERFORM link_perfume_note('Lost Cherry', 'Sour Cherry', 'top');
    PERFORM link_perfume_note('Lost Cherry', 'Almond', 'top');
    PERFORM link_perfume_note('Lost Cherry', 'Plum', 'middle');
    PERFORM link_perfume_note('Lost Cherry', 'Rose', 'middle');
    PERFORM link_perfume_note('Lost Cherry', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Lost Cherry', 'Vanilla', 'base');
    PERFORM link_perfume_note('Lost Cherry', 'Tonka Bean', 'base');
    PERFORM link_perfume_note('Lost Cherry', 'Cinnamon', 'base');
    PERFORM link_perfume_note('Lost Cherry', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Lost Cherry', 'Cedarwood', 'base');

    -- Bitter Peach
    PERFORM link_perfume_note('Bitter Peach', 'Peach', 'top');
    PERFORM link_perfume_note('Bitter Peach', 'Blood Orange', 'top');
    PERFORM link_perfume_note('Bitter Peach', 'Cardamom', 'top');
    PERFORM link_perfume_note('Bitter Peach', 'Rum', 'middle');
    PERFORM link_perfume_note('Bitter Peach', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Bitter Peach', 'Vanilla', 'base');
    PERFORM link_perfume_note('Bitter Peach', 'Tonka Bean', 'base');
    PERFORM link_perfume_note('Bitter Peach', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Bitter Peach', 'Patchouli', 'base');

    -- Tuscan Leather
    PERFORM link_perfume_note('Tuscan Leather', 'Saffron', 'top');
    PERFORM link_perfume_note('Tuscan Leather', 'Thyme', 'top');
    PERFORM link_perfume_note('Tuscan Leather', 'Raspberry', 'top');
    PERFORM link_perfume_note('Tuscan Leather', 'Olibanum', 'middle');
    PERFORM link_perfume_note('Tuscan Leather', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Tuscan Leather', 'Leather', 'base');
    PERFORM link_perfume_note('Tuscan Leather', 'Suede', 'base');
    PERFORM link_perfume_note('Tuscan Leather', 'Amber', 'base');

    -- Ombré Leather
    PERFORM link_perfume_note('Ombré Leather', 'Cardamom', 'top');
    PERFORM link_perfume_note('Ombré Leather', 'Leather', 'middle');
    PERFORM link_perfume_note('Ombré Leather', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Ombré Leather', 'Amber', 'base');
    PERFORM link_perfume_note('Ombré Leather', 'Patchouli', 'base');

    -- Musc Ravageur
    PERFORM link_perfume_note('Musc Ravageur', 'Lavender', 'top');
    PERFORM link_perfume_note('Musc Ravageur', 'Bergamot', 'top');
    PERFORM link_perfume_note('Musc Ravageur', 'Cinnamon', 'middle');
    PERFORM link_perfume_note('Musc Ravageur', 'Clove', 'middle');
    PERFORM link_perfume_note('Musc Ravageur', 'Musk', 'base');
    PERFORM link_perfume_note('Musc Ravageur', 'Vanilla', 'base');
    PERFORM link_perfume_note('Musc Ravageur', 'Amber', 'base');
    PERFORM link_perfume_note('Musc Ravageur', 'Sandalwood', 'base');

    -- Oud for Greatness
    PERFORM link_perfume_note('Oud for Greatness', 'Saffron', 'top');
    PERFORM link_perfume_note('Oud for Greatness', 'Nutmeg', 'top');
    PERFORM link_perfume_note('Oud for Greatness', 'Lavender', 'top');
    PERFORM link_perfume_note('Oud for Greatness', 'Agarwood (Oud)', 'middle');
    PERFORM link_perfume_note('Oud for Greatness', 'Patchouli', 'base');
    PERFORM link_perfume_note('Oud for Greatness', 'Musk', 'base');

    -- XJ 1861 Naxos
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Lavender', 'top');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Bergamot', 'top');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Lemon', 'top');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Honey', 'middle');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Cinnamon', 'middle');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Cashmeran', 'middle');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Jasmine', 'middle');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Tobacco', 'base');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Tonka Bean', 'base');
    PERFORM link_perfume_note('XJ 1861 Naxos', 'Vanilla', 'base');

    -- Spicebomb Extreme
    PERFORM link_perfume_note('Spicebomb Extreme', 'Black Pepper', 'top');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Pimento', 'top');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Cinnamon', 'middle');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Cumin', 'middle');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Saffron', 'middle');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Tobacco', 'base');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Vanilla', 'base');
    PERFORM link_perfume_note('Spicebomb Extreme', 'Amber', 'base');

    -- Le Male Le Parfum
    PERFORM link_perfume_note('Le Male Le Parfum', 'Cardamom', 'top');
    PERFORM link_perfume_note('Le Male Le Parfum', 'Lavender', 'middle');
    PERFORM link_perfume_note('Le Male Le Parfum', 'Iris', 'middle');
    PERFORM link_perfume_note('Le Male Le Parfum', 'Vanilla', 'base');
    PERFORM link_perfume_note('Le Male Le Parfum', 'Oriental Notes', 'base');
    PERFORM link_perfume_note('Le Male Le Parfum', 'Woody Notes', 'base');

    -- Ultra Male
    PERFORM link_perfume_note('Ultra Male', 'Pear', 'top');
    PERFORM link_perfume_note('Ultra Male', 'Lavender', 'top');
    PERFORM link_perfume_note('Ultra Male', 'Mint', 'top');
    PERFORM link_perfume_note('Ultra Male', 'Bergamot', 'top');
    PERFORM link_perfume_note('Ultra Male', 'Cinnamon', 'middle');
    PERFORM link_perfume_note('Ultra Male', 'Caraway', 'middle');
    PERFORM link_perfume_note('Ultra Male', 'Vanilla', 'base');
    PERFORM link_perfume_note('Ultra Male', 'Amber', 'base');
    PERFORM link_perfume_note('Ultra Male', 'Patchouli', 'base');
    PERFORM link_perfume_note('Ultra Male', 'Cedarwood', 'base');

    -- Jazz Club
    PERFORM link_perfume_note('Jazz Club', 'Pink Pepper', 'top');
    PERFORM link_perfume_note('Jazz Club', 'Lemon', 'top');
    PERFORM link_perfume_note('Jazz Club', 'Neroli', 'top');
    PERFORM link_perfume_note('Jazz Club', 'Rum', 'middle');
    PERFORM link_perfume_note('Jazz Club', 'Sage', 'middle');
    PERFORM link_perfume_note('Jazz Club', 'Tobacco', 'base');
    PERFORM link_perfume_note('Jazz Club', 'Vanilla', 'base');
    PERFORM link_perfume_note('Jazz Club', 'Vetiver', 'base');

    -- Reflection Man
    PERFORM link_perfume_note('Reflection Man', 'Rosemary', 'top');
    PERFORM link_perfume_note('Reflection Man', 'Pink Pepper', 'top');
    PERFORM link_perfume_note('Reflection Man', 'Petitgrain', 'top');
    PERFORM link_perfume_note('Reflection Man', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Reflection Man', 'Neroli', 'middle');
    PERFORM link_perfume_note('Reflection Man', 'Iris', 'middle');
    PERFORM link_perfume_note('Reflection Man', 'Ylang-Ylang', 'middle');
    PERFORM link_perfume_note('Reflection Man', 'Sandalwood', 'base');
    PERFORM link_perfume_note('Reflection Man', 'Cedarwood', 'base');
    PERFORM link_perfume_note('Reflection Man', 'Vetiver', 'base');
    PERFORM link_perfume_note('Reflection Man', 'Patchouli', 'base');

    -- Black Saffron
    PERFORM link_perfume_note('Black Saffron', 'Saffron', 'top');
    PERFORM link_perfume_note('Black Saffron', 'Grapefruit', 'top');
    PERFORM link_perfume_note('Black Saffron', 'Leather', 'middle');
    PERFORM link_perfume_note('Black Saffron', 'Violet', 'middle');
    PERFORM link_perfume_note('Black Saffron', 'Raspberry', 'base');
    PERFORM link_perfume_note('Black Saffron', 'Cashmeran', 'base');
    PERFORM link_perfume_note('Black Saffron', 'Vetiver', 'base');

    -- African Leather
    PERFORM link_perfume_note('African Leather', 'Cardamom', 'top');
    PERFORM link_perfume_note('African Leather', 'Saffron', 'top');
    PERFORM link_perfume_note('African Leather', 'Bergamot', 'top');
    PERFORM link_perfume_note('African Leather', 'Cumin', 'middle');
    PERFORM link_perfume_note('African Leather', 'Geranium', 'middle');
    PERFORM link_perfume_note('African Leather', 'Patchouli', 'middle');
    PERFORM link_perfume_note('African Leather', 'Leather', 'base');
    PERFORM link_perfume_note('African Leather', 'Agarwood (Oud)', 'base');
    PERFORM link_perfume_note('African Leather', 'Vetiver', 'base');
    PERFORM link_perfume_note('African Leather', 'Musk', 'base');

    -- Red Tobacco
    PERFORM link_perfume_note('Red Tobacco', 'Cinnamon', 'top');
    PERFORM link_perfume_note('Red Tobacco', 'Agarwood (Oud)', 'top');
    PERFORM link_perfume_note('Red Tobacco', 'Saffron', 'top');
    PERFORM link_perfume_note('Red Tobacco', 'Nutmeg', 'top');
    PERFORM link_perfume_note('Red Tobacco', 'Patchouli', 'middle');
    PERFORM link_perfume_note('Red Tobacco', 'Jasmine', 'middle');
    PERFORM link_perfume_note('Red Tobacco', 'Tobacco', 'base');
    PERFORM link_perfume_note('Red Tobacco', 'Vanilla', 'base');
    PERFORM link_perfume_note('Red Tobacco', 'Amber', 'base');
    PERFORM link_perfume_note('Red Tobacco', 'Guaiac Wood', 'base');

END $$;

-- Clean helper function
DROP FUNCTION IF EXISTS link_perfume_note(text, text, note_layer);
