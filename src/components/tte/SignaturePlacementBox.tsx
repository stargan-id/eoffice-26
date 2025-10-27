"use client";
import { useEffect, useRef, useState } from "react";

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SignaturePlacementBoxProps {
  image: string;
  position: { x: number; y: number; width: number; height: number };
  onChange: (position: Position) => void;
  pdfWidth?: number;
  pdfHeight?: number;
}

export function SignaturePlacementBox({
  image,
  position,
  onChange,
  pdfWidth,
  pdfHeight,
}: SignaturePlacementBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState(position);

  // Drag logic
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    // Get the container (parent) element
    if (!boxRef.current) return;
    const container = (boxRef.current as HTMLDivElement).parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      setStart({
        x: e.clientX - rect.left - pos.x,
        y: e.clientY - rect.top - pos.y,
      });
    } else {
      setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    if (!boxRef.current) return;
    const container = (boxRef.current as HTMLDivElement).parentElement;
    let newX, newY;
    if (container) {
      const rect = container.getBoundingClientRect();
      newX = e.clientX - rect.left - start.x + container.scrollLeft;
      newY = e.clientY - rect.top - start.y + container.scrollTop;
    } else {
      newX = e.clientX - start.x;
      newY = e.clientY - start.y;
    }
    // Constrain to PDF area if pdfWidth/pdfHeight provided
    if (pdfWidth !== undefined && pdfHeight !== undefined) {
      newX = Math.max(0, Math.min(newX, pdfWidth - pos.width));
      newY = Math.max(0, Math.min(newY, pdfHeight - pos.height));
    }
    setPos({ ...pos, x: newX, y: newY });
    if (onChange) onChange({ ...pos, x: newX, y: newY });
  };
  const onMouseUp = () => setDragging(false);

  // Attach listeners
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    setPos(position);
  }, [position]);

  return (
    <div
      ref={boxRef}
      className="absolute border-2 border-blue-500 bg-white/80 cursor-move z-10"
      style={{ left: pos.x, top: pos.y, width: pos.width, height: pos.height }}
      onMouseDown={onMouseDown}
    >
      <img
        src={image}
        alt="Signature"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default SignaturePlacementBox;
