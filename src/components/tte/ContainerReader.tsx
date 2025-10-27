"use client";
import dynamic from "next/dynamic";
const PdfFullViewer = dynamic(() => import("./PdfFullViewer"), { ssr: false });

import { signDocument } from "@/actions/tte";
import FloatingSignatureBox from "./FloatingSignatureBox";

export const ContainerReader = () => {

  const handleOnSign = async (position: { page: number; x: number; y: number } | null) => {
    console.log("Signature position:", position);
    // Here you can call a server action to save the signature position

    const formData = new FormData();
    formData.append("signature", JSON.stringify(position));

    if (position) {
      const response = await signDocument(formData);
      // Handle response...
    }
  }

  return (
    <>
      <div id="pdf-full-viewer" className="max-w-4xl mx-auto">
        <PdfFullViewer file={`/sample.pdf`} />
      </div>
      <FloatingSignatureBox pdfContainerId="pdf-full-viewer" onSign={handleOnSign} />
    </>
  );
};

export default ContainerReader;
