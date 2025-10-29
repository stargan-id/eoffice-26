import { ProtectedLayout } from "@/components/layout";
import ContainerReader from "@/components/tte/ContainerReader";

export const TteIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // get pdf data from api using id param
  const { id } = await params;

  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerReader showSigningTools={false} />
    </ProtectedLayout>
  );
};

export default TteIdPage;
