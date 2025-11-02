import { auth } from '@/auth';
import { ProtectedLayout } from '@/components/layout';
import ContainerReader from '@/components/tte/ContainerReader';
import { ContainerSignerStatus } from '@/components/tte/ContainerSignerStatus';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSignRequestById } from '@/lib/services/tte';
import { SignatoryWithUser } from '@/types/tte/sign-request';
import { AlertCircle } from 'lucide-react';

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

  const signRequest = await getSignRequestById(id);

  const isOwner = userId === signRequest?.userId;
  // isSigner should be true if userId matches any signatory.userId
  const isSigner =
    signRequest?.signatory.some(
      (s: SignatoryWithUser) => s.userId === userId
    ) || false;

  if (!signRequest) {
    return <UnauthorizedPage />;
  }

  // If not owner and not signer, block access
  if (!isOwner && !isSigner) {
    return <UnauthorizedPage />;
  }

  console.log('Fetched sign request:', signRequest);
  console.log('User is owner:', isOwner, 'isSigner:', isSigner);

  const isSigned =
    signRequest?.signatory.find((s: SignatoryWithUser) => s.userId === userId)
      ?.status === 'SIGNED';

  // Allow access if owner or signatory
  const canAccess = isOwner || isSigner;
  if (!canAccess) {
    return (
      <ProtectedLayout title="Tanda Tangan Elektronik">
        <div className="max-w-4xl mx-auto p-4">
          <p>Sign request not found or you do not have access.</p>
        </div>
      </ProtectedLayout>
    );
  }

  // check if the user has NIK if signer, as signer must have NIK
  if (isSigner && !session.user.nik) {
    return <NikNotFoundPage />;
  }

  const showSigningTools = !isSigned && isSigner;
  console.log('Show signing tools:', showSigningTools);

  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <ContainerSignerStatus signatories={signRequest.signatory} />
      <ContainerReader signRequestId={id} showSigningTools={showSigningTools} />
    </ProtectedLayout>
  );
};

const UnauthorizedPage = () => {
  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <div className="max-w-4xl mx-auto p-4">
        <p>Sign request not found or you do not have access.</p>
      </div>
    </ProtectedLayout>
  );
};

const NikNotFoundPage = () => {
  return (
    <ProtectedLayout title="Tanda Tangan Elektronik">
      <div className="max-w-xl mx-auto p-6 flex items-center justify-center min-h-[220px]">
        <Card className="w-full shadow-lg border-red-200">
          <CardHeader className="flex items-center gap-4">
            <AlertCircle
              className="h-8 w-8 text-red-600 shrink-0"
              aria-hidden="true"
            />
            <div>
              <CardTitle className="text-lg font-semibold text-red-700">
                Lengkapi NIK Anda
              </CardTitle>
              <CardDescription className="text-gray-700">
                Anda harus melengkapi <span className="font-semibold">NIK</span>{' '}
                pada profil Anda sebelum dapat menandatangani dokumen.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="destructive">
              <a href="/profile">Lengkapi Profil Sekarang</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default TteIdPage;
