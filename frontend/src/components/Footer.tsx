"use client";

import Link from "next/link";

const footerSections = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About Us", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press Releases", href: "/" },
      { label: "Amazon Science", href: "/" },
    ],
  },
  {
    title: "Connect with Us",
    links: [
      { label: "Facebook", href: "/" },
      { label: "Twitter", href: "/" },
      { label: "Instagram", href: "/" },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on Amazon", href: "/" },
      { label: "Sell under Amazon Accelerator", href: "/" },
      { label: "Protect and Build Your Brand", href: "/" },
      { label: "Amazon Global Selling", href: "/" },
      { label: "Become an Affiliate", href: "/" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", href: "/" },
      { label: "Returns Centre", href: "/" },
      { label: "100% Purchase Protection", href: "/" },
      { label: "Amazon App Download", href: "/" },
      { label: "Help", href: "/" },
    ],
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-8">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="block w-full bg-[#37475a] hover:bg-[#485769] text-white text-sm py-3 text-center cursor-pointer"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e] text-white py-10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-base mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#ddd] text-sm hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#131921] text-white py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-medium whitespace-nowrap">
              <span className="text-white font-bold">amazon</span>
              <span className="text-[#febd69]">clone</span>
            </span>
          </Link>
          <p className="text-xs text-[#999]">
            © 1996-2026, AmazonClone.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    </footer>
  );
}
