import { z } from "zod";
import { ensureWindow } from "../window.js";
import { sendAndWait } from "../wsServer.js";

export const formParams = z.object({
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
});

export type FormParams = z.infer<typeof formParams>;

export async function handleForm(
  params: FormParams
): Promise<Record<string, unknown>> {
  await ensureWindow();
  return sendAndWait<Record<string, unknown>>("ui_form", params);
}
