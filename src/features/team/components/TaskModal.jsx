"use client";

import { useEffect, useState } from "react";

import {
  CheckSquare,
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

import { createDocument, updateDocument } from "@/lib/firestoreService";

import { WORKFLOW_STATUSES, PRIORITIES } from "@/constants/workflow";
import { uid } from "../lib/teamUtils";

const EMPTY_FORM = {
  projectId: "",
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  assigneeProfileId: "",
  reviewerProfileId: "",
  deadline: "",
  estimatedHours: "",
  spentHours: "",
  labels: [],
  attachments: [],
  checklist: [],
};

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
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [labelInput, setLabelInput] = useState("");

  const [attachmentInput, setAttachmentInput] = useState("");

  const [checklistInput, setChecklistInput] = useState("");

  useEffect(() => {
    if (!open) return;

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
        estimatedHours: editing.estimatedHours ?? "",
        spentHours: editing.spentHours ?? "",
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

  function addAttachment() {
    const value = attachmentInput.trim();
    if (!value) return;
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
      const payload = {
        projectId: form.projectId || "",
        title: form.title?.trim() || "",
        description: form.description?.trim() || "",
        status: form.status || "backlog",
        priority: form.priority || "medium",
        assigneeProfileId: form.assigneeProfileId || "",
        reviewerProfileId: form.reviewerProfileId || "",
        deadline: form.deadline || "",
        estimatedHours:
          form.estimatedHours === "" || form.estimatedHours === null
            ? 0
            : Number(form.estimatedHours) || 0,
        spentHours:
          form.spentHours === "" || form.spentHours === null
            ? 0
            : Number(form.spentHours) || 0,
        labels: form.labels || [],
        attachments: form.attachments || [],
        checklist: form.checklist || [],
        activity: buildActivity(),
      };

      if (editing) {
        await updateDocument("tasks", editing.id, payload);
      } else {
        await createDocument("tasks", {
          ...payload,
          createdBy: currentUser?.uid || "",
          reporterProfileId: currentUser?.uid || "",
        });
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
            required
            options={[
              { value: "", label: "اختر المشروع" },
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
            options={WORKFLOW_STATUSES.map((status) => ({
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
          <Select
            label="المسؤول (Assignee)"
            value={form.assigneeProfileId}
            options={[
              { value: "", label: "غير معين" },
              ...users.map((user) => ({
                value: user.id,
                label: user.name || user.email || "بدون اسم",
              })),
            ]}
            onChange={(event) =>
              updateField("assigneeProfileId", event.target.value)
            }
          />

          <Select
            label="المراجع (Reviewer)"
            value={form.reviewerProfileId}
            options={[
              { value: "", label: "غير معين" },
              ...users.map((user) => ({
                value: user.id,
                label: user.name || user.email || "بدون اسم",
              })),
            ]}
            onChange={(event) =>
              updateField("reviewerProfileId", event.target.value)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="الساعات المقدّرة"
            type="number"
            min="0"
            step="0.5"
            value={form.estimatedHours}
            placeholder="0"
            onChange={(event) =>
              updateField("estimatedHours", event.target.value)
            }
          />

          <Input
            label="الساعات المنفقة"
            type="number"
            min="0"
            step="0.5"
            value={form.spentHours}
            placeholder="0"
            onChange={(event) => updateField("spentHours", event.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-ink/40" />
            <p className="text-sm font-bold text-ink">التصنيفات (Labels)</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {form.labels.length === 0 && (
              <span className="text-xs text-ink/35">لا توجد تصنيفات</span>
            )}

            {form.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary"
              >
                {label}
                <button
                  type="button"
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
            <Link2 className="h-4 w-4 text-ink/40" />
            <p className="text-sm font-bold text-ink">المرفقات (Attachments)</p>
          </div>

          {form.attachments.length === 0 && (
            <p className="mb-3 text-xs text-ink/35">لا توجد مرفقات</p>
          )}

          <ul className="mb-3 space-y-2">
            {form.attachments.map((url) => (
              <li
                key={url}
                className="flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-card px-3 py-2"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink/30" />

                <span className="min-w-0 flex-1 truncate text-xs text-ink/70">
                  {url}
                </span>

                <button
                  type="button"
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
            <ListChecks className="h-4 w-4 text-ink/40" />
            <p className="text-sm font-bold text-ink">
              قائمة التحقق ({form.checklist.filter((item) => item.done).length}/
              {form.checklist.length})
            </p>
          </div>

          {form.checklist.length === 0 && (
            <p className="mb-3 text-xs text-ink/35">لا توجد عناصر</p>
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
                    item.done ? "text-ink/30 line-through" : "text-ink/75"
                  }`}
                >
                  {item.label}
                </span>

                <button
                  type="button"
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
