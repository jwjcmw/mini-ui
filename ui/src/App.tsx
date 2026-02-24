import { useEffect, useRef, useState, useCallback } from "react";
import Confirm from "./components/Confirm";
import Select from "./components/Select";
import Form from "./components/Form";
import Display from "./components/Display";

interface RenderCommand {
  id: string;
  tool: string;
  params: Record<string, unknown>;
}

export default function App() {
  const wsRef = useRef<WebSocket | null>(null);
  const [command, setCommand] = useState<RenderCommand | null>(null);

  const respond = useCallback((id: string, result: unknown) => {
    wsRef.current?.send(JSON.stringify({ id, result }));
    // Close the window after responding — next interaction will reopen it
    setTimeout(() => window.close(), 150);
  }, []);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("ws://localhost:9999");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as RenderCommand;
          setCommand(msg);
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        setTimeout(connect, 1000);
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  if (!command) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-600 text-sm">Waiting...</div>
      </div>
    );
  }

  const { id, tool, params } = command;

  return (
    <div className="min-h-screen bg-zinc-900/95 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden animate-in">
      {tool === "ui_confirm" && (
        <Confirm params={params} onResult={(r) => respond(id, r)} />
      )}
      {tool === "ui_select" && (
        <Select params={params} onResult={(r) => respond(id, r)} />
      )}
      {tool === "ui_form" && (
        <Form params={params} onResult={(r) => respond(id, r)} />
      )}
      {tool === "ui_display" && <Display params={params} />}
    </div>
  );
}
