import Link from "next/link";

import { buildListingUrl } from "@/lib/browseUrl";

export function ProductCategoryBar({ categories, currentQ, currentCategory }) {
  const q = currentQ?.trim() || undefined;
  const cat = currentCategory?.trim().toLowerCase() || undefined;

  const pillClass = (active) =>
    [
      "inline-flex shrink-0 snap-start items-center rounded-full border px-3 py-2 text-sm transition-colors touch-manipulation sm:py-1.5",
      active
        ? "border-[#e77600] bg-[#fff8f2] font-medium text-[#0f1111]"
        : "border-[#d5d9d9] bg-white text-[#0f1111] active:bg-[#fff8f2] hover:border-[#e77600] hover:bg-[#fff8f2]",
    ].join(" ");

  return (
    <div className="-mx-3 border-b border-[#e7e7e7] bg-[#f3f3f3] sm:mx-0">
      <div className="px-3 py-3 md:px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#565959]">
          Department
        </p>
        {/* Mobile / small tablet: horizontal scroll; sm+: wrap */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:flex-wrap sm:overflow-visible sm:pb-0 sm:snap-none [&::-webkit-scrollbar]:hidden">
          <Link
            href={buildListingUrl({ q, category: null })}
            className={pillClass(!cat)}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={buildListingUrl({ q, category: c.slug })}
              className={pillClass(cat === c.slug)}
            >
              <span className="max-w-[200px] truncate sm:max-w-none">
                {c.label}
              </span>
              <span className="ml-1 shrink-0 text-[#565959]">({c.count})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
