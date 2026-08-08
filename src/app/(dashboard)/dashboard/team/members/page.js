"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Plus,
  Search,
  Users,
  ArrowUpDown,
  Briefcase,
  Loader2,
  AlertCircle,
  TrendingUp,
  Settings,
  ChevronLeft,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { useTeamData } from "@/features/team/hooks/useTeamData";

import Avatar from "@/features/dashboard/ui/Avatar";
import Button from "@/features/dashboard/ui/Button";
import Badge from "@/features/dashboard/ui/Badge";
import StatsCard from "@/features/dashboard/ui/StatsCard";
import { Select } from "@/features/dashboard/ui/Input";

import { getAssigneeId, isDeadlineOverdue } from "@/features/team/lib/teamUtils";

const ROLE_LABELS = {
  admin: "مسؤول",
  manager: "مدير",
  member: "عضو فريق",
  viewer: "زائر",
  custom: "صلاحيات مخصصة",
};

const ROLE_BADGES = {
  admin: "danger",
  manager: "warning",
  member: "secondary",
  viewer: "neutral",
  custom: "secondary",
};

const ROLE_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "admin", label: "مسؤول" },
  { value: "manager", label: "مدير" },
  { value: "member", label: "عضو فريق" },
  { value: "viewer", label: "زائر" },
];

function rateColor(rate) {
  if (rate >= 80) return { bar: "bg-emerald-500", text: "text-emerald-600" };
  if (rate >= 50) return { bar: "bg-amber-500", text: "text-amber-600" };
  return { bar: "bg-red-500", text: "text-red-600" };
}

