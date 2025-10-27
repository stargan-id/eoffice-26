// lib/actions/user.actions.ts
'use server';

import { ActionResponse } from '@/types/action-response.types';
import {
    RegisterUserResponse,
    UploadKeystoreResponse,
    UserStatusResponse,
} from '@/types/tte.interfaces';
import { RegisterUserSchema, UploadKeystoreSchema } from '@/zod/schema/tte';
import {
    createErrorResponse, createZodErrorResponse, getApiAuthHeaders,
    getApiBaseUrl,
    handleErrorResponse
} from './helpers';

const BASE_URL = getApiBaseUrl();
const AUTH_HEADERS = getApiAuthHeaders();

/**
 * Aksi untuk endpoint "CEK_STATUS_USER"
 */
export async function checkUserStatus(
    nik: string,
): Promise<ActionResponse<UserStatusResponse>> {

    // Anda tetap bisa memvalidasi NIK jika mau
    if (!nik || typeof nik !== 'string' || nik.length < 16) {
        return { success: false, error: "Invalid NIK format." };
    }

    try {
        const response = await fetch(`${BASE_URL}/api/user/status/${nik}`, {
            method: 'GET',
            headers: AUTH_HEADERS,
        });

        if (!response.ok) {
            return await handleErrorResponse(response);
        }

        const data = (await response.json()) as UserStatusResponse;
        return { success: true, data };
    } catch (error) {
        return createErrorResponse(error);
    }
}

/**
 * Aksi untuk endpoint "REGISTRASI"
 * Menerima FormData langsung dari formulir registrasi.
 */
export async function registerUser(
    formData: FormData,
): Promise<ActionResponse<RegisterUserResponse>> {

    // 1. Ubah FormData menjadi objek biasa
    const rawData = Object.fromEntries(formData.entries());

    // 2. Validasi dengan safeParse
    const validation = RegisterUserSchema.safeParse(rawData);

    // 3. Jika gagal, kembalikan error
    if (!validation.success) {
        return createZodErrorResponse(validation.error);
    }

    // 4. Jika berhasil, lanjutkan dengan FormData asli
    try {
        const response = await fetch(`${BASE_URL}/api/user/registrasi`, {
            method: 'POST',
            headers: AUTH_HEADERS,
            body: formData,
        });

        if (!response.ok) {
            return await handleErrorResponse(response);
        }

        const data = (await response.json()) as RegisterUserResponse;
        return { success: true, data };
    } catch (error) {
        return createErrorResponse(error);
    }
}

/**
 * Aksi untuk endpoint "UPLOAD P12"
 * Menerima FormData yang berisi 'nik', 'passphrase', dan 'keystore'.
 */
export async function uploadKeystore(
    formData: FormData,
): Promise<ActionResponse<UploadKeystoreResponse>> {
    // 1. Validasi
    const validation = UploadKeystoreSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    // 2. Jika gagal, kembalikan error
    if (!validation.success) {
        return createZodErrorResponse(validation.error);
    }

    // 3. Jika berhasil, lanjutkan
    try {
        const response = await fetch(`${BASE_URL}/api/user/keystore`, {
            method: 'POST',
            headers: AUTH_HEADERS,
            body: formData,
        });

        if (!response.ok) {
            return await handleErrorResponse(response);
        }

        const data = (await response.json()) as UploadKeystoreResponse;
        return { success: true, data };
    } catch (error) {
        return createErrorResponse(error);
    }
}