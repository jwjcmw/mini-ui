import { useState } from "react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  params: Record<string, unknown>;
  onResult: (result: { value: string } | { values: string[] }) => void;
}

export default function Select({ params, onResult }: SelectProps) {
  const title = params.title as string;
  const options = params.options as Option[];
  const multi = params.multi as boolean | undefined;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function submit() {
    onResult({ values: Array.from(selected) });
  }

  return (
    <div className="p-6 animate-in">
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              if (multi) {
                toggle(opt.value);
              } else {
                onResult({ value: opt.value });
              }
            }}
            className={`text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              selected.has(opt.value)
                ? "bg-blue-600/20 border border-blue-500"
                : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600"
            }`}
          >
            <div className="text-white text-sm font-medium">{opt.label}</div>
            {opt.description && (
              <div className="text-zinc-400 text-xs mt-1">
                {opt.description}
              </div>
            )}
          </button>
        ))}
      </div>
      {multi && (
        <div className="flex justify-end mt-4">
          <button
            onClick={submit}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
