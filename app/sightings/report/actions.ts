"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type SubmitFoundReportResult = {
success: boolean;
message: string;
dogId?: string;
};

const PHOTO_BUCKET = "dog-photos";
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
value instanceof File && value.size > 0
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
formData: FormData
): Promise<SubmitFoundReportResult> {
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

const photos = getPhotos(formData);
const photoError = validatePhotos(photos);

if (photoError) {
return {
success: false,
message: photoError,
};
}

const breed = String(formData.get("breed") ?? "").trim();
const color = String(formData.get("color") ?? "").trim();
const size = String(formData.get("size") ?? "unknown");
const collar = String(formData.get("collar") ?? "unsure");
const dateFound = String(formData.get("dateFound") ?? "");
const city = String(formData.get("city") ?? "").trim();
const zip = String(formData.get("zip") ?? "").trim();
const description = String(
formData.get("description") ?? ""
).trim();

if (!color) {
return {
success: false,
message: "Please enter the animal's color.",
};
}

if (!dateFound) {
return {
success: false,
message: "Please enter the date the animal was found.",
};
}

if (!city) {
return {
success: false,
message: "Please enter the city where the animal was found.",
};
}

if (!zip) {
return {
success: false,
message: "Please enter the ZIP code.",
};
}

const uploadedPaths: string[] = [];
let dogId: string | null = null;

try {
const { data: dog, error: dogError } = await supabase
.from("dogs")
.insert({
owner_id: user.id,
dog_name: "Found Animal",
breed: breed || null,
description:
description ||
`Found animal in ${city}, ${zip}. Collar: ${collar}.`,
circumstances:
`Found on ${dateFound} in ${city}, ${zip}. Collar: ${collar}.`,
primary_color: color,
secondary_color: null,
sex: "unknown",
size:
size === "small" ||
size === "medium" ||
size === "large"
? size
: "unknown",
estimated_birth_year: null,
microchipped: false,
last_seen_at: new Date(
`${dateFound}T12:00:00`
).toISOString(),
time_is_approximate: true,
location_description: `${city}, ${zip}`,
latitude: 0,
longitude: 0,
reward_offered: false,
reward_amount: null,
status: "spotted",
})
.select("id")
.single();


if (dogError || !dog) {
  throw new Error(
    `Could not save the report: ${
      dogError?.message ?? "No row returned."
    }`
  );
}

dogId = dog.id;

for (const photo of photos) {
  const path =
    `${user.id}/${dogId}/${crypto.randomUUID()}.${safeExtension(photo)}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, photo, {
      contentType: photo.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      `Could not upload a photo: ${uploadError.message}`
    );
  }

  uploadedPaths.push(path);
}

const photoRows = uploadedPaths.map(
  (storagePath, index) => ({
    dog_id: dogId,
    storage_path: storagePath,
    is_primary: index === 0,
  })
);

const { error: photoRowsError } = await supabase
  .from("dog_photos")
  .insert(photoRows);

if (photoRowsError) {
  throw new Error(
    `Could not save photo records: ${photoRowsError.message}`
  );
}

revalidatePath("/sightings");
revalidatePath("/");

return {
  success: true,
  message:
    "Your found-animal report was submitted successfully.",
  dogId,
};


} catch (error) {
if (uploadedPaths.length > 0) {
await supabase.storage
.from(PHOTO_BUCKET)
.remove(uploadedPaths);
}


if (dogId) {
  await supabase
    .from("dogs")
    .delete()
    .eq("id", dogId)
    .eq("owner_id", user.id);
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
