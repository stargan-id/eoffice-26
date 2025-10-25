"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/stores";
import { UserAvatar } from "./UserAvatar";
import { NotificationDropdown } from "./NotificationDropdown";
import { SidebarTrigger } from "../ui/sidebar";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function TopBar({ title, subtitle, children }: TopBarProps) {
  const { toggleOpen } = useSidebarStore();

  return (
    <header className="bg-white border-b border-gray-200 pl-2 px-4 h-12 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={toggleOpen}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Title */}
        {(title || subtitle) && (
          <div>
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Center Section - Custom Content */}
      <div className="flex-1 flex justify-center px-4">{children}</div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        {/* User Avatar Dropdown */}
        <UserAvatar />
      </div>
    </header>
  );
}
