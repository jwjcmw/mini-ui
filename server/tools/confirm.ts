import { z } from "zod";
import { ensureWindow } from "../window.js";
import { sendAndWait } from "../wsServer.js";

export const confirmParams = z.object({
  message: z.string(),
  detail: z.string().optional(),
  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
});

export type ConfirmParams = z.infer<typeof confirmParams>;

export async function handleConfirm(
  params: ConfirmParams
): Promise<{ confirmed: boolean }> {
  await ensureWindow();
  return sendAndWait<{ confirmed: boolean }>("ui_confirm", params);
}
