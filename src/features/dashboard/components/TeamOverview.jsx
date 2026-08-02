"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Timer,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "@/features/auth";
import { useTeamData } from "@/features/team/hooks/useTeamData";
import { getAssigneeId, getUserName, canManageTeam } from "@/features/team/lib/teamUtils";

import StatsCard from "../ui/StatsCard";

const priorityStyles = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-600",
  urgent: "bg-red-50 text-red-600",
};

export default function TeamOverview() {
  const { user: currentUser, profile } = useAuth();
  const { tasks, userMap, loading } = useTeamData();

  const profileId = profile?.uid || profile?.id || currentUser?.uid || "";

  const canManage = canManageTeam(profile?.role);

  const myTasks = useMemo(
    () =>
      tasks.filter((task) => profileId && getAssigneeId(task) === profileId),
    [tasks, profileId],
  );

  const myPending = useMemo(
    () => myTasks.filter((task) => task.status !== "done"),
    [myTasks],
  );

  const myOverdue = useMemo(
    () =>
      myTasks.filter(
        (task) =>
          task.status !== "done" &&
          task.deadline &&
          new Date(task.deadline) < new Date(),
      ),
    [myTasks],
  );

  const myDone = useMemo(
    () => myTasks.filter((task) => task.status === "done"),
    [myTasks],
  );

  // Managers/admins also care about tasks waiting on their review.
  const pendingReview = useMemo(
    () => tasks.filter((task) => task.status === "review"),
    [tasks],
  );

  const completionRate =
    myTasks.length > 0 ? Math.round((myDone.length / myTasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="grid animate-pulse gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-[24px] border border-gray-200/80 bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="مهامي"
          value={myTasks.length}
          description="إجمالي المهام المسندة إليك."
          icon={ClipboardList}
          accent="primary"
        />

        <StatsCard
          label="قيد التنفيذ"
          value={myPending.length}
          description="مهام لم تُنجز بعد."
          icon={Timer}
          accent="amber"
        />

        <StatsCard
          label="مؤجلة"
          value={myOverdue.length}
          description="مهام فات موعد تسليمها."
          icon={AlertTriangle}
          accent={myOverdue.length > 0 ? "danger" : "emerald"}
        />

        <StatsCard
          label="معدل الإنجاز"
          value={`${completionRate}%`}
          description={`${myDone.length} من ${myTasks.length} مهمة مكتملة.`}
          icon={CheckCircle2}
          accent="emerald"
        />
      </section>

      {canManage && pendingReview.length > 0 && (
        <section className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-gray-900">
                  بانتظار المراجعة
                </h2>
                <p className="mt-0.5 text-xs font-medium text-gray-400">
                  مهام فريق العمل تحتاج قرارك
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/team"
              className="flex items-center gap-1.5 text-xs font-bold text-violet-600 transition-colors hover:text-violet-700"
            >
              الكل
            </Link>
          </div>

          <ul className="space-y-2">
            {pendingReview.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/dashboard/team/tasks/${task.id || ""}`}
                  className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:border-violet-100 hover:bg-violet-50/40"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-violet-700">
                      {task.title || "بدون عنوان"}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-gray-400">
                      <CalendarDays className="h-3 w-3" />
                      {getUserName(userMap, getAssigneeId(task))}
                      {task.deadline ? ` • ${task.deadline}` : ""}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold ${priorityStyles[task.priority] || "bg-gray-100 text-gray-600"}`}
                  >
                    مراجعة
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}