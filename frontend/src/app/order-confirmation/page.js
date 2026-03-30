import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ searchParams }) {
  const { orderId } = await searchParams;
  const id = orderId?.trim();

  return (
    <div className="amz-container max-w-2xl py-8 sm:py-10 md:py-12">
      <div className="border border-[#d5d9d9] bg-white p-6 text-center shadow-sm rounded-lg sm:p-8 md:p-10">
        {/* Success Animation */}
        <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-[#e6f7e6] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#007600]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#007600] sm:text-3xl">
          Order Placed Successfully!
        </h1>

        <p className="mt-2 text-[#0f1111]">Thank you for your order</p>

        {id ? (
          <div className="mt-4 inline-block bg-[#f0f2f2] rounded-lg px-6 py-3">
            <p className="text-sm text-[#565959]">Order ID</p>
            <p className="text-xl font-mono font-bold text-[#007600]">#{id}</p>
          </div>
        ) : (
          <p className="mt-4 text-[#565959]">
            Order placed. If you arrived here without an order id, check your
            browser history or return home.
          </p>
        )}

        <p className="mt-4 text-sm text-[#565959]">
          A confirmation email would be sent in a production app.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/orders"
            className="amz-btn-secondary px-8 py-2.5 no-underline inline-block"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="amz-btn-add px-8 py-2.5 no-underline inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
