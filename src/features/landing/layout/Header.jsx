"use client";
import { useState, useEffect } from "react";
import Logo from "../../../shared/ui/identity/Logo";

import IconButtons from "@/shared/ui/buttons/IconButtons";
import { LanguagesIcon, Menu, Moon, Sun, User, Verified } from "lucide-react";
import { Container } from "@/features/landing";
import Modal from "@/shared/modals/Modal";
import UnderDevelopment from "./modals/UnderDevelopment";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import UserMenu from "@/features/auth/components/UserMenu";
import { useTheme } from "@/providers/ThemeProvider";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const [isTranslated, setIsTranslated] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function handleScroll() {
      const y = window.scrollY;

      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        if (y > lastY && y > 120) {
          setHidden(true);
        } else if (y < lastY) {
          setHidden(false);
        }

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Modal isOpen={isTranslated} setIsOpen={setIsTranslated}>
        <UnderDevelopment />
      </Modal>
      <header
        className={`
          sticky
          top-0
          z-50
          w-full
          bg-white/90
          shadow
          backdrop-blur
          transition-transform
          duration-500
          ease-out
          dark:bg-background/90
          ${hidden ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <Container className={"flex h-16 items-center justify-between"}>
          <Logo />
          <Navbar />
          <MobileMenu open={isOpen} onClose={() => setIsOpen(false)} />
          <div className="flex items-center gap-1">
            {mounted && (
              <IconButtons
                variant="glass"
                onClick={toggleTheme}
                className="dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-primary-400"
              >
                {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
              </IconButtons>
            )}
            <IconButtons
              variant="glass"
              onClick={() => setIsTranslated(!isTranslated)}
              className="dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-primary-400"
            >
              <LanguagesIcon size={22} />
            </IconButtons>
            <UserMenu />
            <IconButtons
              variant="secondary"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-2xl dark:bg-white/10"
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </IconButtons>
          </div>
        </Container>
      </header>
    </>
  );
}
