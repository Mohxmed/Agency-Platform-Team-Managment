"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  UserRound,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  CalendarDays,
  LockKeyhole,
  Crown,
  RefreshCw,
} from "lucide-react";

import Card from "@/features/dashboard/ui/Card";
import Button from "@/features/dashboard/ui/Button";
import Input, { Select } from "@/features/dashboard/ui/Input";

import {
  subscribeToCollection,
  setDocument,
  removeDocument,
} from "@/lib/firestoreService";

import { useAuth, ProtectedRoute } from "@/features/auth";
import { createProfile } from "@/features/auth/repos/profile.repo";
import { useToast } from "@/hooks/useToast";

/* =========================================================
   ADMIN API HELPER
========================================================= */

async function callAdminApi(path, method, token, body) {
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

/* =========================================================
   DEFAULT USER
========================================================= */

const DEFAULT_USER = {
  name: "",
  email: "",
  password: "",
  role: "member",
  status: "active",

  permissions: {
    dashboard: true,
    projects: false,
    team: false,
    users: false,
    settings: false,
  },
};

/* =========================================================
   ROLES
========================================================= */

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "مسؤول",
  },
  {
    value: "manager",
    label: "مدير",
  },
  {
    value: "member",
    label: "عضو فريق",
  },
  {
    value: "viewer",
    label: "زائر",
  },
];

/* =========================================================
   ROLE PERMISSIONS
========================================================= */

const ROLE_PERMISSIONS = {
  admin: {
    dashboard: true,
    content: true,
    projects: true,
    team: true,
    users: true,
    settings: true,
    "my-tasks": true,
    tasks: true,
    progress: true,
  },

  manager: {
    dashboard: true,
    content: false,
    projects: true,
    team: true,
    "my-tasks": true,
    tasks: true,
    progress: true,
    users: false,
    settings: false,
  },

  member: {
    dashboard: true,
    content: false,
    projects: true,
    team: false,
    "my-tasks": true,
    tasks: true,
    progress: false,
    users: false,
    settings: false,
  },

  viewer: {
    dashboard: true,
    content: false,
    projects: false,
    team: false,
    "my-tasks": false,
    tasks: false,
    progress: false,
    users: false,
    settings: false,
  },
};

