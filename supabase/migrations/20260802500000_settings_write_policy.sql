-- Create policy for admin write access (insert/update/delete) on store_settings table

CREATE POLICY "Allow admin write access to store settings"
ON store_settings FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
