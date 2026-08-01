"use client";

import { useEffect, useState } from "react";

import { FolderKanban, CheckSquare } from "lucide-react";

import Modal from "@/features/dashboard/ui/Modal";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea, Select } from "@/features/dashboard/ui/Input";
import Avatar from "@/features/dashboard/ui/Avatar";

import { createDocument, updateDocument } from "@/lib/firestoreService";
import { useAuth } from "@/features/auth";

import { WORKFLOW_STATUSES, PRIORITIES } from "@/constants/workflow";
import { PROJECT_ICONS } from "@/constants/projectIcons";

const EMPTY_FORM = {
  title: "",
  description: "",
  clientId: "",
  status: "backlog",
  priority: "medium",
  deadline: "",
  icon: "folder",
  memberProfileIds: [],
};

export default function ProjectModal({
  open,
  onClose,
  editing = null,
  users = [],
  clients = [],
  onSaved,
}) {
  const { user: currentUser } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editing) {
      setForm({
        title: editing.title || "",
        description: editing.description || "",
        clientId: editing.clientId || "",
        status: editing.status || "backlog",
        priority: editing.priority || "medium",
        deadline: editing.deadline || "",
        icon: editing.icon || "folder",
        memberProfileIds: Array.isArray(editing.memberProfileIds)
          ? editing.memberProfileIds
          : Array.isArray(editing.teamMemberIds)
            ? editing.teamMemberIds
            : [],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, editing]);

  function updateField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function toggleMember(memberId) {
    setForm((previous) => {
      const exists = previous.memberProfileIds.includes(memberId);
      return {
        ...previous,
        memberProfileIds: exists
          ? previous.memberProfileIds.filter((id) => id !== memberId)
          : [...previous.memberProfileIds, memberId],
      };
    });
  }

  async function handleSave(event) {
    event?.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const payload = {
        title: form.title?.trim() || "",
        description: form.description?.trim() || "",
        clientId: form.clientId || "",
        status: form.status || "backlog",
        priority: form.priority || "medium",
        deadline: form.deadline || "",
        icon: form.icon || "folder",
        memberProfileIds: form.memberProfileIds || [],
      };

      if (editing) {
        await updateDocument("teamProjects", editing.id, payload);
      } else {
        await createDocument("teamProjects", {
          ...payload,
          createdBy: currentUser?.uid || "",
          ownerProfileId: currentUser?.uid || "",
        });
      }

      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("حصل خطأ أثناء حفظ المشروع.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "تعديل المشروع" : "مشروع جديد"}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>

          <Button
            type="submit"
            form="project-form"
            loading={saving}
            icon={CheckSquare}
          >
            {editing ? "حفظ التعديلات" : "إنشاء المشروع"}
          </Button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSave} className="space-y-5">
        <Input
          label="عنوان المشروع"
          value={form.title}
          required
          placeholder="مثال: إعادة تصميم الموقع"
          onChange={(event) => updateField("title", event.target.value)}
        />

        <Textarea
          label="وصف المشروع"
          value={form.description}
          rows={3}
          placeholder="اكتب وصفًا مختصرًا للمشروع وأهدافه..."
          onChange={(event) => updateField("description", event.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="العميل"
            value={form.clientId}
            options={[
              { value: "", label: "بدون عميل" },
              ...clients.map((client) => ({
                value: client.id,
                label: client.name,
              })),
            ]}
            onChange={(event) => updateField("clientId", event.target.value)}
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
            label="حالة المشروع"
            value={form.status}
            options={WORKFLOW_STATUSES.map((status) => ({
              value: status.value,
              label: `${status.labelAr} (${status.label})`,
            }))}
            onChange={(event) => updateField("status", event.target.value)}
          />

          <Input
            label="تاريخ التسليم"
            type="date"
            value={form.deadline}
            onChange={(event) => updateField("deadline", event.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-ink/40" />
            <p className="text-sm font-bold text-ink">أيقونة المشروع</p>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {PROJECT_ICONS.map(({ name, label, Icon }) => {
              const selected = form.icon === name;

              return (
                <button
                  key={name}
                  type="button"
                  title={label}
                  onClick={() => updateField("icon", name)}
                  className={`flex aspect-square items-center justify-center rounded-xl border transition-all ${
                    selected
                      ? "border-primary bg-primary/[0.06] text-primary shadow-sm"
                      : "border-ink/[0.06] bg-card text-ink/40 hover:border-ink/[0.15] hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-ink/[0.06] bg-neutral-50/60 p-4 dark:bg-ink/[0.03]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-ink/40" />
              <p className="text-sm font-bold text-ink">
                أعضاء الفريق ({form.memberProfileIds.length})
              </p>
            </div>
          </div>

          {users.length === 0 ? (
            <p className="py-4 text-center text-xs text-ink/35">
              لا يوجد أعضاء مسجلون حاليًا.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {users.map((user) => {
                const checked = form.memberProfileIds.includes(user.id);

                return (
                  <label
                    key={user.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-all ${
                      checked
                        ? "border-primary/30 bg-primary/[0.04]"
                        : "border-ink/[0.06] hover:border-ink/[0.12]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMember(user.id)}
                      className="h-4 w-4 accent-primary"
                    />

                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar user={user} size={32} />

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-ink">
                          {user.name || "بدون اسم"}
                        </p>
                        <p className="truncate text-[10px] text-ink/40">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
