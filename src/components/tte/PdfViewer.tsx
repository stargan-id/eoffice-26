"use client";

import {
  Position,
  SignaturePlacementBox,
} from "@/components/tte/SignaturePlacementBox";
import { cn } from "@/lib/utils";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PageCallback } from "react-pdf/dist/shared/types.js";
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
  const CONTAINER_HEIGHT = 600; // desired viewer height (no vertical scroll)
  const [pdfSize, setPdfSize] = useState({
    width: PDF_WIDTH,
    height: CONTAINER_HEIGHT,
  });
  const [scale, setScale] = useState(1);
  const pageRef = useRef<HTMLDivElement>(null);
  const [hasWarned, setHasWarned] = useState(false);

  // When a page is loaded, compute a scale so the page fits the container height
  const onPageLoadSuccess = (pdfPage: PageCallback) => {
    try {
      const viewport = pdfPage.getViewport({ scale: 1 });
      const s = CONTAINER_HEIGHT / viewport.height;
      const scaledW = viewport.width * s;
      const scaledH = viewport.height * s;
      setScale(s);
      setPdfSize({ width: scaledW, height: scaledH });
    } catch (err) {
      // fallback: leave defaults
      console.error("Failed to compute PDF viewport:", err);
    }
  };

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
          "border-2 border-gray-400 overflow-hidden",
          outOfBounds && "border-red-500"
        )}
        style={{ width: pdfSize.width, height: CONTAINER_HEIGHT }} // fit to height, hide overflow
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
            <Page
              pageNumber={pageNumber}
              onLoadSuccess={onPageLoadSuccess}
              scale={scale}
            />
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
