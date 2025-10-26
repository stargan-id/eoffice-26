import React from "react";

export interface Pagination {
    page: number;
    pageSize: number;
    totalCount: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectPage: (page: number) => void;
}

interface PaginationControlProps {
    pagination?: Pagination;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({ pagination }) => {
    if (!pagination) {
        return null; // or some default UI
    }
    const { page, pageSize, totalCount, onPrev, onNext, onSelectPage } = pagination || {};
    const pageCount = Math.ceil(totalCount / pageSize);
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalCount);

    return (
        <div className="flex items-center justify-end gap-2 py-2">
            <button
                onClick={onPrev}
                disabled={page === 0}
                className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
                &lt;
            </button>
            <select
                value={page}
                onChange={e => onSelectPage(Number(e.target.value))}
                className="px-2 py-1 rounded border bg-white text-gray-700"
            >
                {Array.from({ length: pageCount }, (_, i) => {
                    const rangeStart = i * pageSize + 1;
                    const rangeEnd = Math.min((i + 1) * pageSize, totalCount);
                    return (
                        <option key={i} value={i}>
                            {rangeStart}-{rangeEnd} of {totalCount.toLocaleString()}
                        </option>
                    );
                })}
            </select>
            <button
                onClick={onNext}
                disabled={page === pageCount - 1}
                className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
    );
};

export default PaginationControl;