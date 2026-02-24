# mini-ui-mcp

A lightweight, chromeless Electron window that AI coding agents can drive via MCP to display rich UI interactions.

## Quick Start

```bash
npm install
npm run dev
```

This starts both the Vite dev server (UI on `:5173`) and the MCP server.

## Architecture

```
Agent ──MCP──► server/index.ts ──WebSocket──► React UI (Electron window)
                                  :9999
```

1. MCP server registers 5 tools and opens a WebSocket on `localhost:9999`
2. Agent calls a tool → server spawns an Electron window (if needed) → sends a render command over WebSocket
3. React UI renders the component, collects user input, sends the result back
4. Server returns the result as the MCP tool response

## MCP Tools

| Tool | Description | Blocking |
|------|-------------|----------|
| `ui_open` | Opens/focuses the window | No |
| `ui_confirm` | Yes/No confirmation dialog | Yes |
| `ui_select` | Single or multi-select list | Yes |
| `ui_form` | Dynamic form with multiple field types | Yes |
| `ui_display` | Show markdown, progress, or diffs | No |

## Scripts

- `npm run dev` — Run UI + MCP server concurrently
- `npm run build` — Build UI and compile server
- `npm start` — Run the built MCP server

## Configuring with Claude Desktop

Add to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "mini-ui": {
      "command": "node",
      "args": ["path/to/mini-ui-mcp/dist/server/index.js"]
    }
  }
}
```
