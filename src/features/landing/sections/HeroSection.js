"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  Mail,
} from "lucide-react";

import { Container } from "@/features/landing";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";

import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/roket.svg";
import Button from "@/features/dashboard/ui/Button";


/* =========================================================
   CONFIG
========================================================= */

const HERO_CONFIG = {
  stats: [
    {
      value: "+150",
      label: "عميل راضي",
    },
    {
      value: "+500",
      label: "حملة ناجحة",
    },
    {
      value: "4.9",
      label: "تقييم العملاء",
    },
  ],

  showcase: {
    campaign: {
      title: "حملة تسويقية",
      text: "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.",
      likes: "2.4K",
      comments: "318",
    },

    analytics: {
      title: "محتوى أسبوعي",
      growth: "+24%",
      text: "تفاعل أعلى من المتوسط بثلاث أضعاف",
    },

    growth: {
      value: "+150K",
      label: "متابع جديد",
      period: "هذا الشهر",
    },
  },

  rocket: {
    path: {
      top: ["70%", "18%", "45%", "70%"],
      left: ["5%", "50%", "82%", "5%"],
      rotate: [-15, 20, -5, -15],
    },

    duration: 28,
    float: 2.5,
  },
};


/* =========================================================
   MOTION SYSTEM
========================================================= */

const easing = [
  0.16,
  1,
  0.3,
  1,
];


const heroMotion = {
  container: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  },


  item: {
    hidden: {
      opacity: 0,
      y: 24,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: easing,
      },
    },
  },


  floating: {
    y: [
      0,
      -14,
      0,
    ],

    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};



const reducedMotion = {
  container: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  },


  item: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  },
};



/* =========================================================
   BACKGROUND
========================================================= */

function HeroBackground() {

  const reduceMotion = useReducedMotion();

  const rocket = HERO_CONFIG.rocket;


  return (

    <div
      className="
        absolute inset-0
        -z-10
        overflow-hidden
        pointer-events-none
      "
    >


      {/* Main glass glow */}

      <div
        className="
          absolute
          -top-40
          -end-40
          w-[500px]
          h-[500px]
          rounded-full
          blur-3xl
        "
        style={{
          background:
            "radial-gradient(circle,rgba(232,33,37,.16),transparent 70%)",
        }}
      />


      {/* Secondary glow */}

      <div
        className="
          absolute
          bottom-0
          start-0
          w-[400px]
          h-[400px]
          rounded-full
          blur-3xl
        "
        style={{
          background:
            "radial-gradient(circle,rgba(232,33,37,.08),transparent 70%)",
        }}
      />



      {/* Logo watermark */}

      <div
        className="
          absolute
          -top-20
          -end-20
          w-[600px]
          h-[600px]
          opacity-[0.035]
        "
      >

        <Image
          src={logoIcon}
          alt=""
          fill
          className="object-contain"
        />

      </div>



      {/* Grid texture */}

      <div
        className="
          absolute
          inset-0
          opacity-40
        "
        style={{
          backgroundImage:
            "radial-gradient(circle,var(--color-border) 1px,transparent 1px)",

          backgroundSize:
            "28px 28px",

          maskImage:
            "radial-gradient(circle at center,black,transparent 75%)",

          WebkitMaskImage:
            "radial-gradient(circle at center,black,transparent 75%)",
        }}
      />




      {/* Rocket animation */}

      <motion.div

        className="
          absolute
          w-20
          h-20
          lg:w-24
          lg:h-24
        "

        initial={{
          top: rocket.path.top[0],
          left: rocket.path.left[0],
          rotate: rocket.path.rotate[0],
        }}


        animate={
          reduceMotion
            ? {}
            : {
                top: rocket.path.top,
                left: rocket.path.left,
                rotate: rocket.path.rotate,
              }
        }


        transition={{
          duration: rocket.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}

      >


        <motion.div

          animate={
            reduceMotion
              ? {}
              : {
                  y:[
                    0,
                    -8,
                    0,
                  ],
                }
          }


          transition={{
            duration: rocket.float,
            repeat: Infinity,
            ease:"easeInOut",
          }}

          className="relative w-full h-full"

        >

          <Image
            src={roket}
            alt=""
            fill
            className="object-contain"
          />


        </motion.div>


      </motion.div>


    </div>

  );
}
/* =========================================================
   GLASS SHOWCASE
========================================================= */

function GlassCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/40
        bg-white/40
        backdrop-blur-2xl
        shadow-[0_30px_80px_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-white/70
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      {children}
    </div>
  );
}



