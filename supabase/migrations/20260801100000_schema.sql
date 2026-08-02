-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUMs
DO $$ BEGIN
    CREATE TYPE note_layer AS ENUM ('top', 'middle', 'base');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'unisex');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE concentration_type AS ENUM ('parfum', 'edp', 'edt', 'edc');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins table RLS
CREATE POLICY "Admins can read admins" ON admins
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update_updated_at_column helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

--------------------------------------------------------------------------------
-- 1. note_categories
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS note_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family text NOT NULL,
    name_ar text NOT NULL,
    name_fr text NOT NULL,
    name_en text NOT NULL,
    icon_name text NOT NULL
);

-- Enable RLS
ALTER TABLE note_categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read note_categories" ON note_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write note_categories" ON note_categories
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

--------------------------------------------------------------------------------
-- 2. notes
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL REFERENCES note_categories(id) ON DELETE CASCADE,
    name_ar text NOT NULL,
    name_fr text NOT NULL,
    name_en text NOT NULL,
    layer note_layer NOT NULL,
    description_ar text
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write notes" ON notes
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Index
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category_id);

--------------------------------------------------------------------------------
-- 3. brands
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    country text,
    logo_url text
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read brands" ON brands
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write brands" ON brands
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

--------------------------------------------------------------------------------
-- 4. perfumes
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS perfumes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name text NOT NULL,
    gender gender_type NOT NULL,
    concentration concentration_type NOT NULL,
    price numeric(10,2) NOT NULL,
    volume_ml integer NOT NULL,
    family text,
    season_tags text[] DEFAULT '{}'::text[] NOT NULL,
    occasion_tags text[] DEFAULT '{}'::text[] NOT NULL,
    in_stock boolean DEFAULT true NOT NULL,
    is_dupe_of text,
    image_url text,
    description_ar text,
    description_fr text,
    description_en text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read perfumes" ON perfumes
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write perfumes" ON perfumes
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Trigger for updated_at
CREATE TRIGGER trigger_update_perfumes_updated_at
    BEFORE UPDATE ON perfumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX IF NOT EXISTS idx_perfumes_brand ON perfumes(brand_id);

--------------------------------------------------------------------------------
-- 5. perfume_notes
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS perfume_notes (
    perfume_id uuid NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
    note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    layer note_layer NOT NULL,
    PRIMARY KEY(perfume_id, note_id)
);

-- Enable RLS
ALTER TABLE perfume_notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read perfume_notes" ON perfume_notes
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write perfume_notes" ON perfume_notes
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Index
CREATE INDEX IF NOT EXISTS idx_perfume_notes_note ON perfume_notes(note_id);

--------------------------------------------------------------------------------
-- 6. wishlists
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    perfume_id uuid NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow CRUD for owners" ON wishlists
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_perfume ON wishlists(perfume_id);

--------------------------------------------------------------------------------
-- 7. search_analytics
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    note_ids uuid[] NOT NULL,
    resulted_in_match boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public insert search_analytics" ON search_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read search_analytics" ON search_analytics
    FOR SELECT TO authenticated
    USING (is_admin());

CREATE POLICY "Allow admin write search_analytics" ON search_analytics
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());
