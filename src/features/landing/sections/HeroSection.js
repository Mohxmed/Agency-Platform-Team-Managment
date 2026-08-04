"use client";

import {
  useEffect,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  Play,
  TrendingUp,
} from "lucide-react";

import {
  Container,
} from "@/features/landing";

import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";

import {
  SITE,
  HERO,
} from "@/constants/content";

import {
  useSettings,
} from "@/contexts/SettingsContext";


import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/rocket.webp";



/* =========================================================
   CONFIG
========================================================= */

const HERO_CONFIG = {

  stats:[
    {
      value:"+150",
      label:"عميل راضي",
    },
    {
      value:"+500",
      label:"مشروع ناجح",
    },
    {
      value:"4.9",
      label:"تقييم العملاء",
    },
  ],


  showcase:{
    title:"نمو العلامات",
    value:"+24%",
    description:
    "نساعد العلامات التجارية على بناء حضور رقمي مؤثر.",
  },


};



/* =========================================================
   MOTION
========================================================= */

const easing = [
  0.16,
  1,
  0.3,
  1,
];


const reveal = {

  hidden:{
    opacity:0,
    y:24,
  },


  visible:{
    opacity:1,
    y:0,

    transition:{
      duration:.7,
      ease:easing,
    },
  },

};



const container = {

  hidden:{
    opacity:0,
  },


  visible:{
    opacity:1,

    transition:{
      staggerChildren:.08,
      delayChildren:.1,
    },

  },

};



/* =========================================================
   PREMIUM BACKGROUND
========================================================= */

function HeroBackground(){


  const reduceMotion =
  useReducedMotion();



  const mouseX =
  useMotionValue(0);



  const mouseY =
  useMotionValue(0);



  const x =
  useSpring(
    mouseX,
    {
      stiffness:40,
      damping:25,
    }
  );


  const y =
  useSpring(
    mouseY,
    {
      stiffness:40,
      damping:25,
    }
  );



  useEffect(()=>{


    if(reduceMotion)
      return;


    const move = (e)=>{


      mouseX.set(
        (e.clientX /
        window.innerWidth -
        .5)
        *
        2
      );


      mouseY.set(
        (e.clientY /
        window.innerHeight -
        .5)
        *
        2
      );


    };



    window.addEventListener(
      "mousemove",
      move
    );


    return ()=>{

      window.removeEventListener(
        "mousemove",
        move
      );

    };


  },[
    mouseX,
    mouseY,
    reduceMotion,
  ]);



  const glowX =
  useTransform(
    x,
    value=>value * 25
  );


  const glowY =
  useTransform(
    y,
    value=>value * 20
  );



  return (

    <div

      className="
        absolute
        inset-0
        -z-10
        overflow-hidden
        pointer-events-none
      "

    >


      {/* Base */}

      <div

        className="
          absolute
          inset-0
          bg-background
        "

      />



      {/* Brand Glow */}

      <motion.div

        style={{

          x:
          reduceMotion
          ? 0
          : glowX,


          y:
          reduceMotion
          ? 0
          : glowY,


        }}


        className="
          absolute
          -top-48
          -right-48
          h-[520px]
          w-[520px]
          rounded-full
          opacity-40
        "


      >


        <div

          className="
            h-full
            w-full
            rounded-full
          "


          style={{

            background:
            "radial-gradient(circle,rgba(217,4,41,.16),transparent 70%)"

          }}


        />


      </motion.div>





      {/* Soft Grid */}

      <div

        className="
          absolute
          inset-0
          opacity-[0.035]
        "

      >

        <div

          className="
            h-full
            w-full
            bg-[linear-gradient(var(--color-ink)_1px,transparent_1px),linear-gradient(90deg,var(--color-ink)_1px,transparent_1px)]
            bg-[size:48px_48px]
          "

        />


      </div>






      {/* Rocket */}

      <motion.div


        initial={{
          opacity:0,
          scale:.9,
        }}


        animate={{
          opacity:.12,
          scale:1,
        }}


        transition={{
          duration:1.2,
        }}


        className="
          absolute
          right-[8%]
          top-[12%]
          hidden
          h-64
          w-64
          lg:block
        "


      >

        <Image

          src={roket}

          alt=""

          fill

          className="
            object-contain
          "

        />


      </motion.div>





      {/* Noise */}

      <div

        className="
          absolute
          inset-0
          opacity-[0.04]
          bg-noise
        "

      />



    </div>

  );

}




