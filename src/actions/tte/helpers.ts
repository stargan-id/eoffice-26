
import { ActionResponse, ErrorResponse } from '@/types/action-response.types';
import { Buffer } from 'buffer';
import z from 'zod';
/**
 * Mendapatkan URL dasar API dari variabel lingkungan.
 */
export function getApiBaseUrl(): string {
    const baseURL = process.env.ESIGN_API_URL;
    if (!baseURL) {
        throw new Error('Missing ESIGN_API_URL in environment variables.');
    }
    return baseURL;
}

/**
 * Membuat header otentikasi Basic Auth.
 */
export function getApiAuthHeaders(): { Authorization: string } {
    const username = process.env.ESIGN_API_USERNAME;
    const password = process.env.ESIGN_API_PASSWORD;

    if (!username || !password) {
        throw new Error('Missing eSign API credentials in environment variables.');
    }

    const authHeader =
        'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    return { Authorization: authHeader };
}

/**
 * Membuat objek ErrorResponse standar dari kesalahan yang ditangkap.
 */
export function createErrorResponse(error: unknown): ErrorResponse {
    const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
    return {
        success: false,
        error: errorMessage,
    };
}

/**
 * Menangani respons fetch yang tidak-OK dan mengurai JSON error.
 */
export async function handleErrorResponse(
    response: Response,
): Promise<ErrorResponse> {
    try {
        const errorData = (await response.json()) as { message?: string; error?: string };
        const message = errorData.message || errorData.error || response.statusText;
        return {
            success: false,
            error: `API Error: ${message} (Status: ${response.status})`,
        };
    } catch (e) {
        return {
            success: false,
            error: `API Error: ${response.statusText} (Status: ${response.status})`,
        };
    }
}


/**
 * Helper untuk memformat error Zod ke ErrorResponse
 */
export function createZodErrorResponse(
    error: z.ZodError,
): ActionResponse<never> {
    // Ambil error pertama untuk pesan yang simpel
    const firstIssue = error.issues[0];
    const errorMessage = `${firstIssue.path.join('.')}: ${firstIssue.message}`;
    return {
        success: false,
        error: errorMessage,
    };
}