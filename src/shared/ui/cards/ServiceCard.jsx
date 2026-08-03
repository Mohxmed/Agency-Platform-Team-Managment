import clsx from "clsx";
import { ArrowLeft, Eye, Send } from "lucide-react";

import Button from "../buttons/Buttons";
import { ROUTES } from "@/constants/routes";
import CardMotion from "@/shared/animations/CardMotion";

export default function ServiceCard({ service, varient = "default", moreHref }) {
  const Icon = service.icon;
  const isBlack = varient === "black";

  return (
    <CardMotion
      className={clsx(
        "group relative flex h-full min-h-[460px] overflow-hidden rounded-4xl",
        "transition-shadow duration-500",
        isBlack
          ? "bg-gradient-to-br from-primary-900 via-primary-900 to-black"
          : "bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900",
        "hover:shadow-[0_30px_80px_rgba(0,0,0,0.28)]",
      )}
    >
      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Big # */}

        <span
          className="
            absolute
            -left-8
            -top-16
            select-none
            text-[220px]
            font-black
            leading-none
            text-black/10
            transition-transform
            duration-700
            group-hover:scale-110
            group-hover:-rotate-6
          "
        >
          #
        </span>

        {/* Top Glow */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-primary-300/20
            blur-3xl
            transition-all
            duration-700
            group-hover:scale-125
          "
        />

        {/* Bottom Glow */}

        <div
          className="
            absolute
            -bottom-28
            -left-24
            h-72
            w-72
            rounded-full
            bg-primary-950/70
            blur-3xl
          "
        />

        {/* Top depth */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-40
            bg-gradient-to-b
            from-primary-950/20
            to-transparent
          "
        />

        {/* Shine */}

        <div
          className="
            absolute
            -left-1/2
            top-0
            h-full
            w-1/3
            -skew-x-12
            bg-gradient-to-r
            from-transparent
            via-primary-300/10
            to-transparent
            opacity-0
            blur-2xl
            transition-all
            duration-1000
            group-hover:left-[130%]
            group-hover:opacity-100
          "
        />
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="relative z-10 flex w-full flex-col items-center px-6 py-10 sm:px-8 sm:py-12">
        {/* Label */}

        <div
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-primary-300/20
            bg-primary-950/20
            px-3.5
            py-1.5
            text-[11px]
            font-medium
            tracking-wide
            text-primary-100/70
            backdrop-blur-sm
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-primary-200
              shadow-[0_0_12px_rgba(255,255,255,0.25)]
            "
          />
          خدمات نقطة
        </div>

        {/* =========================================
            ICON
        ========================================= */}

        <div
          className="
            relative
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-[2rem]
            border
            border-primary-200/15
            bg-primary-950/25
            text-primary-50
            shadow-[0_20px_50px_rgba(0,0,0,0.22)]
            backdrop-blur-sm
            transition-all
            duration-500
            group-hover:-translate-y-1
            group-hover:rotate-3
            group-hover:scale-105
          "
        >
          <div
            className="
              absolute
              inset-4
              rounded-[1.5rem]
              bg-primary-400/20
              blur-xl
              transition
              duration-500
              group-hover:bg-primary-300/30
            "
          />

          <Icon size={42} strokeWidth={1.7} className="relative z-10" />
        </div>

        {/* =========================================
            TEXT
        ========================================= */}

        <div className="mt-8 max-w-md text-center">
          <h3
            className="
              text-2xl
              font-black
              tracking-tight
              text-primary-50
              sm:text-3xl
            "
          >
            {service.title}
          </h3>

          <div
            className="
              mx-auto
              mt-4
              h-px
              w-10
              bg-primary-300/40
              transition-all
              duration-500
              group-hover:w-16
            "
          />

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-primary-100/65
              sm:text-[15px]
            "
          >
            {service.shortDescription}
          </p>
        </div>

        {/* =========================================
            BUTTON
        ========================================= */}

        <div className="mt-auto pt-9">
          {service.more ? (
            <Button
              href={moreHref || ROUTES.SERVICES}
              variant="outline"
              hasEffects={false}
              rounded="full"
              className="
                !border-primary-200/20
                !bg-primary-950/20
                !text-primary-50
                backdrop-blur-sm
                transition-all
                hover:!border-primary-200/40
                hover:!bg-primary-950/40
              "
            >
              <Eye size={17} />
              شوف باقي الخدمات
              <ArrowLeft
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-1
                "
              />
            </Button>
          ) : (
            <Button
              href="/contact"
              variant="outline"
              hasEffects={false}
              rounded="full"
              className="
                !border-primary-200/20
                !bg-primary-950/20
                !text-primary-50
                backdrop-blur-sm
                transition-all
                hover:!border-primary-200/40
                hover:!bg-primary-950/40
              "
            >
              <Send size={16} />
              اطلب الخدمة
              <ArrowLeft
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-1
                "
              />
            </Button>
          )}
        </div>
      </div>
    </CardMotion>
  );
}
