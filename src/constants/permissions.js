export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
};

export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  PROFILES: "profiles",
  PROJECTS: "projects",
  PORTFOLIO: "portfolio",
  CATEGORIES: "categories",
  CLIENTS: "clients",
  TEAM: "team",
  USERS: "users",
  SETTINGS: "settings",
  NOTIFICATIONS: "notifications",
};

export const ROLE_PERMISSIONS = {
  admin: {
    dashboard: true,
    profiles: true,
    projects: true,
    portfolio: true,
    categories: true,
    clients: true,
    team: true,
    users: true,
    settings: true,
    notifications: true,
  },

  manager: {
    dashboard: true,
    profiles: true,
    projects: true,
    portfolio: true,
    categories: true,
    clients: true,
    team: true,
    users: false,
    settings: false,
    notifications: true,
  },

  member: {
    dashboard: true,
    profiles: false,
    projects: false,
    portfolio: false,
    categories: false,
    clients: false,
    team: true,
    users: false,
    settings: false,
    notifications: true,
  },

  viewer: {
    dashboard: true,
    profiles: true,
    projects: false,
    portfolio: true,
    categories: false,
    clients: true,
    team: true,
    users: false,
    settings: false,
    notifications: true,
  },
};

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.MEMBER];
}

export const roleConfig = {
  admin: {
    label: "مسؤول",
    className: "text-red-600",
  },

  manager: {
    label: "مشرف",
    className: "text-amber-600",
  },

  member: {
    label: "عضو",
    className: "text-blue-600",
  },

  default: {
    label: "غير محدد",
    className: "text-gray-400",
  },
};