export default function TeamMembersPage() {
  const router = useRouter();
  const { profile: currentProfile } = useAuth();

  const { users, tasks, userMap, loading } = useTeamData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const canManage = currentProfile?.role === "admin" || currentProfile?.role === "manager";

  // Enrich every user with task stats first, so filtering/sorting can use them.
  const enrichedUsers = useMemo(() => {
    return users.map((user) => {
      const memberTasks = tasks.filter((task) => {
        const assigneeId = getAssigneeId(task);
        return assigneeId === user.id;
      });
      const total = memberTasks.length;
      const done = memberTasks.filter((t) => t.status === "done").length;
      const inProgress = memberTasks.filter((t) => t.status === "in-progress").length;
      const review = memberTasks.filter((t) => t.status === "review").length;
      const revision = memberTasks.filter((t) => t.status === "revision").length;
      const overdue = memberTasks.filter(
        (t) => t.status !== "done" && isDeadlineOverdue(t.deadline),
      ).length;
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        ...user,
        _taskCount: total,
        _doneCount: done,
        _inProgressCount: inProgress + review + revision,
        _overdueCount: overdue,
        _completionRate: completionRate,
      };
    });
  }, [users, tasks]);

  const filteredUsers = useMemo(() => {
    let result = enrichedUsers.filter((m) => {
      const profile = userMap.get(m.id);
      const name = profile?.name || m.name || "";
      const email = profile?.email || m.email || "";
      const specialization = m.specialty || "";
      const matchesSearch = !search || name.includes(search) || email.includes(search) || specialization.includes(search);
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    result.sort((a, b) => {
      const profileA = userMap.get(a.id);
      const profileB = userMap.get(b.id);
      let valA, valB;

      switch (sortBy) {
        case "name":
          valA = profileA?.name || a.name || "";
          valB = profileB?.name || b.name || "";
          break;
        case "role":
          valA = a.role;
          valB = b.role;
          break;
        case "tasks":
          valA = a._taskCount || 0;
          valB = b._taskCount || 0;
          break;
        case "completion":
          valA = a._completionRate || 0;
          valB = b._completionRate || 0;
          break;
        default:
          valA = profileA?.name || a.name || "";
          valB = profileB?.name || b.name || "";
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB, "ar") : valB.localeCompare(valA, "ar");
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [enrichedUsers, userMap, search, roleFilter, sortBy, sortDir]);

  const totalUsers = users.length;
  const activeUsersCount = users.filter((m) => m.status === "active").length;
  const totalTasksAssigned = tasks.filter((t) => t.assigneeProfileId || t.assigneeId).length;
  const avgCompletion = enrichedUsers.length > 0
    ? Math.round(enrichedUsers.reduce((sum, m) => sum + m._completionRate, 0) / enrichedUsers.length)
    : 0;

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded-xl dark:bg-white/[0.08]" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-56 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />)}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink">أعضاء الفريق</h1>
          <p className="mt-1 text-sm text-ink/60">إدارة الأعضاء، تتبع الأداء، وتقارير الإنجاز</p>
        </div>
        {canManage && (
          <Button onClick={() => router.push("/dashboard/team/members/new")}>
            <Plus className="h-4 w-4" />
            إضافة عضو
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="إجمالي الأعضاء"
          value={totalUsers}
          description={activeUsersCount > 0 ? `${activeUsersCount} نشط` : "لا يوجد"}
          icon={Users}
          accent="primary"
        />
        <StatsCard
          label="المهام المسندة"
          value={totalTasksAssigned}
          description="قيد التتبع"
          icon={Briefcase}
          accent="amber"
        />
        <StatsCard
          label="معدل الإنجاز العام"
          value={`${avgCompletion}%`}
          description="متوسط الفريق"
          icon={TrendingUp}
          accent="emerald"
        />
        <StatsCard
          label="بانتظار المراجعة"
          value={enrichedUsers.reduce((sum, m) => sum + m._inProgressCount, 0)}
          description="في مراحل المراجعة والتنفيذ"
          icon={Loader2}
          accent="violet"
        />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-ink/[0.07] bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الإيميل، التخصص..."
              className="h-11 w-full rounded-xl border border-ink/10 bg-surface/60 pr-10 pl-4 text-sm text-ink outline-none transition-all placeholder:text-ink/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Role filter chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {ROLE_FILTERS.map((filter) => {
                const isActive = roleFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setRoleFilter(filter.value)}
                    className={`h-9 rounded-full px-4 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-ink text-white shadow-sm"
                        : "bg-surface text-ink/60 hover:bg-ink/[0.06] hover:text-ink"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                options={[
                  { value: "name", label: "الاسم" },
                  { value: "role", label: "الدور" },
                  { value: "tasks", label: "عدد المهام" },
                  { value: "completion", label: "معدل الإنجاز" },
                ]}
                className="w-full sm:w-40"
              />
              <Button variant="outline" size="icon" onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")} title="عكس الترتيب">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-card py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/[0.04]">
            <Users className="h-8 w-8 text-ink/30" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">لا يوجد أعضاء</h3>
          <p className="mt-1 text-sm text-ink/60">{search ? "جرب تغيير البحث أو الفلاتر" : "ابدأ بإضافة أول عضو للفريق"}</p>
          {canManage && (
            <Button className="mt-5" onClick={() => router.push("/dashboard/team/members/new")}>
              <Plus className="h-4 w-4" />
              إضافة عضو
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const profile = userMap.get(user.id);
            const name = profile?.name || user.name || "عضو";
            const email = profile?.email || user.email || "";
            const avatar = user.photoURL || user.logo || profile?.photoURL || profile?.logo || "";
            const role = user.role || "member";
            const specialization = user.specialty || "";
            const isActive = user.status !== "inactive";
            const rate = rateColor(user._completionRate || 0);

            return (
              <div
                key={user.id}
                className="group flex flex-col rounded-2xl border border-ink/[0.07] bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <Avatar src={avatar} alt={name} size={52} className="ring-2 ring-ink/[0.06]" />
                    <span
                      className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-card ${
                        isActive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      title={isActive ? "نشط" : "غير نشط"}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/team/members/${user.id}`} className="block">
                      <p className="truncate font-bold text-ink transition-colors group-hover:text-primary">
                        {name}
                      </p>
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-ink/50" dir="ltr">{email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge variant={ROLE_BADGES[role] || "secondary"}>{ROLE_LABELS[role] || role}</Badge>
                      {specialization && (
                        <span className="truncate rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink/60">
                          {specialization}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2 rounded-xl bg-surface/70 p-2.5">
                  <div className="text-center">
                    <p className="text-base font-black text-ink">{user._taskCount}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-ink/50">المهام</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-amber-600">{user._inProgressCount}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-ink/50">قيد العمل</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-emerald-600">{user._doneCount}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-ink/50">مكتمل</p>
                  </div>
                  <div className="text-center">
                    {user._overdueCount > 0 ? (
                      <p className="inline-flex items-center gap-1 text-base font-black text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {user._overdueCount}
                      </p>
                    ) : (
                      <p className="text-base font-black text-ink/30">0</p>
                    )}
                    <p className="mt-0.5 text-[10px] font-medium text-ink/50">متأخر</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink/60">معدل الإنجاز</span>
                    <span className={`font-black ${rate.text}`}>{user._completionRate}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                    <div
                      className={`h-full ${rate.bar} transition-all duration-500`}
                      style={{ width: `${user._completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-ink/[0.06] pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center"
                    onClick={() => router.push(`/dashboard/team/members/${user.id}`)}
                  >
                    الملف
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/dashboard/team/members/${user.id}/edit`)}
                      title="تعديل"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
