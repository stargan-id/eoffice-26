'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { UploadSignRequestSchema } from '@/zod/schema/tte';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface FormUploadSignRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = z.infer<typeof UploadSignRequestSchema>;

export const FormUploadSignRequest = ({
  isOpen,
  onClose,
}: FormUploadSignRequestProps) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(UploadSignRequestSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', data.file[0]);

    try {
      const response = await axios.post('/api/tte/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total
          );
          setProgress(percentCompleted);
        },
      });

      toast.success('Document uploaded successfully!');
      router.push(`/tte/${response.data.signRequestId}`);
    } catch (error: unknown) {
      let errorMessage = 'Upload failed. Please try again.';
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error || error.message || errorMessage;
      }
      toast.error(errorMessage);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return; // Jangan tutup jika sedang upload
    reset();
    setProgress(0);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Upload Dokumen untuk Ditandatangani</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">Dokumen PDF</Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              {...register('file')}
              disabled={isUploading}
            />
            {errors.file && (
              <p className="text-sm text-red-500 mt-1">
                {errors.file.message as string}
              </p>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label>Uploading...</Label>
              <Progress value={progress} />
              <p className="text-xs text-center text-gray-500">{progress}%</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Close
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload & Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default FormUploadSignRequest;
