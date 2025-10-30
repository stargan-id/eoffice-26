export const PdfFullViewerSkeleton = () => {
  return (
    <div className="border rounded-lg bg-white p-4 flex flex-col gap-4 items-center h-full min-h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <div className="text-sm text-gray-500">
          Memuat dan memproses file PDF...
        </div>
      </div>
    </div>
  );
};

export default PdfFullViewerSkeleton;