/* =========================================================
   SHOWCASE CONTENT
========================================================= */

function GlassShowcase() {

  const reduceMotion = useReducedMotion();

  const {
    campaign,
    analytics,
    growth,
  } = HERO_CONFIG.showcase;



  const floating = (delay = 0) => {

    if (reduceMotion)
      return {};

    return {
      y:[
        0,
        -12,
        0,
      ],

      transition:{
        duration:7,
        repeat:Infinity,
        delay,
        ease:"easeInOut",
      },
    };

  };



  return (

    <div
      className="
        relative
        w-full
        min-h-[420px]
        hidden
        lg:block
      "
    >


      {/* Main Analytics Card */}

      <motion.div

        animate={floating(.5)}

        className="
          absolute
          top-20
          end-20
          w-[270px]
          rotate-[-5deg]
        "

      >

        <GlassCard
          className="
            p-4
          "
        >


          <div
            className="
              relative
              h-40
              rounded-2xl
              overflow-hidden
              mb-4
            "

            style={{
              background:
              "linear-gradient(135deg,#ff6b6e,#e82125)"
            }}
          >


            <Image
              src={logoIcon}
              alt=""
              className="
                absolute
                -bottom-8
                -end-8
                w-28
                h-28
                opacity-20
              "
            />


            <div
              className="
                absolute
                bottom-4
                start-4
                text-white
              "
            >

              <p
                className="
                  text-xs
                  opacity-80
                "
              >
                Campaign Result
              </p>


              <p
                className="
                  text-3xl
                  font-black
                "
              >
                {analytics.growth}
              </p>


            </div>


          </div>



          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <span
              className="
                font-bold
                text-sm
              "
            >
              {analytics.title}
            </span>


            <span
              className="
                rounded-full
                bg-green-500/10
                text-green-600
                text-xs
                font-bold
                px-3
                py-1
              "
            >
              {analytics.growth}
            </span>


          </div>


          <p
            className="
              text-xs
              text-muted
              mt-2
              leading-relaxed
            "
          >
            {analytics.text}
          </p>



        </GlassCard>


      </motion.div>





      {/* Dark Social Card */}


      <motion.div

        animate={floating(0)}

        className="
          absolute
          top-5
          end-[250px]
          w-[240px]
          rotate-[6deg]
        "

      >

        <div
          className="
            rounded-[28px]
            bg-[#121826]
            text-white
            p-5
            shadow-[0_35px_80px_rgba(0,0,0,.2)]
          "
        >


          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-white/10
                p-2
              "
            >

              <Image
                src={logoIcon}
                alt=""
              />

            </div>


            <span
              className="
                text-sm
                font-bold
              "
            >
              {campaign.title}
            </span>


          </div>




          <p
            className="
              text-sm
              text-white/70
              leading-relaxed
            "
          >
            {campaign.text}
          </p>



          <div
            className="
              flex
              gap-5
              mt-5
              text-xs
              text-white/60
            "
          >

            <span
              className="
                flex
                items-center
                gap-1
              "
            >

              <Heart size={14}/>
              {campaign.likes}

            </span>


            <span
              className="
                flex
                items-center
                gap-1
              "
            >

              <MessageCircle size={14}/>
              {campaign.comments}

            </span>


          </div>


        </div>


      </motion.div>





      {/* Growth Badge */}


      <motion.div

        animate={floating(1)}

        className="
          absolute
          bottom-12
          end-[90px]
        "

      >

        <div
          className="
            rounded-[26px]
            px-6
            py-5
            text-white
            shadow-[0_25px_70px_rgba(232,33,37,.3)]
          "

          style={{
            background:
            "linear-gradient(135deg,#e82125,#b51418)"
          }}
        >

          <div
            className="
              text-xs
              opacity-80
              mb-1
            "
          >
            {growth.period}
          </div>


          <div
            className="
              text-3xl
              font-black
            "
          >
            {growth.value}
          </div>


          <div
            className="
              text-xs
              opacity-90
            "
          >
            {growth.label}
          </div>


        </div>


      </motion.div>



    </div>

  );

}
/* =========================================================
   EYEBROW
========================================================= */

function Eyebrow({ text, variants }) {

  return (

    <motion.div
      variants={variants.item}

      className="
        flex
        items-center
        gap-3
        mb-6
        text-sm
        font-semibold
        text-muted
      "
    >

      <span
        className="
          w-8
          h-[2px]
          rounded-full
          bg-primary-600
        "
      />

      {text}

    </motion.div>

  );

}



/* =========================================================
   STATS
========================================================= */

function HeroStats({
  stats,
  variants,
}) {


  return (

    <motion.div

      variants={variants.item}

      className="
        grid
        grid-cols-3
        gap-5
        w-full
        mt-10
        pt-8
        border-t
      "

      style={{
        borderColor:
        "var(--color-border)"
      }}

    >

      {
        stats.map((item)=> (

          <div
            key={item.label}
            className="
              text-center
              lg:text-start
            "
          >

            <div
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-ink
              "
            >
              {item.value}
            </div>


            <div
              className="
                text-xs
                sm:text-sm
                text-muted
                mt-1
              "
            >
              {item.label}
            </div>


          </div>


        ))
      }


    </motion.div>

  );

}





/* =========================================================
   ACTIONS
========================================================= */


function HeroActions(){

  const {
    settings
  } = useSettings();


  const primary =
    settings.content?.hero?.ctaPrimary
    ||
    HERO.ctaPrimary;


  const secondary =
    settings.content?.hero?.ctaSecondary
    ||
    HERO.ctaSecondary;



  return (

    <div
      className="
        flex
        flex-col
        sm:flex-row
        gap-4
        w-full
        sm:w-auto
      "
    >


      <button

        className="
          group
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          px-8
          py-4
          font-bold
          text-white
          transition-all
          duration-300
          hover:-translate-y-1
          active:translate-y-0
        "

        style={{
          background:
          "var(--color-primary-600)",

          boxShadow:
          "0 20px 40px rgba(232,33,37,.25)"
        }}

      >



        <Mail

size={18}

          className="
          transition-transform
          duration-300
          group-hover:-translate-x-1
          "

          />
          {primary}


      </button>



      <Button
        variant="outline"
        className="
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          px-8
          py-4
          font-bold
          text-ink
          border
          backdrop-blur-xl
          bg-white/40
          transition-all
          duration-300
          hover:bg-white/70
        "

        style={{
          borderColor:
          "var(--color-border)"
        }}

      >

        <Play size={17}/>

        {secondary}


      </Button>


    </div>


  );

}




/* =========================================================
   HERO CONTENT
========================================================= */


function HeroContent(){


  const reduceMotion =
    useReducedMotion();


  const variants =
    reduceMotion
    ? reducedMotion
    : heroMotion;



  const {
    settings
  } = useSettings();



  const siteName =
    settings.siteName
    ||
    SITE.name;


  const description =
    settings.description
    ||
    SITE.description;



  const badge =
    settings.content?.hero?.badge
    ||
    HERO.badge;



  return (

    <motion.div

      variants={variants.container}

      initial="hidden"

      animate="visible"


      className="
        flex
        flex-col
        items-center
        text-center

        lg:items-start
        lg:text-start

        max-w-xl
        w-full
      "

    >



      <Eyebrow
        text={badge}
        variants={variants}
      />





      <motion.h1

        variants={variants.item}

        className="
          font-black
          tracking-tight
          leading-[1.15]
          text-ink
        "

        style={{
          fontSize:
          "clamp(2.2rem,5vw,4rem)"
        }}

      >

        <span
          className="
            text-primary-600
          "
        >
          {siteName}
        </span>


        {" ومن "}


        <HighlightText>
          أول السطر،
        </HighlightText>


        <br/>


        <span
          className="
            text-ink/90
          "
        >
          هنبدأ حكايات جديدة
        </span>



      </motion.h1>





      <motion.p

        variants={variants.item}

        className="
          mt-6
          max-w-lg
          text-muted
          text-base
          sm:text-lg
          leading-relaxed
        "

      >

        {description}


      </motion.p>





      <motion.div

        variants={variants.item}

        className="
          mt-8
        "

      >

        <HeroActions/>


      </motion.div>





      <HeroStats

        stats={
          HERO_CONFIG.stats
        }

        variants={variants}

      />



    </motion.div>

  );

}
/* =========================================================
   MOBILE SHOWCASE
========================================================= */

function MobileShowcase() {

  const {
    campaign,
    analytics,
    growth,
  } = HERO_CONFIG.showcase;


  return (

    <div
      className="
        lg:hidden
        grid
        grid-cols-3
        gap-3
        w-full
      "
    >


      {/* Social */}

      <div
        className="
          rounded-3xl
          bg-[#121826]
          p-4
          text-white
        "
      >

        <Image
          src={logoIcon}
          alt=""
          className="
            w-7
            h-7
            mb-3
          "
        />


        <p
          className="
            text-[11px]
            leading-relaxed
            text-white/70
            line-clamp-3
          "
        >
          {campaign.text}
        </p>


        <div
          className="
            flex
            gap-2
            mt-3
            text-[10px]
            text-white/50
          "
        >

          <span>
            ♥ {campaign.likes}
          </span>


          <span>
            ◯ {campaign.comments}
          </span>

        </div>


      </div>





      {/* Analytics */}

      <div
        className="
          rounded-3xl
          border
          bg-white/50
          backdrop-blur-xl
          p-4
        "

        style={{
          borderColor:
          "var(--color-border)"
        }}

      >


        <div

          className="
            h-16
            rounded-2xl
            mb-3
          "

          style={{
            background:
            "linear-gradient(135deg,#ff6b6e,#e82125)"
          }}

        />


        <p
          className="
            text-xs
            font-bold
          "
        >

          {analytics.growth}

        </p>


        <p
          className="
            text-[10px]
            text-muted
          "
        >
          {analytics.title}
        </p>


      </div>






      {/* Growth */}

      <div

        className="
          rounded-3xl
          p-4
          text-white
        "

        style={{
          background:
          "var(--color-primary-600)"
        }}

      >

        <TrendingUp
          size={16}
          className="mb-3"
        />


        <p
          className="
            text-xl
            font-black
          "
        >

          {growth.value}

        </p>


        <p
          className="
            text-[10px]
            opacity-80
          "
        >

          {growth.label}

        </p>


      </div>


    </div>


  );

}



/* =========================================================
   HERO SECTION
========================================================= */


export default function HeroSection(){


  return (

    <section

      id="hero"

      className="
        relative
        flex
        items-center
        min-h-[calc(100svh-64px)]
        overflow-hidden
        py-12
        sm:py-20
      "

      aria-labelledby="hero-heading"

    >



      <HeroBackground/>





      <Container

        className="
          relative
          z-10
          w-full
        "

      >



        <div

          className="
            grid

            grid-cols-1

            lg:grid-cols-[1fr_.9fr]

            items-center

            gap-12
            lg:gap-20

          "

        >



          {/* Content */}

          <HeroContent/>




          {/* Desktop */}

          <GlassShowcase/>




        </div>





        {/* Mobile */}

        <div
          className="
            mt-10
          "
        >

          <MobileShowcase/>


        </div>





        {/* Scroll */}

        <motion.div

          initial={{
            opacity:0,
            y:20,
          }}

          animate={{
            opacity:1,
            y:0,
          }}

          transition={{
            delay:.7
          }}

          className="
            hidden
            sm:flex
            justify-center
            mt-14
          "

        >

          <ScrollIndicator
            className="
              w-10
              h-16
            "
          />


        </motion.div>



      </Container>



    </section>


  );

}