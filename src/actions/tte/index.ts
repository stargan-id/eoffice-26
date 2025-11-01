'use server';

import { auth } from '@/auth';
import { getBaseUploadPath, saveFile } from '@/lib/helpers';
import { updateSignatoryStatus } from '@/lib/services/tte/sign-request';
import { ActionResponse } from '@/types/action-response.types';
import { SignDocumentResponse } from '@/types/tte.interfaces';
import { SignDocumentSchema } from '@/zod/schema/tte';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  createErrorResponse,
  createZodErrorResponse,
  getApiAuthHeaders,
  getApiBaseUrl,
  getMockPassphrase,
  handleErrorResponse,
} from './helpers';
import { getSignRequestForUser } from './sign-request';

const BASE_URL = getApiBaseUrl();
const AUTH_HEADERS = getApiAuthHeaders();

function buildFormData(
  data: Record<string, string | Blob | undefined>
): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.set(key, value);
  });
  return formData;
}

export async function signDocument(
  signRequestId: string,
  inputFormData: FormData
): Promise<ActionResponse<SignDocumentResponse>> {
  console.log('Starting signDocument for signRequestId:', signRequestId);
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      console.error('User not authenticated');
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    if (!session.user.nik) {
      console.error('User NIK is missing');
      return {
        success: false,
        error: 'User NIK is missing',
      };
    }

    const result = await getSignRequestForUser(session.user.id, signRequestId);
    if (!result.success || !result.data) {
      console.error('Sign request not found or access denied');
      return {
        success: false,
        error: 'Sign request not found or access denied',
      };
    }

    const signRequestForUser = result.data;
    console.log('Fetched sign request for user:', signRequestForUser);

    const baseUploadPath = getBaseUploadPath();
    const finalFileUrl = path.join(baseUploadPath, signRequestForUser.fileUrl);

    console.log('Resolved file path:', finalFileUrl);

    const filePath = path.resolve(finalFileUrl);

    // Convert FormData to object for validation
    const rawData = Object.fromEntries(inputFormData.entries());

    const pdfBuffer = fs.readFileSync(filePath);
    rawData.file = new File([pdfBuffer], 'unsigned.pdf', {
      type: 'application/pdf',
    });
    rawData.nik = session.user.nik;
    rawData.width = (parseInt(rawData.xAxis as string) + 100).toString();
    rawData.height = (parseInt(rawData.yAxis as string) + 100).toString();
    rawData.image = 'false';
    rawData.linkQR = 'https://v.stargan.id/tte/123456';
    rawData.passphrase = getMockPassphrase();
    rawData.page = '1';

    // Validate input
    const validation = SignDocumentSchema.safeParse(rawData);
    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return createZodErrorResponse(validation.error);
    }

    // Build new FormData from validated data
    const formData = buildFormData(validation.data);

    // Send request
    console.log('Sending sign document request to API:', BASE_URL);
    const response = await fetch(`${BASE_URL}/api/sign/pdf`, {
      method: 'POST',
      headers: { ...AUTH_HEADERS },
      body: formData,
    });

    if (!response.ok) {
      const rawBody = await response.text();
      console.error('Sign document failed with status:', response.status);
      console.error('Raw response body:', rawBody);
      return await handleErrorResponse(response);
    }

    const pdfBlob = await response.blob();
    const idDokumen = response.headers.get('id_dokumen') || 'N/A';

    const arrayBuffer = await pdfBlob.arrayBuffer();

    const now = new Date();
    const year = now.getFullYear();

    // Example: '2025110114' for Nov 1, 2025, 14:00
    const timebasedPath = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}`;
    const dailyPath = path.join(
      'signed-documents',
      year.toString(),
      timebasedPath
    );
    const documentId = uuidv4() + '.pdf';
    const signedFileUrl = path.join(dailyPath, documentId); // Best for storage/db
    // cross safe path for signedFileUrl

    const resultPath = saveFile(
      dailyPath,
      documentId,
      Buffer.from(arrayBuffer)
    );

    // update signedFileUrl in database
    // TODO: also update status to COMPLETED if all signatories have signed

    const signed = await updateSignatoryStatus(
      signRequestForUser.signatory.id,
      'SIGNED',
      signedFileUrl
    );

    console.log(
      'Signed count:',
      signed.signedCount,
      'Total count:',
      signed.totalCount
    );

    console.log('Signed document saved to:', resultPath);

    return {
      success: true,
      data: { file: pdfBlob, id_dokumen: idDokumen },
    };
  } catch (error) {
    console.error(error);
    return createErrorResponse(error);
  }
}
