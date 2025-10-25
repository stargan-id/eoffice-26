"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Archive, RefreshCcw } from "lucide-react";
import { PaginationControls } from "./PaginationControl";

export const TableActionBar = () => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-white border-b border-gray-200">
      <CheckBoxFilter />
      <IconButton title="Refresh" icon={<RefreshCcw className="w-5 h-5" />} />
      <IconButton title="Archive" icon={<Archive className="w-5 h-5" />} />
      <PaginationControls
        totalItems={42}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={(page) => console.log("Change to page:", page)}
      />
    </div>
  );
};

const CheckBoxFilter = () => {
  return (
    <div className="flex items-center">
      <input type="checkbox" className="size-4" />
    </div>
  );
};

export function IconButton({
  title,
  onClick,
  className,
  icon,
  tooltipSide,
}: {
  title: string;
  onClick?: () => void;
  className?: string;
  icon: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 transition-colors",
            className
          )}
          aria-label={title}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} align="center">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}
