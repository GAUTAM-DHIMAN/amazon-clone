import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard"; // ✅ ADDED
import { getProduct, getSimilarProducts } from "@/lib/api"; // ✅ ADDED
import { buildListingUrl } from "@/lib/browseUrl";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) notFound();

  let product;
  try {
    product = await getProduct(num);
  } catch (error) {
    console.error(`Failed to load product ${num}:`, error);
    notFound();
  }

  // ✅ FETCH SIMILAR PRODUCTS
  let similarProducts = [];
  try {
    if (product.category) {
      similarProducts = await getSimilarProducts(product.category);
    }
  } catch (e) {
    console.error("Failed to load similar products:", e);
  }

  return (
    <div className="amz-container py-4 sm:py-5 md:py-6">
      <nav className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-[#565959] sm:mb-4 sm:text-sm">
        <Link
          href="/"
          className="text-[#007185] hover:text-[#c7511f] hover:underline"
        >
          Home
        </Link>
        {product.category ? (
          <>
            <span className="text-[#565959]">›</span>
            <Link
              href={buildListingUrl({ category: product.category })}
              className="text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
          </>
        ) : null}
        <span className="text-[#565959]">›</span>
        <span className="line-clamp-2 min-w-0 flex-1 basis-full text-[#0f1111] sm:line-clamp-none sm:basis-auto sm:flex-none">
          {product.name}
        </span>
      </nav>

      <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="border border-[#d5d9d9] bg-white p-3 sm:p-4 md:p-6">
            <ProductGallery alt={product.name} images={[product.imageUrl]} />
          </div>

          <section className="mt-4 border border-[#d5d9d9] bg-white p-3 sm:mt-6 sm:p-4 md:p-6">
            <h1 className="text-lg font-normal leading-snug text-[#0f1111] sm:text-xl md:text-2xl">
              {product.name}
            </h1>

            <h2 className="mt-6 text-sm font-bold text-[#0f1111] sm:mt-8 sm:text-base">
              About this item
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#0f1111] sm:leading-7">
              {product.description}
            </p>
          </section>
        </div>

        <aside className="w-full min-w-0 lg:sticky lg:top-[104px] lg:max-w-[380px] lg:self-start lg:justify-self-end xl:top-[108px]">
          <ProductBuyBox product={product} />
        </aside>
      </div>

      {/* 🔥 SIMILAR PRODUCTS SECTION (NEW) */}
      {similarProducts.length > 0 && (
        <section className="mt-6 border border-[#d5d9d9] bg-white p-4 sm:mt-8 sm:p-5 md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#0f1111] sm:text-xl">
            Similar products
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {similarProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 10)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}