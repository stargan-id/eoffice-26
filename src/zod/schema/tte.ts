import { z } from 'zod';

// Batas ukuran file (contoh: 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ACCEPTED_PDF_TYPES = ['application/pdf'];

// Helper untuk validasi file (browser File, Node Buffer, Blob)
const fileSchema = (types: string[]) =>
  z.custom<any>(
    (file) => {
      if (!file) return false;
      // Browser File/Blob
      if (typeof File !== 'undefined' && file instanceof File) {
        if (file.size <= 0) return false;
        if (file.size > MAX_FILE_SIZE) return false;
        if (!types.includes(file.type)) return false;
        return true;
      }
      // Node.js Buffer
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file)) {
        if (file.length <= 0) return false;
        if (file.length > MAX_FILE_SIZE) return false;
        // No type for Buffer, skip type check
        return true;
      }
      // Blob (browser/Node)
      if (typeof Blob !== 'undefined' && file instanceof Blob) {
        if (file.size <= 0) return false;
        if (file.size > MAX_FILE_SIZE) return false;
        if (!types.includes(file.type)) return false;
        return true;
      }
      return false;
    },
    {
      message: 'Invalid or unsupported file type.',
    }
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

export const ConfirmSignDocumentSchema = z.object({
  passphrase: z.string().min(1, 'Passphrase is required.'),
  tampilan: z.enum(['visible', 'invisible']),
  page: z.string().optional(),
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
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
    // halaman: z.string().optional(),
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
    }
  );

// BARU: Skema untuk /api/sign/verify
export const VerifyDocumentSchema = z.object({
  signed_file: fileSchema(ACCEPTED_PDF_TYPES),
});

export const UploadSelfSignRequestSchema = z.object({
  subject: z.string().optional(),
  file: z
    .any()
    .refine((files) => files?.length == 1, 'File is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type),
      'Only .pdf files are accepted.'
    ),
});

export const UploadSignRequestSchema = z.object({
  subject: z.string().optional(),
  signatories: z
    .array(z.string().min(1, 'User ID is required.'))
    .min(1, 'At least one signatory is required.'),
  file: z
    .any()
    .refine((files) => files?.length == 1, 'File is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type),
      'Only .pdf files are accepted.'
    ),
});
