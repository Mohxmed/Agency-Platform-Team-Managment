import { Container } from "@/features/landing";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "سياسة الخصوصية",
  description:
    "سياسة الخصوصية الخاصة بوكالة نقطة وكيفية جمع بياناتك واستخدامها وحمايتها.",
  keywords: [
    "سياسة الخصوصية",
    "خصوصية البيانات",
    "بيانات المستخدمين",
    "نقطة",
  ],
  path: "/privacy-policy",
});


export default function PrivacyPolicyPage() {

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

              سياسة الخصوصية

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

              خصوصيتك تهمنا

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

              في وكالة نقطة نحرص على حماية خصوصية عملائنا
              وزوار موقعنا، ونسعى للتعامل مع البيانات
              بشكل آمن وشفاف.

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

                المعلومات التي نقوم بجمعها

              </h2>



              <p>

                قد نقوم بجمع بعض المعلومات التي تقدمها لنا
                بشكل مباشر مثل الاسم، البريد الإلكتروني،
                رقم التواصل، أو أي تفاصيل يتم إرسالها من خلال
                نماذج التواصل الخاصة بالموقع.

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

                كيفية استخدام المعلومات

              </h2>



              <p>

                نستخدم المعلومات التي يتم تقديمها لتحسين
                خدماتنا، التواصل مع العملاء، تقديم العروض
                والخدمات المناسبة، وتطوير تجربة المستخدم
                على الموقع.

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

                حماية البيانات

              </h2>



              <p>

                نطبق إجراءات مناسبة لحماية بيانات المستخدمين
                ومنع الوصول غير المصرح به أو إساءة استخدام
                المعلومات التي يتم جمعها.

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

                مشاركة المعلومات

              </h2>



              <p>

                لا نقوم ببيع أو مشاركة بيانات المستخدمين
                مع أطراف خارجية، إلا في الحالات التي تتطلبها
                القوانين أو عند الحاجة لتقديم الخدمة المطلوبة.

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

                ملفات تعريف الارتباط (Cookies)

              </h2>



              <p>

                قد يستخدم الموقع ملفات تعريف الارتباط لتحسين
                الأداء وتحليل استخدام الموقع وتقديم تجربة
                أفضل للزوار.

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

                تحديث سياسة الخصوصية

              </h2>



              <p>

                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر
                لمواكبة أي تغييرات في خدماتنا أو المتطلبات
                القانونية، وسيتم نشر النسخة المحدثة على هذه الصفحة.

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

                التواصل معنا

              </h2>



              <p>

                إذا كان لديك أي استفسار حول سياسة الخصوصية
                أو طريقة التعامل مع بياناتك، يمكنك التواصل
                مع فريق وكالة نقطة.

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