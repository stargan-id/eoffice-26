"use client";
import React from "react";
import { SidebarNavigation, MenuItem } from "@/components/navigation";
import { TopBar } from "./TopBar";
import {
  Home,
  MapPin,
  BarChart3,
  AlertCircle,
  Settings,
  Users,
  FileText,
  Utensils,
  Building,
} from "lucide-react";
import { AppSidebar } from "../navigation/AppSidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showTopBar?: boolean;
  topBarContent?: React.ReactNode;
}

export function ProtectedLayout({
  children,
  title,
  subtitle,
  showTopBar = true,
  topBarContent,
}: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 w-full">
      {/* Sidebar Navigation */}
      {/* <SidebarNavigation
        menuItems={defaultMenuItems}
        title="E-Office"
        headerColor="bg-green-600"
        appIcon={Building}
      /> */}

      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        {showTopBar && (
          <TopBar title={title} subtitle={subtitle}>
            {topBarContent}
          </TopBar>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
