"use client";
import dynamic from "next/dynamic";
const PdfFullViewer = dynamic(() => import("./PdfFullViewer"), { ssr: false });
const FloatingPdfViewer = dynamic(() => import("./FloatingPdfViewer"), {
  ssr: false,
});

import { signDocument } from "@/actions/tte";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmSignDocumentSchema } from "@/zod/schema/tte";
import { useState } from "react";
import { z } from "zod";
//import { FloatingPdfViewer } from "./FloatingPdfViewer";
import FloatingSignatureBox from "./FloatingSignatureBox";
import { FormTte } from "./FormTte";

interface ContainerReaderProps {
  showSigningTools: boolean;
}

export const ContainerReader = ({ showSigningTools }: ContainerReaderProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const schema = ConfirmSignDocumentSchema;
  type FormValues = z.infer<typeof schema>;

  const [values, setValues] = useState<FormValues>({
    tampilan: "visible",
    halaman: "1",
    passphrase: "",
    xAxis: "0",
    yAxis: "0",
  });

  const handleOnSign = async (
    position: { page: number; x: number; y: number } | null
  ) => {
    console.log("Signature position:", position);
    // Here you can call a server action to save the signature position

    // const formData = new FormData();
    // formData.append("signature", JSON.stringify(position));

    if (position) {
      const v: FormValues = {
        ...values,
        halaman: position.page.toString(),
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
    console.log("Form data submitted:", data);
    const v: FormValues = {
      ...values,
      passphrase: data.passphrase,
      tampilan: data.tampilan,
    };
    setValues(v);

    // Convert v to FormData
    const formData = new FormData();
    formData.append("passphrase", v.passphrase);
    formData.append("tampilan", v.tampilan);
    if (v.halaman) formData.append("halaman", v.halaman);
    if (v.xAxis) formData.append("xAxis", v.xAxis);
    if (v.yAxis) formData.append("yAxis", v.yAxis);

    // If you have file input, append file here
    // formData.append("file", fileInput.files[0]);

    const res = await signDocument(formData);
    // console.log("Sign document response:", res);

    // nantinya simpan di lokal

    if (res.success) {
      // // send data to API and close dialog
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <div id="pdf-full-viewer" className="max-w-4xl mx-auto">
        <PdfFullViewer file={`/sample.pdf`} />
      </div>
      {showSigningTools && (
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
          <FormTte onSubmit={handleOnSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContainerReader;
