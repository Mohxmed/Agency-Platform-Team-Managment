"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/constants/routes";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  // لسه بنعرف حالة المستخدم
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-muted">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-line
            border-t-primary
          "
        />
      </div>
    );
  }

  // المستخدم مش مسجل دخول
  if (!user) {
    return null;
  }

  // المستخدم مسجل دخول
  return children;
}
