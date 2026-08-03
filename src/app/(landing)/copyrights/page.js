import { Container } from "@/features/landing";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "حقوق النشر",
  description:
    "حقوق النشر والملكية الفكرية الخاصة بوكالة نقطة، وشروط استخدام المحتوى والعلامة التجارية.",
  keywords: [
    "حقوق النشر",
    "الملكية الفكرية",
    "العلامة التجارية",
    "نقطة",
  ],
  path: "/copyrights",
});


export default function CopyrightPage() {

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        py-24
      "
    >


      {/* Background Glow */}

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
          blur-3xl

          bg-primary-600/10
          dark:bg-primary-500/10
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

            bg-white/70
            dark:bg-white/[0.06]

            backdrop-blur-2xl

            shadow-[0_30px_100px_rgba(0,0,0,0.08)]
            dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]

            p-8
            sm:p-12
          "

        >


          {/* Header */}

          <div
            className="
              mb-12
            "
          >

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

              حقوق النشر

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

              جميع الحقوق محفوظة

            </h1>




            <p

              className="
                mt-6

                max-w-3xl

                text-base
                sm:text-lg

                leading-relaxed

                text-muted
                dark:text-white/60
              "

            >

              جميع المحتويات والتصاميم والمواد الإبداعية الموجودة
              على موقع وكالة نقطة مملوكة للوكالة ومحمية بموجب
              قوانين حقوق الملكية الفكرية.

            </p>


          </div>






          {/* Content */}

          <div

            className="
              space-y-10

              text-muted
              dark:text-white/60

              leading-relaxed
            "

          >



            <article>


              <h2

                className="
                  mb-3

                  text-xl

                  font-bold

                  text-ink
                  dark:text-white
                "

              >

                الملكية الفكرية

              </h2>



              <p>

                تشمل حقوق الملكية الفكرية جميع التصاميم،
                الهوية البصرية، النصوص، الصور، الرسومات،
                الأكواد، والعناصر الإبداعية الخاصة بوكالة نقطة.

              </p>


            </article>






            <article>


              <h2

                className="
                  mb-3

                  text-xl

                  font-bold

                  text-ink
                  dark:text-white
                "

              >

                استخدام المحتوى

              </h2>



              <p>

                لا يسمح بإعادة استخدام أو نسخ أو تعديل أي جزء
                من محتوى الموقع أو الخدمات المقدمة دون الحصول
                على إذن كتابي مسبق من وكالة نقطة.

              </p>


            </article>








            <article>


              <h2

                className="
                  mb-3

                  text-xl

                  font-bold

                  text-ink
                  dark:text-white
                "

              >

                العلامة التجارية

              </h2>



              <p>

                اسم وشعار وهوية نقطة تعد من الأصول التجارية
                الخاصة بالوكالة، ولا يجوز استخدامها بأي شكل
                يوحي بوجود شراكة أو اعتماد رسمي دون موافقة.

              </p>


            </article>








            <article>


              <h2

                className="
                  mb-3

                  text-xl

                  font-bold

                  text-ink
                  dark:text-white
                "

              >

                التواصل

              </h2>



              <p>

                لأي استفسارات متعلقة بحقوق النشر أو استخدام
                المحتوى، يرجى التواصل مع فريق وكالة نقطة.

              </p>


            </article>



          </div>







          {/* Footer */}

          <div

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

          </div>




        </section>


      </Container>


    </main>

  );

}