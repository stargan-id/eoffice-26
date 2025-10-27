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
  return (
    <div className="flex gap-2 items-center py-2">
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
        onClick={onSend}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Kirim Posisi
      </button>
    </div>
  );
}
