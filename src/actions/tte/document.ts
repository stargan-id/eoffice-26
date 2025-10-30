"use server";
import { ActionResponse } from "@/types/action-response.types";
import fs from "fs";
import path from "path";

export const getPdfDocument = async (
  documentId: string
): Promise<ActionResponse<Blob>> => {
  // implementasi pengambilan dokumen PDF berdasarkan documentId
  // Simulate reading request body
  // Simulate PDF file (use a sample file from public folder)

  // find document

  const pdfPath = path.join(process.cwd(), "public", "sample.pdf");
  const pdfBuffer = fs.readFileSync(pdfPath);
  const idDokumen = "mocked-id-12345";

  return {
    success: true,
    data: new Blob([pdfBuffer], { type: "application/pdf" }),
  };
};
