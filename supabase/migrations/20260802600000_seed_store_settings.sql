-- Seed default values for new store_settings keys if not exist

INSERT INTO store_settings (key, value, description)
VALUES 
    ('store_name', 'ParfumWorld', 'The name of the perfume boutique'),
    ('store_slogan', 'Premium Scents Explorer', 'The promotional slogan/subheading of the boutique'),
    ('google_maps_link', 'https://maps.google.com', 'Google Maps link to physical store location')
ON CONFLICT (key) DO NOTHING;
