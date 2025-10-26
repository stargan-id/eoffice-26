import { ProtectedLayout } from "@/components/layout";
import ContainerTableSuratMasuk from "@/components/surat/ContainerTableSuratMasuk";

export default async function SuratMasukPage() {
  const activeAlertCount = 5; // Example static count, replace with real data fetching if needed
  return (
    <ProtectedLayout title="Surat Masuk">
      <ContainerTableSuratMasuk />
    </ProtectedLayout>
  );
}
