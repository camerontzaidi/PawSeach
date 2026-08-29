"use server";

import { revalidatePath } from "next/cache";
import {
  foundReportFromFormData,
  foundReportSchema,
} from "@/lib/validation/found-report";
import { createClient } from "@/utils/supabase/server";

export type SubmitFoundReportResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  reportId?: string;
};

const PHOTO_BUCKET = "found-report-photos";
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getPhotos(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter(
      (value): value is File =>
        value instanceof File && value.size > 0,
    );
}

function validatePhotos(photos: File[]): string | null {
  if (photos.length === 0) {
    return "Upload at least one clear photo of the animal.";
  }

  if (photos.length > MAX_PHOTOS) {
    return `Upload no more than ${MAX_PHOTOS} photos.`;
  }

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

export async function submitFoundAnimalReport(
  formData: FormData,
): Promise<SubmitFoundReportResult> {
  const parsed = foundReportSchema.safeParse(
    foundReportFromFormData(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const photos = getPhotos(formData);
  const photoError = validatePhotos(photos);
  if (photoError) {
    return { success: false, message: photoError };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message:
        "You must be signed in before submitting a found-animal report.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      success: false,
      message:
        "Your account profile is not ready yet. Please sign out, sign back in, and try again.",
    };
  }

  const uploadedPaths: string[] = [];
  let createdReportId: string | null = null;

  try {
    const { data: report, error: reportError } = await supabase
      .from("found_reports")
      .insert({
        reporter_id: user.id,
        breed: parsed.data.breed ?? null,
        color: parsed.data.color,
        size: parsed.data.size,
        collar_status: parsed.data.collarStatus,
        found_at: parsed.data.dateFound,
        city: parsed.data.city,
        zip_code: parsed.data.zipCode,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        details: parsed.data.details ?? null,
        status: "unmatched",
      })
      .select("id")
      .single();

    if (reportError || !report) {
      throw new Error(
        `Could not save the found-animal report: ${
          reportError?.message ?? "No row returned."
        }`,
      );
    }

    const reportId = report.id;
    if (typeof reportId !== "string" || reportId.length === 0) {
      throw new Error("Found-animal report was created without an ID.");
    }
    createdReportId = reportId;

    for (const photo of photos) {
      const path = `${user.id}/${reportId}/${crypto.randomUUID()}.${safeExtension(photo)}`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `Could not upload a photo: ${uploadError.message}`,
        );
      }

      uploadedPaths.push(path);
    }

    const photoRows = uploadedPaths.map((storagePath, index) => ({
      found_report_id: reportId,
      storage_path: storagePath,
      is_primary: index === 0,
    }));

    const { error: photoRowsError } = await supabase
      .from("found_report_photos")
      .insert(photoRows);

    if (photoRowsError) {
      throw new Error(
        `Could not save photo records: ${photoRowsError.message}`,
      );
    }

    revalidatePath("/sightings");
    revalidatePath("/map");
    revalidatePath(`/sightings/${reportId}`);
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/me");

    return {
      success: true,
      message: "Your found-animal report was submitted successfully.",
      reportId,
    };
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(uploadedPaths);
    }

    if (createdReportId) {
      await supabase
        .from("found_reports")
        .delete()
        .eq("id", createdReportId)
        .eq("reporter_id", user.id);
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
