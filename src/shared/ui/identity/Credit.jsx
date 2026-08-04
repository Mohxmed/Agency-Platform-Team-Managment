import { Code2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";


export default function DeveloperCredit() {
  return (
    <motion.a
      href="https://your-link.com"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        y: -4,
      }}
      whileTap={{
        scale: 0.97,
      }}
      className="
        group
        relative
        flex
        items-center
        gap-3

        overflow-hidden

        rounded-2xl

        border
        border-black/5
        dark:border-white/10

        bg-white/85
        dark:bg-white/[0.06]

        px-4
        py-2.5

        shadow-[0_10px_30px_rgba(0,0,0,0.06)]

        transition-all
        duration-500

        hover:border-primary-500/30

        hover:shadow-[0_15px_40px_rgba(234,179,8,0.15)]
      "
    >


      {/* Animated Glow */}

      <motion.span
        className="
          pointer-events-none
          absolute
          inset-0

          bg-gradient-to-r
          from-transparent
          via-primary-500/10
          to-transparent

          translate-x-[-120%]
        "

        whileHover={{
          translateX:"120%"
        }}

        transition={{
          duration:0.8
        }}
      />



      {/* Icon */}

      <span
        className="
          relative
          flex
          h-9
          w-9

          items-center
          justify-center

          rounded-xl

          bg-primary-500/10

          text-primary-600

          transition-all
          duration-300

          group-hover:rotate-6
          group-hover:scale-110
        "
      >

        <Code2 size={18}/>

      </span>




      {/* Text */}

      <div className="relative flex flex-col leading-tight">


        <span
          className="
            text-[10px]
            uppercase
            tracking-widest

            text-neutral-400

            dark:text-neutral-500
          "
        >
          Developed by
        </span>


        <span
          className="
            flex
            items-center
            gap-1

            text-sm
            font-bold

            text-neutral-800

            dark:text-white
          "
        >

          Mohamed Amr

          <Sparkles
            size={12}
            className="
              text-primary-500

              transition-transform
              duration-300

              group-hover:rotate-180
            "
          />

        </span>


      </div>


    </motion.a>
  );
}