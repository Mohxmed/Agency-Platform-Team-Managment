"use client";
import { createElement } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";

const cardVariants = {
  hidden: { opacity: 0, y: 45, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PricingCard({ plan }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: plan.popular ? -8 : -6,
        transition: { type: "spring", stiffness: 300, damping: 22 },
      }}
      className={`
        group relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 sm:p-7
        ${plan.popular
          ? "border-primary-600/30 bg-neutral-950 text-white shadow-[0_30px_90px_rgba(0,0,0,0.16)]"
          : "border-black/[0.06] bg-white text-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.045)] dark:border-white/10 dark:bg-card dark:text-white"
        }
      `}
    >
      {plan.popular && (
        <>
          <div
            className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary-600/20 blur-[90px]"
            style={{ animation: "pf-pulse 5s ease-in-out infinite" }}
          />
          <div className="absolute left-6 top-5 rounded-full bg-primary-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg shadow-primary-600/20">
            الأكثر طلبًا
          </div>
        </>
      )}

      <div className="relative z-10">
        <div className={`
          mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105
          ${plan.popular ? "border-white/10 bg-white/[0.07] text-primary-400" : "border-primary-600/10 bg-primary-600/[0.06] text-primary-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400"}
        `}>
          {createElement(resolveIcon(plan.icon), { size: 21 })}
        </div>
        <h2 className={`text-xl font-black ${plan.popular ? "text-white" : "text-neutral-950 dark:text-white"}`}>
          {plan.name}
        </h2>
        <p className={`mt-2 min-h-[52px] text-xs leading-6 ${plan.popular ? "text-white/40" : "text-neutral-400 dark:text-neutral-400"}`}>
          {plan.description}
        </p>
      </div>



      <div className="relative z-10 mt-7 flex-1">
        <p className={`mb-4 text-[11px] font-bold ${plan.popular ? "text-white/40" : "text-neutral-400 dark:text-neutral-400"}`}>
          الباقة تشمل:
        </p>
        <ul className="space-y-3.5">
          {(plan.features || []).map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.popular ? "bg-primary-600/15 text-primary-400" : "bg-primary-600/10 text-primary-600"}`}>
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={`text-xs leading-6 ${plan.popular ? "text-white/65" : "text-neutral-600 dark:text-neutral-300"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <motion.a
        href="/contact"
        whileTap={{ scale: 0.98 }}
        className={`
          group/button relative z-10 mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-3.5 text-sm font-bold transition-all duration-300
          ${plan.popular
            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-600/25"
            : "bg-neutral-950 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-600/20"
          }
        `}
      >
        <span>ابدأ معانا</span>
        <ArrowLeft size={16} className="transition-transform duration-300 group-hover/button:-translate-x-1" />
      </motion.a>
    </motion.article>
  );
}
