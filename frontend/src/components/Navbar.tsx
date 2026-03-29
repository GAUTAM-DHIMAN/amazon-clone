"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
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

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    const category = searchParams.get("category");

    router.push(
      buildListingUrl({
        q: term || null,
        category: category?.trim() || null,
      })
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
          <div className="container mx-auto flex items-center gap-2 px-4 py-2 sm:py-0">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center px-2 hover:outline outline-1 outline-white">
              <span className="text-[22px] font-medium whitespace-nowrap">
                <span className="text-white font-bold">amazon</span>
                <span className="text-[#febd69]">clone</span>
              </span>
            </Link>

            {/* LOCATION */}
            <div
              onClick={() => setShowLocation(true)}
              className="hidden md:block cursor-pointer px-2 py-1 hover:outline outline-1 outline-white"
            >
              <div className="text-[11px] text-[#ccc] leading-tight">Deliver to</div>
              <div className="text-sm font-bold flex items-center">
                <LocationIcon className="h-4 w-4 mr-0.5" />
                Cloningburg
              </div>
            </div>

            {/* SEARCH */}
            <form onSubmit={onSearch} className="flex-1 flex h-10 ml-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-3 py-2 text-black rounded-l-md focus:outline-none"
                placeholder="Search Amazon Clone"
              />
              <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center rounded-r-md">
                <SearchIcon className="h-6 w-6 text-[#333]" />
              </button>
            </form>

            {/* ACCOUNT */}
            <div
              className="relative hidden sm:block cursor-pointer px-2 py-1 hover:outline outline-1 outline-white"
              onMouseEnter={() => setShowAccount(true)}
              onMouseLeave={() => setShowAccount(false)}
            >
              <div className="text-[11px] leading-tight">
                Hello, {user ? user.name : "sign in"}
              </div>
              <div className="text-sm font-bold flex items-center">
                Account & Lists
              </div>

              {showAccount && (
                <div className="absolute right-0 top-full pt-2 w-[200px] z-50">
                  <div className="bg-white text-black shadow-xl rounded-sm p-4 border border-gray-200">
                    {!user ? (
                      <>
                        <Link href="/login" className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] py-1.5 rounded-md text-sm border border-[#fcd200] text-center">
                          Sign in
                        </Link>
                        <p className="text-[11px] mt-2 text-center">
                          New customer?{" "}
                          <Link href="/signup" className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
                            Start here.
                          </Link>
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 text-sm">
                        <p className="font-bold border-b pb-1">Your Account</p>
                        <Link href="/orders" className="text-left hover:underline">Orders</Link>
                        <Link href="/wishlist" className="text-left hover:underline">Wishlist</Link>
                        <button onClick={logout} className="text-left text-red-600 hover:underline mt-1 font-semibold">Logout</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CART ICON */}
            <Link
              href="/cart"
              className="cursor-pointer flex items-end px-2 py-1 hover:outline outline-1 outline-white relative"
            >
              <div className="relative">
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-orange-500 font-bold text-base">
                  {itemCount}
                </span>
                <CartIcon className="h-8 w-10" />
              </div>
              <span className="font-bold text-sm hidden sm:block">Cart</span>
            </Link>

          </div>
        </div>

        {/* SUB NAV */}
        <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-sm font-medium">
          <div 
            onClick={() => setOpenMenu(true)} 
            className="cursor-pointer flex items-center gap-1 hover:outline outline-1 outline-white px-2 py-1"
          >
            <HamburgerIcon className="h-5 w-5" />
            <span className="font-bold">All</span>
          </div>
          <Link href="/" className="hover:outline outline-1 outline-white px-2 py-1">Today's Deals</Link>
          <Link href="/cart" className="hover:outline outline-1 outline-white px-2 py-1">Cart</Link>
          <Link href="/" className="hover:outline outline-1 outline-white px-2 py-1 hidden md:block">Customer Service</Link>
        </div>
      </header>

      {/* LOCATION MODAL */}
      {showLocation && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100]">
          <div className="bg-white rounded-lg w-[375px] overflow-hidden">
             <div className="bg-[#f3f3f3] px-6 py-4 border-b flex justify-between items-center text-black">
                <h2 className="font-bold text-lg">Choose your location</h2>
                <button onClick={() => setShowLocation(false)} className="text-2xl">&times;</button>
             </div>
             <div className="p-6 text-black">
                {!user ? (
                  <Link 
                    href="/login" 
                    onClick={() => setShowLocation(false)}
                    className="block w-full bg-[#ffd814] shadow-sm py-2 rounded-md font-medium mb-4 text-center"
                  >
                    Sign in to see your addresses
                  </Link>
                ) : (
                  <p className="text-sm mb-4">Select a delivery location to see product availability and delivery options</p>
                )}
                <button 
                  onClick={() => setShowLocation(false)}
                  className="w-full border border-gray-300 py-1 rounded-md shadow-sm text-sm"
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
            className="w-[300px] md:w-[350px] bg-white h-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#232f3e] text-white p-4 flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
              <span className="font-bold text-lg">Hello, {user ? user.name : 'sign in'}</span>
            </div>

            <div className="py-4 text-black overflow-y-auto h-[calc(100%-64px)]">
              <h3 className="px-6 py-2 font-bold text-lg">Trending</h3>
              <p className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Best Sellers</p>
              <p className="px-6 py-3 hover:bg-gray-100 cursor-pointer border-b">New Releases</p>
              
              <h3 className="px-6 py-2 font-bold text-lg mt-2">Shop By Category</h3>
              <p className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Electronics</p>
              <p className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Fashion</p>
              <p className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Mobiles</p>
              
              <button 
                onClick={() => setOpenMenu(false)}
                className="absolute top-4 -right-12 text-white text-4xl"
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
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}