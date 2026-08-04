"use client";

import {
  useEffect,
} from "react";

import Image from "next/image";

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
  BarChart3,
  Heart,
  MessageCircle,
} from "lucide-react";

import Link from "next/link";

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

import {
  resolveIcon,
} from "@/shared/ui/icons/resolveIcon";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/rocket.webp";



/* =========================================================
   HERO CONFIG
========================================================= */

const HERO_CONFIG = {

  stats:[
    {
      value:"+150",
      label:"عميل راضي",
    },

    {
      value:"+500",
      label:"حملة ناجحة",
    },

    {
      value:"4.9",
      label:"تقييم العملاء",
    },
  ],


  showcase:{

    campaign:{
      title:"حملة تسويقية",
      text:
      "نبني محتوى يصنع تأثير حقيقي ويصل بعلامتك للجمهور المناسب.",
      likes:"2.4K",
      comments:"318",
    },


    analytics:{
      title:"أداء المحتوى",
      growth:"+24%",
      text:
      "نمو مستمر في الوصول والتفاعل.",
    },


    growth:{
      value:"+150K",
      label:"وصول جديد",
      period:"هذا الشهر",
    },


    score:86,

    bars:[
      35,
      50,
      42,
      65,
      58,
      80,
      92,
    ],

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


const heroMotion = {


  container:{

    hidden:{
      opacity:0,
    },


    visible:{

      opacity:1,

      transition:{
        staggerChildren:0.08,
        delayChildren:0.15,
      },

    },

  },


  item:{

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

  },


};





const reducedMotion = {


  container:{

    hidden:{
      opacity:0,
    },

    visible:{
      opacity:1,
    },

  },


  item:{

    hidden:{
      opacity:0,
    },

    visible:{
      opacity:1,
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



  const smoothX =
  useSpring(
    mouseX,
    {
      stiffness:45,
      damping:25,
    }
  );



  const smoothY =
  useSpring(
    mouseY,
    {
      stiffness:45,
      damping:25,
    }
  );



  useEffect(()=>{


    if(reduceMotion)
      return;


    function move(
      e
    ){


      mouseX.set(
        (
          e.clientX /
          window.innerWidth -
          .5
        )
        *
        2
      );



      mouseY.set(
        (
          e.clientY /
          window.innerHeight -
          .5
        )
        *
        2
      );

    }



    window.addEventListener(
      "mousemove",
      move
    );


    return()=>{

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



  const gridX =
  useTransform(
    smoothX,
    value=>value * -12
  );



  const gridY =
  useTransform(
    smoothY,
    value=>value * -8
  );



  const accentX =
  useTransform(
    smoothX,
    value=>value * 20
  );



  const accentY =
  useTransform(
    smoothY,
    value=>value * 14
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
          bg-[#fafafa]
        "

      />



      {/* Soft red atmosphere */}
<motion.div
  style={{
    x: reduceMotion ? 0 : accentX,
    y: reduceMotion ? 0 : accentY,

    background:
      "radial-gradient(circle, rgba(217,4,41,0.16) 0%, rgba(217,4,41,0.06) 38%, transparent 72%)",
  }}
  className="
    absolute
    -top-48
    -right-48
    h-[560px]
    w-[560px]
    rounded-full
    pointer-events-none
  "
/>


      {/* Fine grid */}


      <motion.div

        style={{

          x:
          reduceMotion
          ? 0
          : gridX,


          y:
          reduceMotion
          ? 0
          : gridY,

        }}


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
            bg-[linear-gradient(#111_1px,transparent_1px),linear-gradient(90deg,#111_1px,transparent_1px)]
            bg-[size:48px_48px]
          "

        />


      </motion.div>



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
          duration:1.4,
        }}


        className="
          absolute
          right-[8%]
          top-[8%]
          h-56
          w-56
          lg:h-72
          lg:w-72
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



      {/* Bottom vignette */}

      <div

        className="
          absolute
          inset-x-0
          bottom-0
          h-40
          bg-gradient-to-t
          from-white
          to-transparent
        "

      />


    </div>

  );

}
 /* =========================================================
    PREMIUM GLASS CARD
 ========================================================= */


function GlassCard({
  children,
  className = "",
}){


  return (

    <div

      className={`
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-black/[0.06]
        bg-white/80
        backdrop-blur-xl
        shadow-[0_30px_80px_rgba(0,0,0,.08)]
        ${className}
      `}

    >

      <div

        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-white
          via-transparent
          to-transparent
          opacity-70
          pointer-events-none
        "

      />


      {children}


    </div>

  );

}




/* =========================================================
   PERFORMANCE GRAPH
 ========================================================= */


function GrowthGraph(){


 const bars =
 HERO_CONFIG.showcase.bars;



 return (

  <div

    className="
      flex
      h-20
      items-end
      gap-2
    "

  >

    {
      bars.map(
        (item,index)=>(

          <motion.div

            key={index}

            initial={{
              height:0,
              opacity:0,
            }}


            whileInView={{
              height:`${item}%`,
              opacity:1,
            }}


            viewport={{
              once:true,
            }}


            transition={{

              duration:.8,

              delay:
              index*.06,

              ease:easing,

            }}


            className="
              flex-1
              rounded-full
              bg-primary-600
            "

          />

        )
      )
    }


  </div>

 );

}





/* =========================================================
   MAIN ANALYTICS PANEL
 ========================================================= */


function AnalyticsPanel(){


 const {
  settings
 } =
 useSettings();



 const hero =
 settings.content?.hero || {};



 const analytics = {


  title:
  hero.analytics?.title
  ||
  HERO_CONFIG.showcase.analytics.title,


  growth:
  hero.analytics?.growth
  ||
  HERO_CONFIG.showcase.analytics.growth,


  text:
  hero.analytics?.text
  ||
  HERO_CONFIG.showcase.analytics.text,

 };



 return (

  <GlassCard

    className="
      relative
      z-20
      w-[360px]
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
          "

        >

          <BarChart3
            size={22}
          />


        </div>



        <div>


          <p

            className="
              text-sm
              font-black
              text-black
            "

          >

            {analytics.title}

          </p>


          <p

            className="
              text-[11px]
              text-black/40
            "

          >

            Campaign performance

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

        LIVE

      </span>



    </div>




    {/* Main number */}


    <div

      className="
        mt-8
      "

    >

      <p

        className="
          text-5xl
          font-black
          tracking-tight
          text-black
        "

      >

        {analytics.growth}

      </p>


      <p

        className="
          mt-2
          text-sm
          text-black/45
        "

      >

        {analytics.text}

      </p>


    </div>





    {/* Graph */}

    <div

      className="
        mt-8
        rounded-3xl
        bg-black/[0.03]
        p-5
      "

    >

      <div

        className="
          mb-4
          flex
          justify-between
          text-xs
          font-bold
          text-black/50
        "

      >

        <span>
          Reach
        </span>


        <span
          className="
            text-primary-600
          "
        >

          +18%

        </span>


      </div>


      <GrowthGraph/>


    </div>




    {/* Footer */}

    <div

      className="
        mt-6
        flex
        items-center
        justify-between
        border-t
        border-black/[0.06]
        pt-5
      "

    >


      <span

        className="
          flex
          items-center
          gap-2
          text-xs
          font-bold
          text-black/60
        "

      >

        <Heart

          size={15}

          className="
            text-red-500
          "

        />

        2.4K


      </span>



      <span

        className="
          flex
          items-center
          gap-2
          text-xs
          font-bold
          text-black/60
        "

      >

        <MessageCircle

          size={15}

          className="
            text-blue-500
          "

        />

        318


      </span>



    </div>



  </GlassCard>

 );

}





/* =========================================================
   FLOATING BRAND CARDS
 ========================================================= */


function FloatingCampaignCard(){


 return (

  <motion.div

    initial={{
      opacity:0,
      y:30,
    }}

    animate={{
      opacity:1,
      y:0,
    }}

    transition={{
      delay:.5,
      duration:.8,
      ease:easing,
    }}


    className="
      absolute
      -left-16
      top-10
      z-30
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
            "

          >

            حملة جديدة

          </p>


          <p

            className="
              text-[11px]
              text-black/40
            "

          >

            Content Strategy

          </p>


        </div>


      </div>


    </GlassCard>


  </motion.div>

 );

}





function FloatingGrowthCard(){


 return (

  <motion.div


    initial={{
      opacity:0,
      y:30,
    }}


    animate={{
      opacity:1,
      y:0,
    }}


    transition={{
      delay:.7,
      duration:.8,
      ease:easing,
    }}



    className="
      absolute
      -right-10
      bottom-12
      z-30
    "

  >

    <div

      className="
        rounded-[28px]
        bg-primary-600
        px-7
        py-5
        text-white
        shadow-[0_30px_70px_rgba(217,4,41,.25)]
      "

    >

      <p

        className="
          text-xs
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


function GlassShowcase(){


 return (

  <div

    className="
      relative
      hidden
      min-h-[560px]
      items-center
      justify-center
      lg:flex
    "

  >



    <AnalyticsPanel/>


    <FloatingCampaignCard/>


    <FloatingGrowthCard/>




  </div>

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
      mb-7
      flex
      items-center
      gap-3
      text-sm
      font-bold
      text-black/50
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
      w-full
      grid-cols-3
      gap-8
      border-t
      border-black/[0.08]
      pt-8
    "

  >


    {
      stats.map(
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
                text-black
                sm:text-3xl
              "

            >

              {item.value}

            </p>


            <p

              className="
                mt-1
                text-xs
                text-black/45
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
   ACTIONS
 ========================================================= */


function HeroActions(){


 const {
  settings
 } =
 useSettings();



 const hero =
 settings.content?.hero || {};



 const primary =
 hero.ctaPrimary
 ||
 HERO.ctaPrimary
 ||
 "ابدأ مشروعك";



 const primaryLink =
 hero.ctaPrimaryLink
 ||
 "/contact";



 const secondary =
 hero.ctaSecondary
 ||
 HERO.ctaSecondary
 ||
 "شاهد أعمالنا";



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
        shadow-[0_20px_45px_rgba(217,4,41,.22)]
        transition-all
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
        border-black/[0.1]
        bg-white/60
        px-8
        py-4
        font-bold
        text-black
        transition
        hover:bg-black/[0.03]
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
   HERO CONTENT
 ========================================================= */


function HeroContent(){


 const reduceMotion =
 useReducedMotion();



 const variants =
 reduceMotion
 ?
 reducedMotion
 :
 heroMotion;



 const {
  settings
 } =
 useSettings();



 const siteName =
 settings.siteName
 ||
 SITE.name;



 const description =
 settings.description
 ||
 "نصنع محتوى، نبني هوية، ونقود علامتك نحو نمو حقيقي عبر حلول إعلامية وتسويقية مبتكرة.";



 const badge =
 settings.content?.hero?.badge
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
        leading-[1.1]
        tracking-tight
        text-black
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
        text-black/55
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


    <AnalyticsPanel/>


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
      min-h-[calc(100svh-72px)]
      items-center
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





        {/* =========================
            LEFT CONTENT
        ========================== */}


        <HeroContent/>






        {/* =========================
            RIGHT SHOWCASE
        ========================== */}


        <GlassShowcase/>





      </div>







      {/* =========================
          MOBILE SHOWCASE
      ========================== */}


      <MobileShowcase/>









      {/* =========================
          SCROLL INDICATOR
      ========================== */}



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