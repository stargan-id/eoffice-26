import { ProtectedLayout } from "@/components/layout";
import ContainerReader from "@/components/tte/ContainerReader";

export const TteIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // get pdf data from api using id param
  const { id } = await params;
  const isOwner = true;
  const isSigner = true;
  const isSigned = false;

  const showSigningTools = !isSigned && (isOwner || isSigner);

  // cek user
  // cek apakah pemilik dokumen atau orang yg diminta untuk ttd

  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerReader documentId={id} showSigningTools={showSigningTools} />
    </ProtectedLayout>
  );
};

export default TteIdPage;
