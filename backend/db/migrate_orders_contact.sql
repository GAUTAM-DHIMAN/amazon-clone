-- Run once if your database was created before shipping_recipient_name / shipping_phone existed:
-- psql "$DATABASE_URL" -f db/migrate_orders_contact.sql

ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_recipient_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(32);
