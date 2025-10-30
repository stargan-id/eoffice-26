import { ProtectedLayout } from "@/components/layout";
import ContainerTableSignRequest from "@/components/tte/ContainerTableSignRequest";

export default async function TtePage() {
  const activeAlertCount = 5; // Example static count, replace with real data fetching if needed
  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerTableSignRequest />
    </ProtectedLayout>
  );
}
