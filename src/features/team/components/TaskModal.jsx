"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CheckSquare,
  ChevronDown,
  Plus,
  Trash2,
  Link2,
  Tag,
  ListChecks,
  X,
  ExternalLink,
} from "lucide-react";

import Modal from "@/features/dashboard/ui/Modal";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea, Select } from "@/features/dashboard/ui/Input";
import Avatar from "@/features/dashboard/ui/Avatar";

import { roleConfig } from "@/constants/permissions";

import { createDocument, updateDocument } from "@/lib/firestoreService";

import {
  notifyMany,
  getManagerUserIds,
  getProjectMemberUserIds,
  getTaskRecipientUserIds,
} from "@/lib/notificationService";

import { WORKFLOW_STATUSES, PRIORITIES } from "@/constants/workflow";
import {
  uid,
  canMemberAdvance,
  nextWorkflowStatus,
} from "../lib/teamUtils";

const EMPTY_FORM = {
  projectId: "",
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  assigneeProfileId: "",
  reviewerProfileId: "",
  deadline: "",
  labels: [],
  attachments: [],
  checklist: [],
};

function MemberSelect({ label, value = "", users = [], onChange }) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = users.find((user) => user.id === value);

  function selectUser(userId) {
    onChange(userId);
    setOpen(false);
  }

  return (
    <div className="relative w-full" ref={rootRef}>
      {label && (
        <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={`
          flex
          h-11
          w-full
          items-center
          justify-between
          gap-2
          rounded-xl
          border
          border-line
          bg-card
          px-3.5
          text-sm
          text-ink
          outline-none
          transition-all
          duration-200
          hover:border-ink/20
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
        `}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar user={selected} size={26} />

            <span className="min-w-0 text-start">
              <span className="block truncate text-sm font-bold text-ink">
                {selected.name || selected.email || "بدون اسم"}
              </span>

              {selected.role && (
                <span className="block truncate text-[10px] font-medium text-ink/60">
                  {roleConfig[selected.role]?.label || ""}
                </span>
              )}
            </span>
          </span>
        ) : (
          <span className="text-sm text-ink/60">غير معين</span>
        )}

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            z-30
            mt-2
            max-h-64
            w-full
            overflow-y-auto
            rounded-xl
            border
            border-ink/[0.08]
            bg-card
            p-1.5
            shadow-2xl
            shadow-black/10
            dark:border-white/[0.1]
          "
        >
          <button
            type="button"
            onClick={() => selectUser("")}
            className="
              flex
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-2.5
              py-2
              text-sm
              font-medium
              text-ink/60
              transition
              hover:bg-ink/[0.04]
              hover:text-ink
              dark:hover:bg-white/[0.06]
            "
          >
            غير معين
          </button>

          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => selectUser(user.id)}
              className={`
                flex
                w-full
                items-center
                gap-2.5
                rounded-lg
                px-2.5
                py-2
                text-start
                transition
                hover:bg-ink/[0.04]
                dark:hover:bg-white/[0.06]
                ${
                  user.id === value
                    ? "bg-primary/5 ring-1 ring-primary/20"
                    : ""
                }
              `}
            >
              <Avatar user={user} size={28} />

              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">
                  {user.name || user.email || "بدون اسم"}
                </span>

                {user.role && (
                  <span className="block truncate text-[10px] font-medium text-ink/60">
                    {roleConfig[user.role]?.label || ""}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskModal({
  open,
  onClose,
  editing = null,
  projects = [],
  users = [],
  defaultProjectId = "",
  defaultStatus = "backlog",
  onSaved,
  currentUser,
  canManage = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [labelInput, setLabelInput] = useState("");

  const [attachmentInput, setAttachmentInput] = useState("");

  const [checklistInput, setChecklistInput] = useState("");

  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    // Only sync the form when the modal actually opens. Re-syncing on every
    // snapshot while the user is typing would wipe their unsaved edits.
    if (wasOpenRef.current) return;
    wasOpenRef.current = true;

    // Intentional: sync the form with the record being edited when opened.
    if (editing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        projectId: editing.projectId || "",
        title: editing.title || "",
        description: editing.description || "",
        status: editing.status || "backlog",
        priority: editing.priority || "medium",
        assigneeProfileId: editing.assigneeProfileId || editing.assigneeId || "",
        reviewerProfileId: editing.reviewerProfileId || editing.reviewerId || "",
        deadline: editing.deadline || "",
        labels: Array.isArray(editing.labels) ? editing.labels : [],
        attachments: Array.isArray(editing.attachments)
          ? editing.attachments
          : [],
        checklist: Array.isArray(editing.checklist) ? editing.checklist : [],
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        projectId: defaultProjectId,
        status: defaultStatus,
      });
    }

    setLabelInput("");
    setAttachmentInput("");
    setChecklistInput("");
  }, [open, editing, defaultProjectId, defaultStatus]);

  function updateField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  // Non-managers may only move the workflow forward up to "review", or
  // resubmit a task they received back (revision → review). Anything else
  // (setting done/revision directly, assigning others) stays manager-only.
  const statusOptions = useMemo(() => {
    if (canManage || !editing) return WORKFLOW_STATUSES;

    const current = editing.status || "backlog";
    const allowed = new Set([current]);

    if (canMemberAdvance(current)) allowed.add(nextWorkflowStatus(current));
    if (current === "revision") allowed.add("review");

    return WORKFLOW_STATUSES.filter((status) => allowed.has(status.value));
  }, [canManage, editing]);

  const isReadOnlyFields = !canManage && Boolean(editing);

  function addLabel() {
    const value = labelInput.trim();
    if (!value) return;
    if (form.labels.includes(value)) {
      setLabelInput("");
      return;
    }
    updateField("labels", [...form.labels, value]);
    setLabelInput("");
  }

  function removeLabel(label) {
    updateField(
      "labels",
      form.labels.filter((item) => item !== label),
    );
  }

  function normalizeAttachment(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
      return trimmed;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function addAttachment() {
    const value = normalizeAttachment(attachmentInput);
    if (!value) return;
    if (form.attachments.includes(value)) {
      setAttachmentInput("");
      return;
    }
    updateField("attachments", [...form.attachments, value]);
    setAttachmentInput("");
  }

  function removeAttachment(url) {
    updateField(
      "attachments",
      form.attachments.filter((item) => item !== url),
    );
  }

  function addChecklistItem() {
    const value = checklistInput.trim();
    if (!value) return;
    updateField("checklist", [...form.checklist, { id: uid(), label: value, done: false }]);
    setChecklistInput("");
  }

  function toggleChecklistItem(id) {
    updateField(
      "checklist",
      form.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function removeChecklistItem(id) {
    updateField(
      "checklist",
      form.checklist.filter((item) => item.id !== id),
    );
  }

  function buildActivity() {
    const activity = Array.isArray(editing?.activity)
      ? editing.activity
      : [];

    const entries = [...activity];

    if (!editing) {
      entries.push({
        id: uid(),
        type: "created",
        text: "تم إنشاء المهمة",
        authorId: currentUser?.uid || "",
        authorName: currentUser?.displayName || "مستخدم",
        createdAt: new Date().toISOString(),
      });
    } else if (editing.status !== form.status) {
      entries.push({
        id: uid(),
        type: "status",
        text: `تم تغيير الحالة إلى "${WORKFLOW_STATUSES.find(
          (status) => status.value === form.status,
        )?.labelAr}"`,
        authorId: currentUser?.uid || "",
        authorName: currentUser?.displayName || "مستخدم",
        createdAt: new Date().toISOString(),
      });
    }

    return entries;
  }

  async function handleSave(event) {
    event?.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const statusChanged = editing && editing.status !== form.status;

      // Non-managers editing a task must keep assignment/project untouched and
      // may only change status through the same workflow rules as the buttons.
      if (!canManage && editing) {
        const allowedStatuses = statusOptions.map((status) => status.value);
        if (statusChanged && !allowedStatuses.includes(form.status)) {
          alert("ليس لديك صلاحية لنقل المهمة إلى هذه المرحلة.");
          return;
        }
      }

      const payload = {
        projectId: form.projectId || "",
        title: form.title?.trim() || "",
        description: form.description?.trim() || "",
        status: form.status || "backlog",
        priority: form.priority || "medium",
        assigneeProfileId: form.assigneeProfileId || "",
        reviewerProfileId: form.reviewerProfileId || "",
        deadline: form.deadline || "",
        labels: form.labels || [],
        attachments: form.attachments || [],
        checklist: form.checklist || [],
        activity: buildActivity(),
      };

      if (!canManage && editing) {
        payload.assigneeProfileId = editing.assigneeProfileId || editing.assigneeId || "";
        payload.reviewerProfileId = editing.reviewerProfileId || editing.reviewerId || "";
        payload.projectId = editing.projectId || "";
      }

      const project = projects.find((item) => item.id === form.projectId);

      const projectTitle = project?.title || "";

      const actorId = currentUser?.uid || "";

      const statusLabel =
        WORKFLOW_STATUSES.find((status) => status.value === form.status)
          ?.labelAr || form.status;

      if (editing) {
        const wasAssignedTo = editing.assigneeProfileId || editing.assigneeId || "";

        await updateDocument("tasks", editing.id, payload);

        const statusChanged = editing.status !== form.status;

        const wasAttachments = Array.isArray(editing.attachments)
          ? editing.attachments
          : [];

        const newAttachments = (form.attachments || []).filter(
          (url) => !wasAttachments.includes(url),
        );

        const wasChecklist = Array.isArray(editing.checklist)
          ? editing.checklist
          : [];

        const newChecklistCount = (form.checklist || []).filter(
          (item) =>
            !wasChecklist.some((previous) => previous.id === item.id),
        ).length;

        const editingRecipients = getTaskRecipientUserIds(
          editing,
          users,
          actorId,
        );

        if (
          form.assigneeProfileId &&
          form.assigneeProfileId !== wasAssignedTo &&
          form.assigneeProfileId !== actorId
        ) {
          notifyMany([form.assigneeProfileId], {
            title: "مهمة جديدة مسندة إليك",
            message: `تم إسناد مهمة "${payload.title}" إليك.`,
            type: "task",
            link: `/dashboard/team/tasks/${editing.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }

        if (statusChanged) {
          notifyMany(editingRecipients, {
            title: "تم تحديث حالة المهمة",
            message: `تم تغيير حالة مهمة "${payload.title}" إلى "${statusLabel}".`,
            type: "task",
            link: `/dashboard/team/tasks/${editing.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }

        if (newAttachments.length > 0 && editingRecipients.length > 0) {
          notifyMany(editingRecipients, {
            title: "تمت إضافة مرفقات للمهمة",
            message:
              newAttachments.length === 1
                ? `تمت إضافة مرفق إلى مهمة "${payload.title}".`
                : `تمت إضافة ${newAttachments.length} مرفقات إلى مهمة "${payload.title}".`,
            type: "attachment",
            link: `/dashboard/team/tasks/${editing.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }

        if (newChecklistCount > 0 && editingRecipients.length > 0) {
          notifyMany(editingRecipients, {
            title: "تم تحديث قائمة التحقق",
            message:
              newChecklistCount === 1
                ? `تمت إضافة بند إلى قائمة تحقق المهمة "${payload.title}".`
                : `تمت إضافة ${newChecklistCount} بنود إلى قائمة تحقق المهمة "${payload.title}".`,
            type: "checklist",
            link: `/dashboard/team/tasks/${editing.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }
      } else {
        const taskRef = await createDocument("tasks", {
          ...payload,
          createdBy: currentUser?.uid || "",
          reporterProfileId: currentUser?.uid || "",
        });

        if (form.assigneeProfileId && form.assigneeProfileId !== actorId) {
          notifyMany([form.assigneeProfileId], {
            title: "مهمة جديدة مسندة إليك",
            message: `تم إسناد مهمة "${payload.title}" إليك.`,
            type: "task",
            link: `/dashboard/team/tasks/${taskRef.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }

        const crew = [
          ...new Set([
            ...getProjectMemberUserIds(project, actorId),
            ...getManagerUserIds(users, actorId),
          ]),
        ].filter((id) => id !== form.assigneeProfileId);

        if (crew.length > 0) {
          notifyMany(crew, {
            title: form.projectId ? "مهمة جديدة في مشروع" : "مهمة جديدة بدون مشروع",
            message: form.projectId
              ? `تمت إضافة مهمة "${payload.title}" إلى مشروع "${projectTitle}".`
              : `تمت إضافة مهمة واحدة "${payload.title}" بدون مشروع.`,
            type: "task",
            link: `/dashboard/team/tasks/${taskRef.id}`,
            projectId: form.projectId,
            projectTitle,
            eventKey: "tasks",
          });
        }
      }

      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("حصل خطأ أثناء حفظ المهمة.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "تعديل المهمة" : "مهمة جديدة"}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>

          <Button
            type="submit"
            form="task-form"
            loading={saving}
            icon={CheckSquare}
          >
            {editing ? "حفظ التعديلات" : "إنشاء المهمة"}
          </Button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSave} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="المشروع"
            value={form.projectId}
            disabled={isReadOnlyFields}
            options={[
              { value: "", label: "بدون مشروع (مهمة واحدة)" },
              ...projects.map((project) => ({
                value: project.id,
                label: project.title,
              })),
            ]}
            onChange={(event) => updateField("projectId", event.target.value)}
          />

          <Input
            label="تاريخ الاستحقاق"
            type="date"
            value={form.deadline}
            onChange={(event) => updateField("deadline", event.target.value)}
          />
        </div>

        <Input
          label="عنوان المهمة"
          value={form.title}
          required
          placeholder="مثال: تصميم الصفحة الرئيسية"
          onChange={(event) => updateField("title", event.target.value)}
        />

        <Textarea
          label="وصف المهمة"
          value={form.description}
          rows={3}
          placeholder="اشرح تفاصيل المهمة المطلوبة..."
          onChange={(event) => updateField("description", event.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="الحالة"
            value={form.status}
            options={statusOptions.map((status) => ({
              value: status.value,
              label: `${status.labelAr} (${status.label})`,
            }))}
            onChange={(event) => updateField("status", event.target.value)}
          />

          <Select
            label="الأولوية"
            value={form.priority}
            options={PRIORITIES.map((priority) => ({
              value: priority.value,
              label: priority.labelAr,
            }))}
            onChange={(event) => updateField("priority", event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MemberSelect
            label="المسؤول (Assignee)"
            value={form.assigneeProfileId}
            users={users}
            onChange={(userId) =>
              updateField("assigneeProfileId", userId)
            }
          />

          <MemberSelect
            label="المراجع (Reviewer)"
            value={form.reviewerProfileId}
            users={users}
            onChange={(userId) =>
              updateField("reviewerProfileId", userId)
            }
          />
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-ink/60" />
            <p className="text-sm font-bold text-ink">التصنيفات (Labels)</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {form.labels.length === 0 && (
              <span className="text-xs text-ink/60">لا توجد تصنيفات</span>
            )}

            {form.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary"
              >
                {label}
                <button
                  type="button"
                  aria-label={`إزالة التصنيف ${label}`}
                  onClick={() => removeLabel(label)}
                  className="text-primary/50 transition hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Input
              value={labelInput}
              placeholder="أضف تصنيفًا..."
              onChange={(event) => setLabelInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLabel();
                }
              }}
            />

            <Button type="button" onClick={addLabel} icon={Plus}>
              إضافة
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-ink/60" />
            <p className="text-sm font-bold text-ink">المرفقات (Attachments)</p>
          </div>

          {form.attachments.length === 0 && (
            <p className="mb-3 text-xs text-ink/60">لا توجد مرفقات</p>
          )}

          <ul className="mb-3 space-y-2">
            {form.attachments.map((url) => (
              <li
                key={url}
                className="flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-card px-3 py-2"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink/60" />

                <span className="min-w-0 flex-1 truncate text-xs text-ink/70">
                  {url}
                </span>

                <button
                  type="button"
                  aria-label="حذف المرفق"
                  onClick={() => removeAttachment(url)}
                  className="shrink-0 text-red-400 transition hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <Input
              value={attachmentInput}
              placeholder="رابط المرفق..."
              onChange={(event) => setAttachmentInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addAttachment();
                }
              }}
            />

            <Button type="button" onClick={addAttachment} icon={Plus}>
              إضافة
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-ink/60" />
            <p className="text-sm font-bold text-ink">
              قائمة التحقق ({form.checklist.filter((item) => item.done).length}/
              {form.checklist.length})
            </p>
          </div>

          {form.checklist.length === 0 && (
            <p className="mb-3 text-xs text-ink/60">لا توجد عناصر</p>
          )}

          <ul className="mb-3 space-y-2">
            {form.checklist.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-card px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="h-4 w-4 accent-primary"
                />

                <span
                  className={`min-w-0 flex-1 truncate text-xs font-medium ${
                    item.done ? "text-ink/60 line-through" : "text-ink/75"
                  }`}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  aria-label="حذف البند"
                  onClick={() => removeChecklistItem(item.id)}
                  className="shrink-0 text-red-400 transition hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <Input
              value={checklistInput}
              placeholder="أضف عنصرًا إلى القائمة..."
              onChange={(event) => setChecklistInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addChecklistItem();
                }
              }}
            />

            <Button type="button" onClick={addChecklistItem} icon={Plus}>
              إضافة
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
