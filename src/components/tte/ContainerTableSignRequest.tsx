'use client';
import { IconButton, TableActionBar } from '@/components/table/TableActionBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignRequest, SignRequestForUser } from '@/types/tte/sign-request';
import { CheckCircle, Mail, Send, Signature, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TableSkeleton } from '../common/TableSkeleton';
import { Pagination } from '../table/PaginationControl';
import FormUploadSelfSignRequest from './FormUploadSelfSignRequest';

import {
  getSignRequestsByOrForUser,
  getSignRequestsForUser,
} from '@/actions/tte/sign-request';
import FormUploadSignRequest from './FormUploadSignRequest';
import { TableSignRequest } from './TableSignRequest';
import { TableSignRequestForUser } from './TableSignRequestForUser';

export const ContainerTableSignRequest = () => {
  const [dataSignRequestForUser, setDataSignRequestForUser] = useState<
    SignRequestForUser[]
  >([]);
  const [dataSignRequestsByUser, setDataSignRequestsByUser] = useState<
    SignRequest[]
  >([]);
  const [dataSignRequestsByOrForUser, setDataSignRequestsByOrForUser] =
    useState<SignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const pageCount = Math.ceil(dataSignRequestForUser.length / pageSize);
  const pagedData = dataSignRequestForUser.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const pagedDataSignRequestsByOrForUser = dataSignRequestsByOrForUser.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const [
    isUploadSelfSignRequestModalOpen,
    setIsUploadSelfSignRequestModalOpen,
  ] = useState(false);
  const [isUploadSignRequestModalOpen, setIsUploadSignRequestModalOpen] =
    useState(false);

  const pagination: Pagination = {
    page,
    pageSize,
    totalCount: dataSignRequestForUser.length,
    onPrev: () => setPage((p) => Math.max(p - 1, 0)),
    onNext: () => setPage((p) => Math.min(p + 1, pageCount - 1)),
    onSelectPage: (page: number) => setPage(page),
  };

  const handleSignRequest = () => {
    // Logic to handle new sign request
    setIsUploadSignRequestModalOpen(true);
  };

  const handleSelfSignRequest = () => {
    // Logic to handle sign
    toast.success('Sign action triggered');
    setIsUploadSelfSignRequestModalOpen(true);
  };

  const controls = () => {
    return (
      <>
        <IconButton
          title="Sign"
          icon={<Signature className="w-5 h-5" />}
          onClick={handleSelfSignRequest}
        />
        <IconButton
          title="Request"
          icon={<Send className="w-5 h-5" />}
          onClick={handleSignRequest}
        />
      </>
    );
  };

  useEffect(() => {
    // This effect can be used to fetch data if needed
    const fetchData = async () => {
      // Simulate data fetching
      const result = await getSignRequestsForUser();
      if (result.success) {
        setDataSignRequestForUser(result.data);
      }

      const resultByOrForUser = await getSignRequestsByOrForUser();

      if (resultByOrForUser.success) {
        setDataSignRequestsByOrForUser(resultByOrForUser.data);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TableActionBar controls={controls()} pagination={pagination} />
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
                <Mail className="w-5 h-5" />
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <Timer className="w-5 h-5" />
                Menunggu TTE
              </TabsTrigger>
              <TabsTrigger
                value="done"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                TTE Selesai
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="tabs-trigger h-12 min-w-[120px] max-w-[220px] px-4 pb-2 flex items-center justify-start gap-2 text-gray-700 font-medium bg-transparent rounded-none shadow-none ring-0 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Dokumen Selesai
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="h-full">
              <TableSignRequest data={pagedDataSignRequestsByOrForUser} />
            </TabsContent>
            <TabsContent value="pending" className="h-full">
              {/* Filter pagedData for waiting/in progress status */}
              <TableSignRequestForUser
                data={pagedData.filter(
                  (item) =>
                    item.status === 'WAITING' || item.status === 'IN_PROGRESS'
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
            <TabsContent value="completed" className="h-full">
              {/* Filter pagedData for waiting/in progress status */}
              <TableSignRequest
                data={pagedDataSignRequestsByOrForUser.filter((item) =>
                  ['COMPLETED', 'CANCELLED', 'FAILED'].includes(item.status)
                )}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
      <FormUploadSelfSignRequest
        isOpen={isUploadSelfSignRequestModalOpen}
        onClose={() => setIsUploadSelfSignRequestModalOpen(false)}
      />
      <FormUploadSignRequest
        isOpen={isUploadSignRequestModalOpen}
        onClose={() => setIsUploadSignRequestModalOpen(false)}
      />
    </div>
  );
};

export default ContainerTableSignRequest;
