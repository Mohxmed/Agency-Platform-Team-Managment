// Login route ("/login"). Server Component shell.

import AuthMotion from "@/shared/animations/AuthMotion";
import { AuthLayout, LoginForm } from "@/features/auth";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "تسجيل الدخول",
  description: "سجّل دخولك للوصول إلى لوحة التحكم وإدارة موقع نقطة.",
  keywords: ["تسجيل الدخول", "لوحة التحكم", "نقطة"],
  path: "/auth/login",
  noindex: true,
});

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
