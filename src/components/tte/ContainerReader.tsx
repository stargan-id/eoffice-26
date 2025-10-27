"use client";
import dynamic from "next/dynamic";
const PdfFullViewer = dynamic(() => import("./PdfFullViewer"), { ssr: false });

import FloatingSignatureBox from "./FloatingSignatureBox";

const ContainerReader = () => {
  return (
    <>
      <div id="pdf-full-viewer" className="max-w-4xl mx-auto">
        <PdfFullViewer file={`/sample.pdf`} />
      </div>
      <FloatingSignatureBox pdfContainerId="pdf-full-viewer" />
    </>
  );
};

export default ContainerReader;
