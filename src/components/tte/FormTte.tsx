"use client";
import { ConfirmSignDocumentSchema } from "@/zod/schema/tte";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = ConfirmSignDocumentSchema;
type FormValues = z.infer<typeof schema>;

interface FormTteProps {
  onSubmit: (data: FormValues) => void;
}

export const FormTte = ({ onSubmit }: FormTteProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      tampilan: "visible",
    },
  });

  //   const onSubmit = (data: FormValues) => {
  //     // TODO: handle API call
  //     alert(JSON.stringify(data, null, 2));
  //   };

  return (
    <form
      className="bg-white rounded-xl w-full p-2 space-y-8 max-w-lg mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passphrase <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("passphrase")}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.passphrase && (
            <p className="text-red-500 text-xs mt-1">
              {errors.passphrase.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tampilan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-8 mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                value="visible"
                {...register("tampilan")}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Visible</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                value="invisible"
                {...register("tampilan")}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Invisible</span>
            </label>
          </div>
          {errors.tampilan && (
            <p className="text-red-500 text-xs mt-1">
              {errors.tampilan.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-8 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 transition"
      >
        Submit
      </button>
    </form>
  );
};
