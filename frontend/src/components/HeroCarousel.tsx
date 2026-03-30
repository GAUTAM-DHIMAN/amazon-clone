"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    bg: "linear-gradient(135deg, #232f3e 0%, #131921 50%, #1a242f 100%)",
    title: "India's Fashion Destination",
    subtitle: "Clothing, footwear & accessories for everyone",
    cta: "Explore Fashion",
    accent: "#febd69",
  },
  {
    bg: "linear-gradient(135deg, #0f4c75 0%, #1b262c 50%, #3282b8 100%)",
    title: "Electronics Mega Sale",
    subtitle: "Up to 50% off on smartphones, laptops & more",
    cta: "Shop Now",
    accent: "#ffd814",
  },
  {
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    title: "Home & Kitchen Essentials",
    subtitle: "Starting ₹199 — cookware, decor & appliances",
    cta: "Discover Deals",
    accent: "#ff9900",
  },
  {
    bg: "linear-gradient(135deg, #2d132c 0%, #4a0e4e 50%, #6b2fa0 100%)",
    title: "Beauty & Personal Care",
    subtitle: "Top brands at unbeatable prices",
    cta: "Shop Beauty",
    accent: "#ffa41c",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const len = slides.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % len), [len]);
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + len) % len),
    [len]
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="hero-carousel select-none">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="slide"
          style={{
            background: slide.bg,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto w-full px-8 md:px-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
              >
                {slide.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 max-w-lg">
                {slide.subtitle}
              </p>
              <button
                className="px-6 py-2.5 rounded-sm text-sm font-bold shadow-lg hover:opacity-90"
                style={{ backgroundColor: slide.accent, color: "#0f1111" }}
              >
                {slide.cta} ›
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        className="arrow arrow-left"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="arrow arrow-right"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#e3e6e6] to-transparent z-[2]" />
    </div>
  );
}
