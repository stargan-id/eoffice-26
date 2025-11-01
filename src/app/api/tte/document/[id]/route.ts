import { getPdfDocument } from '@/actions/tte/document';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getPdfDocument(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  // Convert Buffer to Uint8Array for NextResponse
  const pdfArray = new Uint8Array(result.data);
  return new NextResponse(pdfArray, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${id}.pdf"`,
    },
  });
}
