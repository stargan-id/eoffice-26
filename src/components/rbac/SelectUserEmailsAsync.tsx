'use client';
import { getUserEmailsByIds, getUserEmailsByPrefix } from '@/actions/rbac/user';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { MultiValue } from 'react-select';
import AsyncSelect from 'react-select/async';

interface SelectUserEmailsAsyncProps {
  name: string;
  control: any;
  label?: string;
  rules?: any;
}

export const SelectUserEmailsAsync = ({
  name,
  control,
  label,
  rules,
}: SelectUserEmailsAsyncProps) => {
  // Loader returns a Promise as expected by react-select
  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return [];
    }
    // Add delay for debounce effect
    await new Promise((r) => setTimeout(r, 400));
    const response = await getUserEmailsByPrefix(inputValue);
    if (response.success && Array.isArray(response.data)) {
      return response.data.map((user) => ({
        label: user.email,
        value: user.id,
      }));
    }
    return [];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const [selectedOptions, setSelectedOptions] = useState<
            Array<{ label: string; value: string }>
          >([]);

          useEffect(() => {
            if (Array.isArray(field.value) && field.value.length > 0) {
              // Only fetch missing IDs
              const missingIds = field.value.filter(
                (id: string) => !selectedOptions.some((opt) => opt.value === id)
              );
              if (missingIds.length > 0) {
                getUserEmailsByIds(missingIds).then((users) => {
                  setSelectedOptions((prev) => [
                    ...prev.filter((opt) => field.value.includes(opt.value)),
                    ...users.map((user: { id: string; email: string }) => ({
                      label: user.email,
                      value: user.id,
                    })),
                  ]);
                });
              } else {
                // Remove options not in field.value
                setSelectedOptions((prev) =>
                  prev.filter((opt) => field.value.includes(opt.value))
                );
              }
            } else {
              setSelectedOptions([]);
            }
          }, [field.value]);

          // On change, update both form value and local state
          const handleChange = (
            options: MultiValue<{ label: string; value: string }>
          ) => {
            const ids = Array.isArray(options)
              ? options.map((opt) => opt.value)
              : [];
            setSelectedOptions(Array.isArray(options) ? options : []);
            field.onChange(ids);
          };

          return (
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions={false}
              isMulti
              onChange={handleChange}
              value={selectedOptions}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              placeholder="Cari email pengguna..."
              isClearable
            />
          );
        }}
      />
    </div>
  );
};

export default SelectUserEmailsAsync;
