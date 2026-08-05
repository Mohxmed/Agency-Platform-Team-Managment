export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
  CUSTOM: "custom",
  DEFAULT: "default",
};

export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  CONTENT: "content",
  PORTFOLIO: "portfolio",
  CATEGORIES: "categories",
  CLIENTS: "clients",
  SERVICES: "services",
  SETTINGS: "settings",
  USERS: "users",
  TEAM: "team",
  MY_TASKS: "my-tasks",
  PROJECTS: "projects",
  TASKS: "tasks",
  PROGRESS: "progress",
  NOTIFICATIONS: "notifications",
};

export const ROLE_PERMISSIONS = {
  admin: {
    dashboard: true,
    content: true,
    portfolio: true,
    categories: true,
    clients: true,
    services: true,
    settings: true,
    users: true,
    team: true,
    "my-tasks": true,
    projects: true,
    tasks: true,
    progress: true,
    notifications: true,
  },

  manager: {
    dashboard: true,
    content: false,
    portfolio: false,
    categories: false,
    clients: false,
    services: false,
    settings: false,
    users: false,
    team: true,
    "my-tasks": true,
    projects: true,
    tasks: true,
    progress: true,
    notifications: true,
  },

  member: {
    dashboard: true,
    content: false,
    portfolio: false,
    categories: false,
    clients: false,
    services: false,
    settings: false,
    users: false,
    team: false,
    "my-tasks": true,
    projects: true,
    tasks: true,
    progress: false,
    notifications: false,
  },

  viewer: {
    dashboard: true,
    content: false,
    portfolio: false,
    categories: false,
    clients: false,
    services: false,
    settings: false,
    users: false,
    team: false,
    "my-tasks": false,
    projects: false,
    tasks: false,
    progress: false,
    notifications: false,
  },
};

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.VIEWER];
}

export function getPermissionsForProfile(profile) {
  if (!profile) return ROLE_PERMISSIONS[ROLES.VIEWER];

  if (profile.role === "custom" && Array.isArray(profile.permissions)) {
    const map = {};
    Object.keys(PERMISSIONS).forEach((key) => {
      map[PERMISSIONS[key]] = profile.permissions.includes(PERMISSIONS[key]);
    });
    return map;
  }

  return getPermissionsForRole(profile.role);
}

export const roleConfig = {
  admin: {
    label: "مسؤول",
    className: "text-red-600",
  },

  manager: {
    label: "مدير",
    className: "text-amber-600",
  },

  member: {
    label: "عضو فريق",
    className: "text-blue-600",
  },

  viewer: {
    label: "زائر",
    className: "text-gray-500",
  },

  custom: {
    label: "صلاحيات مخصصة",
    className: "text-purple-600",
  },

  default: {
    label: "غير محدد",
    className: "text-gray-500",
  },
};