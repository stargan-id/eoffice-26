"use client";

import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

interface SidebarNavigationProps {
  menuItems: MenuItem[];
  title: string;
  subtitle?: string;
  headerColor?: string;
  footer?: React.ReactNode;
  appIcon?: LucideIcon;
}

export function SidebarNavigation({
  menuItems,
  title,
  subtitle,
  headerColor = "bg-green-600",
  footer,
  appIcon,
}: SidebarNavigationProps) {
  const { isMinimized, isOpen, toggleMinimized, setOpen } = useSidebarStore();
  const pathname = usePathname();

  // Mobile sidebar content (always expanded)
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("p-6 border-b text-white", headerColor)}>
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "relative",
                  item.disabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none",
                  isActive
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {footer ? (
        <div className="p-4 border-t bg-gray-50">{footer}</div>
      ) : (
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 BGN Indonesia</p>
            <p>v1.0.0 - MVP</p>
          </div>
        </div>
      )}
    </div>
  );

  // Desktop sidebar content (can be minimized)
  const DesktopSidebarContent = () => (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={cn(
            "border-b text-white relative",
            headerColor,
            isMinimized ? "p-3" : "p-6"
          )}
        >
          {!isMinimized ? (
            <>
              <h2 className="text-xl font-bold">{title}</h2>
              {subtitle && (
                <p className="text-sm opacity-90 mt-1">{subtitle}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center">
              {appIcon ? (
                React.createElement(appIcon, { className: "w-8 h-8" })
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">{title.charAt(0)}</span>
                </div>
              )}
            </div>
          )}

          {/* Toggle button */}
          <Button
            onClick={toggleMinimized}
            variant="ghost"
            size="sm"
            className={cn(
              "absolute text-white hover:bg-white/20 p-1 h-6 w-6",
              isMinimized ? "top-3 right-0" : "top-3 right-0"
            )}
          >
            {isMinimized ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-2", isMinimized ? "p-2" : "p-4")}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            const menuItemContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors w-full",
                  "relative",
                  item.disabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none",
                  isActive
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-600 hover:bg-gray-100",
                  isMinimized
                    ? "gap-0 px-2 py-3 justify-center"
                    : "gap-3 px-3 py-2.5"
                )}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0",
                    isMinimized ? "w-5 h-5" : "w-5 h-5"
                  )}
                />
                {!isMinimized && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );

            return (
              <div key={item.href} className="relative">
                {isMinimized ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{menuItemContent}</TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  menuItemContent
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isMinimized &&
          (footer ? (
            <div className="p-4 border-t bg-gray-50">{footer}</div>
          ) : (
            <div className="p-4 border-t bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                <p>© 2024 BGN Indonesia</p>
                <p>v1.0.0 - MVP</p>
              </div>
            </div>
          ))}
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r shadow-sm z-30",
          isMinimized ? "lg:w-16" : "lg:w-64"
        )}
      >
        <DesktopSidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 z-50">
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Layout Spacer for Desktop */}
      <div
        className={cn(
          "hidden lg:block flex-shrink-0",
          isMinimized ? "lg:w-16" : "lg:w-64"
        )}
        aria-hidden="true"
      />
    </>
  );
}
