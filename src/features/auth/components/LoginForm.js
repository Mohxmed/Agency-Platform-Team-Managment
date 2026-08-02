"use client";
// Next
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
// Routes Config
import { ROUTES } from "@/constants/routes";
// UI
import { Input } from "@/shared/ui";
import { GoogleButton } from "./GoogleButton";
import Button from "@/shared/ui/buttons/Buttons";

import { loginWithEmail, loginWithGoogle } from "../services/auth.service";

function safeRedirect(target) {
  if (!target) return ROUTES.DASHBOARD;
  if (!target.startsWith("/")) return ROUTES.DASHBOARD;
  if (target.startsWith("//")) return ROUTES.DASHBOARD;
  return target;
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = safeRedirect(searchParams.get("redirect"));

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const isSubmitting = loading || googleLoading;

  const clearError = useCallback(() => {
    if (error) setError("");
  }, [error]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const normalizedEmail = email.trim();
      clearError();
      if (!normalizedEmail || !password) {
        setError("من فضلك أدخل البريد الإلكتروني وكلمة المرور");
        return;
      }
      setLoading(true);
      try {
        const result = await loginWithEmail(normalizedEmail, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push(redirectPath);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    },
    [email, password, clearError, router, redirectPath],
  );

  const handleGoogleLogin = useCallback(async () => {
    clearError();
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(redirectPath);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تسجيل الدخول باستخدام Google");
    } finally {
      setGoogleLoading(false);
    }
  }, [clearError, router, redirectPath]);

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset disabled={isSubmitting} className="contents">
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

          <Input
            id="password"
            type="password"
            label="كلمة المرور"
            placeholder="********"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              clearError();
              setPassword(e.target.value);
            }}
          />
          {error && (
            <p
              role="alert"
              className="text-xs text-[#ef5b5b] w-full text-center"
            >
              {error}
            </p>
          )}

          <Button type="submit" isLoading={loading}>
            تسجيل الدخول
          </Button>
        </fieldset>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-lo">أو</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton onClick={handleGoogleLogin} isLoading={googleLoading} />

      <p className="text-center text-sm text-lo">
        معندكش حساب؟{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-medium text-hi hover:underline"
        >
          سجل حساب جديد
        </Link>
      </p>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
