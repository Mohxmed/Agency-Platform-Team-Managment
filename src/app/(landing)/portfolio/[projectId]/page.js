"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MoveUpLeft,
  Layers,
  CalendarDays,
  Images,
} from "lucide-react";

import { Container } from "@/features/landing";
import ProjectGallery from "@/features/landing/components/ProjectGallery";

import { useWorks } from "@/features/landing/hooks/useWorks";
import { ProjectDetailSkeleton } from "@/shared/ui/skeletons/Skeletons";


/* =========================================================
   MOTION SYSTEM
========================================================= */

const pageMotion = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};


const reveal = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: "blur(8px)",
  },

  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};


const scaleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};



export default function ProjectPage({ params }) {
  const { works, categories, loading } = useWorks();

  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;

      setProjectId(resolvedParams?.projectId || null);
    }

    resolveParams();
  }, [params]);
  /* =========================================================
      PROJECT
  ========================================================= */

  const project = useMemo(() => {

    if (!projectId || !Array.isArray(works)) {
      return null;
    }


return works.find((item) => {
  const itemLink = String(item.link || "")
    .replaceAll("/", "")
    .trim();

  const currentId = String(projectId || "")
    .replaceAll("/", "")
    .trim();

  return itemLink === currentId;
});
  }, [works, projectId]);




  /* =========================================================
      CATEGORY
  ========================================================= */


  const categoryName = useMemo(() => {

    if (!project) return "PROJECT";


    const value = project.category;



    if (
      value &&
      typeof value === "object"
    ) {
      return (
        value.name ||
        value.title ||
        value.label ||
        "PROJECT"
      );
    }



    if (project.categoryName) {
      return project.categoryName;
    }



    if (Array.isArray(categories)) {

      const found = categories.find((item)=>{

        const id =
          item.id ||
          item.categoryId ||
          item.uid ||
          item._id;


        return (
          String(id) ===
          String(value || project.categoryId)
        );

      });


      if(found){

        return (
          found.name ||
          found.title ||
          found.label ||
          "PROJECT"
        );

      }

    }



    return value || "PROJECT";


  },[
    project,
    categories
  ]);





  /* =========================================================
      GALLERY
  ========================================================= */


  const gallery = useMemo(()=>{


    if(!project)
      return [];


    if(
      Array.isArray(project.gallery) &&
      project.gallery.length
    ){

      return project.gallery.filter(Boolean);

    }


    return project.image
      ? [project.image]
      : [];


  },[
    project
  ]);





  /* =========================================================
      LOADING
  ========================================================= */


  if(loading){

    return (
      <main
        dir="rtl"
        className="
          min-h-screen
          bg-white
          dark:bg-background
        "
      >

        <Container>
          <ProjectDetailSkeleton/>
        </Container>


      </main>
    );

  }




  /* =========================================================
      NOT FOUND
  ========================================================= */


  if(!project){

    return (

      <main
        dir="rtl"
        className="
          min-h-screen
          bg-white
          dark:bg-background
        "
      >

        <Container>

          <div
            className="
              flex
              min-h-[600px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-primary-500/10
                text-primary-600
              "
            >

              <Sparkles size={30}/>

            </div>



            <h1
              className="
                text-3xl
                font-black
                text-black
                dark:text-white
              "
            >
              المشروع غير موجود
            </h1>



            <p
              className="
                mt-4
                max-w-md
                text-sm
                leading-8
                text-black/50
                dark:text-white/50
              "
            >
              يبدو أن المشروع غير متاح حاليا أو الرابط غير صحيح.
            </p>



            <Link
              href="/portfolio"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-7
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-primary-600
              "
            >

              <ArrowRight size={17}/>

              العودة للأعمال

            </Link>


          </div>


        </Container>


      </main>

    );

  }





  return (

    <motion.main

      initial="hidden"
      animate="show"
      variants={pageMotion}

      dir="rtl"

      className="
        min-h-screen
        overflow-hidden
        bg-white
        pb-28
        dark:bg-background
      "

    >


      {/* ================= HEADER ================= */}


      <section className="pt-8">

        <Container>


          <motion.div
            variants={reveal}

            className="
              flex
              items-center
              justify-between
            "
          >

            <Link

              href="/portfolio"

              className="
                group
                flex
                items-center
                gap-2
                text-sm
                text-black/50
                dark:text-white/50
              "

            >

              <ArrowRight
                size={17}
                className="
                  transition
                  group-hover:translate-x-1
                "
              />

              العودة للأعمال


            </Link>



            <div
              className="
                hidden
                items-center
                gap-3
                text-xs
                text-black/30
                sm:flex
                dark:text-white/40
              "
            >

              الرئيسية

              <span>/</span>

              الأعمال

              <span>/</span>

              {project.title}


            </div>


          </motion.div>


        </Container>


      </section>





      {/* ================= HERO ================= */}



      <section
        className="
          pt-16
          sm:pt-24
        "
      >

        <Container>


          <motion.div
            variants={pageMotion}

            className="
              relative
            "
          >


            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-20
                text-[12rem]
                font-black
                leading-none
                tracking-[-0.08em]
                text-black/[0.03]
                dark:text-white/[0.03]
              "
            >

              0{String(project.id || "").slice(-1)}


            </div>



            <div
              className="
                relative
                grid
                gap-12
                lg:grid-cols-[1fr_260px]
                lg:items-end
              "
            >


              <div>


                <motion.div
                  variants={reveal}

                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-black/10
                    bg-white/60
                    px-4
                    py-2
                    text-xs
                    font-bold
                    backdrop-blur-xl
                    dark:border-white/10
                    dark:bg-white/5
                  "
                >

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-primary-600
                    "
                  />

                  {categoryName}


                </motion.div>




                <motion.h1
                  variants={reveal}

                  className="
                    mt-7
                    max-w-5xl
                    text-5xl
                    font-black
                    leading-[25]
                    tracking-[-0.05em]
                    text-black
                    sm:text-6xl
                    lg:text-8xl
                    dark:text-white
                  "
                >

                  {project.title}


                </motion.h1>



                {project.description && (

                  <motion.p
                    variants={reveal}

                    className="
                      mt-8
                      max-w-2xl
                      text-base
                      leading-8
                      text-black/50
                      dark:text-white/60
                    "
                  >

                    {project.description}

                  </motion.p>

                )}


              </div>



                <InfoItem
                  icon={<CalendarDays/>}
                  title="السنة"
                  value={project.year || "—"}
                />


                <InfoItem
                  icon={<Layers/>}
                  title="التصنيف"
                  value={categoryName}
                />

      
            </div>


          </motion.div>


        </Container>


      </section>
            {/* ================= COVER IMAGE ================= */}

      {project.image && (
        <motion.section
          variants={scaleReveal}
          className="
            mt-16
            sm:mt-24
          "
        >
          <Container>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[2.5rem]
                border
                border-black/10
                bg-neutral-100
                shadow-[0_30px_100px_rgba(0,0,0,0.08)]
                dark:border-white/10
                dark:bg-card
              "
            >

              <div
                className="
                  relative
                  aspect-[16/9]
                  overflow-hidden
                "
              >

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  sizes="100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    ease-out
                    group-hover:scale-[1.04]
                  "
                />


                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/50
                    via-transparent
                    to-transparent
                  "
                />


                {/* Glass Badge */}

                <div
                  className="
                    absolute
                    bottom-6
                    right-6
                    flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-white
                    backdrop-blur-xl
                  "
                >

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-primary-400
                      shadow-[0_0_15px_rgba(234,179,8,.8)]
                    "
                  />

                  عرض المشروع

                </div>


              </div>


            </div>


          </Container>

        </motion.section>
      )}





      {/* ================= GALLERY ================= */}


      {gallery.length > 0 && (

        <section
          className="
            mt-20
            sm:mt-32
          "
        >

          <Container>


            <motion.div
              variants={reveal}
              className="mb-10"
            >


              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-xs
                  font-bold
                  tracking-[.25em]
                  text-primary-600
                "
              >

                <span>
                  01
                </span>


                <span
                  className="
                    h-px
                    w-12
                    bg-primary-600/40
                  "
                />


                <span
                  className="
                    text-black/40
                    dark:text-white/40
                  "
                >
                  GALLERY
                </span>


              </div>



              <h2
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-black
                  sm:text-5xl
                  dark:text-white
                "
              >

                تفاصيل المشروع

              </h2>



            </motion.div>




            <ProjectGallery
              images={gallery}
              title={project.title}
            />




            <div
              className="
                mt-5
                flex
                justify-between
                text-xs
                text-black/40
                dark:text-white/40
              "
            >

              <span>
                اضغط على الصورة للعرض الكامل
              </span>


              <span>
                {gallery.length} صور
              </span>


            </div>


          </Container>


        </section>

      )}






      {/* ================= PROJECT META ================= */}


      <Container>

        <motion.section
          variants={reveal}

          className="
            mt-20
            overflow-hidden
            rounded-[2rem]
            border
            border-black/10
            bg-white/50
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-white/[0.03]
          "
        >


          <div
            className="
              grid
              grid-cols-1
              divide-y
              divide-black/10
              sm:grid-cols-3
              sm:divide-x
              sm:divide-y-0
              dark:divide-white/10
            "
          >


            <MetaCard

              icon={<Layers size={20}/>}

              title="التصنيف"

              value={categoryName}

            />



            <MetaCard

              icon={<CalendarDays size={20}/>}

              title="سنة التنفيذ"

              value={project.year || "غير محدد"}

            />



            <MetaCard

              icon={<Images size={20}/>}

              title="عدد الصور"

              value={`${gallery.length} صور`}

            />


          </div>



        </motion.section>


      </Container>

      {/* ================= PROJECT STORY ================= */}


<Container>

  <motion.section
    variants={reveal}
    className="
      mt-24
      sm:mt-36
    "
  >

    <div
      className="
        grid
        gap-12
        lg:grid-cols-[0.7fr_1.3fr]
        lg:gap-24
      "
    >


      {/* TITLE */}

      <div>


        <div
          className="
            flex
            items-center
            gap-3
            text-xs
            font-bold
            tracking-[.25em]
            text-primary-600
          "
        >

          <span>
            02
          </span>


          <span
            className="
              h-px
              w-12
              bg-primary-600/40
            "
          />


          <span
            className="
              text-black/40
              dark:text-white/40
            "
          >
            ABOUT PROJECT
          </span>


        </div>



        <h2
          className="
            mt-6
            max-w-md
            text-3xl
            font-black
            leading-tight
            text-black
            sm:text-5xl
            dark:text-white
          "
        >

          الفكرة تبدأ من التفاصيل.

        </h2>


      </div>




      {/* CONTENT */}


      <div
        className="
          max-w-3xl
        "
      >

        <p
          className="
            text-lg
            leading-9
            text-black/60
            dark:text-white/70
          "
        >

          {project.description ||
          "كل مشروع هو تجربة مختلفة تجمع بين الاستراتيجية، التصميم، والهوية البصرية لصناعة تأثير حقيقي."}

        </p>


      </div>


    </div>


  </motion.section>


</Container>






{/* ================= CTA ================= */}



<Container>


  <motion.section
    variants={scaleReveal}

    className="
      mt-24
      sm:mt-36
    "
  >


    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[2.5rem]
        bg-primary-600
        px-7
        py-12
        sm:px-14
        sm:py-16
      "
    >


      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-72
          w-72
          rounded-full
          bg-white/20
          blur-3xl
          transition
          duration-700
          group-hover:scale-125
        "
      />



      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-0
          h-80
          w-80
          rounded-full
          bg-black/20
          blur-3xl
        "
      />




      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-start
          justify-between
          gap-8
          sm:flex-row
          sm:items-center
        "
      >


        <div>


          <p
            className="
              text-sm
              text-white/60
            "
          >
            هل لديك مشروع مشابه؟
          </p>



          <h3
            className="
              mt-3
              max-w-xl
              text-3xl
              font-black
              leading-tight
              text-white
              sm:text-5xl
            "
          >

            دعنا نصنع تجربة تستحق الظهور.

          </h3>


        </div>




        <Link

          href="/contact"

          className="
            group/btn
            inline-flex
            items-center
            gap-3
            rounded-full
            bg-white
            px-7
            py-4
            text-sm
            font-black
            text-black
            transition-all
            duration-300
            hover:bg-black
            hover:text-white
          "

        >

          ابدأ مشروعك


          <ArrowLeft

            size={18}

            className="
              transition-transform
              group-hover/btn:-translate-x-1
            "

          />


        </Link>


      </div>


    </div>


  </motion.section>


</Container>






{/* ================= FOOTER NAV ================= */}



<Container>


  <motion.section

    variants={reveal}

    className="
      mt-20
      border-t
      border-black/10
      pt-10
      dark:border-white/10
    "

  >


    <div
      className="
        flex
        flex-col
        gap-6
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >



      <div>


        <p
          className="
            text-xs
            text-black/40
            dark:text-white/40
          "
        >
          المزيد من المشاريع
        </p>



        <h3
          className="
            mt-2
            text-2xl
            font-black
            text-black
            dark:text-white
          "
        >

          استكشف أعمالنا الأخرى

        </h3>


      </div>




      <Link

        href="/portfolio"

        className="
          group
          inline-flex
          w-fit
          items-center
          gap-3
          rounded-full
          border
          border-black/10
          px-6
          py-3
          text-sm
          font-bold
          text-black
          transition-all
          duration-300
          hover:bg-black
          hover:text-white
          dark:border-white/10
          dark:text-white
          dark:hover:bg-white
          dark:hover:text-black
        "

      >

        جميع الأعمال


        <MoveUpLeft

          size={17}

          className="
            transition-transform
            duration-300
            group-hover:-translate-x-1
            group-hover:-translate-y-1
          "

        />


      </Link>



    </div>



  </motion.section>


</Container></motion.main>
);
}
function InfoItem({icon,title,value}) {

  return (

    <div className="mb-6 last:mb-0">

      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          text-black/40
          dark:text-white/40
        "
      >

        {icon}

        {title}

      </div>


      <p
        className="
          mt-2
          text-sm
          font-bold
          text-black
          dark:text-white
        "
      >
        {value}
      </p>


    </div>

  );

}



function MetaCard({icon,title,value}) {

  return (

    <div
      className="
        flex
        items-center
        gap-4
        p-6
        sm:p-8
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
          bg-primary-500/10
          text-primary-600
        "
      >

        {icon}

      </div>



      <div>

        <p
          className="
            text-xs
            text-black/40
            dark:text-white/40
          "
        >
          {title}
        </p>


        <p
          className="
            mt-1
            text-sm
            font-bold
            text-black
            dark:text-white
          "
        >
          {value}
        </p>


      </div>


    </div>

  );

}