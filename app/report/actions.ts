"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  missingReportFromFormData,
  missingReportSchema,
} from "@/lib/validation/missing-report";

export type SubmitReportResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  reportId?: string;
};

const PHOTO_BUCKET = "missing-report-photos";
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getPhotos(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function validatePhotos(photos: File[]): string | null {
  if (photos.length === 0) return "Upload at least one clear photo of the dog.";
  if (photos.length > MAX_PHOTOS) return `Upload no more than ${MAX_PHOTOS} photos.`;

  for (const photo of photos) {
    if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
      return "Photos must be JPEG, PNG, or WebP files.";
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return "Each photo must be 5 MB or smaller.";
    }
  }
  return null;
}

function safeExtension(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function submitMissingDogReport(
  formData: FormData,
): Promise<SubmitReportResult> {
  const parsed = missingReportSchema.safeParse(missingReportFromFormData(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const photos = getPhotos(formData);
  const photoError = validatePhotos(photos);
  if (photoError) return { success: false, message: photoError };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "You must be signed in before submitting a missing-dog report.",
    };
  }

  const dogId = crypto.randomUUID();
  const reportId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  let dogCreated = false;
  let reportCreated = false;

  try {
    const { error: dogError } = await supabase.from("dogs").insert({
      dog_id: dogId,
      owner_id: user.id,
      name: parsed.data.name,
      breed: parsed.data.breed ?? null,
      primary_color: parsed.data.primaryColor,
      secondary_color: parsed.data.secondaryColor ?? null,
      sex: parsed.data.sex,
      estimated_birth_year: parsed.data.estimatedBirthYear ?? null,
      size: parsed.data.size,
      distinctive_features: parsed.data.distinctiveFeatures ?? null,
      microchipped: parsed.data.microchipped,
    });

    if (dogError) throw new Error(`Could not save the dog: ${dogError.message}`);
    dogCreated = true;

    // Coordinates are temporarily set to 0 until the map/geocoding step is added.
    // Replace these values with actual private/public coordinates in Week 4.
    const { error: reportError } = await supabase.from("missing_reports").insert({
      report_id: reportId,
      dog_id: dogId,
      last_seen_at: new Date(parsed.data.lastSeenAt).toISOString(),
      time_is_approximate: parsed.data.timeIsApproximate,
      location_description: parsed.data.locationDescription,
      private_latitude: 0,
      private_longitude: 0,
      public_latitude: 0,
      public_longitude: 0,
      circumstances: parsed.data.circumstances ?? null,
      reward_offered: parsed.data.rewardOffered,
      reward_amount: parsed.data.rewardOffered ? parsed.data.rewardAmount : null,
      report_status: "missing",
    });

    if (reportError) throw new Error(`Could not save the report: ${reportError.message}`);
    reportCreated = true;

    for (const photo of photos) {
      const path = `${user.id}/${reportId}/${crypto.randomUUID()}.${safeExtension(photo)}`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, { contentType: photo.type, upsert: false });

      if (uploadError) throw new Error(`Could not upload a photo: ${uploadError.message}`);
      uploadedPaths.push(path);
    }

    const photoRows = uploadedPaths.map((path) => ({
      report_id: reportId,
      photo_url: path,
    }));

    const { error: photoRowsError } = await supabase
      .from("missing_report_photos")
      .insert(photoRows);

    if (photoRowsError) {
      throw new Error(`Could not save photo records: ${photoRowsError.message}`);
    }

    revalidatePath("/dogs");
    revalidatePath("/report");

    return {
      success: true,
      message: "Your missing-dog report was submitted successfully.",
      reportId,
    };
  } catch (error) {
    // Best-effort compensation for partial failures. A database RPC transaction
    // is an even stronger option once the schema is stable.
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(uploadedPaths);
    }
    if (reportCreated) {
      await supabase.from("missing_reports").delete().eq("report_id", reportId);
    }
    if (dogCreated) {
      await supabase.from("dogs").delete().eq("dog_id", dogId);
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The report could not be submitted. Please try again.",
    };
  }
}
