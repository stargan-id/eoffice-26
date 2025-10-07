// "use server";
export interface RouteItem {
  name: string;
  title: string;
  href: string;
  icon: string;
  order?: number;
  counter?: number;
  permissions?: string[];
  displayAsMenu?: boolean;
  cascadePermissions?: boolean; // cascade permissions to sub routes
  resources?: string[];
}

export const DEFAULT_ROUTE_AFTER_LOGIN = "/dashboard";

export const loginRoutes: RouteItem[] = [
  {
    name: "login",
    title: "Login",
    href: "/login",
    icon: "key",
    order: 2,
    displayAsMenu: false,
  },
  {
    name: "login",
    title: "Login",
    href: "/",
    icon: "key",
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
    icon: "key",
    order: 2,
    displayAsMenu: false,
  },
  {
    name: "login",
    title: "Login",
    href: "/login",
    icon: "key",
    order: 2,
    displayAsMenu: false,
  },
  {
    name: "reset-password",
    title: "Reset Password",
    href: "/reset-password",
    icon: "square-asterisk",
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
    icon: "gauge",
    order: 0,
    displayAsMenu: true,
  },
];

export const alurProsesRoutes: RouteItem[] = [
  {
    name: "menu-data-entry",
    title: "Menu",
    href: "/menu",
    icon: "settings-2",
    order: 0,
    displayAsMenu: true,
    resources: ["proses-setup-kegiatan"],
  },
];

export const dataReferensiRoutes: RouteItem[] = [
  {
    name: "referensi-organisasi",
    title: "Organisasi",
    href: "/data-referensi/organisasi",
    icon: "graduation-cap",
    order: 0,
    displayAsMenu: true,
    resources: ["organization"],
  },
];
