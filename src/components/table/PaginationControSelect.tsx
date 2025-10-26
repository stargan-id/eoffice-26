import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationControlsProps<T> {
    table: Table<T>;
}
export const PaginationControls = <T,>({
    table,
}: PaginationControlsProps<T>) => {
    const [jumpPage, setJumpPage] = useState(
        table.getState().pagination.pageIndex + 1
    );
    const pageCount = table.getPageCount();

    const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const page = Number(e.target.value);
        if (page >= 1 && page <= table.getPageCount()) {
            table.setPageIndex(page - 1); // pageIndex is zero-based
        }
    };

    return (
        <div className="my-2 flex flex-row gapx-2 sm:gap-2 items-center">
            {/* Pagination controls */}
            <Button
                variant={"outline"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2"
            >
                <ChevronLeft size={24} />
                <span className="hidden sm:block">Previous</span>
            </Button>

            <select
                value={table.getState().pagination.pageIndex + 1}
                onChange={handlePageChange}
                className="mx-2 p-2 rounded-sm border border-gray-300"
            >
                {Array.from({ length: pageCount }, (_, i) => (
                    <option key={i} value={i + 1}>
                        Page {i + 1} of {pageCount}
                    </option>
                ))}
            </select>

            <Button
                variant={"outline"}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2"
            >
                <ChevronRight size={24} />
                <span className="hidden sm:block">Next</span>
            </Button>

            {/* Select page size */}
            <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="mx-2 p-2 rounded-sm border border-gray-300"
            >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
};
