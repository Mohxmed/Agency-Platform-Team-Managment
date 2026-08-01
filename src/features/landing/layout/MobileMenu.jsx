import Link from "next/link";
import { navLinks } from "@/constants/navigation";
import Button from "@/shared/ui/buttons/Buttons";
import { FaWhatsapp } from "react-icons/fa";

export default function MobileMenu({ onClose }) {
  const handleNavigate = () => {
    onClose?.();
  };

  return (
    <nav
      className="
        absolute
        left-2.5
        top-18
        z-50
        w-[calc(100%-20px)]
        rounded-lg
        border
        border-black/5
        bg-white/95
        shadow-xl
        backdrop-blur-lg
        lg:hidden
        dark:border-white/10
        dark:bg-card/95
      "
    >
      <div className="container m-auto flex flex-col py-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavigate}
            className="
              border-b
              border-black/10
              py-4
              text-xl
              transition-all
              duration-200
              hover:px-4
              hover:text-primary
              dark:border-white/10
            "
          >
            {link.name}
          </Link>
        ))}

        <Button href="/contact" onClick={handleNavigate} className="mt-4">
          <FaWhatsapp />
          ابعتلنا على واتساب
        </Button>
      </div>
    </nav>
  );
}
