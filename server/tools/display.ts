import { z } from "zod";
import { ensureWindow } from "../window.js";
import { sendFire } from "../wsServer.js";

export const displayParams = z.object({
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
});

export type DisplayParams = z.infer<typeof displayParams>;

export async function handleDisplay(
  params: DisplayParams
): Promise<{ ok: true }> {
  await ensureWindow();
  sendFire("ui_display", params);
  return { ok: true };
}
