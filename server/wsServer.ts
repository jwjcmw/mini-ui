import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";

const PORT = 9999;

let wss: WebSocketServer | null = null;
let activeSocket: WebSocket | null = null;
const pending = new Map<string, { resolve: (result: unknown) => void; reject: (err: Error) => void }>();

function rejectAllPending(reason: string) {
  for (const { reject } of pending.values()) {
    reject(new Error(reason));
  }
  pending.clear();
}

export function startWsServer(): void {
  if (wss) return;

  wss = new WebSocketServer({ port: PORT });

  wss.on("connection", (socket) => {
    activeSocket = socket;

    socket.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const entry = pending.get(msg.id);
        if (entry) {
          pending.delete(msg.id);
          entry.resolve(msg.result);
        }
      } catch {
        // ignore malformed messages
      }
    });

    socket.on("close", () => {
      if (activeSocket === socket) {
        activeSocket = null;
        rejectAllPending("UI window was closed");
      }
    });

    socket.on("error", () => {
      if (activeSocket === socket) {
        activeSocket = null;
        rejectAllPending("UI connection error");
      }
    });
  });
}

/** Send a render command and wait for the UI to respond. */
export function sendAndWait<T = unknown>(
  tool: string,
  params: Record<string, unknown>
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
      reject(new Error("No UI connected"));
      return;
    }

    const id = randomUUID();
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject });

    activeSocket.send(JSON.stringify({ id, tool, params }));
  });
}

/** Send a render command without waiting (fire-and-forget). */
export function sendFire(
  tool: string,
  params: Record<string, unknown>
): void {
  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;

  const id = randomUUID();
  activeSocket.send(JSON.stringify({ id, tool, params }));
}

export function isUiConnected(): boolean {
  return activeSocket !== null && activeSocket.readyState === WebSocket.OPEN;
}

/** Wait until a UI client connects (or timeout). */
export function waitForConnection(timeoutMs = 8000): Promise<void> {
  if (isUiConnected()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const deadline = setTimeout(() => {
      wss?.off("connection", onConn);
      reject(new Error("Timed out waiting for UI to connect"));
    }, timeoutMs);

    const onConn = () => {
      clearTimeout(deadline);
      resolve();
    };

    wss?.once("connection", onConn);
  });
}
