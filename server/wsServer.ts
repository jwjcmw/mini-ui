import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";

const PORT = 9999;

let wss: WebSocketServer | null = null;
let activeSocket: WebSocket | null = null;
const pending = new Map<string, (result: unknown) => void>();

export function startWsServer(): void {
  if (wss) return;

  wss = new WebSocketServer({ port: PORT });

  wss.on("connection", (socket) => {
    activeSocket = socket;

    socket.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const resolve = pending.get(msg.id);
        if (resolve) {
          pending.delete(msg.id);
          resolve(msg.result);
        }
      } catch {
        // ignore malformed messages
      }
    });

    socket.on("close", () => {
      if (activeSocket === socket) activeSocket = null;
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
    pending.set(id, resolve as (v: unknown) => void);

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
