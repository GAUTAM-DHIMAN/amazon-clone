"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { buildListingUrl } from "@/lib/browseUrl";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-[60px] bg-[#131921]" />}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const [q, setQ] = useState("");
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const [showAccount, setShowAccount] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    const category = searchParams.get("category");

    router.push(
      buildListingUrl({
        q: term || null,
        category: category?.trim() || null,
      }),
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 80) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full max-w-[100vw] text-white transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* MAIN NAVBAR */}
        <div className="min-h-[52px] bg-[#131921] sm:min-h-[60px] flex items-center">
          <div className="container mx-auto flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-0">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center px-2 py-1 hover:outline outline-1 outline-white rounded-sm shrink-0"
            >
              <span className="text-[20px] sm:text-[22px] font-medium whitespace-nowrap">
                <span className="text-white font-bold">amazon</span>
                <span className="text-[#febd69]">clone</span>
              </span>
              <span className="text-[10px] text-white/60 ml-0.5">.in</span>
            </Link>

            {/* LOCATION */}
            <div
              onClick={() => setShowLocation(true)}
              className="hidden md:flex cursor-pointer items-end px-2 py-1.5 hover:outline outline-1 outline-white rounded-sm"
            >
              <LocationIcon className="h-5 w-5 mr-0.5 self-end text-white" />
              <div>
                <div className="text-[11px] text-[#ccc] leading-tight">
                  Deliver to
                </div>
                <div className="text-sm font-bold leading-tight">India</div>
              </div>
            </div>

            {/* SEARCH */}
            <form onSubmit={onSearch} className="flex-1 flex h-10 ml-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-3 py-2 text-[#0f1111] text-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#e77600] bg-white"
                placeholder="Search Amazon Clone"
              />

              <button
                type="submit"
                className="bg-[#febd69] hover:bg-[#f3a847] active:bg-[#eeba37] px-4 flex items-center justify-center rounded-r-md"
              >
                <SearchIcon className="h-5 w-5 text-[#333]" />
              </button>
            </form>

            {/* ACCOUNT */}
            <div
              className="relative hidden sm:block cursor-pointer px-2 py-1 hover:outline outline-1 outline-white rounded-sm"
              onMouseEnter={() => setShowAccount(true)}
              onMouseLeave={() => setShowAccount(false)}
            >
              <div className="text-[11px] leading-tight text-[#ccc]">
                Hello, {user ? user.name.split(" ")[0] : "sign in"}
              </div>
              <div className="text-sm font-bold flex items-center leading-tight">
                Account & Lists
                <svg
                  className="w-3 h-3 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>

              {showAccount && (
                <div className="absolute right-0 top-full pt-2 w-[220px] z-50">
                  <div className="bg-white text-[#0f1111] shadow-xl rounded-lg p-4 border border-[#d5d9d9]">
                    {!user ? (
                      <>
                        <Link
                          href="/login"
                          className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2 rounded-lg text-sm border border-[#fcd200] text-center font-medium"
                        >
                          Sign in
                        </Link>
                        <p className="text-[11px] mt-2 text-center text-[#565959]">
                          New customer?{" "}
                          <Link
                            href="/signup"
                            className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                          >
                            Start here.
                          </Link>
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="font-bold border-b border-[#e7e7e7] pb-2 mb-1">
                          Your Account
                        </p>
                        <Link
                          href="/orders"
                          className="py-1.5 hover:text-[#c7511f] hover:underline"
                        >
                          📦 Your Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="py-1.5 hover:text-[#c7511f] hover:underline"
                        >
                          ❤️ Wishlist
                        </Link>
                        <Link
                          href="/cart"
                          className="py-1.5 hover:text-[#c7511f] hover:underline"
                        >
                          🛒 Your Cart
                        </Link>
                        <button
                          onClick={logout}
                          className="text-left text-[#cc0c39] hover:underline mt-2 pt-2 border-t border-[#e7e7e7] font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ORDERS */}
            <Link
              href="/orders"
              className="hidden md:block cursor-pointer px-2 py-1 hover:outline outline-1 outline-white rounded-sm"
            >
              <div className="text-[11px] leading-tight text-[#ccc]">
                Returns
              </div>
              <div className="text-sm font-bold leading-tight">& Orders</div>
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="cursor-pointer flex items-end px-2 py-1 hover:outline outline-1 outline-white rounded-sm relative"
            >
              <div className="relative">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#ffa41c] font-bold text-base leading-none">
                  {itemCount}
                </span>
                <CartIcon className="h-8 w-10" />
              </div>
              <span className="font-bold text-sm hidden sm:block -mb-0.5">
                Cart
              </span>
            </Link>
          </div>
        </div>

        {/* SUB NAV */}
        <div className="bg-[#232f3e] px-3 sm:px-4 py-0.5 flex items-center gap-0 text-sm overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            onClick={() => setOpenMenu(true)}
            className="cursor-pointer flex items-center gap-1 hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm shrink-0"
          >
            <HamburgerIcon className="h-5 w-5" />
            <span className="font-bold">All</span>
          </div>
          <Link
            href="/?q=fresh"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0"
          >
            Fresh
          </Link>
          <Link
            href="/?q=bestsellers"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0"
          >
            Bestsellers
          </Link>
          <Link
            href="/?category=mobiles"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0"
          >
            Mobiles
          </Link>
          <Link
            href="/?q=deals"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0"
          >
            Today&apos;s Deals
          </Link>
          <Link
            href="/?q=customer-service"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0 hidden md:block"
          >
            Customer Service
          </Link>
          <Link
            href="/?q=prime"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0 hidden lg:block"
          >
            Prime
          </Link>
          <Link
            href="/cart"
            className="hover:outline outline-1 outline-white px-2 py-1.5 rounded-sm whitespace-nowrap shrink-0 hidden md:block"
          >
            Cart
          </Link>
        </div>
      </header>

      {/* LOCATION MODAL */}
      {showLocation && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100]">
          <div className="bg-white rounded-lg w-[375px] overflow-hidden shadow-2xl">
            <div className="bg-[#f0f2f2] px-6 py-4 border-b flex justify-between items-center text-[#0f1111]">
              <h2 className="font-bold text-lg">Choose your location</h2>
              <button
                onClick={() => setShowLocation(false)}
                className="text-2xl hover:text-[#cc0c39]"
              >
                &times;
              </button>
            </div>
            <div className="p-6 text-[#0f1111]">
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setShowLocation(false)}
                  className="block w-full amz-btn-add py-2 text-center mb-4"
                >
                  Sign in to see your addresses
                </Link>
              ) : (
                <p className="text-sm mb-4">
                  Select a delivery location to see product availability and
                  delivery options
                </p>
              )}
              <button
                onClick={() => setShowLocation(false)}
                className="amz-btn-secondary w-full py-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] transition-opacity"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="w-[85%] sm:w-[320px] bg-white h-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center gap-3">
              <div className="h-9 w-9 bg-[#f0f2f2] rounded-full flex items-center justify-center text-[#0f1111] font-bold text-sm">
                {user ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <span className="font-bold text-lg">
                Hello, {user ? user.name : "sign in"}
              </span>
            </div>

            {/* CONTENT */}
            <div className="py-2 text-[#0f1111] overflow-y-auto h-[calc(100%-64px)]">
              <h3 className="px-6 py-2 font-bold text-lg border-b border-[#e7e7e7] mb-1">
                Trending
              </h3>

              <Link href="/?q=bestsellers" onClick={() => setOpenMenu(false)}>
                <p className="px-6 py-3 hover:bg-[#f0f2f2] cursor-pointer transition-colors">
                  Best Sellers
                </p>
              </Link>

              <Link href="/?q=new-releases" onClick={() => setOpenMenu(false)}>
                <p className="px-6 py-3 hover:bg-[#f0f2f2] cursor-pointer border-b border-[#e7e7e7] transition-colors">
                  New Releases
                </p>
              </Link>

              <h3 className="px-6 py-2 font-bold text-lg mt-1">
                Shop By Category
              </h3>

              {[
                "Electronics",
                "Fashion",
                "Home & Kitchen",
                "Books",
                "Beauty",
                "Fitness",
              ].map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${cat.toLowerCase().replace(/ & /g, "-")}`}
                  onClick={() => setOpenMenu(false)}
                >
                  <p className="px-6 py-3 hover:bg-[#f0f2f2] cursor-pointer transition-colors flex items-center justify-between">
                    {cat}
                    <svg
                      className="w-4 h-4 text-[#565959]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 6l6 6-6 6z" />
                    </svg>
                  </p>
                </Link>
              ))}

              {/* Close */}
              <button
                onClick={() => setOpenMenu(false)}
                className="absolute top-4 -right-12 text-white text-4xl hover:text-[#febd69]"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ICONS */
function LocationIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function HamburgerIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function CartIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
