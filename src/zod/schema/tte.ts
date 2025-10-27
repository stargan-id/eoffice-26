import { z } from 'zod';

// Batas ukuran file (contoh: 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ACCEPTED_PDF_TYPES = ['application/pdf'];

// Helper untuk validasi file
const fileSchema = (types: string[]) =>
    z
        .instanceof(File)
        .refine((file) => file.size > 0, 'File cannot be empty.')
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`,
        )
        .refine(
            (file) => types.includes(file.type),
            `Unsupported file type.`,
        );

// Skema untuk /api/user/registrasi
export const RegisterUserSchema = z.object({
    nama: z.string().min(1, 'Nama is required.'),
    email: z.email('Invalid email address.'),
    surat_rekomendasi: fileSchema(ACCEPTED_PDF_TYPES),

    // Opsional
    nik: z.string().optional(),
    nip: z.string().optional(),
    nomor_telepon: z.string().optional(),
    kota: z.string().optional(),
    provinsi: z.string().optional(),
    jabatan: z.string().optional(),
    unit_kerja: z.string().optional(),
    image_ttd: fileSchema(ACCEPTED_IMAGE_TYPES).optional(),
    ktp: fileSchema(ACCEPTED_IMAGE_TYPES).optional(),
});

// Skema untuk /api/user/keystore
export const UploadKeystoreSchema = z.object({
    nik: z.string().min(1, 'NIK is required.'),
    passphrase: z.string().min(1, 'Passphrase is required.'),
    keystore: fileSchema(['application/x-pkcs12']), // .p12 file
});

export const SignDocumentSchema = z
    .object({
        // Bidang yang selalu wajib
        file: fileSchema(ACCEPTED_PDF_TYPES),
        nik: z.string().min(1, 'NIK is required.'),
        passphrase: z.string().min(1, 'Passphrase is required.'),
        tampilan: z.enum(['visible', 'invisible']),

        // Bidang opsional / kondisional
        image: z.enum(['true', 'false']).optional(),
        imageTTD: fileSchema(ACCEPTED_IMAGE_TYPES).optional(),
        linkQR: z.url({ message: 'Invalid URL' }).optional().or(z.literal('')),
        halaman: z.string().optional(),
        page: z.string().optional(),
        xAxis: z.string().optional(),
        yAxis: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        tag_koordinat: z.string().optional(),
        reason: z.string().optional(),
        location: z.string().optional(),
        text: z.string().optional(),
    })
    .refine(
        (data) => {
            // Validasi logika 'visible'
            if (data.tampilan === 'visible') {
                // Jika visible, width dan height wajib
                if (!data.width || !data.height) return false;

                // Jika image 'false', linkQR wajib
                if (data.image === 'false' && !data.linkQR) return false;

                // Jika image 'true', imageTTD (file) wajib ada dan tidak kosong
                if (
                    data.image === 'true' &&
                    (!data.imageTTD || data.imageTTD.size === 0)
                )
                    return false;
            }
            return true; // Jika 'invisible', loloskan
        },
        {
            // Pesan error ini akan muncul jika refine gagal
            message:
                'Untuk tampilan "visible", bidang width, height, dan (linkQR atau imageTTD) wajib diisi.',
        },
    );

// BARU: Skema untuk /api/sign/verify
export const VerifyDocumentSchema = z.object({
    signed_file: fileSchema(ACCEPTED_PDF_TYPES),
});