-- Default demo user (id will be 1 if DB is empty)
INSERT INTO users (email, name) VALUES
  ('demo@example.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (name, description, category, price, image_url, stock) VALUES
  (
    'Wireless Noise-Canceling Headphones',
    'Over-ear Bluetooth headphones with 30-hour battery, plush ear cushions, and adaptive noise cancellation for travel and focus.',
    'electronics',
    129.99,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    45
  ),
  (
    'Mechanical Keyboard — Tactile',
    'Compact 87-key layout, hot-swappable switches, USB-C, and programmable RGB per key. Built for typing comfort.',
    'computers',
    89.50,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
    120
  ),
  (
    'Smart Fitness Watch',
    'Track heart rate, sleep, and workouts. Water resistant, 7-day battery, and always-on display option.',
    'wearables',
    199.00,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    60
  ),
  (
    'Portable SSD 1TB',
    'USB 3.2 speeds up to 1050 MB/s. Rugged metal shell—ideal for backups and creative workflows.',
    'storage',
    109.00,
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop',
    200
  ),
  (
    'Ergonomic Office Chair',
    'Adjustable lumbar support, breathable mesh back, and 4D armrests for all-day comfort.',
    'furniture',
    249.99,
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    35
  ),
  (
    '4K Webcam with Auto Light',
    'Crystal-clear video for meetings and streaming. Built-in stereo mics and privacy shutter.',
    'electronics',
    79.00,
    'https://images.unsplash.com/photo-1617005082139-18c878c41234?w=600&h=600&fit=crop',
    80
  ),
  (
    'Stainless Steel Water Bottle — 32oz',
    'Double-wall vacuum insulation keeps drinks cold 24h or hot 12h. Leak-proof cap.',
    'sports-outdoors',
    32.00,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
    150
  ),
  (
    'USB-C Hub — 7-in-1',
    'HDMI 4K, SD/microSD, 3x USB-A, and pass-through charging for laptops and tablets.',
    'computers',
    45.00,
    'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
    90
  );
