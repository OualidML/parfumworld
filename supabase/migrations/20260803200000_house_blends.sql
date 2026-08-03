-- 1. Insert House Blends brand
INSERT INTO brands (id, name) VALUES
('b0000000-0000-0000-0000-000000000000', 'House Blends / تركيبات حصرية')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert House Blends perfumes (Using valid hexadecimal UUIDs and price = 0 to satisfy not-null constraints)
INSERT INTO perfumes (id, brand_id, name, gender, concentration, price, volume_ml, in_stock, description_ar, description_fr, description_en) VALUES
-- Blend 1: Royal Amber Oud Rose
('90000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000000', 'House Blend: Royal Amber, Oud & Rose', 'unisex', 'parfum', 0, 100, true, 'تركيبة شرقية ملكية دافئة تجمع بين فخامة العود والعنبر ونعومة الورد والزعفران، يتم تحضيرها وتركيبها فورياً في المحل.', 'Un mélange oriental royal associant l''oud précieux, l''ambre chaud, la rose et le safran.', 'A royal oriental custom blend combining precious oud, warm amber, elegant rose, and saffron. Blended fresh in-store.'),
-- Blend 2: Fresh Ocean Breeze
('90000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000000', 'House Blend: Fresh Ocean Breeze', 'male', 'edp', 0, 100, true, 'تركيبة بحرية منعشة للغاية تثير نسيم المحيط البارد مع رذاذ الليمون والنعناع والبرغموت، تركب وتخلط خصيصاً لك.', 'Un mélange aquatique rafraîchissant évoquant la brise marine avec du citron et de la menthe.', 'An ultra-fresh marine custom blend evoking sea breeze, lemon, cooling mint, and bergamot. Blended fresh in-store.'),
-- Blend 3: Sweet Vanilla & Caramel
('90000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000000', 'House Blend: Sweet Vanilla & Caramel', 'female', 'edp', 0, 100, true, 'تركيبة غورماند غنية وحلوة بمزيج الفانيليا الكريمية والكراميل اللزج مع لمسات دافئة من فول التونكا واللوز.', 'Un mélange gourmand doux et onctueux mariant la vanille, le caramel, la fève tonka et l''amande.', 'A sweet and rich gourmand blend featuring creamy vanilla, sticky caramel, warm tonka bean, and almond. Blended fresh in-store.'),
-- Blend 4: Velvet Leather & Tobacco
('90000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000000', 'House Blend: Velvet Leather & Tobacco', 'male', 'parfum', 0, 100, true, 'تركيبة جلدية فخمة تمزج أوراق التبغ الدافئة والجلد الفاخر مع لمسة دافئة من الزعفران وخشب الصندل.', 'Un mélange de cuir luxueux et de tabac chaud avec une touche de safran et de santal.', 'A luxurious leather and tobacco blend enriched with warm saffron and creamy sandalwood. Blended fresh in-store.'),
-- Blend 5: White Jasmine & Musk
('90000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000000', 'House Blend: White Jasmine & Musk', 'female', 'edp', 0, 100, true, 'تركيبة زهرية ناعمة ومنعشة برائحة الياسمين الفواح والمسك الأبيض النظيف مع الباتشولي وزنبق الوادي.', 'Un mélange floral doux associant le jasmin blanc, le musc propre, le patchouli et le muguet.', 'A soft floral blend combining fragrant jasmine, clean white musk, earthy patchouli, and fresh lily of the valley.'),
-- Blend 6: Oriental Spiced Woods
('90000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000000', 'House Blend: Oriental Spiced Woods', 'unisex', 'parfum', 0, 100, true, 'تركيبة خشبية حارة ودافئة تجمع خشب الأرز مع نوتات حية من الهيل والقرفة والفلفل الأسود المنشط.', 'Un mélange boisé épicé mariant le cèdre avec la cardamome, la cannelle et le poivre noir.', 'A spicy woody blend combining dry cedarwood with cardamom, warm cinnamon, and black pepper.')
ON CONFLICT (id) DO NOTHING;

-- 3. Map notes to House Blends (Using the correct table: perfume_notes and supply required layer column value)
INSERT INTO perfume_notes (perfume_id, note_id, layer) VALUES
-- Blend 1: Royal Amber Oud Rose
('90000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000013', 'base'), -- Oud
('90000000-0000-0000-0000-000000000001', 'f3000000-0000-0000-0000-000000000017', 'base'), -- Amber
('90000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'middle'), -- Rose
('90000000-0000-0000-0000-000000000001', 'f3000000-0000-0000-0000-000000000022', 'middle'), -- Saffron

-- Blend 2: Fresh Ocean Breeze
('90000000-0000-0000-0000-000000000002', 'f4000000-0000-0000-0000-000000000025', 'top'), -- Bergamot
('90000000-0000-0000-0000-000000000002', 'f4000000-0000-0000-0000-000000000026', 'top'), -- Lemon
('90000000-0000-0000-0000-000000000002', 'f4000000-0000-0000-0000-000000000031', 'top'), -- Sea Notes
('90000000-0000-0000-0000-000000000002', 'f4000000-0000-0000-0000-000000000030', 'top'), -- Mint

-- Blend 3: Sweet Vanilla & Caramel
('90000000-0000-0000-0000-000000000003', 'f6000000-0000-0000-0000-000000000041', 'base'), -- Vanilla
('90000000-0000-0000-0000-000000000003', 'f6000000-0000-0000-0000-000000000042', 'base'), -- Caramel
('90000000-0000-0000-0000-000000000003', 'f6000000-0000-0000-0000-000000000045', 'base'), -- Tonka Bean
('90000000-0000-0000-0000-000000000003', 'f6000000-0000-0000-0000-000000000046', 'middle'), -- Almond

-- Blend 4: Velvet Leather & Tobacco
('90000000-0000-0000-0000-000000000004', 'f8000000-0000-0000-0000-000000000058', 'base'), -- Leather
('90000000-0000-0000-0000-000000000004', 'f3000000-0000-0000-0000-000000000023', 'base'), -- Tobacco
('90000000-0000-0000-0000-000000000004', 'f3000000-0000-0000-0000-000000000022', 'middle'), -- Saffron
('90000000-0000-0000-0000-000000000004', 'f2000000-0000-0000-0000-000000000009', 'base'), -- Sandalwood

-- Blend 5: White Jasmine & Musk
('90000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000002', 'middle'), -- Jasmine
('90000000-0000-0000-0000-000000000005', 'f8000000-0000-0000-0000-000000000057', 'base'), -- White Musk
('90000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000011', 'base'), -- Patchouli
('90000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000008', 'middle'), -- Lily of the valley

-- Blend 6: Oriental Spiced Woods
('90000000-0000-0000-0000-000000000006', 'f2000000-0000-0000-0000-000000000010', 'base'), -- Cedarwood
('90000000-0000-0000-0000-000000000006', 'f7000000-0000-0000-0000-000000000050', 'middle'), -- Cardamom
('90000000-0000-0000-0000-000000000006', 'f7000000-0000-0000-0000-000000000049', 'middle'), -- Cinnamon
('90000000-0000-0000-0000-000000000006', 'f7000000-0000-0000-0000-000000000051', 'top')  -- Black Pepper
ON CONFLICT (perfume_id, note_id) DO NOTHING;
