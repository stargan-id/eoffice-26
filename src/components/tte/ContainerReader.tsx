"use client";
import dynamic from "next/dynamic";
const PdfFullViewer = dynamic(() => import("./PdfFullViewer"), { ssr: false });

const ContainerReader = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <PdfFullViewer file={`/sample.pdf`} />
    </div>
  );
};

export default ContainerReader;
