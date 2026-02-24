import { useState } from "react";

interface Field {
  name: string;
  type: "text" | "select" | "boolean" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  default?: unknown;
  options?: string[];
}

interface FormProps {
  params: Record<string, unknown>;
  onResult: (result: Record<string, unknown>) => void;
}

export default function Form({ params, onResult }: FormProps) {
  const title = params.title as string | undefined;
  const fields = params.fields as Field[];
  const submitLabel = (params.submitLabel as string) || "Submit";

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.default !== undefined) init[f.name] = f.default;
      else if (f.type === "boolean") init[f.name] = false;
      else if (f.type === "select" && f.options?.length) init[f.name] = f.options[0];
      else init[f.name] = "";
    }
    return init;
  });

  function set(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onResult(values);
  }

  return (
    <form onSubmit={submit} className="p-6 animate-in">
      {title && (
        <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      )}
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-zinc-300 text-sm mb-1.5">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={(values[field.name] as string) || ""}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => set(field.name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={(values[field.name] as string) || ""}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => set(field.name, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            )}

            {field.type === "select" && (
              <select
                value={(values[field.name] as string) || ""}
                onChange={(e) => set(field.name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "boolean" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!values[field.name]}
                  onChange={(e) => set(field.name, e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-zinc-400 text-sm">
                  {field.placeholder || "Enabled"}
                </span>
              </label>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
