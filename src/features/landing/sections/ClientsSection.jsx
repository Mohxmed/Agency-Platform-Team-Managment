"use client";

import { motion } from "framer-motion";

import { useClients } from "@/features/landing/hooks/useClients";

import Button from "@/shared/ui/buttons/Buttons";
import ClientCard from "@/shared/ui/cards/ClientCard";

import SwiperFadeEdges from "@/features/landing/components/SwiperFadeEdges";
import Marquee from "@/features/landing/components/Marquee";

import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import SectionTitle from "@/features/landing/layout/SectionTitle";

import {
  Container,
} from "@/features/landing";


import {
  Star,
  Users,
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



/* =====================================================
   MOTION
===================================================== */


const reveal = {

  hidden:{
    opacity:0,
    y:30,
  },


  visible:{

    opacity:1,

    y:0,


    transition:{

      duration:.7,

      ease:[
        .22,
        1,
        .36,
        1,
      ],

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




/* =====================================================
   SECTION
===================================================== */


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
  content.badge ||
  "شركاء النجاح";



  const title =
  content.title ||
  "أبرز";



  const redTitle =
  content.redTitle ||
  "شركائنا";



  const description =
  content.description ||
  "نبني شراكات حقيقية مع صناع المحتوى والعلامات التجارية ونحول الأفكار إلى تأثير ملموس.";



  const ctaPrimary =
  content.ctaPrimary ||
  "تصفح جميع العملاء";



  const ctaPrimaryLink =
  content.ctaPrimaryLink ||
  ROUTES.CLIENTS;



  const ctaSecondary =
  content.ctaSecondary ||
  "انضم إلينا";



  const ctaSecondaryLink =
  content.ctaSecondaryLink ||
  ROUTES.CONTACT;



  return (

<section

id="clients"

className="
relative
isolate
overflow-hidden
bg-gradient-to-br
from-primary-700
via-primary-600
to-primary-900
py-20
"


>


{/* GLOWS */}


<div

className="
pointer-events-none
absolute
-left-60
top-1/2
h-[480px]
w-[480px]
-translate-y-1/2
rounded-full
opacity-40
[background:radial-gradient(circle,rgba(255,255,255,.18),transparent_70%)]
"

/>



<div

className="
pointer-events-none
absolute
-right-60
top-1/3
h-[520px]
w-[520px]
rounded-full
opacity-30
[background:radial-gradient(circle,rgba(255,255,255,.16),transparent_70%)]
"

/>



<Container>


<motion.div

variants={container}

initial="hidden"

whileInView="visible"

viewport={{
once:true,
amount:.2,
}}

className="
mx-auto
max-w-3xl
text-center
"

>


<motion.div variants={reveal}>


<OutlinedBadge variant="white">

<Users size={16}/>

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

variant="light"

title={title}

redTitle={redTitle}

>

{description}

</SectionTitle>


</motion.div>


</motion.div>


</Container>
{/* =====================================================
    FULL WIDTH SLIDER
===================================================== */}


<div

className="
relative
mt-12
w-full
"

>


<div

className="
mx-auto
w-full
max-w-[1500px]
"

>


<motion.div

variants={reveal}

initial="hidden"

whileInView="visible"

viewport={{
once:true,
amount:.15,
}}

>


{/* LOADING */}

{
loading && (

<HomeClientsSkeleton/>

)
}




{/* ERROR */}

{
!loading && error && (

<div

className="
flex
min-h-[260px]
items-center
justify-center
text-center
text-white
"

>

<div>


<p

className="
text-sm
font-bold
text-white/80
"

>

تعذر تحميل بيانات العملاء حاليًا.

</p>



<p

className="
mt-2
text-xs
text-white/50
"

>

حاول تحديث الصفحة مرة أخرى.

</p>


</div>


</div>

)
}





{/* EMPTY */}

{
!loading &&
!error &&
clients.length === 0 && (

<div

className="
flex
min-h-[260px]
items-center
justify-center
text-center
text-white
"

>


<div>


<Users

className="
mx-auto
h-10
w-10
text-white/40
"

/>



<p

className="
mt-4
text-sm
font-bold
text-white/70
"

>

لا يوجد عملاء حتى الآن.

</p>


</div>


</div>

)
}





{/* CLIENTS */}


{
!loading &&
!error &&
clients.length > 0 && (

<SwiperFadeEdges>


<Marquee

slideClassName="
h-full
px-4
py-8
"

>


{
clients.map(

(client)=>(


<motion.div

key={client.id}


initial={{

opacity:0,

y:20,

}}



whileInView={{

opacity:1,

y:0,

}}



viewport={{

once:true,

amount:.1,

}}



transition={{

duration:.6,

ease:[

.22,

1,

.36,

1

],

}}



className="
h-full
"

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


)
}




</motion.div>


</div>


</div>
{/* =====================================================
    CTA
===================================================== */}


<Container>


<motion.div

initial={{

opacity:0,

y:25,

}}



whileInView={{

opacity:1,

y:0,

}}



viewport={{

once:true,

amount:.3,

}}



transition={{

duration:.7,

ease:[

.22,

1,

.36,

1

],

}}



className="
mt-10
flex
flex-col
items-center
justify-center
gap-4
sm:flex-row
"

>


<motion.div

whileHover={{

y:-3,

}}

whileTap={{

scale:.97,

}}

>


<Button

variant="outline"

href={ctaPrimaryLink}

>

<Users size={18}/>

{ctaPrimary}


</Button>


</motion.div>




<motion.div

whileHover={{

y:-3,

}}

whileTap={{

scale:.97,

}}

>


<Button

href={ctaSecondaryLink}

>


<Star size={18}/>


{ctaSecondary}


</Button>


</motion.div>



</motion.div>


</Container>


</section>

  );

}
