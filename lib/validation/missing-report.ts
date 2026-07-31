import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const missingReportSchema = z
  .object({
    dogName: z.string().trim().min(1, "Dog name is required.").max(100),
    breed: optionalText(100),
    primaryColor: z.string().trim().min(1, "Primary color is required.").max(50),
    secondaryColor: optionalText(50),
    sex: z.enum(["male", "female", "unknown"]),
    estimatedBirthYear: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : Number(value)))
      .pipe(
        z
          .number()
          .int()
          .min(1900, "Enter a reasonable birth year.")
          .max(new Date().getFullYear(), "Birth year cannot be in the future.")
          .optional(),
      ),
    size: z.enum(["small", "medium", "large", "unknown"]),
    description: optionalText(3000),
    circumstances: optionalText(3000),
    microchipped: z.boolean(),
    lastSeenAt: z
      .string()
      .min(1, "Last-seen date and time are required.")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date and time."),
    timeIsApproximate: z.boolean(),
    locationDescription: z.string().trim().min(1, "Last-seen location is required.").max(255),
    latitude: z.coerce.number().min(-90, "Latitude must be at least -90.").max(90),
    longitude: z.coerce.number().min(-180, "Longitude must be at least -180.").max(180),
    rewardOffered: z.boolean(),
    rewardAmount: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : Number(value)))
      .pipe(z.number().min(0, "Reward cannot be negative.").optional()),
  })
  .superRefine((data, ctx) => {
    if (data.rewardOffered && data.rewardAmount === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["rewardAmount"],
        message: "Enter the reward amount or turn off the reward option.",
      });
    }

    if (!data.rewardOffered && data.rewardAmount !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["rewardAmount"],
        message: "Turn on the reward option before entering an amount.",
      });
    }
  });

export type MissingReportInput = z.infer<typeof missingReportSchema>;

export function missingReportFromFormData(formData: FormData) {
  return {
    dogName: String(formData.get("dogName") ?? ""),
    breed: String(formData.get("breed") ?? ""),
    primaryColor: String(formData.get("primaryColor") ?? ""),
    secondaryColor: String(formData.get("secondaryColor") ?? ""),
    sex: String(formData.get("sex") ?? "unknown"),
    estimatedBirthYear: String(formData.get("estimatedBirthYear") ?? ""),
    size: String(formData.get("size") ?? "unknown"),
    description: String(formData.get("description") ?? ""),
    circumstances: String(formData.get("circumstances") ?? ""),
    microchipped: formData.get("microchipped") === "on",
    lastSeenAt: String(formData.get("lastSeenAt") ?? ""),
    timeIsApproximate: formData.get("timeIsApproximate") === "on",
    locationDescription: String(formData.get("locationDescription") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
    rewardOffered: formData.get("rewardOffered") === "on",
    rewardAmount: String(formData.get("rewardAmount") ?? ""),
  };
}
