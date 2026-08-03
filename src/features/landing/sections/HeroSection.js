"use client";

import { createElement } from "react";
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
  Eye,
  Share2,
  Users,
  Zap,
  Target,
  Palette,
  MessageSquare,
  BarChart2,
  Video,
  Repeat,
  Award,
} from "lucide-react";

import { Container } from "@/features/landing";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";
import { AnimatedCounter } from "@/shared/ui";

import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/roket.svg";
import Link from "next/link";


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

  flying: [
    {
      title: "حضور قوي كل يوم",
      text: "محتوى بيردد صداه ويخلي جمهورك يتفاعل",
      value: "+2.4K",
      label: "إعجاب جديد",
      icon: "Heart",
      metric: "likes",
      animated: true,
      color: "rose",
    },
    {
      title: "وصول بذكاء محسوب",
      text: "حملات مدروسة بتوصل لجمهورك الصح",
      value: "+150K",
      label: "متابع جديد",
      icon: "Target",
      metric: "followers",
      animated: true,
      color: "blue",
    },
    {
      title: "شغل بخامة عالية",
      text: "تصميم بيشد العين وبيفرض الاحترافية",
      value: "+3.5K",
      label: "مشترك جديد",
      icon: "Users",
      metric: "subscribers",
      animated: true,
      color: "purple",
    },
    {
      title: "مشاهدات بتتضاعف",
      text: "فيديوهات ومحتوى بيحقق أرقام قياسية",
      value: "+2.1M",
      label: "مشاهدة",
      icon: "Video",
      metric: "views",
      animated: true,
      color: "orange",
    },
    {
      title: "مشاركة وانتشار واسع",
      text: "محتوى بيستاهل المشاركة والريتويت",
      value: "+89K",
      label: "مشاركة",
      icon: "Share2",
      metric: "shares",
      animated: true,
      color: "green",
    },
    {
      title: "تفاعل حقيقي ومتزايد",
      text: "تعليقات ونقاشات بتثري المحتوى",
      value: "+12.4K",
      label: "تعليق",
      icon: "MessageSquare",
      metric: "comments",
      animated: true,
      color: "indigo",
    },
    {
      title: "معدل تفاعل قياسي",
      text: "أداء محتوى بياخد المركز الأول",
      value: "12.8%",
      label: "معدل التفاعل",
      icon: "Zap",
      metric: "engagementRate",
      animated: true,
      color: "amber",
    },
    {
      title: "وصول لملايين العيون",
      text: "حضور رقمي بيفرض نفسه في السوق",
      value: "+5.2M",
      label: "وصول",
      icon: "Eye",
      metric: "reach",
      animated: true,
      color: "red",
    },
    {
      title: "حلقة احترافية للنمو",
      text: "حلول احترافية لكل مشروع بتبني حضور قوي",
      value: "+8.3K",
      label: "حلول",
      icon: "BriefcaseBusiness",
      metric: "solutions",
      animated: true,
      color: "cyan",
    },
    {
      title: "مساحة توسع وأعمال",
      text: "حضور بيمتد على السوق المحلي والإقليمي والعالمي",
      value: "+12",
      label: "بلد",
      icon: "Globe2",
      metric: "countries",
      animated: true,
      color: "emerald",
    },
    {
      title: "شراكة مع العلامات التجارية",
      text: "مجموعة كبيرة من العلامات التجارية عتمد علينا",
      value: "+250+",
      label: "عميل",
      icon: "Building2",
      metric: "companies",
      animated: true,
      color: "yellow",
    },
    {
      title: "شهادات رضاء",
      text: "شهادات جودة عالية تعكس تفوقنا في العمل والتميز",
      value: "+89",
      label: "شهادة",
      icon: "Award",
      metric: "awards",
      animated: true,
      color: "pink",
    },
  ],
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
          w-72
          h-72
          opacity-[0.3]
          md:w-96
          md:h-96
          lg:w-[30rem]
          lg:h-[30rem]
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
            className="object-contain w-125 opacity-.5"
          />


        </motion.div>


      </motion.div>


    </div>
);
}

/* =========================================================
   FLYING ENGAGEMENT CARDS (Module Level)
========================================================= */

