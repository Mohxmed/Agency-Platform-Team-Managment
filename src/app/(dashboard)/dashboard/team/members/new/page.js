"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { createProfile } from "@/features/auth/repos/profile.repo";
import { callAdminApi } from "@/features/auth/services/admin.service";
import { useToast } from "@/hooks/useToast";
import { setDocument } from "@/lib/firestoreService";

import Card from "@/features/dashboard/ui/Card";
import Button from "@/features/dashboard/ui/Button";
import Input, { Select } from "@/features/dashboard/ui/Input";

const ROLE_OPTIONS = [
  { value: "member", label: "عضو فريق" },
  { value: "manager", label: "مدير" },
  { value: "admin", label: "مسؤول" },
  { value: "viewer", label: "زائر" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialty: "",
  role: "member",
  status: "active",
};

export default function NewMemberPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "اسم العضو مطلوب.";
    if (!form.email.trim()) next.email = "البريد الإلكتروني مطلوب.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "بريد إلكتروني غير صالح.";
    if (!form.password || form.password.length < 6) next.password = "كلمة المرور يجب ألا تقل عن 6 أحرف.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSaving(true);

      const result = await callAdminApi(
        "/api/admin/users",
        "POST",
        await currentUser.getIdToken(),
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        },
      );

      if (!result.ok) {
        showToast({
          type: "error",
          title: "فشل إنشاء الحساب",
          message: result.data.error || "تعذر إنشاء حساب العضو.",
        });
        return;
      }

      const uid = result.data.uid;

      await createProfile(
        {
          uid,
          displayName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          photoURL: "",
        },
        {
          name: form.name.trim(),
          role: form.role,
          status: form.status,
        },
      );

      const { password: _ignored, ...profilePatch } = form;
      await setDocument("profiles", uid, {
        ...profilePatch,
        email: form.email.trim().toLowerCase(),
        updatedAtClient: new Date().toISOString(),
      });

      showToast({
        type: "success",
        title: "تمت الإضافة بنجاح",
        message: `تم إنشاء حساب ${form.name.trim()} وإضافته للفريق.`,
      });

      router.push(`/dashboard/team/members/${uid}`);
    } catch (error) {
      console.error("Failed to create member:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "تعذر إضافة العضو، حاول مرة أخرى.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-ink">إضافة عضو جديد</h1>
            <p className="text-sm text-ink/50">إنشاء حساب جديد وإضافة العضو للفريق</p>
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="الاسم الكامل"
                required
                placeholder="مثال: أحمد محمد"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="البريد الإلكتروني"
                type="email"
                required
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="كلمة المرور"
                type="password"
                required
                placeholder="6 أحرف على الأقل"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
              />
              <Input
                label="رقم الهاتف"
                type="tel"
                placeholder="05xxxxxxxx"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input
                label="التخصص"
                placeholder="مثال: تطوير واجهات"
                value={form.specialty}
                onChange={(e) => update("specialty", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="الدور"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  options={ROLE_OPTIONS}
                />
                <Select
                  label="الحالة"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  options={STATUS_OPTIONS}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink/[0.07] pt-6">
              <p className="text-sm text-ink/50 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-ink/30" />
                سيتم إنشاء حساب تسجيل دخول وملف شخصي للعضو.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/team/members"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-ink/10 px-5 text-sm font-bold text-ink/60 transition-colors hover:bg-ink/[0.03]"
                >
                  إلغاء
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <UserPlus className="h-4 w-4 ml-2" />}
                  {saving ? "جارٍ الحفظ..." : "إضافة العضو"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
