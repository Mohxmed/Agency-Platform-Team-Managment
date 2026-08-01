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
        left-[-40px]
        top-[-40px]
        -z-10
        w-80
        sm:w-[420px]
        lg:-left-32
        lg:top-[-80px]
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