"use client";
import { getSignRequests } from "@/actions/tte/sign-request";
import { TableActionBar } from "@/components/table/TableActionBar";
import { cn } from "@/lib/utils";
import { SignRequest } from "@prisma/client";
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

export const ContainerTableSignRequest = () => {
  const [data, setData] = useState<SignRequest[]>([]);
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
      const result = await getSignRequests();
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
          <TableSignRequest data={pagedData} />
        )}
      </div>
    </div>
  );
};

export default ContainerTableSignRequest;

const columns: ColumnDef<SignRequest>[] = [
  { accessorKey: "sender", header: "Pengirim" },
  { accessorKey: "subject", header: "Subjek" },
  {
    accessorKey: "receivedAt",
    header: "Tanggal",
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  },
  // { accessorKey: "status", header: "Status" },
];

type TableSignRequestProps = {
  data: SignRequest[];
  onChangePage?: (table: Table<SignRequest>, page: number) => void;
};

export const TableSignRequest = ({ data }: TableSignRequestProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto pr-4">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-800"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "hover:bg-gray-100 transition cursor-pointer dark:hover:bg-gray-700",
                  row.original.status === "unread" ? "font-bold" : ""
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {data.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-200 p-4 hover:bg-gray-50 transition cursor-pointer dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              {item.sender}
            </div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2 text-justify dark:text-gray-400">
              {item.subject}
            </div>
            <div className="text-xs text-gray-500 mt-1 dark:text-gray-500">
              {new Date(item.receivedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
