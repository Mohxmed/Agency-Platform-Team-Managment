"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProjectGallery({ images = [], title = "Project" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  if (!images?.length) return null;

  function openGallery(index) {
    setActiveIndex(index);
  }

  function closeGallery() {
    setActiveIndex(null);
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  function previousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  return (
    <>
      {/* =====================================================
          SLIDER
      ====================================================== */}

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y]}
          spaceBetween={16}
          slidesPerView={1.15}
          centeredSlides={false}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          keyboard={{
            enabled: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 22,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="project-gallery-swiper !pb-12"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => openGallery(index)}
                className="
                  group
                  relative
                  block
                  w-full
                  overflow-hidden
                  rounded-[1.5rem]
                  bg-neutral-100
                  text-right
                  outline-none
                  sm:rounded-[2rem]
                  dark:bg-ink/10
                  focus-visible:ring-4
                  focus-visible:ring-primary-600/20
                "
                aria-label={`عرض الصورة ${index + 1}`}
              >
                {/* Image */}

                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image}
                    alt={`${title} - صورة ${index + 1}`}
                    fill
                    sizes="
                      (max-width: 640px) 87vw,
                      (max-width: 768px) 65vw,
                      (max-width: 1024px) 48vw,
                      33vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                  />

                  {/* Overlay */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/45
                      via-transparent
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  {/* Number */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-black/40
                      px-2.5
                      text-xs
                      font-bold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Open Icon */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-4
                      left-4
                      flex
                      h-10
                      w-10
                      translate-y-2
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-black
                      opacity-0
                      shadow-lg
                      backdrop-blur-md
                      transition-all
                      duration-300
                      group-hover:translate-y-0
                      group-hover:opacity-100
                      dark:bg-white/10
                      dark:text-white
                    "
                  >
                    <Maximize2 size={16} />
                  </div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        {images.length > 1 && (
          <div className="mt-1 flex items-center justify-between">
            {/* Counter */}

            <div className="text-xs font-medium text-black/35 dark:text-white/40">
              <span className="font-bold text-black/60 dark:text-white/60">{images.length}</span>{" "}
              صور للمشروع
            </div>

            {/* Arrows */}

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="
                  gallery-prev
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-white
                  text-black
                  shadow-sm
                  transition
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                  active:scale-95
                  dark:border-white/15
                  dark:bg-white/10
                  dark:text-white
                  dark:hover:border-white
                  dark:hover:bg-white
                  dark:hover:text-black
                "
                aria-label="الصورة السابقة"
              >
                <ChevronRight size={18} />
              </button>

              <button
                type="button"
                className="
                  gallery-next
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-white
                  text-black
                  shadow-sm
                  transition
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                  active:scale-95
                  dark:border-white/15
                  dark:bg-white/10
                  dark:text-white
                  dark:hover:border-white
                  dark:hover:bg-white
                  dark:hover:text-black
                "
                aria-label="الصورة التالية"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          LIGHTBOX
      ====================================================== */}

      {activeIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
            backdrop-blur-sm
            sm:p-8
          "
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="معرض صور المشروع"
        >
          {/* Close */}

          <button
            type="button"
            onClick={closeGallery}
            className="
              absolute
              right-4
              top-4
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              sm:right-7
              sm:top-7
            "
            aria-label="إغلاق المعرض"
          >
            <X size={20} />
          </button>

          {/* Counter */}

          <div
            className="
              absolute
              left-1/2
              top-5
              -translate-x-1/2
              rounded-full
              border
              border-white/10
              bg-white/10
              px-4
              py-2
              text-xs
              font-medium
              text-white/80
              backdrop-blur-md
              sm:top-7
            "
          >
            {activeIndex + 1} / {images.length}
          </div>

          {/* Previous */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="
                absolute
                right-3
                top-1/2
                z-20
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/10
                text-white
                backdrop-blur-md
                transition
                hover:bg-white
                hover:text-black
                sm:right-8
                sm:h-14
                sm:w-14
              "
              aria-label="الصورة السابقة"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Image */}

          <div
            className="
              relative
              h-[75vh]
              w-full
              max-w-6xl
              overflow-hidden
              rounded-2xl
              sm:h-[82vh]
              sm:rounded-3xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - صورة ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="
                absolute
                left-3
                top-1/2
                z-20
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/10
                text-white
                backdrop-blur-md
                transition
                hover:bg-white
                hover:text-black
                sm:left-8
                sm:h-14
                sm:w-14
              "
              aria-label="الصورة التالية"
            >
              <ChevronLeft size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
