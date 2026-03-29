-- Add category to products (existing installs). Safe to re-run.
-- psql "$DATABASE_URL" -f db/migrate_products_category.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'general';
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- Optional: assign categories when rows exist without meaningful category (by typical seed order)
UPDATE products SET category = 'electronics' WHERE id = 1 AND category = 'general';
UPDATE products SET category = 'computers'   WHERE id = 2 AND category = 'general';
UPDATE products SET category = 'wearables'   WHERE id = 3 AND category = 'general';
UPDATE products SET category = 'storage'     WHERE id = 4 AND category = 'general';
UPDATE products SET category = 'furniture'  WHERE id = 5 AND category = 'general';
UPDATE products SET category = 'electronics' WHERE id = 6 AND category = 'general';
UPDATE products SET category = 'sports-outdoors' WHERE id = 7 AND category = 'general';
UPDATE products SET category = 'computers'   WHERE id = 8 AND category = 'general';
