"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Award,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Phone,
  PieChart,
  Target,
  TrendingUp,
  UserCog,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { useTeamData } from "@/features/team/hooks/useTeamData";

import Avatar from "@/features/dashboard/ui/Avatar";
import Button from "@/features/dashboard/ui/Button";
import Card from "@/features/dashboard/ui/Card";
import StatsCard from "@/features/dashboard/ui/StatsCard";
import Badge from "@/features/dashboard/ui/Badge";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";
import {
  getWorkflowMeta,
  formatDeadline,
  isDeadlineOverdue,
  getTimestampMs,
  canManageTeam,
} from "@/features/team/lib/teamUtils";

const STATUS_COLORS = {
  backlog: "bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-ink/70",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  review: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  revision: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  done: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
};

const STATUS_LABELS = {
  backlog: "تراكمي",
  "in-progress": "قيد التنفيذ",
  review: "مراجعة",
  revision: "تعديلات",
  done: "منجز",
};

const ROLE_LABELS = {
  admin: "مسؤول",
  manager: "مدير",
  member: "عضو فريق",
  viewer: "زائر",
  custom: "صلاحيات مخصصة",
};

export default function MemberReportPage() {
  const theme = usePageTheme();
  const params = useParams();
  const router = useRouter();
  const { profile: currentProfile } = useAuth();
  const memberId = params?.id;

  const [period, setPeriod] = useState("week");

  const { users, tasks, projects, userMap, loading } = useTeamData();

  const member = useMemo(
    () => users.find((m) => m.id === memberId) || null,
    [users, memberId]
  );

  const memberProfile = member ? userMap.get(memberId) : null;
  const memberName = memberProfile?.name || member?.name || "عضو الفريق";
  const memberEmail = memberProfile?.email || member?.email || "";
  const memberRole = member?.role || "member";
  const memberSpecialization = member?.specialty || "—";
  const memberPhone = member?.phone || "—";
  const memberAvatar = member?.photoURL || member?.logo || memberProfile?.photoURL || memberProfile?.logo || "";

  const memberTasks = useMemo(
    () =>
      tasks
        .filter((task) => {
          const assigneeId = task.assigneeProfileId || task.assigneeId;
          return assigneeId === memberId;
        })
        .sort(
          (a, b) =>
            getTimestampMs(b.updatedAt || b.createdAt) -
            getTimestampMs(a.updatedAt || a.createdAt),
        ),
    [tasks, memberId]
  );

  const memberProjects = useMemo(() => {
    const projectIds = new Set(memberTasks.map((t) => t.projectId).filter(Boolean));
    return projects.filter((p) => projectIds.has(p.id));
  }, [memberTasks, projects]);

  const periodStart = useMemo(() => {
    const now = new Date();
    if (period === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    if (period === "month") {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return null;
  }, [period]);

  const periodTasks = useMemo(() => {
    if (!periodStart) return memberTasks;
    const startMs = periodStart.getTime();
    return memberTasks.filter((t) => {
      const ts = getTimestampMs(t.updatedAt || t.createdAt);
      return ts >= startMs;
    });
  }, [memberTasks, periodStart]);

  const stats = useMemo(() => {
    const total = memberTasks.length;
    const done = memberTasks.filter((t) => t.status === "done").length;
    const inProgress = memberTasks.filter((t) => t.status === "in-progress").length;
    const review = memberTasks.filter((t) => t.status === "review").length;
    const revision = memberTasks.filter((t) => t.status === "revision").length;
    const backlog = memberTasks.filter((t) => t.status === "backlog").length;

    const completedThisMonth = memberTasks.filter((t) => {
      if (t.status !== "done") return false;
      const updated = t.updatedAt ? new Date(getTimestampMs(t.updatedAt)) : null;
      if (!updated) return false;
      const now = new Date();
      return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear();
    }).length;

    const completedInPeriod = periodTasks.filter((t) => t.status === "done").length;
    const activeInPeriod = periodTasks.filter((t) => t.status !== "done").length;

    const overdue = memberTasks.filter(
      (t) => t.status !== "done" && isDeadlineOverdue(t.deadline)
    ).length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      total,
      done,
      inProgress,
      review,
      revision,
      backlog,
      completedThisMonth,
      completedInPeriod,
      activeInPeriod,
      overdue,
      completionRate,
    };
  }, [memberTasks, periodTasks]);

  const statusBreakdown = useMemo(() => [
    { key: "done", label: "منجز", count: stats.done, color: "bg-emerald-500" },
    { key: "in-progress", label: "قيد التنفيذ", count: stats.inProgress, color: "bg-amber-500" },
    { key: "review", label: "مراجعة", count: stats.review, color: "bg-violet-500" },
    { key: "revision", label: "تعديلات", count: stats.revision, color: "bg-red-500" },
    { key: "backlog", label: "تراكمي", count: stats.backlog, color: "bg-gray-500" },
  ], [stats]);

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

  if (!member) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <Card className="text-center py-12">
            <UserCog className="h-16 w-16 mx-auto text-gray-500 dark:text-ink/40" />
            <h3 className="mt-4 text-xl font-bold text-ink">العضو غير موجود</h3>
            <p className="mt-2 text-gray-500 dark:text-ink/60">لم يتم العثور على بيانات هذا العضو.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              رجوع
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const canManage = canManageTeam(currentProfile?.role);

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" aria-label="رجوع" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-ink">تقرير العضو</h1>
            <p className="text-sm text-ink/60">لوحة أداء شاملة لـ {memberName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={memberRole === "admin" ? "danger" : memberRole === "manager" ? "warning" : "secondary"}>
            {ROLE_LABELS[memberRole] || memberRole}
          </Badge>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-primary-400/10" />
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              src={memberAvatar}
              alt={memberName}
              size={80}
              className="ring-4 ring-white dark:ring-gray-800 shadow-xl"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black text-ink truncate">{memberName}</h2>
                <Badge variant="outline">{ROLE_LABELS[memberRole] || memberRole}</Badge>
              </div>
              <p className="mt-1 text-ink/60">{memberEmail}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-1.5 text-ink/60">
                  <Briefcase className="h-4 w-4 text-ink/60" />
                  التخصص: <span className="font-medium text-ink">{memberSpecialization}</span>
                </span>
                <span className="flex items-center gap-1.5 text-ink/60">
                  <Phone className="h-4 w-4 text-ink/60" />
                  {memberPhone}
                </span>
                <span className="flex items-center gap-1.5 text-ink/60">
                  <Target className="h-4 w-4 text-ink/60" />
                  معدل الإنجاز: <span className="font-bold text-primary">{stats.completionRate}%</span>
                </span>
              </div>
            </div>
            {canManage && (
              <Link
                href={`/dashboard/team/members/${memberId}/edit`}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-ink/10 px-5 text-sm font-bold text-ink/70 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <UserCog className="h-4 w-4" />
                تعديل الملف
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Period Toggle */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-ink">إحصائيات الأداء</h3>
            <p className="mt-0.5 text-xs text-ink/60">
              {period === "week" ? "آخر 7 أيام" : "الشهر الحالي"}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-ink/[0.04] p-1">
            <button
              type="button"
              onClick={() => setPeriod("week")}
              className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
                period === "week"
                  ? "bg-card text-primary shadow-sm"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              أسبوع
            </button>
            <button
              type="button"
              onClick={() => setPeriod("month")}
              className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
                period === "month"
                  ? "bg-card text-primary shadow-sm"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              شهر
            </button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label={period === "week" ? "مهام الأسبوع" : "مهام الشهر"}
          value={stats.completedInPeriod + stats.activeInPeriod}
          description="نشطة خلال الفترة"
          icon={Briefcase}
          accent="primary"
        />
        <StatsCard
          label="منجز"
          value={stats.completedInPeriod}
          description={`${stats.completionRate}% معدل إنجاز`}
          icon={CheckCircle2}
          accent="emerald"
          trend={stats.completedInPeriod > 0 ? `+${stats.completedInPeriod} ${period === "week" ? "هذا الأسبوع" : "هذا الشهر"}` : undefined}
        />
        <StatsCard
          label="قيد التنفيذ"
          value={stats.inProgress + stats.review + stats.revision}
          description="نشطة حالياً"
          icon={Loader2}
          accent="amber"
        />
        <StatsCard
          label="متأخر"
          value={stats.overdue}
          description={stats.overdue > 0 ? "يحتاج متابعة" : "لا يوجد"}
          icon={CalendarDays}
          accent={stats.overdue > 0 ? "red" : "emerald"}
        />
      </div>

      {/* Status Breakdown & Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status Distribution */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">توزيع الحالات</h3>
            <PieChart className="h-5 w-5 text-ink/60" />
          </div>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.key} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{s.label}</span>
                    <span className="font-bold text-ink">{s.count}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                    <div
                      className={`h-full ${s.color} transition-all duration-500`}
                      style={{ width: `${stats.total > 0 ? (s.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-bold text-ink mb-4">إجراءات سريعة</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start gap-3" onClick={() => router.push(`/dashboard/team/my-tasks?assignee=${memberId}`)}>
              <Briefcase className="h-4 w-4" />
              عرض جميع المهام
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push(`/dashboard/team/projects?assignee=${memberId}`)}>
              <Target className="h-4 w-4" />
              المشاريع المسندة
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push(`/dashboard/team/progress?member=${memberId}`)}>
              <TrendingUp className="h-4 w-4" />
              تقرير التقدم
            </Button>
            {currentProfile?.role === "admin" && (
              <Link
                href="/dashboard/settings/users"
                className="inline-flex w-full items-center justify-start gap-3 rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <UserCog className="h-4 w-4" />
                إدارة الصلاحيات
              </Link>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Tasks Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink">آخر المهام</h3>
          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/team/my-tasks?assignee=${memberId}`)}>
            عرض الكل
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {memberTasks.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-ink/20" />
            <p className="mt-3 text-ink/60">لا توجد مهام مسندة لهذا العضو بعد.</p>
            <Button className="mt-4" onClick={() => router.push(`/dashboard/team`)}>
              إنشاء مهمة جديدة
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-ink/60">
                  <th className="pb-3 pr-4">المهمة</th>
                  <th className="pb-3 pr-4 hidden md:table-cell">المشروع</th>
                  <th className="pb-3 pr-4 hidden lg:table-cell">الحالة</th>
                  <th className="pb-3 pr-4 hidden lg:table-cell">الأولوية</th>
                  <th className="pb-3 pl-4">الموعد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {memberTasks.slice(0, 10).map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const meta = getWorkflowMeta(task.status);
                  const isOverdue = task.status !== "done" && isDeadlineOverdue(task.deadline);
                  return (
                    <tr key={task.id} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <Link href={`/dashboard/team/tasks/${task.id}`} className="font-medium text-ink hover:text-primary truncate block max-w-xs">
                          {task.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell text-sm text-ink/60">
                        {project?.title || "—"}
                      </td>
                      <td className="py-3 pr-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[task.status] || STATUS_COLORS.backlog}`}>
                          {meta?.labelAr || STATUS_LABELS[task.status] || task.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 hidden lg:table-cell">
                        <Badge variant={task.priority === "high" || task.priority === "urgent" ? "danger" : task.priority === "medium" ? "warning" : "secondary"}>
                          {task.priority === "high" ? "عالية" : task.priority === "urgent" ? "عاجلة" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                        </Badge>
                      </td>
                      <td className={`py-3 pr-4 text-sm ${isOverdue ? "text-red-600 font-bold" : "text-ink/60"}`}>
                        {task.deadline ? formatDeadline(task.deadline) : "—"}
                        {isOverdue && <span className="ml-1 text-red-500">⚠</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Projects Summary */}
      {memberProjects.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-ink mb-4">المشاريع المسندة ({memberProjects.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberProjects.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const projectDone = projectTasks.filter((t) => t.status === "done").length;
              const projectTotal = projectTasks.length;
              const progress = projectTotal > 0 ? Math.round((projectDone / projectTotal) * 100) : 0;
              return (
                <Link key={project.id} href={`/dashboard/team/projects/${project.id}`} className="group p-4 rounded-xl border border-ink/10 hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white`}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-ink group-hover:text-primary transition-colors truncate">{project.title}</h4>
                      <p className="mt-1 text-sm text-ink/60">{projectDone} / {projectTotal} مهام منجزة</p>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                        <div className={`h-full ${theme.solid} transition-all duration-300`} style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-ink/60">{progress}% مكتمل</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      </div>
    </ProtectedRoute>
  );
}