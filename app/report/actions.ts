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
  dogId?: string;
};

const PHOTO_BUCKET = "dog-photos";
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

  const uploadedPaths: string[] = [];
  let dogId: string | null = null;

  try {
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .insert({
        owner_id: user.id,
        dog_name: parsed.data.dogName,
        breed: parsed.data.breed ?? null,
        description: parsed.data.description ?? null,
        primary_color: parsed.data.primaryColor,
        secondary_color: parsed.data.secondaryColor ?? null,
        sex: parsed.data.sex,
        size: parsed.data.size,
        estimated_birth_year: parsed.data.estimatedBirthYear ?? null,
        microchipped: parsed.data.microchipped,
        last_seen_at: new Date(parsed.data.lastSeenAt).toISOString(),
        time_is_approximate: parsed.data.timeIsApproximate,
        location_description: parsed.data.locationDescription,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        reward_offered: parsed.data.rewardOffered,
        reward_amount: parsed.data.rewardOffered ? parsed.data.rewardAmount : null,
        status: "missing",
      })
      .select("id")
      .single();

    if (dogError || !dog) {
      throw new Error(`Could not save the report: ${dogError?.message ?? "No row returned."}`);
    }
    dogId = dog.id;

    if (!dogId) {
      throw new Error("Dog record was created without an ID.");
    }

    for (const photo of photos) {
      const path = `${user.id}/${dogId}/${crypto.randomUUID()}.${safeExtension(photo)}`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, { contentType: photo.type, upsert: false });

      if (uploadError) throw new Error(`Could not upload a photo: ${uploadError.message}`);
      uploadedPaths.push(path);
    }

    const photoRows = uploadedPaths.map((storagePath, index) => ({
      dog_id: dogId,
      storage_path: storagePath,
      is_primary: index === 0,
    }));

    const { error: photoRowsError } = await supabase.from("dog_photos").insert(photoRows);
    if (photoRowsError) {
      throw new Error(`Could not save photo records: ${photoRowsError.message}`);
    }

    revalidatePath("/dogs");
    revalidatePath("/report");

    return {
      success: true,
      message: "Your missing-dog report was submitted successfully.",
      dogId,
    };
  } catch (error) {
    // Best-effort rollback across Storage and database operations.
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(uploadedPaths);
    }
    if (dogId) {
      await supabase.from("dogs").delete().eq("id", dogId).eq("owner_id", user.id);
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
