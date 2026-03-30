import { ProductCard } from "@/components/ProductCard";
import { ProductCategoryBar } from "@/components/ProductCategoryBar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryCard, mapCategoriesToCards } from "@/components/CategoryCard";
import { PromoBanner } from "@/components/PromoBanner";
import { getProductCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

function formatResultsTitle(count, q, categoryLabel) {
  const term = q?.trim();
  if (term && categoryLabel) {
    return (
      <>
        {count} result{count === 1 ? "" : "s"} in {categoryLabel} for{" "}
        <span className="font-medium">&quot;{term}&quot;</span>
      </>
    );
  }
  if (term) {
    return (
      <>
        1-{count} of {count} results for{" "}
        <span className="font-medium">&quot;{term}&quot;</span>
      </>
    );
  }
  if (categoryLabel) {
    return (
      <>
        {categoryLabel}
        <span className="font-normal text-[#565959]">
          {" "}
          — {count} item{count === 1 ? "" : "s"}
        </span>
      </>
    );
  }
  return null;
}

export default async function Home({ searchParams }) {
  const { q, category: categoryParam } = await searchParams;
  const category = categoryParam?.trim().toLowerCase() || undefined;

  let products = [];
  let categories = [];
  let apiError = false;

  try {
    const results = await Promise.all([
      getProducts({ q, category }),
      getProductCategories(),
    ]);
    products = results[0] || [];
    categories = results[1] || [];
  } catch (error) {
    console.error("SSR Fetch failed on render. Backend might be asleep or starting up:", error);
    apiError = true;
  }

  const activeCategoryLabel =
    category && categories.find((c) => c.slug === category)?.label;

  const isFiltered = !!(q || category);
  const title = formatResultsTitle(products.length, q, activeCategoryLabel);

  const categoryCards = mapCategoriesToCards(categories);

  return (
    <>
      {/* Hero Carousel — only on unfiltered home */}
      {!isFiltered && <HeroCarousel />}

      <div className="amz-container py-4 sm:py-5 md:py-6">
        {apiError && (
          <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
            <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
            <p className="mt-2 text-sm text-red-700">
              The backend API is currently asleep or unreachable. Render free-tier instances may take up to 60 seconds to spin up. Please refresh the page in a moment.
            </p>
          </div>
        )}

        <ProductCategoryBar
          categories={categories}
          currentQ={q}
          currentCategory={category}
        />

        {/* Category Grid — only on unfiltered home */}
        {!isFiltered && (
          <>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryCards.slice(0, 8).map((card, i) => (
                <CategoryCard key={i} {...card} />
              ))}
            </div>

            {/* Promo Banners */}
            <div className="mt-6">
              <PromoBanner />
            </div>
          </>
        )}

        {/* Results header — show when filtered */}
        {title && (
          <div className="mt-3 border-b border-[#d5d9d9] bg-white px-3 py-3 rounded-sm sm:mt-4 sm:px-4 md:mt-5 md:px-5 md:py-4">
            <h1 className="text-base font-normal leading-snug text-[#0f1111] sm:text-lg md:text-xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-[#565959]">
              {products.length} result{products.length === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {/* Product section header */}
        {!isFiltered && (
          <div className="mt-8 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0f1111]">
              Recommended for You
            </h2>
            <span className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
              View all products ›
            </span>
          </div>
        )}

        {products.length === 0 ? (
          <div className="mt-4 border border-[#d5d9d9] bg-white px-6 py-16 text-center text-[#565959] rounded-sm">
            No products match your filters. Try another category or search term.
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
