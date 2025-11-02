import { auth } from '@/auth';
import { db } from '@/lib/db';
import { saveFileFromFormData } from '@/lib/helpers/upload';
import {
  UploadSelfSignRequestSchema,
  UploadSignRequestSchema,
} from '@/zod/schema/tte';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Cek apakah ada signatories (multiple signers)
    const signatories = formData.getAll('signatories');
    let validatedFields;
    let isMultiSign = false;
    if (signatories.length > 0) {
      // Validasi dengan UploadSignRequestSchema
      validatedFields = UploadSignRequestSchema.safeParse({
        subject: formData.get('subject') || undefined,
        signatories,
        file: file ? [file] : [],
      });
      isMultiSign = true;
    } else {
      // Validasi dengan UploadSelfSignRequestSchema
      validatedFields = UploadSelfSignRequestSchema.safeParse({
        subject: formData.get('subject') || undefined,
        file: file ? [file] : [],
      });
    }

    if (!validatedFields.success) {
      const errorMessage = z.flattenError(validatedFields.error);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Buat path penyimpanan berdasarkan tanggal
    const now = new Date();
    const year = now.getFullYear();
    // Example: '2025110114' for Nov 1, 2025, 14:00
    const timebasedPath = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}`;
    const dailyPath = `/documents/${year}/${timebasedPath}`;

    // generate random document ID use uuid like '550e8400-e29b-41d4-a716-446655440000'
    const documentId = uuidv4() + '.pdf';
    const fileUrl = `${dailyPath}/${documentId}`;

    // try to save file and then buat entri di database

    await saveFileFromFormData(session.user.id, file!, dailyPath, documentId);

    // Buat entri di database
    let newSignRequest;
    if (isMultiSign) {
      // Multiple signatories
      const multiData = validatedFields.data as z.infer<
        typeof UploadSignRequestSchema
      >;

      console.log('Creating multi-sign sign request', multiData);

      newSignRequest = await db.signRequest.create({
        data: {
          userId: session.user.id,
          subject: multiData.subject
            ? `${multiData.subject}`
            : `Document: ${file!.name}`,
          fileUrl: fileUrl,
          status: 'WAITING',
          completion: `0/${multiData.signatories.length}`,
          message: '',
          notes: '',
          signatory: {
            create: multiData.signatories.map(
              (userId: string, idx: number) => ({
                userId: userId,
                ordinal: idx + 1,
                status: 'WAITING',
                signVisibility: 'VISIBLE',
                notes: '',
              })
            ),
          },
        },
      });
    } else {
      // Single signatory (self-sign)
      newSignRequest = await db.signRequest.create({
        data: {
          userId: session.user.id,
          subject: validatedFields.data.subject
            ? `${validatedFields.data.subject}`
            : `Document: ${file!.name}`,
          fileUrl: fileUrl,
          status: 'WAITING',
          completion: '0/1',
          message: '',
          notes: '',
          signatory: {
            create: {
              userId: session.user.id,
              ordinal: 1,
              status: 'WAITING',
              signVisibility: 'VISIBLE',
              notes: '',
            },
          },
        },
      });
    }

    return NextResponse.json(
      { signRequestId: newSignRequest.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API_UPLOAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