/* =========================================================
   GLASS CARD
========================================================= */

function GlassCard({
 children,
 className="",
}){


 return (

  <div

    className={`

      relative
      overflow-hidden
      rounded-[32px]

      border
      border-black/10
      dark:border-white/10

      bg-white/60
      dark:bg-white/5

      backdrop-blur-2xl

      shadow-[0_30px_80px_rgba(0,0,0,.12)]

      ${className}

    `}


  >

    <div

      className="
        absolute
        inset-0
        bg-gradient-to-br
        from-white/30
        dark:from-white/10
        to-transparent
        pointer-events-none
      "

    />


    {children}


  </div>


 );

}
/* =========================================================
   SHOWCASE CARD
========================================================= */

function AnalyticsShowcase(){


  const {
    settings,
  } = useSettings();



  const hero =
  settings.content?.hero || {};



  const showcase = {

    title:
    hero.showcase?.title
    ||
    HERO_CONFIG.showcase.title,


    value:
    hero.showcase?.value
    ||
    HERO_CONFIG.showcase.value,


    description:
    hero.showcase?.description
    ||
    HERO_CONFIG.showcase.description,

  };



  return (

    <motion.div

      variants={reveal}

      className="
        relative
        mx-auto
        w-full
        max-w-[380px]
      "

    >


      <GlassCard

        className="
          p-7
        "

      >



        {/* Header */}

        <div

          className="
            flex
            items-center
            justify-between
          "

        >


          <div

            className="
              flex
              items-center
              gap-3
            "

          >


            <div

              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-primary-600
                text-white
                shadow-lg
              "

            >

              <TrendingUp
                size={22}
              />


            </div>



            <div>


              <p

                className="
                  text-sm
                  font-black
                  text-ink
                "

              >

                {showcase.title}

              </p>



              <p

                className="
                  mt-1
                  text-[11px]
                  text-muted
                "

              >

                أداء العلامة التجارية

              </p>


            </div>


          </div>




          <span

            className="
              rounded-full
              bg-primary-600/10
              px-3
              py-1
              text-[10px]
              font-bold
              text-primary-600
            "

          >

            Growth

          </span>



        </div>







        {/* Main Value */}


        <div

          className="
            mt-10
          "

        >


          <p

            className="
              text-6xl
              font-black
              tracking-tight
              text-ink
            "

          >

            {showcase.value}

          </p>



          <p

            className="
              mt-3
              max-w-xs
              text-sm
              leading-relaxed
              text-muted
            "

          >

            {showcase.description}


          </p>


        </div>






        {/* Mini Metrics */}


        <div

          className="
            mt-8
            grid
            grid-cols-3
            gap-3
          "

        >


          {
            [
              {
                value:"+150",
                label:"عميل",
              },

              {
                value:"+500",
                label:"حملة",
              },

              {
                value:"4.9",
                label:"تقييم",
              },

            ].map(
              item=>(

                <div

                  key={item.label}

                  className="
                    rounded-2xl
                    bg-black/[0.04]
                    dark:bg-white/[0.05]
                    p-3
                  "

                >

                  <p

                    className="
                      text-sm
                      font-black
                      text-ink
                    "

                  >

                    {item.value}

                  </p>


                  <p

                    className="
                      mt-1
                      text-[10px]
                      text-muted
                    "

                  >

                    {item.label}

                  </p>


                </div>

              )
            )
          }


        </div>






      </GlassCard>




    </motion.div>

  );

}








/* =========================================================
   FLOATING BRAND CARD
========================================================= */