/* =========================================================
   STATUS
========================================================= */

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "نشط",
  },
  {
    value: "inactive",
    label: "غير نشط",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const { showToast } = useToast();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [deleteUser, setDeleteUser] = useState(null);

  const [saving, setSaving] = useState(false);

  /* =======================================================
     FIRESTORE
  ======================================================= */

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "profiles",
      (data) => {
        setUsers(data);
        setLoading(false);
      },
      "createdAt",
    );

    return unsubscribe;
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: users.length,

      active: users.filter((user) => user.status === "active").length,

      admins: users.filter((user) => user.role === "admin").length,

      managers: users.filter((user) => user.role === "manager").length,
    };
  }, [users]);

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  function handleCreate() {
    setEditingUser(null);
    setModalOpen(true);
  }

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  function handleEdit(user) {
    setEditingUser(user);
    setModalOpen(true);
  }

  /* =======================================================
     SAVE
  ======================================================= */

  async function handleSave(formData) {
    if (saving) return;

    try {
      setSaving(true);

      const role = formData.role || "member";

      const permissions =
        role === "custom" ? formData.permissions : ROLE_PERMISSIONS[role];

      const payload = {
        name: formData.name?.trim() || "",

        email: formData.email?.trim().toLowerCase() || "",

        role,

        status: formData.status || "active",

        permissions,

        updatedAtClient: new Date().toISOString(),
      };

      if (editingUser) {
        if (editingUser.uid || editingUser.id) {
          const patchBody = { name: payload.name };

          if (payload.email !== editingUser.email) {
            patchBody.email = payload.email;
          }

          if (formData.password) {
            patchBody.password = formData.password;
          }

          const result = await callAdminApi(
            `/api/admin/users/${editingUser.uid || editingUser.id}`,
            "PATCH",
            await currentUser.getIdToken(),
            patchBody,
          );

          if (!result.ok) {
            showToast({
              type: "error",
              title: "فشل التحديث",
              message: result.data.error || "حصل خطأ أثناء تعديل الحساب.",
            });

            return;
          }

          await setDocument("profiles", editingUser.uid || editingUser.id, {
            name: payload.name,
            email: payload.email,
            role,
            status: payload.status,
            updatedAtClient: payload.updatedAtClient,
          });
        }
      } else {
        if (!formData.password || formData.password.length < 6) {
          showToast({
          type: "warning",
          title: "بيانات غير مكتملة",
          message: "كلمة المرور يجب ألا تقل عن 6 أحرف.",
        });

          return;
        }

        const result = await callAdminApi(
          "/api/admin/users",
          "POST",
          await currentUser.getIdToken(),
          {
            name: payload.name,
            email: payload.email,
            password: formData.password,
          },
        );

        if (!result.ok) {
          showToast({
            type: "error",
            title: "فشل الإنشاء",
            message: result.data.error || "حصل خطأ أثناء إنشاء الحساب.",
          });

          return;
        }

        const uid = result.data.uid;

        await createProfile(
          {
            uid,
            displayName: payload.name,
            email: payload.email,
            photoURL: "",
          },
          {
            name: payload.name,
            role,
            status: payload.status,
          },
        );
      }

      setModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حفظ المستخدم.",
      });
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete() {
    if (!deleteUser) return;

    if (currentUser?.uid && deleteUser.uid === currentUser.uid) {
      showToast({
        type: "warning",
        title: "عملية غير مسموحة",
        message: "لا يمكنك حذف حسابك الحالي.",
      });

      setDeleteUser(null);

      return;
    }

    try {
      setSaving(true);

      const profileId = deleteUser.uid || deleteUser.id;

      if (profileId) {
        const result = await callAdminApi(
          `/api/admin/users/${profileId}`,
          "DELETE",
          await currentUser.getIdToken(),
        );

        if (!result.ok && result.status !== 404) {
          showToast({
            type: "error",
            title: "فشل الحذف",
            message:
              result.data.error ||
              "حصل خطأ أثناء حذف الحساب.",
            detail: result.data.detail || "",
          });

          return;
        }

        await removeDocument("profiles", profileId);
      }

      setDeleteUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المستخدم.",
      });
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  async function toggleStatus(user) {
    if (currentUser?.uid && user.uid === currentUser.uid) {
      showToast({
        type: "warning",
        title: "عملية غير مسموحة",
        message: "لا يمكنك تعطيل حسابك الحالي.",
      });

      return;
    }

    try {
      const nextStatus = user.status === "active" ? "inactive" : "active";

      const profileId = user.uid || user.id;

      if (profileId) {
        const result = await callAdminApi(
          `/api/admin/users/${profileId}`,
          "PATCH",
          await currentUser.getIdToken(),
          {
            disabled: nextStatus === "inactive",
          },
        );

        if (!result.ok) {
          showToast({
            type: "error",
            title: "فشل التحديث",
            message: result.data.error || "حصل خطأ أثناء تحديث حالة الحساب.",
          });

          return;
        }

        await setDocument("profiles", profileId, {
          status: nextStatus,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <ProtectedRoute permission="users">
    {loading ? (
      <div dir="rtl" className="space-y-6">
        <div
          className="
            h-40
            animate-pulse
            rounded-[28px]
            bg-ink/[0.035]
          "
        />

        <div
          className="
            h-[600px]
            animate-pulse
            rounded-[28px]
            bg-ink/[0.035]
          "
        />
      </div>
    ) : (
    <div dir="rtl" className="space-y-6">
      {/* ===================================================
          HEADER
      ==================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[28px]
          bg-card
          p-6
          shadow-[0_15px_50px_rgba(0,0,0,0.035)]
          sm:p-8
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-primary/[0.06]
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-ink
                  "
                >
                  المستخدمون والأعضاء
                </h1>

                <p className="mt-1 text-sm text-ink/40">
                  إدارة أعضاء النظام والأدوار والصلاحيات والحسابات.
                </p>
              </div>
            </div>
          </div>

          <Button icon={UserPlus} onClick={handleCreate} className="rounded-xl">
            إضافة مستخدم
          </Button>
        </div>
      </section>

      {/* ===================================================
          STATS
      ==================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          lg:grid-cols-4
        "
      >
        <StatCard icon={Users} label="إجمالي المستخدمين" value={stats.total} />

        <StatCard
          icon={CheckCircle2}
          label="المستخدمون النشطون"
          value={stats.active}
        />

        <StatCard icon={Crown} label="مديرو النظام" value={stats.admins} />

        <StatCard icon={ShieldCheck} label="المديرون" value={stats.managers} />
      </div>

      {/* ===================================================
          TABLE
      ==================================================== */}

      <Card
        className="
          overflow-hidden
          border-ink/[0.07]
          bg-card
          p-0
          shadow-none
        "
      >
        {/* FILTERS */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-ink/[0.06]
            p-5
            lg:flex-row
            lg:items-center
          "
        >
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-ink/30
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-ink/[0.07]
                bg-surface
                pr-11
                pl-4
                text-sm
                text-ink
                outline-none
                transition
                focus:border-primary/30
                focus:bg-card
                focus:ring-4
                focus:ring-primary/10
              "
            />
          </div>

          <Select
            value={roleFilter}
            options={[
              {
                value: "all",
                label: "كل الأدوار",
              },
              ...ROLE_OPTIONS,
            ]}
            onChange={(e) => setRoleFilter(e.target.value)}
          />

          <Select
            value={statusFilter}
            options={[
              {
                value: "all",
                label: "كل الحالات",
              },
              ...STATUS_OPTIONS,
            ]}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="
              flex
              h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-ink/[0.07]
              px-4
              text-sm
              font-semibold
              text-ink/50
              transition
              hover:bg-ink/[0.025]
              hover:text-ink
            "
          >
            <RefreshCw className="h-4 w-4" />
            إعادة ضبط
          </button>
        </div>

        {/* MOBILE CARDS */}

        <div className="space-y-3 p-4 lg:hidden">
          {filteredUsers.length === 0 ? (
            <EmptyUsers />
          ) : (
            filteredUsers.map((user) => (
              <UserMobileCard
                key={user.id}
                user={user}
                currentUser={currentUser}
                onEdit={handleEdit}
                onDelete={setDeleteUser}
                onToggle={toggleStatus}
              />
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr
                className="
                  border-b
                  border-ink/[0.06]
                  bg-surface
                "
              >
                <th className="px-6 py-4 text-right text-xs font-bold text-ink/35">
                  المستخدم
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold text-ink/35">
                  الدور
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold text-ink/35">
                  الصلاحيات
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold text-ink/35">
                  الحالة
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold text-ink/35">
                  تاريخ الإضافة
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-ink/35">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyUsers />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    onEdit={handleEdit}
                    onDelete={setDeleteUser}
                    onToggle={toggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===================================================
          USER MODAL
      ==================================================== */}

      {modalOpen && (
        <UserModal
          user={editingUser}
          saving={saving}
          onClose={() => {
            if (saving) return;

            setModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* ===================================================
          DELETE MODAL
      ==================================================== */}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          saving={saving}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
    )}
    </ProtectedRoute>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card
      className="
        border-ink/[0.07]
        bg-card
        p-5
        shadow-none
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink/35">{label}</p>

          <p className="mt-1 text-2xl font-black text-ink">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   USER ROW
========================================================= */

function UserRow({ user, currentUser, onEdit, onDelete, onToggle }) {
  const isMe = currentUser?.uid && user.uid === currentUser.uid;

  return (
    <tr
      className="
        border-b
        border-ink/[0.05]
        transition
        hover:bg-ink/[0.012]
      "
    >
      {/* USER */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="max-w-[220px] truncate text-sm font-bold text-ink">
                {user.name || "بدون اسم"}
              </p>

              {isMe && (
                <span
                  className="
                    rounded-full
                    bg-primary/10
                    px-2
                    py-0.5
                    text-[9px]
                    font-bold
                    text-primary
                  "
                >
                  أنت
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/35">
              <Mail className="h-3 w-3" />
              <span className="max-w-[220px] truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </td>

      {/* ROLE */}

      <td className="px-6 py-5">
        <RoleBadge role={user.role} />
      </td>

      {/* PERMISSIONS */}

      <td className="px-6 py-5">
        <PermissionSummary permissions={ROLE_PERMISSIONS[user.role] || {}} />
      </td>

      {/* STATUS */}

      <td className="px-6 py-5">
        <button
          type="button"
          disabled={isMe}
          onClick={() => onToggle(user)}
          className="group"
        >
          <StatusBadge status={user.status} />
        </button>
      </td>

      {/* DATE */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-ink/40">
          <CalendarDays className="h-3.5 w-3.5" />

          {formatDate(user.createdAt)}
        </div>
      </td>

      {/* ACTIONS */}

      <td className="px-6 py-5">
        <Actions user={user} isMe={isMe} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function UserMobileCard({ user, currentUser, onEdit, onDelete, onToggle }) {
  const isMe = currentUser?.uid && user.uid === currentUser.uid;

  return (
    <div
      className="
        rounded-2xl
        border
        border-ink/[0.07]
        bg-surface
        p-4
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-ink">
                {user.name || "بدون اسم"}
              </p>

              {isMe && (
                <span className="text-[9px] font-bold text-primary">أنت</span>
              )}
            </div>

            <p className="mt-1 truncate text-xs text-ink/35">{user.email}</p>
          </div>
        </div>

        <Actions user={user} isMe={isMe} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <RoleBadge role={user.role} />

        <button type="button" disabled={isMe} onClick={() => onToggle(user)}>
          <StatusBadge status={user.status} />
        </button>
      </div>

      <div className="mt-3">
        <PermissionSummary permissions={ROLE_PERMISSIONS[user.role] || {}} />
      </div>
    </div>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function UserAvatar({ user }) {
  const initial = user.name?.charAt(0) || user.email?.charAt(0) || "U";

  return (
    <div
      className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-xl
        bg-primary/10
        text-sm
        font-black
        text-primary
      "
    >
      {user.photoURL || user.logo ? (
        <img
          src={user.photoURL || user.logo}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        initial.toUpperCase()
      )}
    </div>
  );
}

/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({ role }) {
  const data = {
    admin: {
      label: "مسؤول",
      icon: Crown,
      className: "bg-purple-500/10 text-purple-600",
    },

    manager: {
      label: "مدير",
      icon: ShieldCheck,
      className: "bg-blue-500/10 text-blue-600",
    },

    member: {
      label: "عضو فريق",
      icon: UserRound,
      className: "bg-gray-500/10 text-gray-600",
    },

    viewer: {
      label: "زائر",
      icon: UserRound,
      className: "bg-emerald-500/10 text-emerald-600",
    },
  };

  const current = data[role] || data.member;

  const Icon = current.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1.5
        text-[10px]
        font-bold
        ${current.className}
      `}
    >
      <Icon className="h-3 w-3" />

      {current.label}
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1.5
        text-[10px]
        font-bold
        ${
          active
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-red-500/10 text-red-500"
        }
      `}
    >
      {active ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}

      {active ? "نشط" : "غير نشط"}
    </span>
  );
}

/* =========================================================
   PERMISSION SUMMARY
========================================================= */

function PermissionSummary({ permissions = {} }) {
  const labels = {
    dashboard: "لوحة التحكم",
    content: "إدارة الموقع",
    portfolio: "المحفظة",
    projects: "المشاريع",
    team: "الفريق",
    "my-tasks": "مهماتي",
    tasks: "المهام",
    progress: "التقدم",
    users: "المستخدمون",
    settings: "الإعدادات",
  };

  const active = Object.entries(permissions)
    .filter(([, value]) => value)
    .map(([key]) => labels[key])
    .filter(Boolean);

  if (!active.length) {
    return <span className="text-xs text-ink/25">لا توجد صلاحيات</span>;
  }

  return (
    <div className="flex max-w-[230px] flex-wrap gap-1">
      {active.slice(0, 3).map((item) => (
        <span
          key={item}
          className="
            rounded-md
            bg-ink/[0.035]
            px-1.5
            py-1
            text-[9px]
            font-semibold
            text-ink/45
          "
        >
          {item}
        </span>
      ))}

      {active.length > 3 && (
        <span
          className="
            rounded-md
            bg-primary/10
            px-1.5
            py-1
            text-[9px]
            font-bold
            text-primary
          "
        >
          +{active.length - 3}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   ACTIONS
========================================================= */

function Actions({ user, isMe, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          text-ink/35
          transition
          hover:bg-ink/[0.04]
          hover:text-ink
        "
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => setOpen(false)}
            className="
              fixed
              inset-0
              z-40
              cursor-default
            "
          />

          <div
            className="
              absolute
              left-0
              top-full
              z-50
              mt-2
              w-44
              rounded-2xl
              border
              border-ink/[0.07]
              bg-card
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            "
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit(user);
              }}
              className="
                flex
                w-full
                items-center
                gap-2
                rounded-xl
                px-3
                py-2.5
                text-right
                text-xs
                font-semibold
                text-ink/60
                transition
                hover:bg-ink/[0.035]
                hover:text-ink
              "
            >
              <Pencil className="h-4 w-4" />
              تعديل المستخدم
            </button>

            <button
              type="button"
              disabled={isMe}
              onClick={() => {
                setOpen(false);

                if (!isMe) {
                  onDelete(user);
                }
              }}
              className="
                flex
                w-full
                items-center
                gap-2
                rounded-xl
                px-3
                py-2.5
                text-right
                text-xs
                font-semibold
                text-red-500
                transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Trash2 className="h-4 w-4" />
              حذف المستخدم
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   USER MODAL
========================================================= */

function UserModal({ user, saving, onClose, onSave }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => ({
    ...DEFAULT_USER,
    ...(user || {}),
    permissions: {
      ...DEFAULT_USER.permissions,
      ...(user?.permissions || {}),
    },
  }));

  function update(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function changeRole(role) {
    setForm((previous) => ({
      ...previous,
      role,
      permissions: ROLE_PERMISSIONS[role] || previous.permissions,
    }));
  }

  function togglePermission(permission) {
    setForm((previous) => ({
      ...previous,
      role: "custom",
      permissions: {
        ...previous.permissions,
        [permission]: !previous.permissions[permission],
      },
    }));
  }

  function submit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast({
        type: "warning",
        title: "بيانات غير مكتملة",
        message: "اكتب اسم المستخدم.",
      });
      return;
    }

    if (!form.email.trim()) {
      showToast({
        type: "warning",
        title: "بيانات غير مكتملة",
        message: "اكتب البريد الإلكتروني.",
      });
      return;
    }

    if (!user && (!form.password || form.password.length < 6)) {
      showToast({
        type: "warning",
        title: "بيانات غير مكتملة",
        message: "كلمة المرور يجب ألا تقل عن 6 أحرف.",
      });
      return;
    }

    if (user && form.password && form.password.length < 6) {
      showToast({
        type: "warning",
        title: "بيانات غير مكتملة",
        message: "كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف.",
      });
      return;
    }

    onSave(form);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/30
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-[28px]
          bg-card
          shadow-[0_30px_100px_rgba(0,0,0,0.2)]
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-ink/[0.06]
            bg-card
            p-5
            sm:p-6
          "
        >
          <div>
            <h2 className="text-lg font-black text-ink">
              {user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
            </h2>

            <p className="mt-1 text-xs text-ink/35">
              {user
                ? "تعديل بيانات المستخدم والدور والصلاحيات."
                : "سيتم إنشاء حساب تسجيل دخول فعلي للمستخدم."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-ink/35
              transition
              hover:bg-ink/[0.04]
              hover:text-ink
            "
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6 p-5 sm:p-6">
          {/* BASIC */}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="الاسم"
              value={form.name}
              placeholder="مثال: أحمد محمد"
              onChange={(e) => update("name", e.target.value)}
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              placeholder="ahmed@example.com"
              onChange={(e) => update("email", e.target.value)}
            />

            {!user && (
              <div className="sm:col-span-2">
                <Input
                  label="كلمة المرور"
                  type="password"
                  value={form.password}
                  placeholder="6 أحرف على الأقل"
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
            )}

            {user && (
              <div className="sm:col-span-2">
                <Input
                  label="كلمة مرور جديدة (اختياري)"
                  type="password"
                  value={form.password}
                  placeholder="اتركه فارغًا للإبقاء على كلمة المرور الحالية"
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* ROLE */}

          <div
            className="
              rounded-2xl
              border
              border-ink/[0.07]
              bg-surface
              p-4
            "
          >
            <div className="mb-4">
              <p className="text-sm font-bold text-ink">الدور الوظيفي</p>

              <p className="mt-1 text-[11px] text-ink/35">
                الدور يحدد الصلاحيات الافتراضية للمستخدم.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => changeRole(role.value)}
                  className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      p-3
                      text-right
                      transition
                      ${
                        form.role === role.value
                          ? "border-primary/30 bg-primary/[0.06]"
                          : "border-ink/[0.06] bg-card hover:bg-ink/[0.02]"
                      }
                    `}
                >
                  <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          form.role === role.value
                            ? "bg-primary/10 text-primary"
                            : "bg-ink/[0.04] text-ink/40"
                        }
                      `}
                  >
                    {role.value === "admin" ? (
                      <Crown className="h-4 w-4" />
                    ) : role.value === "manager" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : role.value === "viewer" ? (
                      <UserRound className="h-4 w-4" />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-ink">{role.label}</p>

                    <p className="mt-0.5 text-[10px] text-ink/30">
                      {role.value === "admin"
                        ? "صلاحيات كاملة"
                        : role.value === "manager"
                          ? "إدارة المشاريع والفريق"
                          : role.value === "viewer"
                            ? "بدون صلاحيات"
                            : "مهامه ومشاريعه المسندة"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}

          <Select
            label="حالة الحساب"
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={(e) => update("status", e.target.value)}
          />

          {/* PERMISSIONS */}

          <div
            className="
              rounded-2xl
              border
              border-ink/[0.07]
              bg-surface
              p-4
            "
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <LockKeyhole className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold text-ink">الصلاحيات</p>

                <p className="mt-1 text-[10px] text-ink/35">
                  يمكنك تعديل الصلاحيات يدويًا.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <PermissionToggle
                title="لوحة التحكم"
                description="الوصول للـ Dashboard"
                checked={form.permissions.dashboard}
                onChange={() => togglePermission("dashboard")}
              />

              <PermissionToggle
                title="المشاريع"
                description="إدارة المشاريع والأعمال"
                checked={form.permissions.projects}
                onChange={() => togglePermission("projects")}
              />

              <PermissionToggle
                title="الفريق"
                description="إدارة أعضاء الفريق"
                checked={form.permissions.team}
                onChange={() => togglePermission("team")}
              />

              <PermissionToggle
                title="المستخدمون"
                description="إدارة مستخدمي النظام"
                checked={form.permissions.users}
                onChange={() => togglePermission("users")}
              />

              <PermissionToggle
                title="الإعدادات"
                description="تعديل إعدادات الموقع"
                checked={form.permissions.settings}
                onChange={() => togglePermission("settings")}
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-ink/[0.06]
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                rounded-xl
                px-5
                py-3
                text-sm
                font-bold
                text-ink/50
                transition
                hover:bg-ink/[0.035]
                hover:text-ink
              "
            >
              إلغاء
            </button>

            <Button
              type="submit"
              loading={saving}
              icon={saving ? Loader2 : ShieldCheck}
              className="rounded-xl"
            >
              {user ? "حفظ التعديلات" : "إضافة المستخدم"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   PERMISSION TOGGLE
========================================================= */

function PermissionToggle({ title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-ink/[0.06]
        bg-card
        p-3
        text-right
        transition
        hover:border-primary/20
      "
    >
      <div className="min-w-0">
        <p className="text-xs font-bold text-ink">{title}</p>

        <p className="mt-1 text-[10px] text-ink/30">{description}</p>
      </div>

      <span
        className={`
          relative
          h-6
          w-10
          shrink-0
          rounded-full
          p-1
          transition
          ${checked ? "bg-primary" : "bg-ink/[0.12]"}
        `}
      >
        <span
          className={`
            block
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            ${checked ? "-translate-x-4" : "translate-x-0"}
          `}
        />
      </span>
    </button>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({ user, saving, onClose, onConfirm }) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/30
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[28px]
          bg-card
          p-6
          shadow-[0_30px_100px_rgba(0,0,0,0.2)]
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-red-500/10
            text-red-500
          "
        >
          <Trash2 className="h-5 w-5" />
        </div>

        <h2 className="mt-5 text-lg font-black text-ink">حذف المستخدم؟</h2>

        <p className="mt-2 text-sm leading-6 text-ink/45">
          هل أنت متأكد من حذف المستخدم{" "}
          <strong className="text-ink">{user.name || user.email}</strong>
          ؟
          <br />
          سيتم حذف الحساب نهائيًا ولا يمكنه تسجيل الدخول بعد ذلك.
        </p>

        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-2
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              rounded-xl
              px-5
              py-3
              text-sm
              font-bold
              text-ink/50
              hover:bg-ink/[0.035]
            "
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-500
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-red-600
              dark:bg-red-400
              dark:hover:bg-red-300
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            حذف المستخدم
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyUsers() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-16
        text-center
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-ink/[0.035]
          text-ink/25
        "
      >
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-sm font-black text-ink">لا يوجد مستخدمون</h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-ink/35">
        لم نجد أي مستخدم مطابق للبحث أو الفلاتر الحالية.
      </p>
    </div>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(timestamp) {
  if (!timestamp) {
    return "—";
  }

  try {
    let date;

    if (typeof timestamp?.toDate === "function") {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}
