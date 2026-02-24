import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { startWsServer } from "./wsServer.js";
import { ensureWindow } from "./window.js";
import { handleConfirm } from "./tools/confirm.js";
import { handleSelect } from "./tools/select.js";
import { handleForm } from "./tools/form.js";
import { handleDisplay } from "./tools/display.js";

const server = new McpServer({
  name: "mini-ui",
  version: "0.1.0",
});

// --- ui_open ---
server.tool(
  "ui_open",
  "Opens the mini-ui window. Idempotent.",
  {
    title: z.string().optional(),
    position: z.enum(["center", "top-right", "cursor"]).optional(),
  },
  async ({ title, position }) => {
    await ensureWindow({ title, position });
    return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
  }
);

// --- ui_confirm ---
server.tool(
  "ui_confirm",
  "Shows a confirmation dialog. Blocks until user responds.",
  {
    message: z.string(),
    detail: z.string().optional(),
    confirmLabel: z.string().optional(),
    cancelLabel: z.string().optional(),
  },
  async (params) => {
    const result = await handleConfirm(params);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// --- ui_select ---
server.tool(
  "ui_select",
  "Shows a selection list. Blocks until user selects.",
  {
    title: z.string(),
    options: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        description: z.string().optional(),
      })
    ),
    multi: z.boolean().optional(),
  },
  async (params) => {
    const result = await handleSelect(params);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// --- ui_form ---
server.tool(
  "ui_form",
  "Renders a form. Blocks until user submits.",
  {
    title: z.string().optional(),
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["text", "select", "boolean", "textarea"]),
        label: z.string(),
        placeholder: z.string().optional(),
        required: z.boolean().optional(),
        default: z.any().optional(),
        options: z.array(z.string()).optional(),
      })
    ),
    submitLabel: z.string().optional(),
  },
  async (params) => {
    const result = await handleForm(params);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// --- ui_display ---
server.tool(
  "ui_display",
  "Pushes content to the window for display. Non-blocking.",
  {
    type: z.enum(["markdown", "progress", "diff"]),
    content: z.union([
      z.string(),
      z.array(
        z.object({
          label: z.string(),
          done: z.boolean(),
          active: z.boolean().optional(),
        })
      ),
    ]),
    append: z.boolean().optional(),
  },
  async (params) => {
    const result = await handleDisplay(params);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// --- Start ---
startWsServer();

const transport = new StdioServerTransport();
await server.connect(transport);
