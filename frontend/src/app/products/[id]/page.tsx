import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { getProduct, getSimilarProducts } from "@/lib/api";
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

  let similarProducts: any[] = [];
  try {
    if (product.category) {
      similarProducts = await getSimilarProducts(product.category);
    }
  } catch (e) {
    console.error("Failed to load similar products:", e);
  }

  const discount = 17;
  const originalPrice = Math.round(Number(product.price) / (1 - discount / 100));

  return (
    <div className="amz-container py-4 sm:py-5 md:py-6">
      {/* Breadcrumb */}
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
              className="text-[#007185] hover:text-[#c7511f] hover:underline capitalize"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
          </>
        ) : null}
        <span className="text-[#565959]">›</span>
        <span className="line-clamp-1 min-w-0 flex-1 text-[#0f1111]">
          {product.name}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 xl:grid-cols-[1fr_400px]">
        <div className="min-w-0 space-y-6">
          {/* Gallery */}
          <div className="border border-[#d5d9d9] bg-white p-3 rounded-lg sm:p-4 md:p-6">
            <ProductGallery alt={product.name} images={[product.imageUrl]} />
          </div>

          {/* Product Info */}
          <section className="border border-[#d5d9d9] bg-white p-4 rounded-lg sm:p-5 md:p-6">
            {/* Brand */}
            <p className="text-sm text-[#007185]">
              Brand: <span className="font-bold">{product.category?.replace(/-/g, " ") || "Amazon Clone"}</span>
            </p>

            {/* Title */}
            <h1 className="mt-1 text-xl font-normal leading-snug text-[#0f1111] sm:text-2xl md:text-[28px]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="star-rating text-base">★★★★☆</div>
              <span className="text-sm text-[#007185] hover:text-[#c7511f] cursor-pointer">
                3,627 ratings
              </span>
            </div>

            {/* Price section */}
            <div className="mt-3 border-t border-[#e7e7e7] pt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs mt-1 text-[#cc0c39]">₹</span>
                <span className="text-3xl font-medium text-[#0f1111]">
                  {Number(product.price).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="text-[#565959]">M.R.P.:</span>
                <span className="text-[#565959] line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="text-[#cc0c39] font-medium">({discount}% off)</span>
              </div>
              <p className="mt-0.5 text-xs text-[#565959]">Inclusive of all taxes</p>
            </div>

            {/* Prime + Delivery */}
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block bg-[#232f3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide">
                prime
              </span>
              <span className="text-sm text-[#007185]">
                FREE Delivery by <span className="font-bold text-[#0f1111]">Tomorrow</span>
              </span>
            </div>

            {/* Delivery feature icons */}
            <div className="delivery-features mt-3">
              <div className="feature">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                <span>Free Delivery</span>
              </div>
              <div className="feature">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                <span>10 Day Returns</span>
              </div>
              <div className="feature">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                <span>1 Year Warranty</span>
              </div>
            </div>

            {/* Tabs */}
            <ProductDetailTabs description={product.description} />
          </section>
        </div>

        {/* Buy Box (sticky) */}
        <aside className="w-full min-w-0 lg:sticky lg:top-[104px] lg:max-w-[400px] lg:self-start lg:justify-self-end xl:top-[108px]">
          <ProductBuyBox product={product} />
        </aside>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mt-8 border border-[#d5d9d9] bg-white p-4 rounded-lg sm:mt-10 sm:p-5 md:p-6">
          <h2 className="mb-4 text-xl font-bold text-[#0f1111]">
            Products related to this item
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