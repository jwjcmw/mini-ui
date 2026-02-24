interface ConfirmProps {
  params: Record<string, unknown>;
  onResult: (result: { confirmed: boolean }) => void;
}

export default function Confirm({ params, onResult }: ConfirmProps) {
  const message = params.message as string;
  const detail = params.detail as string | undefined;
  const confirmLabel = (params.confirmLabel as string) || "Confirm";
  const cancelLabel = (params.cancelLabel as string) || "Cancel";

  return (
    <div className="p-6 animate-in">
      <h2 className="text-white text-lg font-semibold mb-2">{message}</h2>
      {detail && <p className="text-zinc-400 text-sm mb-6">{detail}</p>}
      <div className="flex gap-3 justify-end mt-4">
        <button
          onClick={() => onResult({ confirmed: false })}
          className="px-4 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => onResult({ confirmed: true })}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
