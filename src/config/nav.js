import {
  LayoutDashboard,
  GraduationCap,
  Images,
  MessageSquareQuote,
  Users,
  Settings,
  Tag,
  Wallet,
  ClipboardList,
  BarChart3,
} from "lucide-react";

export const sidebarSections = [
  {
    title: "لوحة التحكم",
    items: [
      { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { title: "محفظة الأعمال", href: "/dashboard/portfolio", icon: Images },
      { title: "التصنيفات", href: "/dashboard/categories", icon: Tag },
      { title: "العملاء", href: "/dashboard/teachers", icon: GraduationCap },
      { title: "الخدمات", href: "/dashboard/services", icon: MessageSquareQuote },
      { title: "إدارة الأسعار", href: "/dashboard/pricing", icon: Wallet },
      { title: "الإعدادات", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    title: "الفريق",
    items: [
      { title: "الفريق", href: "/dashboard/team", icon: Users },
      { title: "مهماتي", href: "/dashboard/team/my-tasks", icon: ClipboardList },
      { title: "لوحة التقدم", href: "/dashboard/team/progress", icon: BarChart3 },
    ],
  },
];

export const sidebarItems = sidebarSections.flatMap((section) => section.items);

export function getPageMeta(pathname = "/dashboard") {
  let best = null;

  for (const section of sidebarSections) {
    for (const item of section.items) {
      const matches =
        pathname === item.href || pathname.startsWith(item.href + "/");

      if (!matches) continue;

      if (!best || item.href.length > best.item.href.length) {
        best = { section: section.title, item };
      }
    }
  }

  if (!best) {
    return { section: "لوحة التحكم", item: sidebarItems[0] };
  }

  return best;
}
