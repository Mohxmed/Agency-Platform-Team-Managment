"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, MessageSquareHeart, Eye } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import { ShareModal } from "@/features/landing/layout/modals/ShareModal";

import Modal from "@/shared/modals/Modal";
import Button from "@/shared/ui/buttons/Buttons";
import IconButton from "@/shared/ui/buttons/IconButtons";
import { staggerContainer, itemReveal } from "@/shared/motions";

export default function HeroActions() {
  const [shareIsOpen, setShareIsOpen] = useState(false);
  const { settings } = useSettings();

  const ctaPrimary = settings.content?.hero?.ctaPrimary || HERO.ctaPrimary;
  const ctaSecondary = settings.content?.hero?.ctaSecondary || HERO.ctaSecondary;

  return (
    <>
      <Modal isOpen={shareIsOpen} setIsOpen={setShareIsOpen}>
        <ShareModal />
      </Modal>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
      >
        <motion.div variants={itemReveal} className="hidden md:block">
          <IconButton variant="outline" onClick={() => setShareIsOpen(true)}>
            <Share2 />
          </IconButton>
        </motion.div>

        <motion.div variants={itemReveal} className="w-full sm:w-auto">
          <Button variant="secondary" href={ROUTES.CONTACT} className="w-full sm:w-auto">
            <MessageSquareHeart />
            {ctaPrimary}
          </Button>
        </motion.div>

        <motion.div variants={itemReveal} className="w-full sm:w-auto">
          <Button href={ROUTES.PORTFOLIO} className="w-full sm:w-auto">
            <Eye />
            {ctaSecondary}
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