const FLYING_COLOR_STYLES = {
  rose: { bg: "bg-rose-500", bgLight: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", glow: "rgba(244,63,94,0.3)" },
  blue: { bg: "bg-blue-500", bgLight: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", glow: "rgba(59,130,246,0.3)" },
  purple: { bg: "bg-purple-500", bgLight: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", glow: "rgba(168,85,247,0.3)" },
  orange: { bg: "bg-orange-500", bgLight: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20", glow: "rgba(249,115,22,0.3)" },
  green: { bg: "bg-green-500", bgLight: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20", glow: "rgba(34,197,94,0.3)" },
  indigo: { bg: "bg-indigo-500", bgLight: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20", glow: "rgba(99,102,241,0.3)" },
  amber: { bg: "bg-amber-500", bgLight: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", glow: "rgba(245,158,11,0.3)" },
  red: { bg: "bg-red-500", bgLight: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20", glow: "rgba(239,68,68,0.3)" },
};

function FlyingEngagementCard({ item, className, floatDelay, pulseDelay, reduceMotion }) {
  const colors = FLYING_COLOR_STYLES[item.color] || FLYING_COLOR_STYLES.rose;
  const Icon = resolveIcon(item.icon, Heart);
  const iconEl = createElement(Icon, { size: 18, strokeWidth: 2 });

  const floating = reduceMotion ? {} : {
    y: [0, -12, 0],
    transition: { duration: 7, repeat: Infinity, delay: floatDelay, ease: "easeInOut" },
  };

  const pulse = reduceMotion ? {} : {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 2, repeat: Infinity, delay: pulseDelay, ease: "easeInOut" },
  };

  return (
    <motion.div
      animate={floating}
      className={`absolute ${className}`}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <motion.div
        animate={pulse}
        className="relative"
      >
        <div
          className={`
            absolute inset-0 rounded-[24px] blur-2xl opacity-30
            ${colors.bg}
          `}
        />
        <GlassCard
          className={`
            p-4 relative z-10 min-w-[220px] max-w-[260px]
            border-${item.color}-500/20
            hover:border-${item.color}-500/40
            transition-all duration-300
            hover:shadow-[0_20px_50px_${colors.glow}]
          `}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bgLight} ${colors.text}`}>
              {iconEl}
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.bgLight} ${colors.text}`}>
              {item.label}
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[11px] leading-relaxed text-muted mb-3 line-clamp-2"
          >
            {item.text}
          </motion.p>

          <div className="flex items-end justify-between gap-2 pt-2 border-t border-ink/[0.05]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-baseline gap-1"
            >
              {item.animated ? (
                <AnimatedCounter
                  value={item.value}
                  className="text-2xl font-black text-ink"
                  duration={1800}
                />
              ) : (
                <span className="text-2xl font-black text-ink">{item.value}</span>
              )}
              <span className="text-xs font-medium text-muted ml-1">{item.metric === "engagementRate" ? "" : "+"}</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className={`text-[10px] font-bold px-2 py-1 rounded-full ${colors.bgLight} ${colors.text}`}>
              {item.metric}
            </motion.span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function MobileEngagementCard({ item }) {
  const colors = FLYING_COLOR_STYLES[item.color] || FLYING_COLOR_STYLES.rose;
  const Icon = resolveIcon(item.icon, Heart);
  const iconEl = createElement(Icon, { size: 14, strokeWidth: 2 });

  return (
    <div className="group relative rounded-2xl border bg-white/50 backdrop-blur-xl p-3 hover:border-primary-500/30 transition-all duration-300" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${colors.bgLight} ${colors.text}`}>
          {iconEl}
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${colors.bgLight} ${colors.text}`}>
          {item.label}
        </span>
      </div>

      <p className="text-[10px] leading-relaxed text-muted mb-2 line-clamp-2">{item.text}</p>

      <div className="flex items-end justify-between gap-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-baseline gap-1">
          {item.animated ? (
            <AnimatedCounter value={item.value} className="text-lg font-black text-ink" duration={1500} />
          ) : (
            <span className="text-lg font-black text-ink">{item.value}</span>
          )}
          <span className="text-xs font-medium text-muted ml-1">{item.metric === "engagementRate" ? "" : "+"}</span>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colors.bgLight} ${colors.text}`}>
          {item.metric}
        </span>
      </div>
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

  const { settings } = useSettings();
  const heroContent = settings.content?.hero || {};
  const showcaseDefaults = HERO_CONFIG.showcase;

  const campaign = {
    title: heroContent.campaign?.title || showcaseDefaults.campaign.title,
    text: heroContent.campaign?.text || showcaseDefaults.campaign.text,
    likes: heroContent.campaign?.likes || showcaseDefaults.campaign.likes,
    comments: heroContent.campaign?.comments || showcaseDefaults.campaign.comments,
  };

  const analytics = {
    title: heroContent.analytics?.title || showcaseDefaults.analytics.title,
    growth: heroContent.analytics?.growth || showcaseDefaults.analytics.growth,
    text: heroContent.analytics?.text || showcaseDefaults.analytics.text,
  };

  const growth = {
    value: heroContent.growth?.value || showcaseDefaults.growth.value,
    label: heroContent.growth?.label || showcaseDefaults.growth.label,
    period: heroContent.growth?.period || showcaseDefaults.growth.period,
  };



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




      {/* Flying Engagement Cards */}

      <FlyingEngagementCard
        item={flying[0]}
        className="top-[12%] end-[-20px] rotate-[4deg]"
        floatDelay={0.2}
        pulseDelay={0.5}
      />

      <FlyingEngagementCard
        item={flying[1]}
        className="top-[18%] end-[320px] rotate-[-5deg]"
        floatDelay={0.8}
        pulseDelay={1.2}
      />

      <FlyingEngagementCard
        item={flying[2]}
        className="top-[42%] end-[-40px] rotate-[3deg]"
        floatDelay={1.4}
        pulseDelay={0.8}
      />

      <FlyingEngagementCard
        item={flying[3]}
        className="top-[55%] end-[280px] rotate-[-4deg]"
        floatDelay={2.0}
        pulseDelay={1.5}
      />

      <FlyingEngagementCard
        item={flying[4]}
        className="top-[68%] end-[-10px] rotate-[2deg]"
        floatDelay={1.6}
        pulseDelay={2.2}
      />

      <FlyingEngagementCard
        item={flying[5]}
        className="bottom-[18%] end-[360px] rotate-[-3deg]"
        floatDelay={2.4}
        pulseDelay={0.3}
      />

      <FlyingEngagementCard
        item={flying[6]}
        className="bottom-[8%] end-[-30px] rotate-[5deg]"
        floatDelay={2.8}
        pulseDelay={1.8}
      />

      <FlyingEngagementCard
        item={flying[7]}
        className="bottom-[32%] end-[200px] rotate-[-2deg]"
        floatDelay={3.2}
        pulseDelay={2.5}
      />

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

  const colsClass =
    stats.length >= 4
      ? "grid-cols-2 md:grid-cols-4"
      : stats.length === 3
        ? "grid-cols-3"
        : stats.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  return (

    <motion.div

      variants={variants.item}

      className={`
        grid
        ${colsClass}
        gap-5
        w-full
        mt-10
        pt-8
        border-t
      `}

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

  const hero =
    settings.content?.hero
    || {};


  const primary =
    hero.ctaPrimary
    ||
    HERO.ctaPrimary;

  const primaryLink =
    hero.ctaPrimaryLink
    ||
    "/contact";

  const primaryIcon =
    createElement(
      resolveIcon(hero.ctaPrimaryIcon, ArrowLeft),
      {
        size: 18,
        className:
          "transition-transform duration-300 group-hover:-translate-x-1",
      },
    );


  const secondary =
    hero.ctaSecondary
    ||
    HERO.ctaSecondary;

  const secondaryLink =
    hero.ctaSecondaryLink
    ||
    "/portfolio";

  const secondaryIcon =
    createElement(
      resolveIcon(hero.ctaSecondaryIcon, Play),
      { size: 17 },
    );



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


      <Link href={primaryLink}

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

        {primary}


        {primaryIcon}


      </Link>

      <Link href={secondaryLink}

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
          bg-white/20
          transition-all
          duration-300
          hover:bg-white/30
        "

        style={{
          borderColor:
          "var(--color-border)"
        }}

      >

        {secondaryIcon}

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

  const titlePrefix =
    settings.content?.hero?.titlePrefix
    ||
    "ومن";

  const titleHighlight =
    settings.content?.hero?.titleHighlight
    ||
    "أول السطر،";

  const titleSuffix =
    settings.content?.hero?.titleSuffix
    ||
    "هنبدأ حكايات جديدة..";


  const stats =
    settings.stats?.length
    ? settings.stats
    : HERO_CONFIG.stats;



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


        {" "}
        {titlePrefix}
        {" "}


        <HighlightText>
          {titleHighlight}
        </HighlightText>


        <br/>


        <span
          className="
            text-ink/90
          "
        >
          {titleSuffix}
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
          stats
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

  const { settings } = useSettings();
  const heroContent = settings.content?.hero || {};
  const showcaseDefaults = HERO_CONFIG.showcase;

  const campaign = {
    title: heroContent.campaign?.title || showcaseDefaults.campaign.title,
    text: heroContent.campaign?.text || showcaseDefaults.campaign.text,
    likes: heroContent.campaign?.likes || showcaseDefaults.campaign.likes,
    comments: heroContent.campaign?.comments || showcaseDefaults.campaign.comments,
  };

  const analytics = {
    title: heroContent.analytics?.title || showcaseDefaults.analytics.title,
    growth: heroContent.analytics?.growth || showcaseDefaults.analytics.growth,
    text: heroContent.analytics?.text || showcaseDefaults.analytics.text,
  };

  const growth = {
    value: heroContent.growth?.value || showcaseDefaults.growth.value,
    label: heroContent.growth?.label || showcaseDefaults.growth.label,
    period: heroContent.growth?.period || showcaseDefaults.growth.period,
  };


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
        isolate
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