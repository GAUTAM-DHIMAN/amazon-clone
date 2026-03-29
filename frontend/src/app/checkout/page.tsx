"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutAddressForm } from "@/components/checkout/CheckoutAddressForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useCart } from "@/context/CartContext";
import { postOrder, type ShippingPayload } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const initialShipping: ShippingPayload = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();
  const [shipping, setShipping] = useState<ShippingPayload>(initialShipping);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuth(); // ✅ already present

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // ✅ SAFETY CHECK (ADDED)
      if (!user) {
        setFormError("Please login to place order");
        setSubmitting(false);
        return;
      }

      const payload: ShippingPayload = {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone?.trim() || undefined,
        line1: shipping.line1.trim(),
        line2: shipping.line2?.trim() || undefined,
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim(),
      };

      // ✅ FIXED (userId added)
      const res = await postOrder({
        userId: user.id,
        shipping: payload,
      });

      await refresh();
      router.push(`/order-confirmation?orderId=${res.orderId}`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not place order. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="amz-container py-16 text-center text-[#565959]">
        Loading checkout…
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="amz-container py-12">
        <div className="border border-[#d5d9d9] bg-white p-10 text-center shadow-[0_2px_5px_rgba(15,17,17,0.06)]">
          <h1 className="text-xl font-normal text-[#0f1111]">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-[#565959]">
            Add items before checking out.
          </p>
          <Link
            href="/"
            className="amz-btn-add mt-6 inline-block px-8 py-2.5 no-underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="amz-container py-4 md:py-6">
      <nav className="mb-4 text-sm text-[#565959]">
        <Link
          href="/cart"
          className="text-[#007185] hover:text-[#c7511f] hover:underline"
        >
          Cart
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[#0f1111]">Secure checkout</span>
      </nav>

      <h1 className="text-xl font-normal text-[#0f1111] sm:text-2xl md:text-[28px]">
        Secure checkout
      </h1>
      <p className="mt-1 text-sm text-[#565959]">
        Review your items and enter a shipping address to place your order.
      </p>

      <div className="mt-5 grid gap-5 md:mt-6 md:grid-cols-[1fr_minmax(280px,360px)] md:items-start md:gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <form
          onSubmit={onSubmit}
          className="min-w-0 border border-[#d5d9d9] bg-white p-3 shadow-[0_2px_5px_rgba(15,17,17,0.06)] sm:p-4 md:p-6"
        >
          <CheckoutAddressForm
            shipping={shipping}
            onChange={setShipping}
            disabled={submitting}
          />

          {formError && (
            <p
              className="mt-4 rounded-sm border border-[#cc0c39]/30 bg-[#fcf4f4] p-3 text-sm text-[#cc0c39]"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="amz-btn-add mt-6 py-3 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing your order…" : "Place your order"}
          </button>

          <p className="mt-3 text-center text-xs text-[#565959]">
            By placing your order, you agree to this demo&apos;s terms (educational
            use only).
          </p>
        </form>

        <CheckoutOrderSummary
          items={items}
          subtotal={subtotal}
          hidePrimaryCta
        />
      </div>
    </div>
  );
}