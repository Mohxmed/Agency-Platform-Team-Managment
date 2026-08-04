"use client";

import { motion } from "framer-motion";

import { useClients } from "@/features/landing/hooks/useClients";

import Button from "@/shared/ui/buttons/Buttons";
import ClientCard from "@/shared/ui/cards/ClientCard";
import SwiperFadeEdges from "@/features/landing/components/SwiperFadeEdges";
import Marquee from "@/features/landing/components/Marquee";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import SectionTitle from "@/features/landing/layout/SectionTitle";
import { Container } from "@/features/landing";

import {
  Users,
  ArrowLeft,
} from "lucide-react";

import {
  HomeClientsSkeleton,
} from "@/shared/ui/skeletons/Skeletons";

import {
  ROUTES,
} from "@/constants/routes";

import {
  useSettings,
} from "@/contexts/SettingsContext";


/* =========================================================
   MOTION SYSTEM
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
    y:28,
  },


  visible:{

    opacity:1,

    y:0,

    transition:{
      duration:.75,
      ease:easing,
    },

  },

};



const container = {

  hidden:{},


  visible:{

    transition:{
      staggerChildren:.12,
    },

  },

};



/* =========================================================
   DEFAULT CONTENT
========================================================= */


const CLIENTS_DEFAULTS = {

  badge:
  "شركاء النجاح",


  title:
  "أبرز",


  redTitle:
  "شركائنا",


  description:
  "خلف كل نجاح قصة، وخلف كل قصة شراكة حقيقية. نساعد العلامات وصناع المحتوى على بناء حضور أقوى وتأثير يصل للجمهور المناسب.",


  primary:
  "تصفح جميع العملاء",


  secondary:
  "ابدأ معنا",


};



/* =========================================================
   PREMIUM CARD MOTION
========================================================= */


const cardMotion = {

  hidden:{
    opacity:0,
    scale:.96,
  },


  visible:{

    opacity:1,

    scale:1,

    transition:{
      duration:.7,
      ease:easing,
    },

  },

};
export default function ClientsSection(){

  const {
    clients,
    loading,
    error,
  } = useClients();


  const {
    settings,
  } = useSettings();



  const content =
    settings.content?.clients || {};



  const badge =
    content.badge
    ||
    CLIENTS_DEFAULTS.badge;



  const title =
    content.title
    ||
    CLIENTS_DEFAULTS.title;



  const redTitle =
    content.redTitle
    ||
    CLIENTS_DEFAULTS.redTitle;



  const description =
    content.description
    ||
    CLIENTS_DEFAULTS.description;



  const ctaPrimary =
    content.ctaPrimary
    ||
    CLIENTS_DEFAULTS.primary;



  const ctaPrimaryLink =
    content.ctaPrimaryLink
    ||
    ROUTES.CLIENTS;



  const ctaSecondary =
    content.ctaSecondary
    ||
    CLIENTS_DEFAULTS.secondary;



  const ctaSecondaryLink =
    content.ctaSecondaryLink
    ||
    ROUTES.CONTACT;



  return (

    <section

      id="clients"

      className="
        relative
        isolate
        overflow-hidden
        py-24
      "

    >


      {/* Premium background */}


      <div

        className="
          absolute
          inset-0
          -z-10
          bg-background
        "

      />



      <div

        className="
          pointer-events-none
          absolute
          -top-40
          left-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          opacity-20
        "

        style={{

          background:
          "radial-gradient(circle, rgba(217,4,41,.25), transparent 70%)"

        }}

      />



      <div

        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-32
          bg-gradient-to-t
          from-black/[0.03]
          to-transparent
        "

      />





      <Container>


        {/* HEADER */}


        <motion.div

          variants={container}

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:true,
            amount:.3,
          }}

          className="
            mx-auto
            max-w-3xl
            text-center
          "

        >


          <motion.div

            variants={reveal}

            className="
              flex
              justify-center
            "

          >


            <OutlinedBadge>

              <Users
                size={15}
              />

              {badge}

            </OutlinedBadge>


          </motion.div>




          <motion.div

            variants={reveal}

            className="
              mt-6
            "

          >

            <SectionTitle

              title={title}

              redTitle={redTitle}

            >

              {description}

            </SectionTitle>


          </motion.div>


        </motion.div>

                {/* CLIENTS CONTENT */}


        <motion.div

          variants={reveal}

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:true,
            amount:.15,
          }}

          className="
            mt-14
          "

        >



          {/* Loading */}


          {loading && (

            <HomeClientsSkeleton/>

          )}




          {/* Error */}


          {!loading && error && (

            <div

              className="
                flex
                min-h-[240px]
                items-center
                justify-center
                text-center
              "

            >

              <p

                className="
                  text-sm
                  text-muted
                "

              >

                تعذر تحميل بيانات العملاء حاليًا.

              </p>


            </div>

          )}






          {/* Empty */}


          {!loading &&
          !error &&
          clients.length === 0 && (

            <div

              className="
                flex
                min-h-[240px]
                flex-col
                items-center
                justify-center
                text-center
              "

            >

              <Users

                className="
                  h-10
                  w-10
                  text-muted
                "

              />


              <p

                className="
                  mt-4
                  text-sm
                  text-muted
                "

              >

                لا يوجد عملاء حتى الآن.

              </p>


            </div>

          )}







          {/* Clients Marquee */}



          {!loading &&
          !error &&
          clients.length > 0 && (


            <SwiperFadeEdges>


              <Marquee

                slideClassName="
                  h-full
                  px-3
                  py-8
                "

              >


                {
                  clients.map(
                    client => (

                      <motion.div

                        key={client.id}

                        variants={cardMotion}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                          once:true,
                          amount:.2,
                        }}

                      >

                        <ClientCard

                          teacher={client}

                        />


                      </motion.div>

                    )
                  )
                }


              </Marquee>


            </SwiperFadeEdges>


          )}



        </motion.div>







        {/* CTA */}



        <motion.div

          variants={reveal}

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:true,
          }}

          className="
            mt-12
            flex
            flex-col
            items-center
            justify-center
            gap-4
            sm:flex-row
          "

        >



          <Button

            href={ctaPrimaryLink}

            variant="outline"

          >

            <Users size={17}/>

            {ctaPrimary}


          </Button>





          <Button

            href={ctaSecondaryLink}

          >

            {ctaSecondary}


            <ArrowLeft

              size={17}

            />


          </Button>




        </motion.div>




      </Container>


    </section>

  );

}