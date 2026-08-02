"use client";

import { useEffect, useMemo, useState } from "react";

import {
  FolderKanban,
  Plus,
  ClipboardList,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import TeamHero from "@/features/team/components/TeamHero";
import ProjectCard from "@/features/team/components/ProjectCard";
import ProjectModal from "@/features/team/components/ProjectModal";

import { canManageTeam, getProjectMemberIds } from "@/features/team/lib/teamUtils";

import { removeDocument } from "@/lib/firestoreService";

import StatsCard from "@/features/dashboard/ui/StatsCard";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

export default function TeamProjectsPage() {
  const theme = usePageTheme();

  const { showToast } = useToast();

  const { profile } = useAuth();

  const canManage = canManageTeam(profile?.role);

  const { projects, tasks, activeUsers, userMap, clientMap, clients, loading } =
    useTeamData();

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("quickActionCreate") === "open-create") {
      sessionStorage.removeItem("quickActionCreate");
      // Intentional: open the create modal once on mount via a stored flag.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalOpen(true);
    }
  }, []);

  const tasksByProject = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.projectId) return;
      map[task.projectId] = map[task.projectId] || [];
      map[task.projectId].push(task);
    });
    return map;
  }, [tasks]);

  // Members may only see the projects they participate in.
  const visibleProjects = useMemo(() => {
    if (canManage) return projects;
    const uid = profile?.uid || "";
    return projects.filter((project) =>
      getProjectMemberIds(project).includes(uid),
    );
  }, [projects, canManage, profile, currentUser]);

  const stats = useMemo(
    () => [
      {
        label: "المشاريع",
        value: visibleProjects.length,
        description: canManage ? "إجمالي مشاريع الفريق." : "المشاريع المشترك فيها.",
        icon: FolderKanban,
        footer: "teamProjects",
      },
      {
        label: "المهام",
        value: tasks.length,
        description: "إجمالي المهام الموزعة على الفريق.",
        icon: ClipboardList,
        footer: "tasks",
      },
      {
        label: "المكتملة",
        value: tasks.filter(
          (task) => task.status === "done",
        ).length,
        description: "مهام تم إنهاؤها واعتمادها.",
        icon: CheckCircle2,
        footer: "done",
      },
      {
        label: "قيد التنفيذ",
        value: tasks.filter((task) => task.status === "in-progress").length,
        description: "مهام تعمل الآن داخل الفريق.",
        icon: Loader2,
        footer: "in-progress",
      },
    ],
    [visibleProjects, tasks, canManage],
  );

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleDelete(project) {
    if (!canManageTeam(profile?.role)) {
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

    if (!confirmed) return;

    if (deleting) return;

    setDeleting(true);

    try {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);

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

  return (
    <ProtectedRoute permission="projects">
      <div dir="rtl" className="space-y-6">
        <TeamHero
          icon={FolderKanban}
          title="المشاريع"
          subtitle="أنشئ مشاريع الفريق ووزّع مهامها على الأعضاء."
        >
          <button
            type="button"
            onClick={openCreate}
            className={`w-full overflow-hidden rounded-xl bg-gradient-to-r ${theme.gradient} px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 ${theme.gradientHover} sm:w-auto`}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              مشروع جديد
            </span>
          </button>
        </TeamHero>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard
                key={`${stat.label}-${index}`}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                footer={stat.footer}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <TrendingUp className={`h-4 w-4 ${theme.textSoft}`} />
          <h2 className="text-base font-black tracking-tight text-ink">
            جميع المشاريع
          </h2>

          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${theme.chip}`}>
            {projects.length}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-[24px] border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className={`flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed ${theme.border} ${theme.bgSofter} px-6 text-center`}>
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bgSoftStrong} ${theme.textSoft}`}>
              <FolderKanban className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-black text-ink">
              لا توجد مشاريع بعد
            </h3>

            <p className="mt-1.5 max-w-sm text-sm leading-6 text-ink/40">
              أنشئ أول مشروع ووزّع مهامه على أعضاء فريقك.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${theme.solid} ${theme.solidHover}`}
            >
              <Plus className="h-4 w-4" />
              إنشاء مشروع
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectTasks={tasksByProject[project.id] || []}
                userMap={userMap}
                clientMap={clientMap}
                onEdit={openEdit}
                onDelete={handleDelete}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editingProject}
        users={activeUsers}
        clients={clients}
      />
    </ProtectedRoute>
  );
}
