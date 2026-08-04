import { Container } from "@/features/landing";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "اتفاقية الاستخدام",
  description:
    "اتفاقية الاستخدام والشروط العامة الخاصة بوكالة نقطة واستخدام خدماتها.",
  keywords: [
    "اتفاقية الاستخدام",
    "شروط الاستخدام",
    "نقطة",
  ],
  path: "/terms-of-use",
});


export default function TermsPage() {

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

              اتفاقية الاستخدام

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

              شروط استخدام موقع نقطة

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

              باستخدامك لموقع وكالة نقطة أو أي من خدماتها،
              فإنك توافق على الالتزام بالشروط والأحكام
              الموضحة في هذه الاتفاقية.

            </p>


          </header>






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

                قبول الاتفاقية

              </h2>



              <p>

                عند تصفح الموقع أو استخدام أي من الخدمات
                المقدمة من وكالة نقطة، فإنك تقر بقراءة
                وفهم هذه الاتفاقية والموافقة على جميع
                البنود الواردة بها.

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

                استخدام الموقع

              </h2>



              <p>

                يلتزم المستخدم باستخدام الموقع والخدمات
                المقدمة للأغراض المشروعة فقط، وعدم القيام
                بأي نشاط قد يؤدي إلى تعطيل الموقع أو التأثير
                على تجربة المستخدمين الآخرين.

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

                خدمات الوكالة

              </h2>



              <p>

                تقدم وكالة نقطة خدمات التسويق، صناعة المحتوى،
                بناء الهوية التجارية، التصميم، والخدمات
                الرقمية الأخرى وفقاً للاتفاقيات المبرمة مع
                العملاء.

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

                مسؤولية المستخدم

              </h2>



              <p>

                يتحمل المستخدم مسؤولية صحة المعلومات التي
                يقدمها، وعدم استخدام الموقع بطريقة تخالف
                القوانين أو تنتهك حقوق الآخرين.

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

                حقوق الملكية

              </h2>



              <p>

                جميع المحتويات والعناصر الإبداعية الخاصة
                بوكالة نقطة، بما في ذلك الهوية البصرية،
                التصاميم، النصوص، والمواد الرقمية، محمية
                بحقوق الملكية الفكرية.

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

                تعديل الاتفاقية

              </h2>



              <p>

                تحتفظ وكالة نقطة بحق تعديل أو تحديث بنود
                اتفاقية الاستخدام في أي وقت بما يتناسب مع
                تطورات الخدمات أو المتطلبات القانونية.

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

                إخلاء المسؤولية

              </h2>



              <p>

                تسعى وكالة نقطة لتقديم معلومات وخدمات دقيقة،
                ولكن لا تضمن خلو الموقع بشكل دائم من الأخطاء
                أو الانقطاعات الناتجة عن عوامل خارجة عن السيطرة.

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

                لأي استفسارات أو ملاحظات حول اتفاقية الاستخدام،
                يمكنك التواصل مع فريق وكالة نقطة.

              </p>


            </article>



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