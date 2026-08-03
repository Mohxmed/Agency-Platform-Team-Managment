import { notifyUser } from "./firestoreService";

export function isManagerRole(role) {
  return role === "admin" || role === "manager";
}

function resolveTaskId(task, field) {
  return task?.[field + "ProfileId"] || task?.[field] || "";
}

export function getAssigneeId(task) {
  return resolveTaskId(task, "assignee");
}

export function getReviewerId(task) {
  return resolveTaskId(task, "reviewer");
}

export function getReporterId(task) {
  return task?.reporterProfileId || task?.createdBy || "";
}

export function getManagerUserIds(users, actorId = "") {
  if (!Array.isArray(users)) return [];

  return users
    .filter(
      (user) =>
        isManagerRole(user?.role) && user?.id && user.id !== actorId,
    )
    .map((user) => user.id);
}

export function getProjectMemberUserIds(project, actorId = "") {
  const ids =
    project?.memberProfileIds ||
    project?.teamMemberIds ||
    [];

  if (!Array.isArray(ids)) return [];

  return ids.filter((id) => id && id !== actorId);
}

export function getTaskRecipientUserIds(task, users, actorId = "") {
  const ids = new Set();

  [getAssigneeId(task), getReviewerId(task), getReporterId(task)].forEach(
    (id) => {
      if (id && id !== actorId) ids.add(id);
    },
  );

  getManagerUserIds(users, actorId).forEach((id) => ids.add(id));

  return [...ids];
}

export async function notifyMany(userIds, notification) {
  const unique = [...new Set((userIds || []).filter(Boolean))];

  await Promise.all(
    unique.map((userId) => notifyUser({ ...notification, userId })),
  );
}
