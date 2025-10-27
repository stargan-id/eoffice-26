"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface PdfFullViewerProps {
  file: string;
  pageCount?: number;
  width?: number;
}

export const PdfFullViewer = ({
  file,
  pageCount,
  width = 800,
}: PdfFullViewerProps) => {
  const [numPages, setNumPages] = useState(pageCount || 1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="border rounded-lg bg-white p-4 flex flex-col gap-4 items-center">
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i + 1} className="mb-4">
            <Page pageNumber={i + 1} width={width} />
            <div className="text-xs text-gray-500 text-center mt-1">
              Halaman {i + 1}
            </div>
            <div>
              <hr className="border-dashed border-t border-gray-300 my-2" />
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PdfFullViewer;
