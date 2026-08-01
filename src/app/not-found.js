"use client";

import { Header } from "@/features/landing";
import no2taIcon from "@/assets/identity/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <>
      <Header />

      <main
        className="
        relative
        min-h-[calc(100vh-70px)]
        overflow-hidden
        bg-white
        flex
        items-center
        justify-center
        px-6
        "
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-red-500/20
          blur-[120px]
          "
        />

        <motion.div
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="
          absolute
          right-[-100px]
          bottom-[-100px]
          w-80
          h-80
          rounded-full
          bg-black/10
          blur-3xl
          "
        />

        <div className="relative text-center max-w-xl">
          {/* Logo Background */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 0.08,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
            className="
            absolute
            inset-0
            flex
            justify-center
            items-center
            pointer-events-none
            "
          >
            <Image
              src={no2taIcon}
              alt="No2ta"
              width={350}
              className="
              blur-[1px]
              "
            />
          </motion.div>

          {/* 404 */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
            relative
            text-[140px]
            md:text-[220px]
            font-black
            leading-none
            bg-gradient-to-b
            from-black
            to-gray-400
            bg-clip-text
            text-transparent
            "
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
            text-3xl
            md:text-5xl
            font-bold
            text-gray-900
            "
          >
            الصفحة غير موجودة
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.4,
            }}
            className="
            mt-5
            text-gray-500
            text-lg
            leading-8
            "
          >
            يبدو أنك وصلت إلى مكان غير موجود.
            <br />
            دعنا نعيدك إلى الصفحة الرئيسية.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
          >
            <Link
              href="/"
              className="
              group
              relative
              inline-flex
              mt-10
              px-10
              py-4
              rounded-2xl
              bg-black
              text-white
              font-medium
              overflow-hidden
              shadow-xl
              shadow-black/20
              transition-all
              duration-500
              hover:-translate-y-1
              "
            >
              <span
                className="
                absolute
                inset-0
                bg-gradient-to-r
                from-red-600
                via-red-500
                to-red-700
                translate-x-[-100%]
                group-hover:translate-x-0
                transition-transform
                duration-500
                "
              />

              <span className="relative z-10">العودة للرئيسية</span>
            </Link>
          </motion.div>

          {/* Floating Logo */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="
            mt-14
            flex
            justify-center
            opacity-40
            "
          >
            <Image src={no2taIcon} width={80} alt="No2ta Logo" />
          </motion.div>
        </div>
      </main>
    </>
  );
}
