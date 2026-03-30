import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Today's Deals */}
      <div
        className="promo-card"
        style={{
          background: "linear-gradient(135deg, #cc0c39 0%, #8b0000 100%)",
        }}
      >
        <div className="relative z-10 text-white">
          <h3 className="text-xl sm:text-2xl font-bold italic underline">
            Today&apos;s Deals
          </h3>
          <p className="text-sm mt-1 text-white/90">
            Savings across all categories
          </p>
          <Link href="/?q=deals" className="promo-btn mt-3 inline-block">
            Shop now ›
          </Link>
        </div>
      </div>

      {/* Prime Exclusive */}
      <div
        className="promo-card"
        style={{
          background: "linear-gradient(135deg, #232f3e 0%, #1a3a5c 100%)",
        }}
      >
        <div className="relative z-10 text-white">
          <h3 className="text-xl sm:text-2xl font-bold text-[#ffa41c]">
            Prime Exclusive
          </h3>
          <p className="text-sm mt-1 text-white/90">
            Free fast delivery on millions of items
          </p>
          <Link href="/?q=prime" className="promo-btn mt-3 inline-block">
            Shop now ›
          </Link>
        </div>
      </div>
    </div>
  );
}
