"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Search,
  User,
  Users,
  Filter,
  ArrowUpDown,
  Briefcase,
  CheckCircle2,
  Loader2,
  AlertCircle,
  TrendingUp,
  Settings,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { useTeamData } from "@/features/team/hooks/useTeamData";

import Avatar from "@/features/dashboard/ui/Avatar";
import Button from "@/features/dashboard/ui/Button";
import Card from "@/features/dashboard/ui/Card";
import Badge from "@/features/dashboard/ui/Badge";
import StatsCard from "@/features/dashboard/ui/StatsCard";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";
import { getAssigneeId } from "@/features/team/lib/teamUtils";

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

export default function TeamMembersPage() {
  const theme = usePageTheme();
  const { profile: currentProfile } = useAuth();

  const { users, tasks, projects, userMap, loading } = useTeamData();

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
      const overdue = memberTasks.filter((t) => t.status !== "done" && t.deadline && new Date(t.deadline) < new Date()).length;
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
            <div className="h-96 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">أعضاء الفريق</h1>
          <p className="text-sm text-ink/60">إدارة الأعضاء، تتبع الأداء، وتقارير الإنجاز</p>
        </div>
        {canManage && (
          <Button onClick={() => window.location.href = "/dashboard/team/members/new"}>
            <Plus className="h-4 w-4 ml-2" />
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
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الإيميل، التخصص..."
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-ink/10 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 px-4 rounded-xl border border-ink/10 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink"
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">مسؤول</option>
              <option value="manager">مدير</option>
              <option value="member">عضو فريق</option>
              <option value="viewer">زائر</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-4 rounded-xl border border-ink/10 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink"
            >
              <option value="name">الاسم</option>
              <option value="role">الدور</option>
              <option value="tasks">عدد المهام</option>
              <option value="completion">معدل الإنجاز</option>
            </select>

            <Button variant="outline" size="icon" onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")} title="عكس الترتيب">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Grid */}
      <Card className="p-0 overflow-hidden">
        {enrichedUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-ink/20" />
            <h3 className="mt-4 text-lg font-bold text-ink">لا يوجد أعضاء</h3>
            <p className="mt-1 text-ink/60">{search ? "جرب تغيير البحث أو الفلاتر" : "ابدأ بإضافة أول عضو للفريق"}</p>
            {canManage && (
              <Button className="mt-4" onClick={() => window.location.href = "/dashboard/team/members/new"}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة عضو
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-ink/60 bg-ink/[0.02]">
                  <th className="py-4 pr-6 text-right">العضو</th>
                  <th className="py-4 px-4 hidden md:table-cell">الدور</th>
                  <th className="py-4 px-4 hidden lg:table-cell text-center">التخصص</th>
                  <th className="py-4 px-4 text-center">المهام</th>
                  <th className="py-4 px-4 text-center">قيد التنفيذ</th>
                  <th className="py-4 px-4 text-center">مكتمل</th>
                  <th className="py-4 px-4 text-center">معدل الإنجاز</th>
                  <th className="py-4 px-4 text-center">متأخر</th>
                  <th className="py-4 pl-6">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {enrichedUsers.map((user) => {
                  const profile = userMap.get(user.id);
                  const name = profile?.name || user.name || "عضو";
                  const email = profile?.email || user.email || "";
                  const avatar = user.photoURL || user.logo || profile?.photoURL || profile?.logo || "";
                  const role = user.role || "member";
                  const specialization = user.specialty || "—";

                  return (
                    <tr key={user.id} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="py-4 pr-6">
                        <Link href={`/dashboard/team/members/${user.id}`} className="flex items-center gap-3 group">
                          <Avatar src={avatar} alt={name} size={36} />
                          <div className="min-w-0">
                            <p className="font-medium text-ink group-hover:text-primary transition-colors truncate max-w-xs">{name}</p>
                            <p className="text-xs text-ink/60 truncate max-w-xs">{email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <Badge variant={ROLE_BADGES[role] || "secondary"}>{ROLE_LABELS[role] || role}</Badge>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell text-center text-sm text-ink/60 truncate max-w-[120px]">
                        {specialization}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-ink">{user._taskCount}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-medium text-amber-600">{user._inProgressCount}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-medium text-emerald-600">{user._doneCount}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 max-w-[80px] h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                            <div
                              className={`h-full transition-all duration-500 ${
                                user._completionRate >= 80 ? "bg-emerald-500" :
                                user._completionRate >= 50 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${user._completionRate}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${user._completionRate >= 80 ? "text-emerald-600" : user._completionRate >= 50 ? "text-amber-600" : "text-red-600"}`}>
                            {user._completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user._overdueCount > 0 ? (
                          <span className="font-bold text-red-600 flex items-center justify-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {user._overdueCount}
                          </span>
                        ) : (
                          <span className="text-ink/60">—</span>
                        )}
                      </td>
                      <td className="py-4 pl-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/team/members/${user.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink/60 hover:bg-primary/10 hover:text-primary transition-colors"
                            title="تقرير مفصل"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Link>
                          {canManage && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.location.href = `/dashboard/team/members/${user.id}/edit`}
                              title="تعديل"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      </div>
    </ProtectedRoute>
  );
}