"use client";
import { useState } from "react";
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

  return (
    <>
      <Modal isOpen={isTranslated} setIsOpen={setIsTranslated}>
        <UnderDevelopment />
      </Modal>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur shadow dark:bg-background/90">
        <Container className={"flex h-16 items-center justify-between"}>
          <Logo />
          <Navbar />
          {isOpen && <MobileMenu />}
          <div className="flex gap-2">
            {mounted && (
              <IconButtons
                variant="glass"
                onClick={toggleTheme}
                className="dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-primary-400"
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </IconButtons>
            )}
            <IconButtons
              variant="glass"
              onClick={() => setIsTranslated(!isTranslated)}
              className="dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-primary-400"
            >
              <LanguagesIcon size={24} />
            </IconButtons>
            <UserMenu />
            <IconButtons
              variant="secondary"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-3xl dark:bg-white/10"
            >
              <Menu size={24} />
            </IconButtons>
          </div>
        </Container>
      </header>
    </>
  );
}
