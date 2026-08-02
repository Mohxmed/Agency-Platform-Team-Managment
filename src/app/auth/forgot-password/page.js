// Forgot password route. Server Component shell.

import AuthMotion from "@/shared/animations/AuthMotion";
import { AuthLayout, ForgotPasswordForm } from "@/features/auth";

export const metadata = {
  title: "نقطة - استعادة كلمة المرور",
};

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
