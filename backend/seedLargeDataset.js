import { pool } from "./src/config/database.js";

const categories = {
  electronics: {
    label: "Electronics",
    items: [
      "Wireless Headphones",
      "USB-C Cable",
      "Phone Charger",
      "Laptop Stand",
      "USB Hub",
      "Webcam",
      "Microphone",
      "Monitor",
      "Keyboard",
      "Mouse",
      "Portable Speaker",
      "Power Bank",
      "Screen Protector",
      "Phone Case",
      "Tablet",
      "Smartwatch",
      "Camera",
      "Drone",
      "Gaming Controller",
      "HDMI Cable",
    ],
    prices: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 125, 150, 200, 250, 300, 400, 500, 750, 1000, 1500],
  },
  fashion: {
    label: "Fashion",
    items: [
      "T-Shirt",
      "Jeans",
      "Jacket",
      "Sweater",
      "Hoodie",
      "Shorts",
      "Dress",
      "Skirt",
      "Shirt",
      "Blazer",
      "Coat",
      "Underwear",
      "Socks",
      "Belt",
      "Scarf",
      "Hat",
      "Cap",
      "Beanie",
      "Gloves",
      "Boots",
    ],
    prices: [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600],
  },
  home: {
    label: "Home & Kitchen",
    items: [
      "Coffee Maker",
      "Toaster",
      "Blender",
      "Microwave",
      "Bed Sheet",
      "Pillow",
      "Blanket",
      "Curtains",
      "Lamp",
      "Picture Frame",
      "Clock",
      "Mirror",
      "Rug",
      "Couch",
      "Chair",
      "Table",
      "Desk",
      "Bookshelf",
      "Storage Box",
      "Trash Can",
    ],
    prices: [20, 35, 45, 60, 75, 85, 100, 120, 150, 180, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500],
  },
  books: {
    label: "Books",
    items: [
      "Fiction Novel",
      "Mystery Book",
      "Science Fiction",
      "Fantasy Book",
      "Romance Novel",
      "Self-Help Book",
      "Cooking Book",
      "Art Book",
      "Travel Guide",
      "History Book",
      "Biography",
      "Business Book",
      "Psychology Book",
      "Children's Book",
      "Comic Book",
      "Graphic Novel",
      "Poetry Book",
      "Educational Book",
      "Cookbook",
      "Reference Book",
    ],
    prices: [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 70, 80, 100, 150],
  },
  beauty: {
    label: "Beauty & Personal Care",
    items: [
      "Face Wash",
      "Moisturizer",
      "Sunscreen",
      "Lipstick",
      "Foundation",
      "Eye Shadow",
      "Mascara",
      "Hair Shampoo",
      "Hair Conditioner",
      "Hair Oil",
      "Perfume",
      "Deodorant",
      "Soap",
      "Toothbrush",
      "Toothpaste",
      "Face Mask",
      "Serum",
      "Nail Polish",
      "Cream",
      "Lotion",
    ],
    prices: [5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150, 200],
  },
  sports: {
    label: "Sports & Outdoors",
    items: [
      "Running Shoes",
      "Yoga Mat",
      "Dumbbells",
      "Resistance Bands",
      "Water Bottle",
      "Sports Bag",
      "Gym Shoes",
      "Bicycle",
      "Skateboard",
      "Roller Skates",
      "Tennis Racket",
      "Badminton Set",
      "Football",
      "Basketball",
      "Soccer Ball",
      "Hiking Boots",
      "Camping Tent",
      "Sleeping Bag",
      "Backpack",
      "Running Belt",
    ],
    prices: [20, 30, 40, 50, 60, 75, 90, 110, 130, 150, 180, 200, 250, 300, 400, 500, 600, 800, 1000, 1500],
  },
  toys: {
    label: "Toys & Games",
    items: [
      "Building Blocks",
      "Action Figure",
      "Doll",
      "Board Game",
      "Puzzle",
      "Card Game",
      "LEGO Set",
      "Remote Control Car",
      "Drone Toy",
      "Teddy Bear",
      "Ball Toy",
      "Toy Gun",
      "Video Game",
      "Game Console",
      "VR Headset",
      "Gaming Headset",
      "Arcade Machine",
      "Bluetooth Speaker",
      "Robot Toy",
      "Educational Toy",
    ],
    prices: [10, 15, 20, 25, 30, 40, 50, 60, 75, 85, 100, 125, 150, 200, 250, 300, 400, 500, 600, 800],
  },
  grocery: {
    label: "Grocery & Gourmet",
    items: [
      "Organic Tea",
      "Coffee Beans",
      "Chocolate",
      "Snack Mix",
      "Nuts",
      "Dried Fruits",
      "Granola",
      "Cereal",
      "Honey",
      "Olive Oil",
      "Pasta",
      "Rice",
      "Beans",
      "Spices",
      "Salt",
      "Sugar",
      "Flour",
      "Nut Butter",
      "Jam",
      "Energy Bar",
    ],
    prices: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 24, 27, 30, 35, 40, 45, 50, 60, 70, 85],
  },
  automotive: {
    label: "Automotive",
    items: [
      "Car Seat Cover",
      "Floor Mat",
      "Car Air Freshener",
      "Steering Wheel Cover",
      "Car Charger",
      "GPS Device",
      "Dash Camera",
      "Car Vacuum",
      "Tire Pressure Gauge",
      "Jump Starter",
      "Car Tool Kit",
      "Car Organizer",
      "Phone Mount",
      "Car Lights",
      "Windshield Shade",
      "Car Wash Kit",
      "Fuel Saver",
      "Oil Filter",
      "Air Filter",
      "Battery Charger",
    ],
    prices: [8, 12, 15, 18, 22, 28, 35, 42, 50, 60, 75, 85, 100, 120, 150, 180, 200, 250, 300, 400],
  },
  pets: {
    label: "Pets & Supplies",
    items: [
      "Dog Food",
      "Cat Food",
      "Dog Toy",
      "Dog Collar",
      "Cat Bed",
      "Dog Bed",
      "Fish Tank",
      "Bird Cage",
      "Pet Carrier",
      "Pet Leash",
      "Pet Bowl",
      "Grooming Kit",
      "Pet Brush",
      "Litter Box",
      "Pet Shampoo",
      "Dog Treats",
      "Cat Treats",
      "Pet Fence",
      "Pet Nail Clipper",
      "Pet Training Pads",
    ],
    prices: [5, 8, 10, 12, 15, 18, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 180, 200, 250],
  },
  garden: {
    label: "Garden & Outdoor",
    items: [
      "Garden Shovel",
      "Garden Hose",
      "Plant Pot",
      "Gardening Gloves",
      "Pruning Shears",
      "Garden Fork",
      "Soil",
      "Fertilizer",
      "Seeds",
      "Garden Light",
      "Plant Trellis",
      "Garden Stake",
      "Mulch",
      "Watering Can",
      "Sprinkler",
      "Garden Bench",
      "Plant Mister",
      "Compost Bin",
      "Weed Killer",
      "Garden Tool Set",
    ],
    prices: [5, 8, 10, 12, 15, 18, 22, 28, 35, 45, 55, 65, 75, 85, 100, 120, 150, 180, 220, 280],
  },
};

