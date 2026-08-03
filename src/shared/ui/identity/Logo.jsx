import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/identity/no2ta-logo-light.png";
import logoDark from "@/assets/identity/no2ta-logo.png";

export default function Logo({ className = "w-24" }) {
  return (
    <Link href="/#">
      <Image src={logoLight} alt="No2ta" className={`${className} h-auto dark:hidden`} />
      <Image src={logoDark} alt="No2ta" className={`hidden ${className} h-auto dark:block`} />
    </Link>
  );
}
