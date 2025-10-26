import ContainerTable from "@/components/common/ContainerTable";
import { ProtectedLayout } from "@/components/layout";

export default async function SuratKeluarPage() {
  const activeAlertCount = 5; // Example static count, replace with real data fetching if needed
  return (
    <ProtectedLayout title="Surat Keluar">
      <ContainerTable />
    </ProtectedLayout>
  );
}
