import { ProductCard } from "@/components/ProductCard";
import { ProductCategoryBar } from "@/components/ProductCategoryBar";
import { getProductCategories, getProducts } from "@/lib/api";

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

function formatResultsTitle(
  count: number,
  q?: string | null,
  categoryLabel?: string | null
) {
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
  return <>Shop deals and more</>;
}

export default async function Home({ searchParams }: Props) {
  const { q, category: categoryParam } = await searchParams;
  const category = categoryParam?.trim().toLowerCase() || undefined;

  const [products, categories] = await Promise.all([
    getProducts({ q, category }),
    getProductCategories(),
  ]);

  const activeCategoryLabel =
    category && categories.find((c) => c.slug === category)?.label;

  return (
    <div className="amz-container py-4 sm:py-5 md:py-6">
      <ProductCategoryBar
        categories={categories}
        currentQ={q}
        currentCategory={category}
      />

      <div className="mt-3 border-b border-[#d5d9d9] bg-white px-3 py-3 sm:mt-4 sm:px-4 md:mt-5 md:px-5 md:py-4">
        <h1 className="text-base font-normal leading-snug text-[#0f1111] sm:text-lg md:text-xl">
          {formatResultsTitle(products.length, q, activeCategoryLabel)}
        </h1>
        <p className="mt-1 text-sm text-[#565959]">
          {products.length} result{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-4 border border-[#d5d9d9] bg-white px-6 py-16 text-center text-[#565959]">
          No products match your filters. Try another category or search term.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex min-h-0 border border-[#d5d9d9] bg-white shadow-[0_2px_5px_rgba(15,17,17,0.06)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(15,17,17,0.1)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
