"use client";
// Next
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
// Routes Config
import { ROUTES } from "@/constants/routes";
// UI
import { Input } from "@/shared/ui";
import Button from "@/shared/ui/buttons/Buttons";

import { sendPasswordResetEmail } from "../services/auth.service";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => {
    if (error) setError("");
  }, [error]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const normalizedEmail = email.trim();
      clearError();

      if (!normalizedEmail) {
        setError("من فضلك أدخل البريد الإلكتروني");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        setError("البريد الإلكتروني غير صالح");
        return;
      }

      setLoading(true);
      try {
        const result = await sendPasswordResetEmail(normalizedEmail);
        if (result.error) {
          setError(result.error);
          return;
        }
        setSent(true);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    },
    [email, clearError],
  );

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4Z" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold text-hi">تم إرسال رابط الاستعادة</h2>
          <p className="mt-2 text-sm leading-6 text-lo">
            إذا كان هذا البريد الإلكتروني مسجلًا لدينا، فستصلك رسالة تحتوي على
            رابط لإعادة تعيين كلمة المرور.
          </p>
        </div>

        <Button type="button" variant="secondary" onClick={() => router.push(ROUTES.LOGIN)}>
          العودة لتسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset disabled={loading} className="contents">
          <Input
            id="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              clearError();
              setEmail(e.target.value);
            }}
          />
          {error && (
            <p role="alert" className="text-xs text-[#ef5b5b] w-full text-center">
              {error}
            </p>
          )}

          <Button type="submit" isLoading={loading}>
            إرسال رابط الاستعادة
          </Button>
        </fieldset>
      </form>

      <p className="text-center text-sm text-lo">
        تذكرت كلمة المرور؟{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-hi hover:underline">
          سجل دخولك
        </Link>
      </p>
    </div>
  );
}
