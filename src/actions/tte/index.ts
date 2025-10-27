"use server";

import { ActionResponse } from "@/types/action-response.types";
import {
    SignDocumentResponse,
    VerifyDocumentResponse
} from '@/types/tte.interfaces';
import {
    createErrorResponse,
    getApiAuthHeaders,
    getApiBaseUrl,
    handleErrorResponse,
} from './helpers';

import {
    // Pastikan Anda mengimpor helper error Zod
    createZodErrorResponse
} from './helpers';
// Impor skema baru
import { SignDocumentSchema, VerifyDocumentSchema } from '@/zod/schema/tte';

const BASE_URL = getApiBaseUrl();
const AUTH_HEADERS = getApiAuthHeaders();


/**
 * Aksi untuk endpoint "SIGN DOKUMEN (User)" (DENGAN ZOD)
 */
export async function signDocument(
    formData: FormData,
): Promise<ActionResponse<SignDocumentResponse>> {
    // 1. Ubah FormData menjadi objek untuk divalidasi
    const rawData = Object.fromEntries(formData.entries());

    // 2. Validasi dengan safeParse
    const validation = SignDocumentSchema.safeParse(rawData);

    // 3. Jika validasi gagal, kembalikan error Zod
    if (!validation.success) {
        return createZodErrorResponse(validation.error);
    }

    // 4. Jika sukses, lanjutkan dengan FormData *asli*
    try {
        const response = await fetch(`${BASE_URL}/api/sign/pdf`, {
            method: 'POST',
            headers: AUTH_HEADERS,
            body: formData, // Kirim FormData asli (bukan validation.data)
        });

        if (!response.ok) {
            return await handleErrorResponse(response);
        }

        const data = (await response.json()) as SignDocumentResponse;
        return { success: true, data };
    } catch (error) {
        return createErrorResponse(error);
    }
}

/**
 * Aksi untuk endpoint "DOWNLOAD SIGNED DOKUMEN"
 * (Tidak perlu Zod, karena hanya menerima string ID)
 */
export async function downloadSignedDocument(
    id_dokumen: string,
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
            },
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
    formData: FormData,
): Promise<ActionResponse<VerifyDocumentResponse>> {
    // 1. Validasi
    const validation = VerifyDocumentSchema.safeParse(
        Object.fromEntries(formData.entries()),
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