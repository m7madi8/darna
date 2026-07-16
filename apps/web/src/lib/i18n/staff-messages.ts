import type { Locale } from "@/lib/i18n/messages";

export type StaffMsg = {
  staffConsole: string;
  branch: string;
  selectBranch: string;
  noBranches: string;
  more: string;
  menu: string;
  close: string;
  openMenu: string;
  closeMenu: string;
  signOut: string;
  staff: string;
  nav: {
    dashboard: string;
    reservations: string;
    floor: string;
    timeline: string;
    waitingList: string;
    customers: string;
    employees: string;
    analytics: string;
    heatmap: string;
    activity: string;
    blacklist: string;
    notifications: string;
    settings: string;
  };
};

export const staffMessages: Record<Locale, StaffMsg> = {
  ar: {
    staffConsole: "لوحة التحكم",
    branch: "الفرع",
    selectBranch: "اختر الفرع",
    noBranches: "لا توجد فروع",
    more: "المزيد",
    menu: "القائمة",
    close: "إغلاق",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    signOut: "تسجيل الخروج",
    staff: "الموظف",
    nav: {
      dashboard: "لوحة التحكم",
      reservations: "الحجوزات",
      floor: "القاعة",
      timeline: "الجدول الزمني",
      waitingList: "قائمة الانتظار",
      customers: "العملاء",
      employees: "الموظفون",
      analytics: "التحليلات",
      heatmap: "الخريطة الحرارية",
      activity: "سجل النشاط",
      blacklist: "القائمة السوداء",
      notifications: "الإشعارات",
      settings: "الإعدادات",
    },
  },
  en: {
    staffConsole: "Staff console",
    branch: "Branch",
    selectBranch: "Select branch",
    noBranches: "No branches loaded",
    more: "More",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    signOut: "Sign out",
    staff: "Staff",
    nav: {
      dashboard: "Dashboard",
      reservations: "Reservations",
      floor: "Floor",
      timeline: "Timeline",
      waitingList: "Waiting list",
      customers: "Customers",
      employees: "Employees",
      analytics: "Analytics",
      heatmap: "Heatmap",
      activity: "Activity",
      blacklist: "Blacklist",
      notifications: "Notifications",
      settings: "Settings",
    },
  },
};
