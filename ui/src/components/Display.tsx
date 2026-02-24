import ReactMarkdown from "react-markdown";

interface ProgressItem {
  label: string;
  done: boolean;
  active?: boolean;
}

interface DisplayProps {
  params: Record<string, unknown>;
}

export default function Display({ params }: DisplayProps) {
  const type = params.type as "markdown" | "progress" | "diff";
  const content = params.content;

  if (type === "markdown" && typeof content === "string") {
    return (
      <div className="p-6 animate-in prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  if (type === "progress" && Array.isArray(content)) {
    const items = content as ProgressItem[];
    return (
      <div className="p-6 animate-in">
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  item.done
                    ? "bg-green-500/20 text-green-400"
                    : item.active
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {item.done ? "✓" : item.active ? "●" : "○"}
              </div>
              <span
                className={`text-sm ${
                  item.done
                    ? "text-zinc-400 line-through"
                    : item.active
                      ? "text-white"
                      : "text-zinc-500"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "diff" && typeof content === "string") {
    return (
      <div className="p-6 animate-in">
        <pre className="text-xs leading-relaxed overflow-x-auto">
          {content.split("\n").map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith("+")
                  ? "text-green-400 bg-green-500/10"
                  : line.startsWith("-")
                    ? "text-red-400 bg-red-500/10"
                    : line.startsWith("@@")
                      ? "text-blue-400"
                      : "text-zinc-400"
              }
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    );
  }

  return null;
}
