"use client";

import { useState } from "react";

type Props = {
  description: string;
};

export function ProductDetailTabs({ description }: Props) {
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  return (
    <div className="mt-6">
      <div className="tab-nav">
        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={activeTab === "specs" ? "active" : ""}
          onClick={() => setActiveTab("specs")}
        >
          Specifications
        </button>
      </div>

      <div className="py-4">
        {activeTab === "description" ? (
          <div className="space-y-3 text-sm leading-relaxed text-[#0f1111]">
            <ul className="list-disc pl-5 space-y-2">
              {description
                .split(/[.\n]/)
                .filter((s) => s.trim().length > 10)
                .slice(0, 6)
                .map((sentence, i) => (
                  <li key={i}>{sentence.trim()}.</li>
                ))}
              <li>Ships from Amazon&apos;s dedicated fulfillment center.</li>
            </ul>
          </div>
        ) : (
          <div className="text-sm text-[#0f1111]">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#e7e7e7]">
                  <td className="py-2 pr-4 font-medium text-[#565959] w-1/3">Brand</td>
                  <td className="py-2">Amazon Clone</td>
                </tr>
                <tr className="border-b border-[#e7e7e7]">
                  <td className="py-2 pr-4 font-medium text-[#565959]">Material</td>
                  <td className="py-2">Premium Quality</td>
                </tr>
                <tr className="border-b border-[#e7e7e7]">
                  <td className="py-2 pr-4 font-medium text-[#565959]">Warranty</td>
                  <td className="py-2">1 Year Manufacturer</td>
                </tr>
                <tr className="border-b border-[#e7e7e7]">
                  <td className="py-2 pr-4 font-medium text-[#565959]">Country of Origin</td>
                  <td className="py-2">India</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-[#565959]">Item Weight</td>
                  <td className="py-2">Varies</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
