"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import roket from "@/assets/svg/roket.svg";

import {
  decorationReveal,
  rocketFloat,
} from "@/shared/motions";


export default function HeroRocket() {
  return (
    <motion.div
      variants={decorationReveal}
      initial="hidden"
      animate="visible"

      className="
        pointer-events-none
        absolute
        left-[-20px]
        top-[-20px]
        -z-10
        w-40
        sm:left-[-40px]
        sm:top-[-40px]
        sm:w-[300px]
        md:left-[-80px]
        md:top-[-80px]
        md:w-[420px]
        lg:left-[-100px]
        lg:top-[-100px]
        lg:w-[520px]
      "
    >

      <motion.div animate={rocketFloat}>

        <Image
          src={roket}
          alt="rocket"
          className="w-full"
        />

      </motion.div>

    </motion.div>
  );
}