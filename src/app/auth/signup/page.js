// Signup route ("/signup"). Server Component shell — the interactive
// form itself is a Client Component (SignupForm).

import { AuthLayout } from "@/features/auth/layout/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "إنشاء حساب",
  description: "أنشئ حسابك في نقطة للوصول إلى لوحة التحكم وإدارة موقعك.",
  keywords: ["إنشاء حساب", "تسجيل", "نقطة"],
  path: "/auth/signup",
  noindex: true,
});

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="ابدأ الآن"
      title="إنشاء حساب في نقطة"
      subtitle="أنشئ حسابك وابدأ رحلتك معنا."
    >
      <SignupForm />
    </AuthLayout>
  );
}
