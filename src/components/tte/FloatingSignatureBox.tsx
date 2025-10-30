'use client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Position {
  page: number;
  x: number;
  y: number;
}

interface FloatingSignatureBoxProps {
  pdfContainerId?: string; // id of the PDF container for position calculation
  onPositionChange?: (info: { page: number; x: number; y: number }) => void;
  onSign?: (position: Position | null) => void;
}

export const FloatingSignatureBox = ({
  pdfContainerId = 'pdf-full-viewer',
  onPositionChange,
  onSign,
}: FloatingSignatureBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [pageInfo, setPageInfo] = useState<{
    page: number;
    x: number;
    y: number;
  } | null>(null);
  const [outOfBounds, setOutOfBounds] = useState(false);

  const PDF_WIDTH_PT = 8.27 * 72; // 596 points (A4 width)
  const PDF_HEIGHT_PT = 11.69 * 72; // 841 points (A4 height)

  // PDF box size in points
  const BOX_WIDTH_PT = 100;
  const BOX_HEIGHT_PT = 100;

  // Calculate initial box size in CSS pixels based on PDF scale
  const pdfEl =
    typeof window !== 'undefined'
      ? document.getElementById(pdfContainerId)
      : null;
  let boxWidthPx = 100;
  let boxHeightPx = 100;
  if (pdfEl) {
    const pageEls = pdfEl.querySelectorAll('.react-pdf__Page');
    if (pageEls.length > 0) {
      const pageRect = (pageEls[0] as HTMLElement).getBoundingClientRect();
      const scaleX = pageRect.width / (8.27 * 72);
      const scaleY = pageRect.height / (11.69 * 72);
      boxWidthPx = BOX_WIDTH_PT * scaleX;
      boxHeightPx = BOX_HEIGHT_PT * scaleY;
    }
  }

  // Drag logic
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    setPos({ x: newX, y: newY });
  };
  const onMouseUp = () => {
    setDragging(false);
    // Calculate position relative to PDF
    const pdfEl = document.getElementById(pdfContainerId);
    if (pdfEl && boxRef.current) {
      const boxRect = boxRef.current.getBoundingClientRect();
      const pageEls = pdfEl.querySelectorAll('.react-pdf__Page');
      let foundPage = null;
      for (let i = 0; i < pageEls.length; i++) {
        const pageRect = (pageEls[i] as HTMLElement).getBoundingClientRect();
        if (
          boxRect.top >= pageRect.top &&
          boxRect.top < pageRect.bottom &&
          boxRect.left >= pageRect.left &&
          boxRect.left + boxRect.width <= pageRect.right &&
          boxRect.top + boxRect.height <= pageRect.bottom
        ) {
          foundPage = i + 1;
          // Calculate x/y relative to page
          const xPx = boxRect.left - pageRect.left;
          const yPx = pageRect.bottom - boxRect.bottom;
          // Scale to PDF points
          const scaleX = PDF_WIDTH_PT / pageRect.width;
          const scaleY = PDF_HEIGHT_PT / pageRect.height;
          const x = Math.round(xPx * scaleX);
          const y = Math.round(yPx * scaleY);
          setPageInfo({ page: foundPage, x, y });
          setOutOfBounds(false);
          if (onPositionChange)
            onPositionChange({
              page: foundPage,
              x,
              y,
            });
          return;
        }
      }
      // If not found, mark as out of bounds
      setPageInfo(null);
      setOutOfBounds(true);
      if (onPositionChange) onPositionChange({ page: 0, x: 0, y: 0 });
    }
  };

  const handleSign = () => {
    // alert(pageInfo);
    console.log('Sign action triggered!', pageInfo);
    toast.success(
      'Sign action triggered!',
      pageInfo ? {} : { description: 'But position is not set.' }
    );
    if (onSign && pageInfo) onSign(pageInfo);
  };

  // Attach listeners

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={boxRef}
      className={`fixed z-50 border-2 bg-white/80 cursor-move shadow-lg ${
        outOfBounds ? 'border-red-500' : 'border-blue-500'
      }`}
      style={{
        left: pos.x,
        top: `calc(${pos.y}px - ${boxHeightPx}px)`,
        width: boxWidthPx,
        height: boxHeightPx,
      }}
      onMouseDown={onMouseDown}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
        <span className="font-bold text-blue-700">Signature Box</span>
        {pageInfo && (
          <span className="text-xs text-gray-700">
            Page: {pageInfo.page}, x: {pageInfo.x}, y: {pageInfo.y}
          </span>
        )}
        {!outOfBounds && (
          <button
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            onClick={handleSign}
          >
            Sign
          </button>
        )}
      </div>
    </div>
  );
};

export default FloatingSignatureBox;
