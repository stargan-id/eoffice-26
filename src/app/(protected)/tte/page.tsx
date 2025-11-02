import { ProtectedLayout } from '@/components/layout';
import ContainerTableSignRequest from '@/components/tte/ContainerTableSignRequest';

export default async function TtePage() {
  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerTableSignRequest />
    </ProtectedLayout>
  );
}
