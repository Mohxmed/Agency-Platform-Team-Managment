"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Activity as ActivityIcon,
  ArrowLeft,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  History,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  PieChart,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
  UserCog,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";
import { useTeamData } from "@/features/team/hooks/useTeamData";

import Avatar from "@/features/dashboard/ui/Avatar";
import Button from "@/features/dashboard/ui/Button";
import Badge from "@/features/dashboard/ui/Badge";
import StatsCard from "@/features/dashboard/ui/StatsCard";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";
import {
  getWorkflowMeta,
  formatDeadline,
  formatDateTime,
  isDeadlineOverdue,
  getTimestampMs,
  canManageTeam,
} from "@/features/team/lib/teamUtils";

const STATUS_COLORS = {
  backlog: "bg-gray-500/10 text-gray-600 dark:bg-white/[0.08] dark:text-ink/70",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  review: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  revision: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  done: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
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

const ACTIVITY_ICONS = {
  created: { icon: Plus, color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
  status: { icon: RefreshCw, color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
  comment: { icon: MessageSquare, color: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400" },
  checklist: { icon: ListChecks, color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" },
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
  const memberRole = member?.role || memberProfile?.role || "member";
  const memberSpecialization = member?.specialty || memberProfile?.specialty || "—";
  const memberPhone = member?.phone || memberProfile?.phone || "—";
  const memberStatus = memberProfile?.status || member?.status || "active";
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

  const memberActivity = useMemo(() => {
    const entries = [];
    memberTasks.forEach((task) => {
      (task.activity || []).forEach((entry) => {
        if (entry.authorId === memberId || entry.authorName === memberName) {
          entries.push({ ...entry, taskId: task.id, taskTitle: task.title });
        }
      });
    });
    return entries
      .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt))
      .slice(0, 10);
  }, [memberTasks, memberId, memberName]);

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
            <div className="h-44 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />
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
          <div className="rounded-2xl border border-ink/[0.07] bg-card py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/[0.04]">
              <UserRound className="h-8 w-8 text-ink/30" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">العضو غير موجود</h3>
            <p className="mt-2 text-sm text-ink/60">لم يتم العثور على بيانات هذا العضو.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const canManage = canManageTeam(currentProfile?.role);

  const completionColor =
    stats.completionRate >= 80 ? "text-emerald-600" :
    stats.completionRate >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" aria-label="رجوع" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink">الملف الشخصي للعضو</h1>
            <p className="mt-0.5 text-sm text-ink/60">لوحة أداء شاملة لـ {memberName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={memberRole === "admin" ? "danger" : memberRole === "manager" ? "warning" : "secondary"}>
            {ROLE_LABELS[memberRole] || memberRole}
          </Badge>
          <Badge variant={memberStatus === "active" ? "success" : "neutral"}>
            {memberStatus === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-ink/[0.07] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="h-24 bg-gradient-to-l from-primary-50 via-primary-100/60 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent" />
        <div className="-mt-12 px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar
                src={memberAvatar}
                alt={memberName}
                size={96}
                className="ring-4 ring-card"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-black tracking-tight text-ink">{memberName}</h2>
                  {memberStatus === "active" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="h-4 w-4" />
                      حساب نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-ink/50">
                      <CalendarDays className="h-4 w-4" />
                      حساب غير نشط
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <Badge variant={memberRole === "admin" ? "danger" : memberRole === "manager" ? "warning" : "secondary"}>
                    {ROLE_LABELS[memberRole] || memberRole}
                  </Badge>
                  <Badge variant="outline">{memberSpecialization}</Badge>
                </div>
              </div>
            </div>

            {canManage && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/dashboard/team/members/${memberId}/edit`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-card px-4 text-sm font-semibold text-ink/75 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <UserCog className="h-4 w-4" />
                  تعديل الملف
                </Link>
                {currentProfile?.role === "admin" && (
                  <Link
                    href="/dashboard/settings/users"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-card px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    إدارة الصلاحيات
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-surface/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink/50">البريد الإلكتروني</p>
                <p className="truncate text-sm font-semibold text-ink" dir="ltr">{memberEmail || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-surface/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                <Phone className="h-4 w-4 text-sky-600" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink/50">رقم الهاتف</p>
                <p className="truncate text-sm font-semibold text-ink" dir="ltr">{memberPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-surface/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Award className="h-4 w-4 text-emerald-600" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-ink/50">معدل الإنجاز</p>
                <p className={`text-sm font-black ${completionColor}`}>{stats.completionRate}%</p>
              </div>
              <div className="h-9 w-24 overflow-hidden rounded-full bg-ink/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.completionRate >= 80 ? "bg-emerald-500" :
                    stats.completionRate >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex flex-col gap-3 rounded-2xl border border-ink/[0.07] bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">إحصائيات الأداء</h3>
          <p className="mt-0.5 text-xs text-ink/60">
            {period === "week" ? "آخر 7 أيام" : "الشهر الحالي"}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-surface p-1">
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
          description={`${stats.completionRate}% معدل إنجاز إجمالي`}
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

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status Breakdown */}
          <div className="rounded-2xl border border-ink/[0.07] bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">توزيع الحالات</h3>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/[0.04]">
                <PieChart className="h-4.5 w-4.5 text-ink/50" />
              </span>
            </div>
            <div className="space-y-4">
              {statusBreakdown.map((s) => (
                <div key={s.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{s.label}</span>
                    <span className="font-black text-ink">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                    <div
                      className={`h-full ${s.color} transition-all duration-500`}
                      style={{ width: `${stats.total > 0 ? (s.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks Table */}
          <div className="rounded-2xl border border-ink/[0.07] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4 sm:px-6">
              <h3 className="text-lg font-bold text-ink">المهام المسندة ({memberTasks.length})</h3>
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/team/my-tasks?assignee=${memberId}`)}>
                عرض الكل
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>

            {memberTasks.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/[0.04]">
                  <Briefcase className="h-7 w-7 text-ink/30" />
                </div>
                <p className="mt-4 text-ink/60">لا توجد مهام مسندة لهذا العضو بعد.</p>
                <Button className="mt-4" onClick={() => router.push(`/dashboard/team`)}>
                  إنشاء مهمة جديدة
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/50">
                      <th className="px-5 py-3 sm:px-6">المهمة</th>
                      <th className="hidden px-4 py-3 md:table-cell">المشروع</th>
                      <th className="hidden px-4 py-3 lg:table-cell">الحالة</th>
                      <th className="hidden px-4 py-3 lg:table-cell">الأولوية</th>
                      <th className="px-5 py-3 text-left sm:px-6">الموعد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/[0.05]">
                    {memberTasks.slice(0, 8).map((task) => {
                      const project = projects.find((p) => p.id === task.projectId);
                      const meta = getWorkflowMeta(task.status);
                      const isOverdue = task.status !== "done" && isDeadlineOverdue(task.deadline);
                      return (
                        <tr key={task.id} className="transition-colors hover:bg-surface/50">
                          <td className="px-5 py-3.5 sm:px-6">
                            <Link href={`/dashboard/team/tasks/${task.id}`} className="block max-w-xs truncate font-semibold text-ink hover:text-primary">
                              {task.title}
                            </Link>
                          </td>
                          <td className="hidden px-4 py-3.5 text-sm text-ink/60 md:table-cell">
                            {project?.title || "—"}
                          </td>
                          <td className="hidden px-4 py-3.5 lg:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[task.status] || STATUS_COLORS.backlog}`}>
                              {meta?.labelAr || STATUS_LABELS[task.status] || task.status}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3.5 lg:table-cell">
                            <Badge variant={task.priority === "high" || task.priority === "urgent" ? "danger" : task.priority === "medium" ? "warning" : "secondary"}>
                              {task.priority === "high" ? "عالية" : task.priority === "urgent" ? "عاجلة" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                            </Badge>
                          </td>
                          <td className={`px-5 py-3.5 text-sm sm:px-6 ${isOverdue ? "font-bold text-red-600" : "text-ink/60"}`}>
                            {task.deadline ? formatDeadline(task.deadline) : "—"}
                            {isOverdue && <span className="mr-1 text-red-500">⚠</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projects Summary */}
          {memberProjects.length > 0 && (
            <div className="rounded-2xl border border-ink/[0.07] bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-ink">المشاريع المسندة ({memberProjects.length})</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {memberProjects.map((project) => {
                  const projectTasks = tasks.filter((t) => t.projectId === project.id);
                  const projectDone = projectTasks.filter((t) => t.status === "done").length;
                  const projectTotal = projectTasks.length;
                  const progress = projectTotal > 0 ? Math.round((projectDone / projectTotal) * 100) : 0;
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/team/projects/${project.id}`}
                      className="group rounded-xl border border-ink/[0.07] p-4 transition-all hover:border-primary/25 hover:bg-primary/[0.02]"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white`}>
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-bold text-ink transition-colors group-hover:text-primary">{project.title}</h4>
                          <p className="mt-1 text-sm text-ink/60">{projectDone} / {projectTotal} مهام منجزة</p>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                            <div className={`h-full ${theme.solid} transition-all duration-300`} style={{ width: `${progress}%` }} />
                          </div>
                          <p className="mt-1 text-xs font-medium text-ink/50">{progress}% مكتمل</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Activity / History */}
          <div className="rounded-2xl border border-ink/[0.07] bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink">
              <History className="h-5 w-5 text-ink/50" />
              سجل النشاط
            </h3>

            {memberActivity.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/[0.04]">
                  <ActivityIcon className="h-6 w-6 text-ink/30" />
                </div>
                <p className="mt-3 text-sm text-ink/60">لا يوجد نشاط مسجل لهذا العضو.</p>
              </div>
            ) : (
              <ol className="relative space-y-4 border-r border-ink/[0.08] pr-5">
                {memberActivity.map((entry) => {
                  const meta = ACTIVITY_ICONS[entry.type] || { icon: ActivityIcon, color: "bg-gray-500/10 text-gray-600 dark:bg-white/10 dark:text-ink/60" };
                  const Icon = meta.icon;
                  return (
                    <li key={entry.id} className="relative">
                      <span className={`absolute -right-[25px] top-0 flex h-5 w-5 items-center justify-center rounded-full ${meta.color}`}>
                        <Icon className="h-3 w-3" />
                      </span>
                      <Link
                        href={`/dashboard/team/tasks/${entry.taskId}`}
                        className="-m-2 block rounded-lg p-2 transition-colors hover:bg-surface/60"
                      >
                        <p className="text-xs font-bold text-ink">{entry.text}</p>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-ink/50">
                          في «{entry.taskTitle}» · {formatDateTime(entry.createdAt)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-ink/[0.07] bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-ink">إجراءات سريعة</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" onClick={() => router.push(`/dashboard/team/my-tasks?assignee=${memberId}`)}>
                <Briefcase className="h-4 w-4" />
                عرض جميع المهام
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/dashboard/team/projects?assignee=${memberId}`)}>
                <Target className="h-4 w-4" />
                المشاريع المسندة
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/dashboard/team/progress?member=${memberId}`)}>
                <TrendingUp className="h-4 w-4" />
                تقرير التقدم
              </Button>
            </div>
          </div>
        </div>
      </div>

      </div>
    </ProtectedRoute>
  );
}
