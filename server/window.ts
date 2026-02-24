import { spawn, ChildProcess } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let electronProc: ChildProcess | null = null;

interface WindowOptions {
  title?: string;
  position?: "center" | "top-right" | "cursor";
}

export async function ensureWindow(opts: WindowOptions = {}): Promise<void> {
  if (electronProc && !electronProc.killed) return;

  const electronEntry = path.resolve(__dirname, "electron-main.ts");
  const env = {
    ...process.env,
    MINI_UI_TITLE: opts.title ?? "mini-ui",
    MINI_UI_POSITION: opts.position ?? "center",
    MINI_UI_URL:
      process.env.NODE_ENV === "production"
        ? `file://${path.resolve(__dirname, "../dist-ui/index.html")}`
        : "http://localhost:5173",
  };

  electronProc = spawn(
    path.resolve(__dirname, "../node_modules/.bin/electron"),
    [electronEntry],
    { env, stdio: "ignore" }
  );

  electronProc.on("exit", () => {
    electronProc = null;
  });

  // Give Electron a moment to start and connect
  await new Promise((r) => setTimeout(r, 1500));
}

export function closeWindow(): void {
  if (electronProc && !electronProc.killed) {
    electronProc.kill();
    electronProc = null;
  }
}
