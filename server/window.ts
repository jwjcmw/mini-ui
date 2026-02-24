import { spawn, ChildProcess } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { isUiConnected, waitForConnection } from "./wsServer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let electronProc: ChildProcess | null = null;

interface WindowOptions {
  title?: string;
  position?: "center" | "top-right" | "cursor";
}

export async function ensureWindow(opts: WindowOptions = {}): Promise<void> {
  if (electronProc && !electronProc.killed) return;

  const electronEntry = path.resolve(__dirname, "../electron-main.cjs");
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

  // Wait until the UI actually connects over WebSocket (up to 8s)
  await waitForConnection(8000);
}

export function closeWindow(): void {
  if (electronProc && !electronProc.killed) {
    electronProc.kill();
    electronProc = null;
  }
}
