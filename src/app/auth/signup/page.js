// Signup route ("/signup"). Server Component shell — the interactive
// form itself is a Client Component (SignupForm).

import { AuthLayout } from "@/features/auth/layout/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata = {
  title: "نقطة - إنشاء حساب",
};

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
