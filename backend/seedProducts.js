import { pool } from "./src/config/database.js";

const categories = [
  "electronics",
  "fashion",
  "home",
  "books",
  "beauty",
  "sports",
  "toys",
  "grocery",
];

const sampleNames = [
  "Premium Product",
  "Smart Device",
  "Stylish Item",
  "Luxury Item",
  "Budget Product",
];

const images = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
];

async function seed() {
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)] + " " + i;
    const price = Math.floor(Math.random() * 5000) + 500;
    const stock = Math.floor(Math.random() * 50) + 1;
    const image = images[Math.floor(Math.random() * images.length)];

    await pool.query(
      `INSERT INTO products (name, description, price, image, category, stock)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name,
        `High quality ${category} product with great features.`,
        price,
        image,
        category,
        stock,
      ]
    );
  }

  console.log("✅ 100 products inserted");
  process.exit();
}

seed();