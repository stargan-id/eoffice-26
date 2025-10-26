"use client";
import { getInboxData } from "@/actions/inbox";
import { TableActionBar } from "@/components/table/TableActionBar";
import { InboxItem } from "@/types/inbox-item.types";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Table,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../common/TableSkeleton";
import { Pagination } from "../table/PaginationControl";

export const ContainerTableSuratMasuk = () => {
    const [data, setData] = useState<InboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const pageCount = Math.ceil(data.length / pageSize);
    const pagedData = data.slice(page * pageSize, (page + 1) * pageSize);

    const pagination: Pagination = {
        page,
        pageSize,
        totalCount: data.length,
        onPrev: () => setPage((p) => Math.max(p - 1, 0)),
        onNext: () => setPage((p) => Math.min(p + 1, pageCount - 1)),
        onSelectPage: (page: number) => setPage(page),
    };


    useEffect(() => {
        // This effect can be used to fetch data if needed
        const fetchData = async () => {
            // Simulate data fetching
            const result = await getInboxData();
            if (result.success) {
                setData(result.data);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <TableActionBar pagination={pagination} />
            <div className="flex-1 overflow-auto pb-[5rem]">
                {loading ? (
                    <TableSkeleton rows={20} />
                ) : (
                    <TableSuratMasuk data={pagedData} />
                )}
            </div>
        </div>
    );
};

export default ContainerTableSuratMasuk;


const columns: ColumnDef<InboxItem>[] = [
    { accessorKey: "sender", header: "Pengirim" },
    { accessorKey: "subject", header: "Subjek" },
    { accessorKey: "receivedAt", header: "Tanggal", cell: info => new Date(info.getValue() as string).toLocaleDateString() },
    { accessorKey: "status", header: "Status" },
];

type TableSuratMasukProps = {
    data: InboxItem[];
    onChangePage?: (table: Table<InboxItem>, page: number) => void;
};

export const TableSuratMasuk = ({ data, onChangePage }: TableSuratMasukProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="min-w-full">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} className="px-4 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-100 transition cursor-pointer">
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-4 py-3 text-sm text-gray-800">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};