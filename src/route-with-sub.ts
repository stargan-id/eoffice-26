// "use server";
export interface RouteItem {
  name: string;
  title: string;
  href: string;
  iconName: string; // for iconify
  order?: number;
  counter?: number;
  permissions?: string[];
  displayAsMenu?: boolean;
  cascadePermissions?: boolean; // cascade permissions to sub routes
  resources?: string[];
  subs?: RouteItem[]; // sub routes
}

export const DEFAULT_ROUTE_AFTER_LOGIN = "/dashboard";

export const profileRoutes: RouteItem[] = [
  {
    name: "profile",
    title: "Profile",
    href: "/profile",
    iconName: "user",
    order: 1,
    displayAsMenu: false,
  },
];

export const loginRoutes: RouteItem[] = [
  {
    name: "login",
    title: "Login",
    href: "/login",
    iconName: "key",
    // icon: Key,
    order: 2,
    displayAsMenu: false,
  },
];

export const isLoginRoute = (url: string) => {
  return loginRoutes.some((route) => route.href === url);
};

export const publicRoutes: RouteItem[] = [
  {
    name: "doc",
    title: "Documentation",
    href: "/doc",
    iconName: "book-open",
    //icon: BookOpen,
    order: 2,
    displayAsMenu: false,
  },
  {
    name: "login",
    title: "Login",
    href: "/login",
    iconName: "key",
    // icon: Key,
    order: 2,
    displayAsMenu: false,
  },
  {
    name: "reset-password",
    title: "Reset Password",
    href: "/reset-password",
    iconName: "square-asterisk",
    // icon: SquareAsterisk,
    order: 3,
    displayAsMenu: false,
  },
];

export const isPublicRoute = (url: string) => {
  return publicRoutes.some((route) => route.href === url);
};

export const dashboardRoutes: RouteItem[] = [
  {
    name: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    iconName: "gauge",
    // icon: Gauge,
    order: 0,
    displayAsMenu: true,
  },
];

export const manajemenRoutesWithSub: RouteItem[] = [
  {
    name: "manajemen",
    title: "Manajemen",
    href: "#",
    iconName: "user-cog",
    order: 4,
    displayAsMenu: true,
    subs: [
      {
        name: "manajemen-organisasi",
        title: "Organisasi",
        href: "/manajemen/organisasi",
        iconName: "brick-wall",
        order: 90,
        resources: ["manajemen-organisasi", "manajemen"],
      },
      {
        name: "manajemen-role",
        title: "Role",
        href: "/manajemen/rbac/role",
        iconName: "user-cog",
        order: 140,
        displayAsMenu: true,
        resources: ["manajemen-role", "manajemen"],
      },
      {
        name: "manajemen-permission",
        title: "Permission",
        href: "/manajemen/rbac/permission",
        iconName: "shield-check",
        order: 190,
        displayAsMenu: true,
        resources: ["manajemen-permission", "manajemen"],
      },
      {
        name: "manajemen-pengguna",
        title: "Pengguna",
        href: "/manajemen/pengguna",
        iconName: "users",
        order: 240,
        displayAsMenu: true,
        resources: ["manajemen-pengguna", "manajemen"],
      },
    ],
  },
];

export const naskahDinasRoutesWithSub: RouteItem[] = [
  {
    name: "Naskah Dinas Masuk",
    title: "Masuk",
    href: "#",
    iconName: "settings-2",
    order: 1000,
    displayAsMenu: true,
    subs: [
      {
        name: "surat-masuk",
        title: "Surat Masuk",
        href: "/surat/masuk",
        iconName: "inbox",
        order: 1010,
        displayAsMenu: true,
        resources: ["surat-masuk"],
      },
      {
        name: "disposisi-masuk",
        title: "Disposisi",
        href: "/disposisi/masuk",
        iconName: "message-circle",
        order: 1020,
        displayAsMenu: true,
        resources: ["disposisi-masuk"],
      },
    ],
  },
  {
    name: "Naskah Dinas Keluar",
    title: "Keluar",
    href: "#",
    iconName: "settings-2",
    // icon: Settings2,
    order: 1030,
    displayAsMenu: true,
    subs: [
      {
        name: "surat-keluar",
        title: "Surat Keluar",
        href: "/surat/keluar",
        iconName: "send",
        order: 1040,
        displayAsMenu: true,
        resources: ["surat-keluar"],
      },
      {
        name: "disposisi-keluar",
        title: "Disposisi",
        href: "/disposisi/keluar",
        iconName: "square-arrow-down-right",
        order: 1050,
        displayAsMenu: true,
        resources: ["disposisi-keluar"],
      },
    ],
  },
];

export const expandedRutes: RouteItem[] = [
  ...dashboardRoutes,
  ...manajemenRoutesWithSub,
  ...naskahDinasRoutesWithSub,
];

export const getRoutes = async (): Promise<RouteItem[]> => {
  return expandedRutes;
};
