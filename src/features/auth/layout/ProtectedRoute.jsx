"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { getPermissionsForRole } from "@/constants/permissions";

export default function ProtectedRoute({ children, permission }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, profile, loading, profileLoading } = useAuth();

  /* =========================================================
     AUTH / PERMISSION CHECK
  ========================================================= */

  useEffect(() => {
    // لسه Firebase Auth أو Firestore profile بيحمّل
    if (loading || profileLoading) return;

    // المستخدم مش عامل Login
    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);

      return;
    }

    // مفيش Profile
    if (!profile) {
      router.replace("/dashboard");
      return;
    }

    // لو الصفحة محتاجة Permission
    if (permission) {
      const permissions = getPermissionsForRole(profile.role);

      const allowed = permissions?.[permission] === true;

      if (!allowed) {
        router.replace("/dashboard/403");
      }
    }
  }, [user, profile, loading, profileLoading, permission, pathname, router]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading || profileLoading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-gray-200
              border-t-red-600
            "
          />

          <span className="text-sm text-gray-500">
            جاري التحقق من الصلاحيات...
          </span>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT AUTHENTICATED
  ========================================================= */

  if (!user) {
    return null;
  }

  /* =========================================================
     PROFILE NOT FOUND
  ========================================================= */

  if (!profile) {
    return null;
  }

  /* =========================================================
     PERMISSION CHECK
  ========================================================= */

  if (permission) {
    const permissions = getPermissionsForRole(profile.role);

    const allowed = permissions?.[permission] === true;

    if (!allowed) {
      return null;
    }
  }

  /* =========================================================
     ACCESS GRANTED
  ========================================================= */

  return children;
}
