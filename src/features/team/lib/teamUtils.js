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

// Convert a deadline value (Firestore Timestamp, Date, ISO string, number)
// into a Date. Date-only strings ("YYYY-MM-DD") are treated as the end of
// that day so the deadline is only considered passed once the day is over.
function toDeadlineDate(value) {
  if (!value) return null;

  try {
    if (typeof value.toDate === "function") {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
    }

    if (typeof value === "string") {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (match) {
        return new Date(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3]),
          23,
          59,
          59,
          999,
        );
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === "number") {
      return new Date(value);
    }
  } catch {
    return null;
  }

  return null;
}

export function formatDeadline(value) {
  if (!value) return "—";

  const date = toDeadlineDate(value);
  if (!date) return String(value);

  return date.toLocaleDateString("ar-EG");
}

export function isDeadlineOverdue(value) {
  if (!value) return false;

  const date = toDeadlineDate(value);
  if (!date) return false;

  return date.getTime() < Date.now();
}

function toTimestampMs(value) {
  if (!value) return 0;

  try {
    if (typeof value.toMillis === "function") return value.toMillis();
    if (typeof value.toDate === "function") return value.toDate().getTime();
    if (value instanceof Date) return value.getTime();
    if (typeof value.seconds === "number") return value.seconds * 1000;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? 0 : date.getTime();
    }
  } catch {
    return 0;
  }

  return 0;
}

function toDeadlineMs(value) {
  if (!value) return Number.POSITIVE_INFINITY;

  try {
    if (typeof value.toDate === "function") return value.toDate().getTime();
    if (value instanceof Date) return value.getTime();
    if (typeof value.seconds === "number") return value.seconds * 1000;

    if (typeof value === "string") {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (match) {
        return new Date(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3]),
          23,
          59,
          59,
          999,
        ).getTime();
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? Number.POSITIVE_INFINITY
        : date.getTime();
    }

    if (typeof value === "number") return value;
  } catch {
    return Number.POSITIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
}

// Sort projects by creation time or delivery deadline.
// "newest" | "oldest" | "deadline-nearest" | "deadline-furthest"
export function sortProjects(projects = [], sortBy = "newest") {
  const list = [...projects];

  switch (sortBy) {
    case "oldest":
      return list.sort(
        (a, b) => toTimestampMs(a.createdAt) - toTimestampMs(b.createdAt),
      );

    case "deadline-nearest":
      return list.sort(
        (a, b) => toDeadlineMs(a.deadline) - toDeadlineMs(b.deadline),
      );

    case "deadline-furthest":
      return list.sort(
        (a, b) => toDeadlineMs(b.deadline) - toDeadlineMs(a.deadline),
      );

    case "newest":
    default:
      return list.sort(
        (a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt),
      );
  }
}

export function calcProjectProgress(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const done = tasks.filter(
    (task) => task.status === "done",
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
  return task?.status === "done";
}

// Only admin/manager roles may delete team data or change others' tasks.
export function canManageTeam(role) {
  return role === "admin" || role === "manager";
}

// A team member can reach at most "review"; only admin/manager may
// decide revision/done or move backward.
const MEMBER_MAX_STATUS = "review";

export function isMemberMaxStatus(status) {
  return status === MEMBER_MAX_STATUS;
}

// Members may only advance the workflow (accept -> work -> submit for review),
// and only up to the "review" status. They can never revert or finalize.
export function canMemberAdvance(currentStatus) {
  const current = getWorkflowIndex(currentStatus);
  const max = getWorkflowIndex(MEMBER_MAX_STATUS);
  if (current < 0) return false;
  return current < max;
}
