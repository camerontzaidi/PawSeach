import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const foundReportSchema = z.object({
  breed: optionalText(100),
  color: z.string().trim().min(1, "Color is required.").max(50),
  size: z.enum(["small", "medium", "large", "unknown"]),
  collarStatus: z.enum(["yes", "no", "unsure"]),
  foundDate: z
    .string()
    .min(1, "Date found is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date."),
  city: z.string().trim().min(1, "City is required.").max(100),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}(?:-\d{4})?$/, "Enter a valid ZIP code."),
  details: z.string().trim().min(1, "Additional details are required.").max(3000),
});

export type FoundReportInput = z.infer<typeof foundReportSchema>;

export function foundReportFromFormData(formData: FormData) {
  return {
    breed: String(formData.get("breed") ?? ""),
    color: String(formData.get("color") ?? ""),
    size: String(formData.get("size") ?? "unknown"),
    collarStatus: String(formData.get("collarStatus") ?? "unsure"),
    foundDate: String(formData.get("foundDate") ?? ""),
    city: String(formData.get("city") ?? ""),
    zipCode: String(formData.get("zipCode") ?? ""),
    details: String(formData.get("details") ?? ""),
  };
}
