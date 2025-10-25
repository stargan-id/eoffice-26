import ContainerTable from "@/components/common/ContainerTable";
import { ProtectedLayout } from "@/components/layout";

export default async function DashboardPage() {
  const activeAlertCount = 5; // Example static count, replace with real data fetching if needed
  return (
    <ProtectedLayout title="Inbox">
      <ContainerTable />
    </ProtectedLayout>
  );
}
