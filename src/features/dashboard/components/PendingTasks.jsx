"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

const statusLabels = Object.fromEntries(
  WORKFLOW_STATUSES.map((status) => [status.value, status.labelAr]),
);

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-600",
  urgent: "bg-red-50 text-red-600",
};

export default function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          orderBy("createdAt", "desc"),
          limit(8),
        );
        const snap = await getDocs(tasksQuery);

        if (!cancelled) {
          const items = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter(
              (t) => t.status !== "done" && t.status !== "approved",
            )
            .slice(0, 5);

          setTasks(items);
        }
      } catch (err) {
        console.error("Failed loading pending tasks:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchUsers() {
      try {
        const usersQuery = query(collection(db, "profiles"), limit(200));
        const snap = await getDocs(usersQuery);
        if (!cancelled) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setUsers(items);
        }
      } catch (err) {
        console.error("Failed loading profiles:", err);
      }
    }

    fetchData();
    fetchUsers();
    return () => { cancelled = true; };
  }, []);

  function getUserName(task) {
    const assigneeId = task?.assigneeProfileId || task?.assigneeId;
    if (!assigneeId) return "غير معين";
    return users.find((user) => user.id === assigneeId)?.name || "غير معين";
  }

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-[24px] border border-gray-200/80 bg-card" />
    );
  }

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              المهام المعلقة
            </h2>
            <p className="mt-0.5 text-xs font-medium text-gray-400">
              مهام فريق العمل التي تحتاج متابعة
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/team"
          className="group flex items-center gap-1.5 text-xs font-bold text-amber-600 transition-colors hover:text-amber-700"
        >
          الكل
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
          <ClipboardList className="h-6 w-6 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">لا توجد مهام معلقة</p>
          <p className="text-[11px] text-gray-400">كل المهام مكتملة. شغل رائع!</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                href={`/dashboard/team/tasks/${task.id || ""}`}
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:border-amber-100 hover:bg-amber-50/40"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-amber-700">
                    {task.title || "بدون عنوان"}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-gray-400">
                    {getUserName(task)}
                    {task.deadline ? ` • ${task.deadline}` : ""}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold ${priorityColors[task.priority] || "bg-gray-100 text-gray-600"}`}
                >
                  {statusLabels[task.status] || task.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
