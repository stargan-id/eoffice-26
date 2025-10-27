import { ProtectedLayout } from "@/components/layout";
import { ContainerTte } from "@/components/tte/ContainerTte";

export const TteIdSignPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // get pdf data from api using id param
  const { id } = await params;

  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerTte />
    </ProtectedLayout>
  );
};

export default TteIdSignPage;
