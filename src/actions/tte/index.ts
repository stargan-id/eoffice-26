"use server";

import { ActionResponse } from "@/types/action-response.types";
import {
  SignDocumentResponse,
  VerifyDocumentResponse,
} from "@/types/tte.interfaces";
import fs from "fs";
import {
  createErrorResponse,
  // Pastikan Anda mengimpor helper error Zod
  createZodErrorResponse,
  getApiAuthHeaders,
  getApiBaseUrl,
  handleErrorResponse,
} from "./helpers";
// Impor skema baru
import { SignDocumentSchema, VerifyDocumentSchema } from "@/zod/schema/tte";
import path from "path";

const BASE_URL = getApiBaseUrl();
const AUTH_HEADERS = getApiAuthHeaders();

/**
 * Aksi untuk endpoint "SIGN DOKUMEN (User)" (DENGAN ZOD)
 */
export async function signDocument(
  formData: FormData
): Promise<ActionResponse<SignDocumentResponse>> {
  // 1. Ubah FormData menjadi objek untuk divalidasi
  const rawData = Object.fromEntries(formData.entries());

  // read file from folder /public/sample.pdf for testing purpose
  // and then add to rawData file property
  const pdfPath = path.join(process.cwd(), "public", "sample.pdf");
  const pdfBuffer = fs.readFileSync(pdfPath);
  rawData.file = new File([pdfBuffer], "sample.pdf", {
    type: "application/pdf",
  });
  rawData.nik = "1234567890887";
  rawData.width = "100";
  rawData.height = "100";
  rawData.image = "false";
  rawData.linkQR = "https://example.com/verify/12345";

  // 2. Validasi dengan safeParse
  const validation = SignDocumentSchema.safeParse(rawData);

  // 3. Jika validasi gagal, kembalikan error Zod
  if (!validation.success) {
    console.error("Validation failed:", validation.error);
    return createZodErrorResponse(validation.error);
  }

  // 4. Jika sukses, lanjutkan dengan FormData *asli*
  try {
    const response = await fetch(`${BASE_URL}/api/sign/pdf`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: formData, // Kirim FormData asli (bukan validation.data)
    });

    if (!response.ok) {
      console.error("Sign document failed with status:", response.status);
      return await handleErrorResponse(response);
    }

    console.log("Sign document response status:", response.status);

    const pdfBlob = await response.blob();
    const idDokumen = response.headers.get("id_dokumen");

    return {
      success: true,
      data: {
        file: pdfBlob,
        id_dokumen: idDokumen || "N/A",
      },
    };
  } catch (error) {
    console.error(error);
    return createErrorResponse(error);
  }
}

/**
 * Aksi untuk endpoint "DOWNLOAD SIGNED DOKUMEN"
 * (Tidak perlu Zod, karena hanya menerima string ID)
 */
export async function downloadSignedDocument(
  id_dokumen: string
): Promise<ActionResponse<Blob>> {
  // Anda bisa menambahkan validasi string sederhana di sini jika mau
  if (!id_dokumen || typeof id_dokumen !== "string") {
    return { success: false, error: "Invalid document ID." };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/sign/download/${id_dokumen}`,
      {
        method: "GET",
        headers: AUTH_HEADERS,
      }
    );

    if (!response.ok) {
      return await handleErrorResponse(response);
    }

    const data = await response.blob();
    return { success: true, data };
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * Aksi untuk endpoint "VERIFY" (DENGAN ZOD)
 */
export async function verifyDocument(
  formData: FormData
): Promise<ActionResponse<VerifyDocumentResponse>> {
  // 1. Validasi
  const validation = VerifyDocumentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // 2. Jika gagal, kembalikan error
  if (!validation.success) {
    return createZodErrorResponse(validation.error);
  }

  // 3. Jika sukses, lanjutkan
  try {
    const response = await fetch(`${BASE_URL}/api/sign/verify`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: formData, // Kirim FormData asli
    });

    if (!response.ok) {
      return await handleErrorResponse(response);
    }

    const data = (await response.json()) as VerifyDocumentResponse;
    return { success: true, data };
  } catch (error) {
    return createErrorResponse(error);
  }
}
