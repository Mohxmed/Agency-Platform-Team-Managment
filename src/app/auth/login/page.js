// Login route ("/login"). Server Component shell.

import AuthMotion from "@/shared/animations/AuthMotion";
import { AuthLayout, LoginForm } from "@/features/auth";

export const metadata = {
  title: "نقطة - تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="أهلاً بعودتك،"
      title="سجل الدخول لنقطة"
      subtitle="سجّل دخولك للوصول إلى لوحة التحكم."
    >
      <AuthMotion>
        <LoginForm />
      </AuthMotion>
    </AuthLayout>
  );
}
