import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/identity/no2ta-logo-light.png";
import logoDark from "@/assets/identity/no2ta-logo.png";

export default function Logo() {
  return (
    <Link href="/">
      <Image src={logoLight} alt="No2ta" className="w-24 dark:hidden" />
      <Image src={logoDark} alt="No2ta" className="hidden w-24 dark:block" />
    </Link>
  );
}
