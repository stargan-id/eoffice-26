import { getSignRequestForUser } from '@/actions/tte/sign-request';
import { auth } from '@/auth';
import { ProtectedLayout } from '@/components/layout';
import ContainerReader from '@/components/tte/ContainerReader';

export const TteIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // get pdf data from api using id param
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const userId = session.user.id;

  console.log('Fetching sign request for user:', userId, 'and id:', id);

  const resSignReq = await getSignRequestForUser(userId, id);
  console.log('Sign request fetch result:', resSignReq);

  if (!resSignReq.success || !resSignReq.data) {
    return (
      <ProtectedLayout title="Tanda Tangan Elektronik">
        <div className="max-w-4xl mx-auto p-4">
          <p>Sign request not found or you do not have access.</p>
        </div>
      </ProtectedLayout>
    );
  }

  const isOwner = userId === resSignReq.data.user.id;
  const isSigner = userId === resSignReq.data.signatory.userId;
  const isSigned = resSignReq.data.signatory.status === 'SIGNED';

  const showSigningTools = !isSigned && isSigner;
  console.log('Show signing tools:', showSigningTools);

  // cek user
  // cek apakah pemilik dokumen atau orang yg diminta untuk ttd

  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerReader documentId={id} showSigningTools={showSigningTools} />
    </ProtectedLayout>
  );
};

export default TteIdPage;
