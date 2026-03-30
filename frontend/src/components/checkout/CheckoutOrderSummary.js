import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/formatCurrency";

export function CheckoutOrderSummary({
  items,
  subtotal,
  hidePrimaryCta = false,
}) {
  const units = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <aside className="h-fit min-w-0 border border-[#d5d9d9] bg-white p-3 shadow-[0_2px_5px_rgba(15,17,17,0.06)] sm:p-4 md:sticky md:top-[104px] lg:top-[108px]">
      <h2 className="border-b border-[#e7e7e7] pb-2 text-lg font-medium text-[#0f1111]">
        Order summary
      </h2>

      <ul className="mt-3 max-h-[min(45vh,380px)] space-y-3 overflow-y-auto overscroll-y-contain sm:max-h-[min(50vh,420px)] sm:space-y-4">
        {items.map((line) => (
          <li key={line.cartId} className="flex gap-3">
            <Link
              href={`/products/${line.productId}`}
              className="relative h-16 w-16 shrink-0 rounded-sm border border-[#e7e7e7] bg-white"
            >
              <Image
                src={line.imageUrl}
                alt={line.name}
                fill
                className="object-contain p-1"
                sizes="64px"
              />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded bg-[#0f1111]/80 px-1 text-xs font-medium text-white">
                {line.quantity}
              </span>
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${line.productId}`}
                className="line-clamp-2 text-sm text-[#0f1111] hover:text-[#c7511f] hover:underline"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-xs text-[#565959]">
                {formatCurrency(Number(line.price))} × {line.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-[#0f1111]">
              {formatCurrency(line.lineTotal)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-[#e7e7e7] pt-4 text-sm">
        <div className="flex justify-between text-[#565959]">
          <span>Items ({units})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#565959]">
          <span>Shipping</span>
          <span className="text-[#007600]">FREE</span>
        </div>
        <div className="flex justify-between border-t border-[#e7e7e7] pt-2 text-base font-semibold text-[#0f1111]">
          <span>Order total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-xs text-[#565959]">
          Tax is not calculated in this demo.
        </p>
      </div>

      {!hidePrimaryCta && (
        <p className="mt-4 text-center text-xs text-[#565959]">
          Use the form to place your order.
        </p>
      )}
    </aside>
  );
}
