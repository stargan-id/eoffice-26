'use client';
import { cn } from '@/lib/utils';
import { SignRequestForUser } from '@/types/tte/sign-request';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/dist/client/components/navigation';

const columns: ColumnDef<SignRequestForUser>[] = [
  { accessorKey: 'user.name', header: 'Pengirim' },
  { accessorKey: 'subject', header: 'Subjek' },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
  { accessorKey: 'signatory.status', header: 'Status' },
];

type TableSignRequestByUserProps = {
  data: SignRequestForUser[];
  onChangePage?: (table: Table<SignRequestForUser>, page: number) => void;
};

export const TableSignRequestByUser = ({
  data,
}: TableSignRequestByUserProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();

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
                onClick={() => router.push(`/tte/${row.original.id}`)}
                className={cn(
                  'hover:bg-gray-100 transition cursor-pointer dark:hover:bg-gray-700',
                  row.original.status === 'WAITING' ? 'font-bold' : ''
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
              {item.user.name}
            </div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2 text-justify dark:text-gray-400">
              {item.subject}
            </div>
            <div className="text-xs text-gray-500 mt-1 dark:text-gray-500">
              {new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
