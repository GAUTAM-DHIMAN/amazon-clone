import Link from "next/link";

export function CategoryCard({
  title,
  subtitle,
  items,
  seeAllHref,
  seeAllLabel = "See all",
}) {
  const displayItems = items.slice(0, 4);

  return (
    <div className="category-card flex flex-col h-full">
      <h3>
        {subtitle && (
          <span className="block text-sm font-normal text-[#565959] mb-0.5">
            {subtitle}
          </span>
        )}
        {title}
      </h3>
      <div className="card-grid flex-1">
        {displayItems.map((item, i) => (
          <Link key={i} href={seeAllHref}>
            <div className="overflow-hidden rounded-sm bg-[#f7f7f7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.label}
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
      <Link href={seeAllHref} className="see-all">
        {seeAllLabel} ›
      </Link>
    </div>
  );
}

// Helper to generate category card data from API categories
export function mapCategoriesToCards(categories) {
  const categoryImages = {
    electronics: [
      {
        label: "Smartphones",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      },
      {
        label: "Laptops",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
      },
      {
        label: "Headphones",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      },
      {
        label: "Smartwatches",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      },
    ],

    fashion: [
      {
        label: "Men's Wear",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
      },
      {
        label: "Women's Wear",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
      },
      {
        label: "Sports Wear",
        image:
          "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
      },
      {
        label: "Casual",
        image:
          "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300&h=300&fit=crop",
      },
    ],

    "home-kitchen": [
      {
        label: "Cookware",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      },
      {
        label: "Appliances",
        image:
          "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop",
      },
      {
        label: "Furniture",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
      },
      {
        label: "Decor",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop",
      },
    ],

    books: [
      {
        label: "Fiction",
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
      },
      {
        label: "Non-Fiction",
        image:
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=300&fit=crop",
      },
      {
        label: "Self Help",
        image:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
      },
      {
        label: "Academic",
        image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop",
      },
    ],

    beauty: [
      {
        label: "Skincare",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
      },
      {
        label: "Makeup",
        image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop",
      },
      {
        label: "Haircare",
        image:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop",
      },
      {
        label: "Perfume",
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
      },
    ],

    fitness: [
      {
        label: "Gym Equipment",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop",
      },
      {
        label: "Cycling",
        image:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop",
      },
      {
        label: "Yoga",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
      },
      {
        label: "Running",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      },
    ],
  };

  const defaultItems = [
    {
      label: "Popular",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=300&fit=crop",
    },
    {
      label: "Trending",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop",
    },
    {
      label: "Best Sellers",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop",
    },
    {
      label: "New Arrivals",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop",
    },
  ];

  const priceLabels = {
    electronics: "Starting ₹999",
    fashion: "Starting ₹299",
    "home-kitchen": "Starting ₹499",
    books: "Starting ₹149",
    beauty: "Starting ₹199",
    fitness: "Starting ₹399",
  };

  return categories.map((cat) => ({
    title: cat.label,
    subtitle: priceLabels[cat.slug] || undefined,
    items: categoryImages[cat.slug] || defaultItems,
    seeAllHref: `/?category=${cat.slug}`,
    seeAllLabel: `See all in ${cat.label}`,
  }));
}
