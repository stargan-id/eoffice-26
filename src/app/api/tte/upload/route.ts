import { auth } from '@/auth';
import { db } from '@/lib/db';
import { saveFileFromFormData } from '@/lib/helpers/upload';
import { UploadSignRequestSchema } from '@/zod/schema/tte';
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

    // Validasi menggunakan Zod
    const validatedFields = UploadSignRequestSchema.safeParse({
      file: file ? [file] : [], // Schema mengharapkan array
    });

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
    const newSignRequest = await db.signRequest.create({
      data: {
        userId: session.user.id,
        subject: `New Document: ${file!.name}`,
        fileUrl: fileUrl,
        status: 'PENDING',
        completion: '0/1',
        message: '',
        notes: '',
        signatory: {
          create: {
            userId: session.user.id, // Untuk demo, pemilik juga sebagai signatory
            ordinal: 1,
            status: 'WAITING',
            signVisibility: 'VISIBLE',
            notes: '',
          },
        },
      },
    });

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
