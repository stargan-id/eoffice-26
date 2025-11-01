'use client';
import dynamic from 'next/dynamic';
const PdfFullViewer = dynamic(() => import('./PdfFullViewer'), { ssr: false });
const FloatingPdfViewer = dynamic(() => import('./FloatingPdfViewer'), {
  ssr: false,
});

import { PdfFullViewerSkeleton } from './PdfFullViewerSkeleton';

import { signDocument } from '@/actions/tte';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmSignDocumentSchema } from '@/zod/schema/tte';
import { useEffect, useState } from 'react';
import { z } from 'zod';
//import { FloatingPdfViewer } from "./FloatingPdfViewer";
import { toast } from 'sonner';
import FloatingSignatureBox from './FloatingSignatureBox';
import { FormTte } from './FormTte';
// import { PdfFullViewerSkeleton } from "./PdfFullViewer";

interface ContainerReaderProps {
  signRequestId: string;
  showSigningTools: boolean;
}

export const ContainerReader = ({
  signRequestId,
  showSigningTools,
}: ContainerReaderProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(!showSigningTools);
  const [isSignRequested, setIsSignRequested] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [isFileSigned, setIsFileSigned] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const schema = ConfirmSignDocumentSchema;
  type FormValues = z.infer<typeof schema>;

  const [values, setValues] = useState<FormValues>({
    tampilan: 'visible',
    page: '1',
    passphrase: '',
    xAxis: '0',
    yAxis: '0',
  });

  const handleOnSign = async (
    position: { page: number; x: number; y: number } | null
  ) => {
    console.log('Signature position:', position);
    // Here you can call a server action to save the signature position

    // const formData = new FormData();
    // formData.append("signature", JSON.stringify(position));

    if (position) {
      const v: FormValues = {
        ...values,
        page: position.page.toString(),
        yAxis: position.y.toString(),
        xAxis: position.x.toString(),
      };
      setValues(v);
      setShowConfirmation(true);
      // const response = await signDocument(formData);
      // Handle response...
    }
  };

  const handleOnSubmit = async (data: FormValues) => {
    setIsProcessing(true);

    console.log('Form data submitted:', data);
    const v: FormValues = {
      ...values,
      passphrase: data.passphrase,
      tampilan: data.tampilan,
    };
    setValues(v);

    // Convert v to FormData
    const formData = new FormData();
    formData.append('passphrase', v.passphrase);
    formData.append('tampilan', v.tampilan);
    if (v.page) formData.append('page', v.page);
    if (v.xAxis) formData.append('xAxis', v.xAxis);
    if (v.yAxis) formData.append('yAxis', v.yAxis);

    // If you have file input, append file here
    // formData.append("file", fileInput.files[0]);

    try {
      const res = await signDocument(signRequestId, formData);
      if (!res.success) {
        toast.error('Gagal menandatangani dokumen: ' + res.error);
        setIsProcessing(false);
        return;
      }
      setIsFileSigned(true);
      setShowConfirmation(false);
    } catch (err) {
      toast.error('Terjadi kesalahan saat memproses dokumen.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(`/api/tte/document/${signRequestId}`);
      if (response.ok) {
        const blob = await response.blob();
        setPdfFile(blob);
      }
    };
    fetchPdf();
  }, [signRequestId, isFileSigned]);

  return (
    <>
      <div id="pdf-full-viewer" className="max-w-4xl mx-auto relative">
        {pdfFile ? <PdfFullViewer file={pdfFile} /> : <PdfFullViewerSkeleton />}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-600 bg-opacity-60 animate-pulse">
            <div className="text-white text-lg font-semibold mb-2">
              Dokumen sedang diproses...
            </div>
            <div className="text-white text-sm">
              Mohon tunggu, file sedang diproses di server.
            </div>
            <div className="mt-4">
              <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      {showSigningTools && pdfFile && !isFileSigned && (
        <FloatingSignatureBox
          pdfContainerId="pdf-full-viewer"
          onSign={handleOnSign}
        />
      )}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Konfirmasi Tanda Tangan</DialogTitle>
          </DialogHeader>
          <FormTte onSubmit={handleOnSubmit} disabled={isProcessing} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContainerReader;
