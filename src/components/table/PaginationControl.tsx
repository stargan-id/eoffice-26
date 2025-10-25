"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export const PaginationControls = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = (
      <span key="ellipsis" className="px-3 py-1">
        ...
      </span>
    );

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="h-8 w-8 p-0"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );

      // Ellipsis or pages after first
      if (currentPage > 3) {
        pageNumbers.push(ellipsis);
      }

      // Middle pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(i)}
              className="h-8 w-8 p-0"
            >
              {i}
            </Button>
          );
        }
      }

      // Ellipsis or pages before last
      if (currentPage < totalPages - 2) {
        pageNumbers.push(ellipsis);
      }

      // Always show last page
      pageNumbers.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="h-8 w-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {renderPageNumbers()}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
