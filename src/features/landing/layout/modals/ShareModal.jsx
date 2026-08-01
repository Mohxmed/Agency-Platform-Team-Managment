"use client";

import { useState } from "react";
import { Check, Copy, Link2, Share, Sparkles } from "lucide-react";

import SocialMediaLinks from "../../components/SocialMediaLinks";
import { OutlinedBadge } from "../../../../shared/ui/badges/OutlinedBadge";

function getShareUrls(url) {
  const encoded = encodeURIComponent(url);
  return {
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    Whatsapp: `https://wa.me/?text=${encoded}`,
    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    Twitter: `https://twitter.com/intent/tweet?url=${encoded}`,
  };
}

export function ShareModal() {
  const [url] = useState(() =>
    typeof window !== "undefined" ? window.location.href : "",
  );
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const shareUrls = url ? getShareUrls(url) : {};

  /* =========================================================
     COPY LINK
  ========================================================= */

  async function handleCopy() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  /* =========================================================
     NATIVE SHARE
  ========================================================= */

  async function handleShare() {
    if (!url) return;

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "نقطة | No2ta",
          text: "شوف الصفحة دي على نقطة",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      // User cancelled native share
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div dir="rtl" className="w-full overflow-hidden rounded-[2rem] bg-white dark:bg-card">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative border-b border-black/[0.06] px-6 pb-6 pt-7 sm:px-8 dark:border-white/10">
        {/* Decorative */}

        <div className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full bg-primary-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-10 -top-20 h-36 w-36 rounded-full bg-primary-600/[0.06] blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge */}

          <OutlinedBadge>
            <Sparkles size={14} />
            شارك نقطة
          </OutlinedBadge>

          {/* Title */}

          <h2 className="mt-5 text-xl font-black tracking-tight text-black sm:text-2xl dark:text-white">
            خلي أصحابك يعرفوا نقطة
          </h2>

          {/* Description */}

          <p className="mt-2 max-w-md text-xs leading-6 text-black/45 sm:text-sm sm:leading-7 dark:text-white/50">
            شارك الصفحة مع أصحابك وخليهم يكتشفوا أعمالنا وخدماتنا.
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {/* Link Label */}

        <div className="mb-2 flex items-center gap-2">
          <Link2 size={14} className="text-primary-600" />

          <span className="text-xs font-bold text-black/55 dark:text-white/60">رابط الصفحة</span>
        </div>

        {/* ===================================================
            LINK BOX
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-black/[0.07]
            bg-neutral-50
            p-1.5
            transition
            focus-within:border-primary-600/30
            focus-within:ring-4
            focus-within:ring-primary-600/[0.07]
            dark:border-white/10
            dark:bg-white/5
          "
        >
          {/* URL */}

          <div
            className="
              min-w-0
              flex-1
              overflow-hidden
              px-3
              py-2
              text-right
            "
            dir="ltr"
          >
            <p
              className="
                truncate
                text-xs
                font-medium
                text-black/55
                sm:text-sm
                dark:text-white/60
              "
              title={url}
            >
              {url || "جاري تحميل الرابط..."}
            </p>
          </div>

          {/* Copy */}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!url}
            className="
              flex
              h-11
              shrink-0
              items-center
              gap-2
              rounded-xl
              bg-black
              px-4
              text-xs
              font-bold
              text-white
              transition-all
              hover:bg-primary-600
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="hidden sm:inline">نسخ الرابط</span>
              </>
            )}
          </button>
        </div>

        {/* ===================================================
            SHARE BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={handleShare}
          disabled={!url || isSharing}
          className="
            mt-3
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-primary-600/15
            bg-primary-600/10
            text-sm
            font-bold
            text-primary-600
            transition-all
            hover:bg-primary-600
            hover:text-white
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Share size={17} className={isSharing ? "animate-pulse" : ""} />

          {isSharing ? "جاري المشاركة..." : "مشاركة مباشرة"}
        </button>

        {/* ===================================================
            DIVIDER
        ==================================================== */}

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/10" />

          <span className="text-[11px] font-medium text-black/30 dark:text-white/40">
            أو شارك عبر
          </span>

          <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/10" />
        </div>

        {/* ===================================================
            SOCIAL MEDIA
        ==================================================== */}

        <SocialMediaLinks
          Facebook={shareUrls.Facebook}
          Whatsapp={shareUrls.Whatsapp}
          LinkedIn={shareUrls.LinkedIn}
          Twitter={shareUrls.Twitter}
          size="lg"
          className="mt-0"
        />

        {/* ===================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-black/30 dark:text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
          شارك الخير والمعرفة مع اللي حواليك
        </div>
      </div>
    </div>
  );
}
