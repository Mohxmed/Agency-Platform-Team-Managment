"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Search,
  FolderKanban,
  Plus,
  ClipboardList,
  CheckCircle2,
  Timer,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import ProjectModal from "@/features/team/components/ProjectModal";
import ProjectCard from "@/features/team/components/ProjectCard";

import {
  calcProjectProgress,
  canManageTeam,
  deriveProjectStatus,
  getProjectMemberIds,
  isDeadlineOverdue,
} from "@/features/team/lib/teamUtils";

import { removeDocument } from "@/lib/firestoreService";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import StatsCard from "@/features/dashboard/ui/StatsCard";
import Card from "@/features/dashboard/ui/Card";
import { Select } from "@/features/dashboard/ui/Input";

import PageHero from "@/features/dashboard/components/PageHero";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

const PAGE_SIZE = 8;

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageInner />
    </Suspense>
  );
}

function ProjectsPageInner() {
  const theme = usePageTheme();

  const { showToast } = useToast();

  const { profile } = useAuth();

  const canManage = canManageTeam(profile?.role);

  const { projects, tasks, activeUsers, clients, userMap, clientMap, loading } =
    useTeamData();

  const searchParams = useSearchParams();

  const assigneeParam = searchParams.get("assignee");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const tasksByProject = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.projectId) return;
      map[task.projectId] = map[task.projectId] || [];
      map[task.projectId].push(task);
    });
    return map;
  }, [tasks]);

  const derivedStatusByProject = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      map[project.id] = deriveProjectStatus(
        tasksByProject[project.id] || [],
        project.status,
      );
    });
    return map;
  }, [projects, tasksByProject]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        derivedStatusByProject[project.id] === statusFilter;

      const matchesMember =
        !assigneeParam ||
        getProjectMemberIds(project).includes(assigneeParam);

      return matchesSearch && matchesStatus && matchesMember;
    });
  }, [projects, search, statusFilter, derivedStatusByProject, assigneeParam]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    list.sort((a, b) => {
      if (sortBy === "oldest") {
        return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0);
      }

      if (sortBy === "deadline-nearest") {
        return (a.deadline?.toMillis?.() || 0) - (b.deadline?.toMillis?.() || 0);
      }

      if (sortBy === "deadline-furthest") {
        return (b.deadline?.toMillis?.() || 0) - (a.deadline?.toMillis?.() || 0);
      }

      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });

    return list;
  }, [filteredProjects, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pageProjects = sortedProjects.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeCount = projects.filter(
    (project) =>
      ["in-progress", "review", "revision"].includes(
        derivedStatusByProject[project.id],
      ),
  ).length;

  const doneCount = projects.filter(
    (project) => derivedStatusByProject[project.id] === "done",
  ).length;

  const overdueCount = projects.filter(
    (project) =>
      derivedStatusByProject[project.id] !== "done" &&
      isDeadlineOverdue(project.deadline),
  ).length;

  const stats = [
    {
      label: "إجمالي المشاريع",
      value: projects.length,
      description: "كل مشاريع الفريق",
      icon: FolderKanban,
      accent: "primary",
    },
    {
      label: "قيد التنفيذ",
      value: activeCount,
      description: "تنفيذ ومراجعة",
      icon: Loader2,
      accent: "amber",
    },
    {
      label: "منجزة",
      value: doneCount,
      description: "مكتملة ومعتمدة",
      icon: CheckCircle2,
      accent: "emerald",
    },
    {
      label: "متأخرة",
      value: overdueCount,
      description: "تجاوزت موعد التسليم",
      icon: Timer,
      accent: "danger",
    },
  ];

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleDelete(project) {
    if (!canManage) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المشاريع.",
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مشروع "${project.title}" وجميع مهامه؟`,
    );

    if (!confirmed || deleting) return;

    setDeleting(true);

    try {
      const projectTasks = tasks.filter(
        (task) => task.projectId === project.id,
      );

      await Promise.all([
        removeDocument("teamProjects", project.id),
        ...projectTasks.map((task) => removeDocument("tasks", task.id)),
      ]);
    } catch (error) {
      console.error("Failed to delete project:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المشروع.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function pageNumbers() {
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, safePage + 2);
    const numbers = [];

    for (let i = start; i <= end; i += 1) {
      numbers.push(i);
    }

    return numbers;
  }

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded-xl dark:bg-white/[0.08]" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-gray-100 rounded-2xl dark:bg-white/[0.04]"
                />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-2xl dark:bg-white/[0.04]"
                />
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <PageHero
          icon={FolderKanban}
          eyebrow="الفريق"
          title={assigneeParam ? "مشاريع العضو" : "المشاريع"}
          subtitle={
            assigneeParam
              ? "المشاريع المسندة إلى هذا العضو."
              : "استعرض مشاريع الفريق، وتابع تقدمها ومواعيد تسليمها."
          }
          badge="PROJECTS"
        >
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-red-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-red-50 dark:bg-black dark:text-white dark:hover:bg-black/80 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            مشروع جديد
          </button>
        </PageHero>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              accent={stat.accent}
            />
          ))}
        </div>

        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/60" />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="ابحث بعنوان المشروع أو وصفه..."
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-ink/10 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
              <Select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="كل الحالات"
                options={[
                  { value: "all", label: "كل الحالات" },
                  ...WORKFLOW_STATUSES.map((status) => ({
                    value: status.value,
                    label: status.labelAr,
                  })),
                ]}
                className="sm:w-44"
              />

              <Select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
                placeholder="الأحدث أولاً"
                options={[
                  { value: "newest", label: "الأحدث أولاً" },
                  { value: "oldest", label: "الأقدم أولاً" },
                  { value: "deadline-nearest", label: "الأقرب تسليمًا" },
                  { value: "deadline-furthest", label: "الأبعد تسليمًا" },
                ]}
                className="sm:w-48"
              />
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        {pageProjects.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-ink/10 bg-card px-6 text-center dark:border-white/10">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bgSoftStrong} ${theme.textSoft}`}
            >
              <FolderKanban className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-black text-ink">
              {sortedProjects.length === 0
                ? "لا توجد مشاريع بعد"
                : "لا توجد نتائج مطابقة"}
            </h3>

            <p className="mt-1.5 max-w-sm text-sm leading-6 text-ink/60">
              {sortedProjects.length === 0
                ? "أنشئ أول مشروع ووزّع مهامه على أعضاء فريقك."
                : "جرب تغيير البحث أو فلتر الحالة."}
            </p>

            {sortedProjects.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${theme.solid} ${theme.solidHover}`}
              >
                <Plus className="h-4 w-4" />
                إنشاء مشروع
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pageProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasksByProject[project.id] || []}
                  userMap={userMap}
                  clientMap={clientMap}
                  theme={theme}
                  canManage={canManage}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ink/10 px-6 py-4">
              <p className="text-xs font-medium text-ink/60">
                عرض {pageProjects.length} من {sortedProjects.length} مشروع
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  disabled={safePage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.05]"
                  title="الصفحة السابقة"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {safePage > 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-xs font-bold text-ink/60 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                    >
                      1
                    </button>

                    <span className="px-1 text-xs text-ink/40">...</span>
                  </>
                )}

                {pageNumbers().map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                      number === safePage
                        ? "bg-primary text-white shadow-sm"
                        : "border border-ink/10 bg-white text-ink/60 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                {safePage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-xs text-ink/40">...</span>

                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-xs font-bold text-ink/60 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setPage((previous) => Math.min(totalPages, previous + 1))
                  }
                  disabled={safePage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.05]"
                  title="الصفحة التالية"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editingProject}
        users={activeUsers}
        clients={clients}
        onSaved={() => setModalOpen(false)}
      />
    </ProtectedRoute>
  );
}
