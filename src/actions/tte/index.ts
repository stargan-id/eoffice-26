'use server';

import { ActionResponse } from '@/types/action-response.types';
import {
  SignDocumentResponse,
  VerifyDocumentResponse,
} from '@/types/tte.interfaces';
import fs from 'fs';
import {
  createErrorResponse,
  // Pastikan Anda mengimpor helper error Zod
  createZodErrorResponse,
  getApiAuthHeaders,
  getApiBaseUrl,
  handleErrorResponse,
} from './helpers';
// Impor skema baru
import { SignDocumentSchema, VerifyDocumentSchema } from '@/zod/schema/tte';
import path from 'path';

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
  const pdfPath = path.join(process.cwd(), 'public', 'sample.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);
  rawData.file = new File([pdfBuffer], 'sample.pdf', {
    type: 'application/pdf',
  });
  rawData.nik = '3524142010820005';
  rawData.width = (parseInt(formData.get('xAxis') as string) + 100).toString();
  rawData.height = (parseInt(formData.get('yAxis') as string) + 100).toString();
  rawData.image = 'false';
  rawData.linkQR = 'https://example.com/verify/123456';
  rawData.passphrase = 'P@ssw0rdtte';
  rawData.page = '1';

  // 2. Validasi dengan safeParse
  const validation = SignDocumentSchema.safeParse(rawData);

  // 3. Jika validasi gagal, kembalikan error Zod
  if (!validation.success) {
    console.error('Validation failed:', validation.error);
    return createZodErrorResponse(validation.error);
  }

  // after parse add validated data back to formData
  formData.set('nik', validation.data.nik);
  if (validation.data.width !== undefined)
    formData.set('width', validation.data.width);
  if (validation.data.height !== undefined)
    formData.set('height', validation.data.height);
  if (validation.data.image !== undefined)
    formData.set('image', validation.data.image);
  if (validation.data.linkQR !== undefined)
    formData.set('linkQR', validation.data.linkQR);

  formData.set('file', validation.data.file);

  formData.set('passphrase', validation.data.passphrase);

  console.log('Validation succeeded:', formData);

  // 4. Jika sukses, lanjutkan dengan FormData *asli*
  try {
    console.log('trying to sign document...', BASE_URL);
    const response = await fetch(`${BASE_URL}/api/sign/pdf`, {
      method: 'POST',
      headers: {
        ...AUTH_HEADERS,
        // Add content type for file upload
        // 'Content-Type': 'multipart/form-data', // Let browser set this automatically for FormData
      },
      body: formData, // Kirim FormData asli (bukan validation.data)
    });

    if (!response.ok) {
      const rawBody = await response.text();
      console.error('Sign document failed with status:', response.status);
      console.error('Raw response body:', rawBody);
      return await handleErrorResponse(response);
    }

    // // console log all response headers
    // console.log('Response Headers:', Array.from(response.headers.entries()));

    // return {
    //   success: false,
    //   error: 'Invalid document ID.',
    // };

    console.log('Sign document response status:', response.status);

    const pdfBlob = await response.blob();

    // save to file for testing purpose
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfPathResult = path.join(process.cwd(), 'public', 'result.pdf');

    fs.writeFileSync(pdfPathResult, Buffer.from(arrayBuffer));
    console.log('Signed document saved to:', pdfPathResult);

    const idDokumen = response.headers.get('id_dokumen');

    console.log('Signed document ID:', idDokumen);

    return {
      success: true,
      data: {
        file: pdfBlob,
        id_dokumen: idDokumen || 'N/A',
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
  if (!id_dokumen || typeof id_dokumen !== 'string') {
    return { success: false, error: 'Invalid document ID.' };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/sign/download/${id_dokumen}`,
      {
        method: 'GET',
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
      method: 'POST',
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
