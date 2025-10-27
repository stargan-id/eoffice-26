"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
// import { PdfViewer } from "./PdfViewer";
import { Position } from "./SignaturePlacementBox";
import { SignatureToolbar } from "./SignatureToolbar";

const PdfViewer = dynamic(
  () => import("@/components/tte/PdfViewer").then((mod) => mod.PdfViewer),
  { ssr: false }
);

export const ContainerTte = () => {
  //   const position: Position = { x: 100, y: 150, width: 200, height: 50 };

  const [position, setPosition] = useState<Position>({
    x: 100,
    y: 150,
    width: 200,
    height: 50,
  });
  const image = "/signature.png";
  //   const pageNumber = 1;
  const [pageNumber, setPageNumber] = useState(1);
  const pageCount = 3;

  const handleSend = () => {
    // Kirim posisi ke API TTE
    console.log("Posisi dikirim:", position);
  };

  const handleSetPageNumber = (pageNumber: number) => {
    // set page number
    setPageNumber(pageNumber);
  };

  const handleSetPosition = (position: Position) => {
    // set position
    setPosition(position);
    console.log("Posisi diperbarui:", position);
  };

  return (
    <>
      {/* <span>position : {JSON.stringify(position)}</span> */}
      <SignatureToolbar
        pageCount={pageCount}
        pageNumber={pageNumber}
        onPageChange={setPageNumber}
        onSend={handleSend}
      />
      <div className="border rounded shadow bg-white">
        <PdfViewer
          file="/sample.pdf"
          image="/signature.png"
          position={position}
          onPositionChange={handleSetPosition}
          pageNumber={pageNumber}
          onPageChange={handleSetPageNumber}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};
