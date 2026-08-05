import clsx from "clsx";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function SocialMediaLinks({
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Youtube,
  TikTok,
  Whatsapp,
  size = "sm",
  className,
}) {
  const toHref = (val) => (typeof val === "string" && val ? val : "#");
  const style =
    size == "sm"
      ? "w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition cursor-pointer bg-white text-black dark:border-white/10 dark:bg-white/5 dark:text-white/80"
      : "w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center transition cursor-pointer bg-white text-black dark:border-white/10 dark:bg-white/5 dark:text-white/80";
  const iconSize = size == "sm" ? 18 : 28;
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-3 justify-center",
        className,
      )}
    >
      {Facebook && (
        <a
          href={toHref(Facebook)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="فيسبوك"
          className={clsx("hover:bg-blue-600 hover:text-white", style)}
        >
          {<FaFacebookF size={iconSize} />}
        </a>
      )}
      {Instagram && (
        <a
          href={toHref(Instagram)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="إنستغرام"
          className={clsx(
            "hover:bg-linear-to-br hover:from-violet-500 hover:via-pink-500 hover:to-orange-500 hover:text-white",
            style,
          )}
        >
          {<FaInstagram size={iconSize} />}
        </a>
      )}
      {LinkedIn && (
        <a
          href={toHref(LinkedIn)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="لينكد إن"
          className={clsx("hover:bg-blue-800 hover:text-white", style)}
        >
          {<FaLinkedinIn size={iconSize} />}
        </a>
      )}
      {Twitter && (
        <a
          href={toHref(Twitter)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="إكس (تويتر)"
          className={clsx("hover:bg-black hover:text-white", style)}
        >
          {<FaXTwitter size={iconSize} />}
        </a>
      )}
      {Youtube && (
        <a
          href={toHref(Youtube)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="يوتيوب"
          className={clsx("hover:bg-red-600 hover:text-white", style)}
        >
          {<FaYoutube size={iconSize} />}
        </a>
      )}
      {TikTok && (
        <a
          href={toHref(TikTok)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تيك توك"
          className={clsx("hover:bg-black hover:text-white", style)}
        >
          {<FaTiktok size={iconSize} />}
        </a>
      )}
      {Whatsapp && (
        <a
          href={toHref(Whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="واتساب"
          className={clsx("hover:bg-green-600 hover:text-white", style)}
        >
          {<FaWhatsapp size={iconSize} />}
        </a>
      )}
    </div>
  );
}

export default SocialMediaLinks;
