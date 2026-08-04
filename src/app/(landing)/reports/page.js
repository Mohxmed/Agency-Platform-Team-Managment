import { Container } from "@/features/landing";
import { MessageSquare, Lightbulb, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "الشكاوى والاقتراحات",
  description:
    "صفحة استقبال الشكاوى والاقتراحات الخاصة بوكالة نقطة. شاركنا ملاحظاتك وساعدنا على تحسين خدماتنا.",
  keywords: [
    "الشكاوى",
    "الاقتراحات",
    "آراء العملاء",
    "نقطة",
  ],
  path: "/reports",
});


export default function ComplaintsPage() {

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        py-24
      "
    >


      {/* Background */}

      <div
        className="
          absolute
          inset-0
          -z-10

          bg-gradient-to-b
          from-primary-600/10
          via-transparent
          to-transparent

          dark:from-primary-500/10
        "
      />


      <div
        className="
          absolute
          -top-40
          end-0
          -z-10

          w-[500px]
          h-[500px]

          rounded-full

          [background:radial-gradient(circle,rgba(217,4,41,0.10),transparent_62%)]
        "
      />




      <Container>


        <section

          className="
            max-w-4xl
            mx-auto

            rounded-[36px]

            border
            border-black/5
            dark:border-white/10

            bg-white/85
            dark:bg-white/[0.06]

            shadow-[0_30px_100px_rgba(0,0,0,0.08)]
            dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]

            p-8
            sm:p-12
          "

        >



          {/* Header */}

          <header className="mb-12">


            <span

              className="
                inline-flex

                px-4
                py-2

                rounded-full

                text-sm
                font-semibold

                bg-primary-600/10
                dark:bg-primary-500/20

                text-primary-600
                dark:text-primary-400
              "

            >

              الشكاوى والاقتراحات

            </span>





            <h1

              className="
                mt-6

                text-3xl
                sm:text-5xl

                font-black

                tracking-tight

                text-ink
                dark:text-white
              "

            >

              نسمعك ونطور معك

            </h1>





            <p

              className="
                mt-6

                text-base
                sm:text-lg

                leading-relaxed

                text-muted
                dark:text-white/60
              "

            >

              نؤمن في نقطة بأن أفضل الأفكار تأتي من الاستماع
              لعملائنا وشركائنا. شاركنا ملاحظاتك أو اقتراحاتك
              لمساعدتنا على تقديم تجربة وخدمات أفضل.

            </p>


          </header>







          {/* Cards */}

          <div

            className="
              grid
              sm:grid-cols-3
              gap-5
              mb-12
            "

          >


            <div

              className="
                rounded-3xl
                border

                border-black/5
                dark:border-white/10

                bg-white/50
                dark:bg-white/[0.05]

                p-5
              "

            >

              <MessageSquare
                className="
                  text-primary-600
                  mb-4
                "
                size={24}
              />


              <h3

                className="
                  font-bold
                  text-ink
                  dark:text-white
                  mb-2
                "

              >

                الشكاوى

              </h3>


              <p
                className="
                  text-sm
                  text-muted
                  dark:text-white/60
                "
              >

                نراجع جميع الملاحظات ونعمل على حل أي مشكلة
                تواجهك بأفضل طريقة ممكنة.

              </p>


            </div>






            <div

              className="
                rounded-3xl
                border

                border-black/5
                dark:border-white/10

                bg-white/50
                dark:bg-white/[0.05]

                p-5
              "

            >

              <Lightbulb
                className="
                  text-primary-600
                  mb-4
                "
                size={24}
              />


              <h3

                className="
                  font-bold
                  text-ink
                  dark:text-white
                  mb-2
                "

              >

                الاقتراحات

              </h3>


              <p

                className="
                  text-sm
                  text-muted
                  dark:text-white/60
                "

              >

                أفكارك تساعدنا على تحسين خدماتنا وتطوير
                حلول أكثر تأثيراً.

              </p>


            </div>







            <div

              className="
                rounded-3xl
                border

                border-black/5
                dark:border-white/10

                bg-white/50
                dark:bg-white/[0.05]

                p-5
              "

            >

              <ShieldCheck
                className="
                  text-primary-600
                  mb-4
                "
                size={24}
              />


              <h3

                className="
                  font-bold
                  text-ink
                  dark:text-white
                  mb-2
                "

              >

                الخصوصية

              </h3>


              <p

                className="
                  text-sm
                  text-muted
                  dark:text-white/60
                "

              >

                نتعامل مع جميع البلاغات والملاحظات بسرية
                واهتمام كامل.

              </p>


            </div>


          </div>







          {/* Contact Box */}

          <div

            className="
              rounded-3xl

              border
              border-primary-600/20

              bg-primary-600/5

              dark:bg-primary-500/10

              p-6
            "

          >


            <h2

              className="
                text-xl
                font-bold

                text-ink
                dark:text-white

                mb-3
              "

            >

              كيف يمكنك التواصل؟

            </h2>



            <p

              className="
                text-muted
                dark:text-white/60

                leading-relaxed
              "

            >

              يمكنك إرسال شكواك أو اقتراحك من خلال نموذج
              التواصل الموجود بالموقع، وسيتولى فريق نقطة
              مراجعتها والرد عليك في أقرب وقت ممكن.

            </p>


          </div>







          <footer

            className="
              mt-12

              pt-6

              border-t

              border-black/5
              dark:border-white/10

              text-sm

              text-muted
              dark:text-white/50
            "

          >

            © {new Date().getFullYear()} نقطة.
            جميع الحقوق محفوظة.

          </footer>



        </section>


      </Container>


    </main>

  );

}