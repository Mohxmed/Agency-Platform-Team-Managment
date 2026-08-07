"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Loader2,
  Save,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { callAdminApi } from "@/features/auth/services/admin.service";
import { useTeamData } from "@/features/team/hooks/useTeamData";
import { useToast } from "@/hooks/useToast";
import { setDocument } from "@/lib/firestoreService";

import Avatar from "@/features/dashboard/ui/Avatar";
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

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id;

  const { user: currentUser, profile: currentProfile } = useAuth();
  const { users, userMap, loading } = useTeamData();
  const { showToast } = useToast();

  const member = useMemo(
    () => users.find((m) => m.id === memberId) || null,
    [users, memberId]
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    role: "member",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const synced = useRef(false);

  useEffect(() => {
    if (!member || synced.current) return;
    const profile = userMap.get(memberId);
    // Sync the form only once when the member data first arrives, so the
    // live subscription never overwrites the admin's in-progress edits.
    synced.current = true;
    setForm({
      name: member.name || profile?.name || "",
      email: member.email || profile?.email || "",
      password: "",
      phone: member.phone || profile?.phone || "",
      specialty: member.specialty || profile?.specialty || "",
      role: member.role || "member",
      status: member.status === "inactive" ? "inactive" : "active",
    });
  }, [member, memberId, userMap]);

  const isAdmin = currentProfile?.role === "admin";

  const roleOptions = ROLE_OPTIONS.filter(
    (option) => isAdmin || option.value !== "admin",
  );

  const editingAdmin = member?.role === "admin" && !isAdmin;

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "اسم العضو مطلوب.";
    if (!form.email.trim()) next.email = "البريد الإلكتروني مطلوب.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "بريد إلكتروني غير صالح.";
    if (form.password && form.password.length < 6) next.password = "كلمة المرور يجب ألا تقل عن 6 أحرف.";
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

      const patchBody = { name: form.name.trim() };
      if (form.email.trim().toLowerCase() !== (member.email || "")) {
        patchBody.email = form.email.trim().toLowerCase();
      }
      if (form.password) {
        patchBody.password = form.password;
      }

      const result = await callAdminApi(
        `/api/admin/users/${memberId}`,
        "PATCH",
        await currentUser.getIdToken(),
        patchBody,
      );

      if (!result.ok) {
        showToast({
          type: "error",
          title: "فشل التحديث",
          message: result.data.error || "تعذر تحديث بيانات العضو.",
        });
        return;
      }

      await setDocument("profiles", memberId, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        status: form.status,
        phone: form.phone.trim(),
        specialty: form.specialty.trim(),
        updatedAtClient: new Date().toISOString(),
      });

      showToast({
        type: "success",
        title: "تم الحفظ بنجاح",
        message: "تم تحديث بيانات العضو.",
      });

      router.push(`/dashboard/team/members/${memberId}`);
    } catch (error) {
      console.error("Failed to update member:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "تعذر حفظ التعديلات، حاول مرة أخرى.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded-xl dark:bg-white/[0.08]" />
            <div className="h-96 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!member) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <Card className="text-center py-12">
            <UserCog className="h-16 w-16 mx-auto text-gray-500 dark:text-ink/40" />
            <h3 className="mt-4 text-xl font-bold text-ink">العضو غير موجود</h3>
            <p className="mt-2 text-gray-500 dark:text-ink/60">لم يتم العثور على بيانات هذا العضو.</p>
            <Button variant="outline" className="mt-6" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              رجوع
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const profile = userMap.get(memberId);
  const avatar = member.photoURL || member.logo || profile?.photoURL || profile?.logo || "";

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" aria-label="رجوع" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-ink">تعديل العضو</h1>
              <p className="text-sm text-ink/60">تحديث بيانات وحساب {form.name || "العضو"}</p>
            </div>
          </div>
          <Link
            href={`/dashboard/team/members/${memberId}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-ink/10 px-5 text-sm font-bold text-ink/60 transition-colors hover:bg-ink/[0.03]"
          >
            عرض التقرير
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 border-b border-ink/[0.07] bg-ink/[0.02] px-6 py-4">
            <Avatar src={avatar} alt={form.name || "عضو"} size={48} />
            <div className="min-w-0">
              <p className="font-bold text-ink truncate">{form.name || "عضو الفريق"}</p>
              <p className="text-sm text-ink/60 truncate">{form.email || "—"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="الاسم الكامل"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="البريد الإلكتروني"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="كلمة المرور (اختياري)"
                type="password"
                placeholder="اتركها فارغة للإبقاء على كلمة المرور الحالية"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
              />
              <Input
                label="رقم الهاتف"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input
                label="التخصص"
                value={form.specialty}
                onChange={(e) => update("specialty", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
              <Select
                label="الدور"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                options={roleOptions}
                disabled={editingAdmin}
              />
              <Select
                label="الحالة"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                options={STATUS_OPTIONS}
                disabled={editingAdmin}
              />
            </div>

            {editingAdmin && (
              <p className="text-xs font-semibold text-amber-600">
                لا يمكنك تعديل دور أو حالة مسؤول النظام من حساب مدير.
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink/[0.07] pt-6">
              <p className="text-sm text-ink/60 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-ink/60" />
                التغييرات تنعكس على حساب العضو وملفه الشخصي فوراً.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/team/members"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-ink/10 px-5 text-sm font-bold text-ink/60 transition-colors hover:bg-ink/[0.03]"
                >
                  إلغاء
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                  {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
