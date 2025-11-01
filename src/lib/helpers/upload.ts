import { saveFile } from '.';

// returns full path where file is saved
export async function saveFileFromFormData(
  userId: string,
  file: File,
  subPath: string,
  toFileName?: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return await saveFile(subPath, toFileName || file.name, buffer);
}
