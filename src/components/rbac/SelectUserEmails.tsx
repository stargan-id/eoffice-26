'use client';
import { getUserEmailsByPrefix } from '@/actions/rbac/user';
import { useState } from 'react';

interface SelectUserEmailsProps {
  onSelect: (email: string) => void;
  label?: string;
}

export const SelectUserEmails = ({
  onSelect,
  label,
}: SelectUserEmailsProps) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length >= 2) {
      setLoading(true);
      const emails = await getUserEmailsByPrefix(value);
      setOptions(emails);
      setLoading(false);
    } else {
      setOptions([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Cari email pengguna..."
      />
      {loading && <div className="mt-2 text-sm text-gray-500">Memuat...</div>}
      {options.length > 0 && (
        <ul className="mt-2 border rounded-lg bg-white shadow">
          {options.map((email) => (
            <li
              key={email}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => {
                onSelect(email);
                setInput(email);
                setOptions([]);
              }}
            >
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectUserEmails;
