import Link from "next/link";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  const id = orderId?.trim();

  return (
    <div className="amz-container max-w-2xl py-8 sm:py-10 md:py-12">
      <div className="border border-[#d5d9d9] bg-white p-6 text-center shadow-[0_2px_5px_rgba(15,17,17,0.06)] sm:p-8 md:p-10">
        <h1 className="text-xl font-normal text-[#0f1111] sm:text-2xl">
          Thank you for your order!
        </h1>
        {id ? (
          <p className="mt-4 text-[#0f1111]">
            Your order ID is{" "}
            <span className="font-mono font-semibold text-[#007600]">{id}</span>
            .
          </p>
        ) : (
          <p className="mt-4 text-[#565959]">
            Order placed. If you arrived here without an order id, check your
            browser history or return home.
          </p>
        )}
        <p className="mt-2 text-sm text-[#565959]">
          A confirmation email would be sent in a production app.
        </p>
        <Link
          href="/"
          className="amz-btn-add mt-8 inline-block px-10 py-2.5 no-underline"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
