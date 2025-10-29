import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  // Simulate reading request body
  const body = await request.formData();
  // Simulate PDF file (use a sample file from public folder)
  const pdfPath = path.join(process.cwd(), "public", "sample.pdf");
  const pdfBuffer = fs.readFileSync(pdfPath);
  const idDokumen = "mocked-id-12345";

  const response = new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      id_dokumen: idDokumen,
    },
  });
  return response;
}
