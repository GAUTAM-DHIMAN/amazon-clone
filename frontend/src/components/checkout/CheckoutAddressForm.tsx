"use client";

import type { ShippingPayload } from "@/lib/api";

type Props = {
  shipping: ShippingPayload;
  onChange: (next: ShippingPayload) => void;
  disabled?: boolean;
};

export function CheckoutAddressForm({
  shipping,
  onChange,
  disabled,
}: Props) {
  const set = (patch: Partial<ShippingPayload>) =>
    onChange({ ...shipping, ...patch });

  return (
    <fieldset disabled={disabled} className="space-y-4">
      <legend className="mb-3 text-base font-medium text-[#0f1111] sm:mb-4 sm:text-lg">
        Shipping address
      </legend>

      <div>
        <label htmlFor="co-fullName" className="block text-sm font-medium text-[#0f1111]">
          Full name (first and last name)
        </label>
        <input
          id="co-fullName"
          name="fullName"
          required
          autoComplete="name"
          value={shipping.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          className="amz-field"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="co-phone" className="block text-sm font-medium text-[#0f1111]">
          Phone number <span className="font-normal text-[#565959]">(optional)</span>
        </label>
        <input
          id="co-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={shipping.phone ?? ""}
          onChange={(e) => set({ phone: e.target.value })}
          className="amz-field"
          placeholder="(555) 555-0100"
        />
      </div>

      <div>
        <label htmlFor="co-line1" className="block text-sm font-medium text-[#0f1111]">
          Street address
        </label>
        <input
          id="co-line1"
          name="line1"
          required
          autoComplete="address-line1"
          value={shipping.line1}
          onChange={(e) => set({ line1: e.target.value })}
          className="amz-field"
          placeholder="123 Main Street"
        />
      </div>

      <div>
        <label htmlFor="co-line2" className="block text-sm font-medium text-[#0f1111]">
          Apt, suite, unit, building{" "}
          <span className="font-normal text-[#565959]">(optional)</span>
        </label>
        <input
          id="co-line2"
          name="line2"
          autoComplete="address-line2"
          value={shipping.line2 ?? ""}
          onChange={(e) => set({ line2: e.target.value })}
          className="amz-field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="co-city" className="block text-sm font-medium text-[#0f1111]">
            City
          </label>
          <input
            id="co-city"
            name="city"
            required
            autoComplete="address-level2"
            value={shipping.city}
            onChange={(e) => set({ city: e.target.value })}
            className="amz-field"
          />
        </div>
        <div>
          <label htmlFor="co-state" className="block text-sm font-medium text-[#0f1111]">
            State / Province
          </label>
          <input
            id="co-state"
            name="state"
            required
            autoComplete="address-level1"
            value={shipping.state}
            onChange={(e) => set({ state: e.target.value })}
            className="amz-field"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="co-postal" className="block text-sm font-medium text-[#0f1111]">
            ZIP / Postal code
          </label>
          <input
            id="co-postal"
            name="postalCode"
            required
            autoComplete="postal-code"
            value={shipping.postalCode}
            onChange={(e) => set({ postalCode: e.target.value })}
            className="amz-field"
          />
        </div>
        <div>
          <label htmlFor="co-country" className="block text-sm font-medium text-[#0f1111]">
            Country / Region
          </label>
          <input
            id="co-country"
            name="country"
            required
            autoComplete="country-name"
            value={shipping.country}
            onChange={(e) => set({ country: e.target.value })}
            className="amz-field"
          />
        </div>
      </div>
    </fieldset>
  );
}
