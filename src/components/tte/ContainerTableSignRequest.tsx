'use client';
import { getSignRequests } from '@/actions/tte/sign-request';
import { TableActionBar } from '@/components/table/TableActionBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignRequest, SignRequestForUser } from '@/types/tte/sign-request';
import { useEffect, useState } from 'react';
import { TableSkeleton } from '../common/TableSkeleton';
import { Pagination } from '../table/PaginationControl';
import { TableSignRequestForUser } from './TableSignRequestForUser';

export const ContainerTableSignRequest = () => {
  const [dataSignRequestForUser, setDataSignRequestForUser] = useState<
    SignRequestForUser[]
  >([]);
  const [dataSignRequestsByUser, setDataSignRequestsByUser] = useState<
    SignRequest[]
  >([]);
  const [dataSignRequestsSelf, setDataSignRequestsSelf] = useState<
    SignRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const pageCount = Math.ceil(dataSignRequestForUser.length / pageSize);
  const pagedData = dataSignRequestForUser.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const pagination: Pagination = {
    page,
    pageSize,
    totalCount: dataSignRequestForUser.length,
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
        setDataSignRequestForUser(result.data);
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
          <Tabs defaultValue="all" className="w-full h-full">
            <TabsList className="flex gap-2 bg-transparent h-12 justify-start items-end rounded-none shadow-none p-0 w-full border-b border-gray-200">
              <TabsTrigger
                value="all"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Menunggu
              </TabsTrigger>
              <TabsTrigger
                value="done"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Selesai
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="h-full">
              <TableSignRequestForUser data={pagedData} />
            </TabsContent>
            <TabsContent value="pending" className="h-full">
              {/* Filter pagedData for waiting/in progress status */}
              <TableSignRequestForUser
                data={pagedData.filter(
                  (item) =>
                    item.status === 'PENDING' || item.status === 'IN_PROGRESS'
                )}
              />
            </TabsContent>
            <TabsContent value="done" className="h-full">
              {/* Filter pagedData for completed/cancelled/failed status */}
              <TableSignRequestForUser
                data={pagedData.filter((item) =>
                  ['COMPLETED', 'FAILED', 'CANCELLED'].includes(item.status)
                )}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ContainerTableSignRequest;
