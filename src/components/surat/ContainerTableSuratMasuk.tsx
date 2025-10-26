"use client";
import { getInboxData } from "@/actions/inbox";
import { TableActionBar } from "@/components/table/TableActionBar";
import { InboxItem } from "@/types/inbox-item.types";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../common/TableSkeleton";

export const ContainerTableSuratMasuk = () => {
    const [data, setData] = useState<InboxItem[]>([]);
    const [loading, setLoading] = useState(true);

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
            <TableActionBar />
            <div className="flex-1 overflow-auto pb-[5rem]">
                {loading ? (
                    <TableSkeleton rows={20} />
                ) : (
                    <TableSuratMasuk data={data} />
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
};

export const TableSuratMasuk = ({ data }: TableSuratMasukProps) => {
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