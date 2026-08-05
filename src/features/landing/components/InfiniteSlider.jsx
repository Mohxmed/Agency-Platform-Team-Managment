"use client";

import { useRef, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useReducedMotion } from "framer-motion";

import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

/* =========================================================
   INFINITE SLIDER
   Real Swiper loop (seamless, no visible card duplication),
   fully touch-driven for phones, RTL aware.
   - Edge fades are gradient-to-transparent overlays colored
     like the section background → cards slide in/out seamlessly.
   - transform/opacity only → GPU clean, no glitches.
========================================================= */

export default function InfiniteSlider({
  children,
  variant = "light",
  autoplay = true,
  autoplayDelay = 4500,
  reverse = false,
  visible = { mobile: 1, md: 2, lg: 3 },
  className = "",
}) {
  const items = Array.isArray(children) ? children : [children];
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef(null);
  const autoplayEnabled = autoplay && !reduceMotion;

  // Reverse direction manually — Swiper 9+ removed autoplay.reverseDirection.
  useEffect(() => {
    if (!autoplayEnabled || !reverse) return;
    const id = setInterval(() => {
      swiperRef.current?.slidePrev();
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [autoplayEnabled, reverse, autoplayDelay]);

  if (items.length === 0) return null;

  // Swiper 14's loop needs more slides than slidesPerView + loopedSlides.
  // Rendering the set twice guarantees a seamless infinite loop at every
  // breakpoint no matter how few real items exist (still discrete slides,
  // never two identical cards visible at once).
  const loopItems = items.length > 1 ? [...items, ...items] : items;

  return (
    <div className={`infinite-slider infinite-slider--${variant} ${className}`}>
      {/* Gradient edge fades — cards blend in/out against the section */}
      <div
        aria-hidden
        className="infinite-slider-edge infinite-slider-edge--start"
      />
      <div
        aria-hidden
        className="infinite-slider-edge infinite-slider-edge--end"
      />

      <div className="infinite-slider__viewport">
        <Swiper
          modules={[Autoplay]}
          loop={items.length > 1}
          loopAdditionalSlides={2}
          speed={650}
          grabCursor
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: visible.md },
            1024: { slidesPerView: visible.lg },
          }}
          autoplay={
            autoplayEnabled && !reverse
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="infinite-slider__swiper"
        >
          {loopItems.map((child, index) => (
            <SwiperSlide key={index} className="infinite-slider__slide">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Arrows — RTL: next points left, prev points right */}
      <button
        type="button"
        aria-label="السابق"
        onClick={() => swiperRef.current?.slidePrev()}
        className="infinite-slider-arrow infinite-slider-arrow--prev"
      >
        <ChevronRight size={18} />
      </button>

      <button
        type="button"
        aria-label="التالي"
        onClick={() => swiperRef.current?.slideNext()}
        className="infinite-slider-arrow infinite-slider-arrow--next"
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  );
}
