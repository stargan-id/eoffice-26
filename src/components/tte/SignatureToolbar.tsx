interface SignatureToolbarProps {
  pageCount: number;
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
  onSend: () => void;
}

export function SignatureToolbar({
  pageCount,
  pageNumber,
  onPageChange,
  onSend,
}: SignatureToolbarProps) {
  const handlePrev = () => {
    if (pageNumber > 1) onPageChange(pageNumber - 1);
  };
  const handleNext = () => {
    if (pageNumber < pageCount) onPageChange(pageNumber + 1);
  };
  return (
    <div className="flex gap-2 items-center py-2">
      <button
        onClick={handlePrev}
        disabled={pageNumber === 1}
        className="px-2 py-1 border rounded bg-gray-100 disabled:opacity-50"
      >
        Prev
      </button>
      <select
        value={pageNumber}
        onChange={(e) => onPageChange(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {Array.from({ length: pageCount }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Halaman {i + 1}
          </option>
        ))}
      </select>
      <button
        onClick={handleNext}
        disabled={pageNumber === pageCount}
        className="px-2 py-1 border rounded bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={onSend}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Kirim Posisi
      </button>
    </div>
  );
}
