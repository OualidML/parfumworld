-- Create store_settings table for store configurations (e.g. WhatsApp contact number)
CREATE TABLE IF NOT EXISTS store_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to settings
CREATE POLICY "Allow public read access to store settings" 
ON store_settings 
FOR SELECT 
USING (true);

-- Populate default WhatsApp phone number setting
INSERT INTO store_settings (key, value, description)
VALUES (
    'whatsapp_number', 
    '+212600000000', 
    'WhatsApp phone number for order processing redirection'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, 
    description = EXCLUDED.description;