function FloatingBrandCard(){



  const {
    settings,
  } = useSettings();



  const title =
  settings.content?.hero?.floatingCard?.title
  ||
  "استراتيجية محتوى";



  const subtitle =
  settings.content?.hero?.floatingCard?.subtitle
  ||
  "نبني حضور رقمي قوي";



  return (

    <motion.div


      variants={reveal}


      className="
        absolute
        -left-10
        top-12
        hidden
        lg:block
      "


    >



      <GlassCard

        className="
          w-[220px]
          p-5
        "

      >


        <div

          className="
            flex
            items-center
            gap-3
          "

        >



          <Image

            src={logoIcon}

            alt=""

            className="
              h-10
              w-10
            "

          />



          <div>


            <p

              className="
                text-xs
                font-black
                text-ink
              "

            >

              {title}

            </p>



            <p

              className="
                mt-1
                text-[11px]
                text-muted
              "

            >

              {subtitle}

            </p>


          </div>



        </div>


      </GlassCard>


    </motion.div>


  );

}






/* =========================================================
   FLOATING GROWTH BADGE
========================================================= */

function GrowthBadge(){


 return (

  <motion.div

    variants={reveal}

    className="
      absolute
      -right-8
      bottom-10
      hidden
      lg:block
    "

  >

    <div

      className="
        rounded-[28px]
        bg-primary-600
        px-6
        py-5
        text-white
        shadow-[0_25px_70px_rgba(217,4,41,.25)]
      "

    >

      <p

        className="
          text-[11px]
          opacity-80
        "

      >

        هذا الشهر

      </p>


      <p

        className="
          mt-1
          text-3xl
          font-black
        "

      >

        +150K

      </p>


      <p

        className="
          text-[11px]
          opacity-90
        "

      >

        وصول جديد

      </p>


    </div>


  </motion.div>

 );


}








/* =========================================================
   SHOWCASE WRAPPER
========================================================= */

function HeroShowcase(){


 return (

  <motion.div

    variants={container}

    initial="hidden"

    animate="visible"


    className="
      relative
      hidden
      min-h-[520px]
      items-center
      justify-center
      lg:flex
    "

  >



    <AnalyticsShowcase/>

    <FloatingBrandCard/>

    <GrowthBadge/>


  </motion.div>


 );


}
 /* =========================================================
    EYEBROW
 ========================================================= */

function Eyebrow({
  text,
  variants,
}){


  return (

    <motion.div

      variants={variants.item}

      className="
        mb-6
        flex
        items-center
        justify-center
        gap-3
        text-sm
        font-bold
        text-muted

        lg:justify-start
      "

    >

      <span

        className="
          h-[2px]
          w-10
          rounded-full
          bg-primary-600
        "

      />

      {text}


    </motion.div>

  );

}





/* =========================================================
   ACTIONS
========================================================= */


function HeroActions(){


  const {
    settings,
  } = useSettings();



  const hero =
  settings.content?.hero || {};



  const primary =
  hero.ctaPrimary
  ||
  HERO.ctaPrimary
  ||
  "ابدأ مشروعك";



  const secondary =
  hero.ctaSecondary
  ||
  HERO.ctaSecondary
  ||
  "شاهد أعمالنا";



  const primaryLink =
  hero.ctaPrimaryLink
  ||
  "/contact";



  const secondaryLink =
  hero.ctaSecondaryLink
  ||
  "/works";



  return (

    <div

      className="
        flex
        flex-col
        gap-4

        sm:flex-row
      "

    >



      <Link

        href={primaryLink}

        className="
          group
          flex
          items-center
          justify-center
          gap-3

          rounded-2xl

          bg-primary-600

          px-8
          py-4

          font-bold
          text-white

          shadow-[0_20px_45px_rgba(217,4,41,.25)]

          transition-all
          duration-300

          hover:-translate-y-1
        "

      >

        {primary}


        <ArrowLeft

          size={18}

          className="
            transition-transform
            group-hover:-translate-x-1
          "

        />


      </Link>





      <Link

        href={secondaryLink}

        className="
          flex
          items-center
          justify-center
          gap-3

          rounded-2xl

          border
          border-black/10
          dark:border-white/10

          bg-white/40
          dark:bg-white/5

          px-8
          py-4

          font-bold
          text-ink

          backdrop-blur

          transition

          hover:bg-black/5
          dark:hover:bg-white/10
        "

      >


        <Play

          size={16}

          fill="currentColor"

        />


        {secondary}


      </Link>



    </div>

  );

}






