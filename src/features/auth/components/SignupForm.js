"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button, Input } from "@/shared/ui";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { ROUTES } from "@/constants/routes";
import { fetchSettings } from "@/lib/settingsCache";
import { Ban } from "lucide-react";

import {
  registerWithEmail,
  loginWithGoogle,
} from "@/features/auth/services/auth.service";

export function SignupForm() {
  const router = useRouter();
  const [registrationDisabled, setRegistrationDisabled] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchSettings()
      .then((data) => {
        if (!mounted) return;
        setRegistrationDisabled(data?.auth?.allowRegistration === false);
      })
      .finally(() => {
        if (mounted) setCheckingRegistration(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function handleChange(field) {
    return (event) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Remove error while user is typing
      if (formError) {
        setFormError("");
      }
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

    const name = values.name.trim();
    const email = values.email.trim();
    const password = values.password;

    // Validation
    if (!name || !email || !password) {
      setFormError("من فضلك أدخل الاسم والبريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (password.length < 6) {
      setFormError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerWithEmail({
        name,
        email,
        password,
      });

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.user) {
        // Firebase signs the user in automatically after registration.
        // The session cookie is created by registerWithEmail, so we can
        // go straight to the dashboard.
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error("Signup error:", error);

      setFormError("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleClick() {
    setFormError("");
    setIsGoogleLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.user) {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error("Google signup error:", error);

      setFormError("حدث خطأ أثناء التسجيل باستخدام Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  if (checkingRegistration) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary-600" />
        <p className="text-sm text-lo">جاري التحقق من حالة التسجيل...</p>
      </div>
    );
  }

  if (registrationDisabled) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-lo">
          <Ban className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-bold text-hi">إنشاء الحسابات موقوف حالياً</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-lo">
            أُوقِف التسجيل مؤقتًا من قِبل الإدارة. يرجى المحاولة لاحقًا، أو سجّل الدخول إذا كان لديك حساب بالفعل.
          </p>
        </div>
        <a
          href={ROUTES.LOGIN}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-hi transition hover:bg-surface-hover"
        >
          تسجيل الدخول
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="name"
          type="text"
          label="الاسم كامل"
          placeholder="مثال: محمد عمرو"
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          disabled={isSubmitting || isGoogleLoading}
        />

        <Input
          id="email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          disabled={isSubmitting || isGoogleLoading}
        />

        <Input
          id="password"
          type="password"
          label="كلمة المرور"
          placeholder="على الأقل 6 حروف"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange("password")}
          disabled={isSubmitting || isGoogleLoading}
        />

        {formError && (
          <p role="alert" className="text-xs text-[#ef5b5b]">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting || isGoogleLoading}
        >
          إنشاء حساب جديد
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />

        <span className="text-xs text-lo">أو</span>

        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton onClick={handleGoogleClick} isLoading={isGoogleLoading} />

      <p className="text-center text-sm text-lo">
         لديك حساب بالفعل؟{" "}
         <Link href={ROUTES.LOGIN} className="font-medium text-hi hover:underline">
           سجل الدخول
         </Link>
       </p>
    </div>
  );
}
