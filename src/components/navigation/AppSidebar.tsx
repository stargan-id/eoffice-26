"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getRoutes, RouteItem } from "@/route-with-sub";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SideBarMenuButtonWithBadge } from "./SidebarCustom";

// SidebarHeader component
export function SidebarHeader() {
  const { toggleSidebar, open, isMobile, state } = useSidebar();

  return (
    <div
      className={cn(
        "flex",
        state === "collapsed"
          ? "justify-center"
          : "justify-between items-center pl-4 pr-2 h-12 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10"
      )}
    >
      <div className={cn(state === "collapsed" ? "hidden" : "justify-between")}>
        <span className="">E-Office</span>
      </div>
      <SidebarTrigger className="" />
    </div>
  );
}

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  // Responsive collapsed state (example: can be improved with context or props)
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const fetchRoutes = async () => {
      const routes = await getRoutes();
      setRoutes(routes);
    };
    fetchRoutes();
  }, []);

  if (routes.length === 0) {
    return null; // or a loading spinner
  }

  return (
    <Sidebar className={cn("gap-0", className)} collapsible="icon">
      <SidebarHeader />
      <SidebarContent className="gap-0 pb-[5rem]">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SideBarMenuButtonWithBadge item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {routes.map((item) => {
            if (item.subs && item.subs.length > 0) {
              return MenuWithSub(item);
            } else {
              return (
                <SidebarMenuItem key={item.title}>
                  <SideBarMenuButtonWithBadge item={item} />
                </SidebarMenuItem>
              );
            }
          })}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export const MenuWithSub = (item: RouteItem) => {
  return (
    <Collapsible
      defaultOpen={false}
      className="group/collapsible w-full"
      key={item.title}
    >
      <SidebarGroup className="p-0 m-0 w-full">
        <SidebarGroupLabel asChild className="text-sm">
          <CollapsibleTrigger>
            {item.title}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className="pl-2">
            <SidebarMenu>
              {item.subs?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SideBarMenuButtonWithBadge item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
