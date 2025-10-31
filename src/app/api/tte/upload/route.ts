import { auth } from '@/auth';
import { db } from '@/lib/db';
import { UploadSignRequestSchema } from '@/zod/schema/tte';
import { NextResponse } from 'next/server';

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
      const errorMessage =
        validatedFields.error.flatten().fieldErrors.file?.[0] ||
        'Invalid file.';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Simulasi upload ke cloud storage (misal: S3, Google Cloud Storage)
    // Di aplikasi nyata, Anda akan mengunggah file dan mendapatkan URL-nya.
    const simulatedFileUrl = `/uploads/documents/${Date.now()}-${file!.name}`;

    // Buat entri di database
    const newSignRequest = await db.signRequest.create({
      data: {
        userId: session.user.id,
        subject: `New Document: ${file!.name}`,
        fileUrl: simulatedFileUrl,
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
      { documentId: newSignRequest.id },
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
