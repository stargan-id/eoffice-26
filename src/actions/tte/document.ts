'use server';
import { getBaseUploadPath } from '@/lib/helpers';
import { getSignRequestById } from '@/lib/services/tte/sign-request';
import { ActionResponse } from '@/types/action-response.types';
import fs from 'fs/promises';
import path from 'path';

export const getPdfDocument = async (
  signRequestId: string
): Promise<ActionResponse<Buffer>> => {
  if (!signRequestId || typeof signRequestId !== 'string') {
    return { success: false, error: 'Invalid signRequestId' };
  }

  try {
    const result = await getSignRequestById(signRequestId);
    if (!result || !result.fileUrl) {
      return { success: false, error: 'Sign request not found' };
    }

    console.log('Fetched sign request:', result);

    const baseUploadPath = getBaseUploadPath();
    const finalFileUrl = path.join(
      baseUploadPath,
      result.signedFileUrl || result.fileUrl
    );

    console.log('Resolved file path:', finalFileUrl);

    const filePath = path.resolve(finalFileUrl);
    try {
      const pdfBuffer = await fs.readFile(filePath);
      return { success: true, data: pdfBuffer };
    } catch (err) {
      console.error('PDF file not found:', err);
      return { success: false, error: 'PDF document not found' };
    }
  } catch (e) {
    console.error('Error fetching PDF document:', e);
    return { success: false, error: 'Failed to fetch PDF document' };
  }
};
