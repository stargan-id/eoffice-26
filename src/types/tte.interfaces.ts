// =================================================================
// Tipe Data Respons API (Disimpulkan dari Postman)
// Anda mungkin perlu menyesuaikannya berdasarkan respons API sebenarnya.
// =================================================================

/**
 * Respons dari /api/sign/pdf
 * Diasumsikan mengembalikan ID dokumen untuk diunduh nanti.
 */
export interface SignDocumentResponse {
    id_dokumen: string;
    status: string;
    message?: string;
}

/**
 * Respons dari /api/sign/verify
 * Diasumsikan mengembalikan status validasi.
 */
export interface VerifyDocumentResponse {
    isValid: boolean;
    signerInfo?: Record<string, unknown>; // Pengganti aman untuk 'any'
    message?: string;
}

/**
 * Respons dari /api/user/status/{nik}
 */
export interface UserStatusResponse {
    nik: string;
    status: 'registered' | 'unregistered' | 'pending' | 'unknown';
    message?: string;
}

/**
 * Respons dari /api/user/registrasi
 */
export interface RegisterUserResponse {
    id: string;
    email: string;
    status: 'pending_approval' | 'registered';
    message?: string;
}

/**
 * Respons dari /api/user/keystore
 */
export interface UploadKeystoreResponse {
    nik: string;
    status: 'success' | 'failed';
    message?: string;
}