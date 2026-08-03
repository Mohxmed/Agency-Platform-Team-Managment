// Forgot password route. Server Component shell.

import AuthMotion from "@/shared/animations/AuthMotion";
import { AuthLayout, ForgotPasswordForm } from "@/features/auth";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "استعادة كلمة المرور",
  description: "استعد كلمة مرور حسابك في نقطة بسهولة وأمان.",
  keywords: ["استعادة كلمة المرور", "نسيت كلمة المرور", "نقطة"],
  path: "/auth/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="استعادة الوصول"
      title="استعادة كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
    >
      <AuthMotion>
        <ForgotPasswordForm />
      </AuthMotion>
    </AuthLayout>
  );
}