const images = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1617005082139-18c878c41234?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
  "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=600&fit=crop",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(priceArray) {
  return priceArray[Math.floor(Math.random() * priceArray.length)];
}

function getRandomStock() {
  return Math.floor(Math.random() * 300) + 5;
}

function generateProductName(category, item, variant) {
  const variations = [
    `${item} - Premium ${variant}`,
    `${item} ${variant}`,
    `Professional ${item} - ${variant}`,
    `${item} Deluxe ${variant}`,
    `${item} Elite ${variant}`,
    `High Quality ${item} ${variant}`,
    `${item} Standard ${variant}`,
    `${item} Pro ${variant}`,
    `${item} Basic ${variant}`,
    `${item} Ultra ${variant}`,
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

function generateDescription(category, item) {
  const descriptions = [
    `Premium quality ${item} designed for everyday use. Exceeds expectations in durability and performance.`,
    `Professional-grade ${item} perfect for enthusiasts and professionals alike.`,
    `Affordable yet high-quality ${item} that delivers excellent value for money.`,
    `Experience comfort and functionality with this amazing ${item}.`,
    `Top-of-the-line ${item} with advanced features and superior build quality.`,
    `Essential ${item} for every household. Reliable and long-lasting.`,
    `Innovative ${item} combines style with practicality for modern lifestyles.`,
    `Best-selling ${item} trusted by thousands of customers worldwide.`,
    `Durable and versatile ${item} suitable for multiple purposes.`,
    `Must-have ${item} that simplifies daily tasks and saves time.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

async function seed() {
  try {
    let totalCount = 0;
    const batchSize = 1000;
    let batch = [];

    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      const { items, prices } = categoryData;

      // Generate products for each item in the category
      for (const item of items) {
        // Create 10-30 variants of each product
        const variantCount = Math.floor(Math.random() * 20) + 10;

        for (let v = 1; v <= variantCount; v++) {
          const product = {
            name: generateProductName(categoryKey, item, `Variant ${v}`),
            description: generateDescription(categoryKey, item),
            category: categoryKey,
            price: getRandomPrice(prices),
            image_url: getRandomElement(images),
            stock: getRandomStock(),
          };

          batch.push(product);

          // Insert in batches to avoid memory issues
          if (batch.length >= batchSize) {
            await insertBatch(batch);
            totalCount += batch.length;
            console.log(`✅ Inserted ${totalCount} products...`);
            batch = [];
          }
        }
      }
    }

    // Insert remaining products
    if (batch.length > 0) {
      await insertBatch(batch);
      totalCount += batch.length;
    }

    console.log(`\n✅ COMPLETED! Total products inserted: ${totalCount}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

async function insertBatch(products) {
  const values = products
    .map(
      (p, idx) =>
        `($${idx * 6 + 1}, $${idx * 6 + 2}, $${idx * 6 + 3}, $${idx * 6 + 4}, $${idx * 6 + 5}, $${idx * 6 + 6})`
    )
    .join(",");

  const query = `
    INSERT INTO products (name, description, category, price, image_url, stock) 
    VALUES ${values}
  `;

  const flatParams = products.flatMap((p) => [
    p.name,
    p.description,
    p.category,
    p.price,
    p.image_url,
    p.stock,
  ]);

  await pool.query(query, flatParams);
}

seed();
