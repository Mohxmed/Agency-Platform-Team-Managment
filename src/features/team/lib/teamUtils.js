import { WORKFLOW_STATUSES, PRIORITIES } from "@/constants/workflow";

export function getWorkflowMeta(value) {
  return (
    WORKFLOW_STATUSES.find((status) => status.value === value) ||
    WORKFLOW_STATUSES[0]
  );
}

export function getPriorityMeta(value) {
  return (
    PRIORITIES.find((priority) => priority.value === value) || PRIORITIES[1]
  );
}

export function getWorkflowIndex(value) {
  const index = WORKFLOW_STATUSES.findIndex((status) => status.value === value);
  return index === -1 ? 0 : index;
}

export function nextWorkflowStatus(value) {
  const index = getWorkflowIndex(value);
  const next = WORKFLOW_STATUSES[Math.min(index + 1, WORKFLOW_STATUSES.length - 1)];
  return next.value;
}

export function prevWorkflowStatus(value) {
  const index = getWorkflowIndex(value);
  const previous = WORKFLOW_STATUSES[Math.max(index - 1, 0)];
  return previous.value;
}

export function formatTimestamp(value) {
  if (!value) return "—";

  try {
    if (typeof value.toDate === "function") {
      return value.toDate().toLocaleDateString("ar-EG");
    }
    if (value instanceof Date) {
      return value.toLocaleDateString("ar-EG");
    }
    if (typeof value === "number") {
      return new Date(value).toLocaleDateString("ar-EG");
    }
    if (value.seconds) {
      return new Date(value.seconds * 1000).toLocaleDateString("ar-EG");
    }
    if (typeof value === "string") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("ar-EG");
      }
      return value;
    }
  } catch (error) {
    return String(value);
  }

  return String(value);
}

export function formatDateTime(value) {
  if (!value) return "—";

  try {
    if (typeof value.toDate === "function") {
      return value.toDate().toLocaleString("ar-EG");
    }
    if (value instanceof Date) {
      return value.toLocaleString("ar-EG");
    }
    if (value.seconds) {
      return new Date(value.seconds * 1000).toLocaleString("ar-EG");
    }
    if (typeof value === "string") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString("ar-EG");
      }
      return value;
    }
  } catch (error) {
    return String(value);
  }

  return String(value);
}

export function formatDeadline(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ar-EG");
}

export function isDeadlineOverdue(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export function calcProjectProgress(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const done = tasks.filter(
    (task) => task.status === "approved" || task.status === "done",
  ).length;
  return Math.round((done / tasks.length) * 100);
}

export function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
  );
}

export function getUserName(userMap, id) {
  if (!id) return "غير معين";
  return userMap.get(id)?.name || id;
}

export function getAssigneeId(task) {
  return task?.assigneeProfileId || task?.assigneeId || "";
}

export function getReviewerId(task) {
  return task?.reviewerProfileId || task?.reviewerId || "";
}

export function getReporterId(task) {
  return task?.reporterProfileId || task?.createdBy || "";
}

export function getProjectOwnerId(project) {
  return project?.ownerProfileId || project?.createdBy || "";
}

export function getProjectMemberIds(project) {
  const ids = project?.memberProfileIds || project?.teamMemberIds || [];
  return Array.isArray(ids) ? ids : [];
}

export function getClientName(clientMap, id) {
  if (!id) return "—";
  return clientMap.get(id)?.name || "—";
}

export function isTaskDone(task) {
  return task?.status === "done" || task?.status === "approved";
}
