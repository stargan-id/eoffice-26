"use client";

import {
  Position,
  SignaturePlacementBox,
} from "@/components/tte/SignaturePlacementBox";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface PdfViewerProps {
  file: string;
  image: string;
  position: Position;
  onPositionChange: (position: Position) => void;
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
  pageCount: number;
}

function isSignatureOutside(
  pos: Position,
  pdfWidth: number,
  pdfHeight: number
) {
  return (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x + pos.width > pdfWidth ||
    pos.y + pos.height > pdfHeight
  );
}

export const PdfViewer = ({
  file,
  image,
  position,
  onPositionChange,
  pageNumber,
  onPageChange,
  pageCount,
}: PdfViewerProps) => {
  const PDF_WIDTH = 800;
  const [pdfSize, setPdfSize] = useState({ width: PDF_WIDTH, height: 1000 });
  const pageRef = useRef<HTMLDivElement>(null);
  const [hasWarned, setHasWarned] = useState(false);

  // Measure the actual PDF page size after render
  useEffect(() => {
    if (pageRef.current) {
      const pageEl = pageRef.current.querySelector(".react-pdf__Page");
      if (pageEl) {
        const el = pageEl as HTMLElement;
        setPdfSize({ width: el.offsetWidth, height: el.scrollHeight });
      }
    }
  }, [pageNumber, file]);

  const outOfBounds = isSignatureOutside(
    position,
    pdfSize.width,
    pdfSize.height
  );

  useEffect(() => {
    if (outOfBounds && !hasWarned) {
      toast.error("Posisi tanda tangan keluar dari area dokumen!");
      setHasWarned(true);
    }
    if (!outOfBounds && hasWarned) {
      setHasWarned(false);
    }
  }, [outOfBounds, hasWarned]);

  return (
    <div>
      {/* <div className="mb-2 text-xs text-gray-600">
        <span>
          PDF Size: {pdfSize.width.toFixed(0)} x {pdfSize.height.toFixed(0)} px
        </span>{" "}
        | <span>Page: {pageNumber}</span>
      </div> */}
      <div
        className={cn(
          "border-2 border-gray-400 overflow-auto",
          outOfBounds && "border-red-500"
        )}
        style={{ width: PDF_WIDTH, height: 1000 }} // fixed scrollable area
      >
        <Document file={file}>
          <div
            ref={pageRef}
            style={{
              position: "relative",
              width: pdfSize.width,
              height: pdfSize.height,
            }}
          >
            <Page pageNumber={pageNumber} width={PDF_WIDTH} />
            <SignaturePlacementBox
              image={image}
              position={position}
              onChange={onPositionChange}
              pdfWidth={pdfSize.width}
              pdfHeight={pdfSize.height}
            />
          </div>
        </Document>
      </div>
    </div>
  );
};
