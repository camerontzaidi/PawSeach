import { z } from "zod";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional();

export const foundReportSchema = z.object({
  breed: optionalTrimmedString(100),
  color: z.string().trim().min(1, "Color is required.").max(50),
  size: z.enum(["small", "medium", "large", "unknown"]),
  collarStatus: z.enum(["yes", "no", "unsure"]),
  dateFound: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date."),
  city: z.string().trim().min(1, "City is required.").max(100),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code."),
  latitude: z.coerce
    .number()
    .min(-90, "Latitude must be at least -90.")
    .max(90, "Latitude must be at most 90."),
  longitude: z.coerce
    .number()
    .min(-180, "Longitude must be at least -180.")
    .max(180, "Longitude must be at most 180."),
  details: optionalTrimmedString(2000),
});

export type FoundReportInput = z.infer<typeof foundReportSchema>;

export function foundReportFromFormData(formData: FormData) {
  return {
    breed: String(formData.get("breed") ?? ""),
    color: String(formData.get("color") ?? ""),
    size: String(formData.get("size") ?? "unknown"),
    collarStatus: String(formData.get("collar") ?? "unsure"),
    dateFound: String(formData.get("dateFound") ?? ""),
    city: String(formData.get("city") ?? ""),
    zipCode: String(formData.get("zip") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
    details: String(formData.get("description") ?? ""),
  };
}
