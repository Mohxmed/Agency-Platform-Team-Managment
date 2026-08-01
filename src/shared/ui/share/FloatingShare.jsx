"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Share2 } from "lucide-react";
import { ShareModal } from "@/features/landing/layout/modals/ShareModal";
import Modal from "@/shared/modals/Modal";

export default function FloatingShare() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (pathname === "/") return null;

  return (
    <>
      <Modal isOpen={open} setIsOpen={setOpen}>
        <ShareModal />
      </Modal>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="مشاركة"
        className="
          group
          fixed
          bottom-6
          left-6
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-primary-600
          text-white
          shadow-[0_8px_32px_rgba(0,0,0,0.18)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-primary-700
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
          active:scale-95
        "
      >
        <Share2 size={22} className="transition-transform duration-300 group-hover:scale-110" />
      </button>
    </>
  );
}