/* =========================================================
   STATS
========================================================= */


function HeroStats({
  stats,
  variants,
}){


 return (

  <motion.div

    variants={variants.item}


    className="
      mt-12

      grid
      grid-cols-3

      gap-5

      border-t
      border-black/10
      dark:border-white/10

      pt-8
    "

  >


    {
      stats
      .slice(0,3)
      .map(
        item=>(

          <div

            key={item.label}

            className="
              text-center
              lg:text-start
            "

          >


            <p

              className="
                text-2xl
                font-black
                text-ink

                sm:text-3xl
              "

            >

              {item.value}


            </p>



            <p

              className="
                mt-1
                text-xs
                text-muted

                sm:text-sm
              "

            >

              {item.label}


            </p>


          </div>


        )
      )
    }


  </motion.div>


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
  ?
  {
    container,
    item: {
      hidden:{opacity:0},
      visible:{opacity:1},
    }
  }
  :
  {
    container,
    item:reveal,
  };




  const {
    settings,
  } = useSettings();




  const siteName =
  settings.siteName
  ||
  SITE.name;



  const description =
  settings.description
  ||
  "نصنع محتوى، نبني هوية، ونقود علامتك نحو نمو حقيقي من خلال حلول إعلامية وتسويقية مبتكرة.";




  const hero =
  settings.content?.hero || {};




  const badge =
  hero.badge
  ||
  "Media & Creative Studio";



  const stats =
  settings.stats?.length
  ?
  settings.stats
  :
  HERO_CONFIG.stats;




  return (

    <motion.div


      variants={variants.container}


      initial="hidden"


      animate="visible"



      className="
        max-w-xl

        text-center

        lg:text-start

      "

    >



      <Eyebrow

        text={badge}

        variants={variants}

      />






      <motion.h1

        variants={variants.item}


        className="
          text-5xl

          font-black

          leading-[1.08]

          tracking-tight

          text-ink


          sm:text-6xl

        "

      >



        <span

          className="
            text-primary-600
          "

        >

          {siteName}

        </span>



        {" "}

        تصنع

        <br/>


        علامات


        <HighlightText>

          مؤثرة

        </HighlightText>




      </motion.h1>







      <motion.p

        variants={variants.item}

        className="
          mt-6

          max-w-lg

          text-base

          leading-relaxed

          text-muted

          sm:text-lg
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

        stats={stats}

        variants={variants}

      />




    </motion.div>


  );


}









/* =========================================================
   MOBILE SHOWCASE
========================================================= */


function MobileShowcase(){


 return (

  <div

    className="
      mt-12

      lg:hidden
    "

  >

    <AnalyticsShowcase/>


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

      aria-labelledby="hero-heading"

      className="
        relative
        isolate

        flex
        items-center

        min-h-[calc(100svh-72px)]

        overflow-hidden

        py-16

        sm:py-20
      "

    >




      {/* Background */}

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

            items-center

            gap-14


            lg:grid-cols-[1fr_.9fr]

            lg:gap-20

          "

        >




          {/* Content */}

          <HeroContent/>







          {/* Desktop Showcase */}

          <HeroShowcase/>




        </div>








        {/* Mobile Showcase */}

        <MobileShowcase/>









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

            delay:1,

            duration:.8,

            ease:easing,

          }}



          className="
            mt-16

            hidden

            justify-center

            sm:flex

          "

        >


          <ScrollIndicator

            className="
              h-14
              w-9
            "

          />



        </motion.div>







      </Container>






    </section>

  );

}