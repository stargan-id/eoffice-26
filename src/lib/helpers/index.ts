export * from './upload';

export function getBaseUploadPath(): string {
  const basePath = process.env.UPLOAD_BASE_PATH || '/var/www/uploads';
  return basePath;
}

// save uploaded files to: `${getBaseUploadPath()}` + `some/sub/path` + `filename.ext` from calling code
export async function ensureUploadPathExists(subPath: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const fullPath = path.join(getBaseUploadPath(), subPath);
  try {
    await fs.mkdir(fullPath, { recursive: true });
  } catch (e) {
    console.error('Error creating upload directory:', e);
    throw e;
  }
}

export async function saveFile(
  subPath: string,
  fileName: string,
  fileBuffer: Buffer
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const dirPath = path.join(getBaseUploadPath(), subPath);
  await ensureUploadPathExists(subPath);

  const filePath = path.join(dirPath, fileName);
  await fs.writeFile(filePath, fileBuffer);
  return filePath;
}
