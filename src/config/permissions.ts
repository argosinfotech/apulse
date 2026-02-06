import { UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Briefcase,
  AlertTriangle,
  MessageSquareWarning,
  MessageCircle,
  Calendar,
  Settings,
} from "lucide-react";

export type Permission = 
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "mark_ready";

export type Module = 
  | "dashboard"
  | "clients"
  | "intake"
  | "work-items"
  | "risks"
  | "escalations"
  | "communications"
  | "snapshot"
  | "settings";

interface ModulePermissions {
  [key: string]: Permission[];
}

interface RoleConfig {
  permissions: ModulePermissions;
  defaultRoute: string;
  dashboardType: "operational" | "strategic";
}

export const rolePermissions: Record<UserRole, RoleConfig> = {
  dcol: {
    defaultRoute: "/",
    dashboardType: "operational",
    permissions: {
      dashboard: ["view"],
      clients: ["view"],
      intake: ["view", "create", "edit", "delete"],
      "work-items": ["view", "create", "edit", "delete"],
      risks: ["view", "create", "edit", "delete"],
      escalations: ["view", "create", "edit"], // draft, recommend
      communications: ["view", "create", "edit", "delete"],
      snapshot: ["view", "create"], // generate
      settings: [], // no access
    },
  },
  founder: {
    defaultRoute: "/",
    dashboardType: "strategic",
    permissions: {
      dashboard: ["view"],
      clients: ["view", "create", "edit", "delete"],
      intake: ["view"],
      "work-items": ["view"],
      risks: ["view"],
      escalations: ["view", "approve"],
      communications: ["view"],
      snapshot: ["view"],
      settings: ["view", "create", "edit", "delete"],
    },
  },
};

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: number;
  module: Module;
}

export const allNavItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, module: "dashboard" },
  { title: "Clients", url: "/clients", icon: Users, module: "clients" },
  { title: "Intake Requests", url: "/intake", icon: Inbox, badge: 3, module: "intake" },
  { title: "Work Items", url: "/work-items", icon: Briefcase, module: "work-items" },
  { title: "Risks & Blockers", url: "/risks", icon: AlertTriangle, badge: 2, module: "risks" },
  { title: "Escalations", url: "/escalations", icon: MessageSquareWarning, badge: 1, module: "escalations" },
  { title: "Communications", url: "/communications", icon: MessageCircle, module: "communications" },
  { title: "Weekly Snapshot", url: "/snapshot", icon: Calendar, module: "snapshot" },
  { title: "Settings", url: "/settings", icon: Settings, module: "settings" },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  const config = rolePermissions[role];
  return allNavItems.filter((item) => {
    const permissions = config.permissions[item.module];
    return permissions && permissions.length > 0;
  });
}

export function hasPermission(role: UserRole, module: Module, permission: Permission): boolean {
  const config = rolePermissions[role];
  const permissions = config.permissions[module];
  return permissions?.includes(permission) ?? false;
}

export function canEdit(role: UserRole, module: Module): boolean {
  return hasPermission(role, module, "edit") || hasPermission(role, module, "create");
}

export function getDashboardType(role: UserRole): "operational" | "strategic" {
  return rolePermissions[role].dashboardType;
}
