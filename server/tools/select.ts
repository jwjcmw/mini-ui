import { z } from "zod";
import { ensureWindow } from "../window.js";
import { sendAndWait } from "../wsServer.js";

export const selectParams = z.object({
  title: z.string(),
  options: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      description: z.string().optional(),
    })
  ),
  multi: z.boolean().optional(),
});

export type SelectParams = z.infer<typeof selectParams>;

export async function handleSelect(
  params: SelectParams
): Promise<{ value: string } | { values: string[] }> {
  await ensureWindow();
  return sendAndWait("ui_select", params);
}
