"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  missingReportFromFormData,
  missingReportSchema,
} from "@/lib/validation/missing-report";
import {
  foundReportFromFormData,
  foundReportSchema,
} from "@/lib/validation/found-report";

export type ReportActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function requireUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return error || !user ? null : user;
}

async function ownsMissingReport(
  supabase: SupabaseClient,
  dogId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("dogs")
    .select("id, owner_id")
    .eq("id", dogId)
    .maybeSingle();

  return !error && data?.owner_id === userId;
}

async function ownsFoundReport(
  supabase: SupabaseClient,
  reportId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("found_reports")
    .select("id, reporter_id")
    .eq("id", reportId)
    .maybeSingle();

  return !error && data?.reporter_id === userId;
}

function revalidateMissing(dogId: string) {
  revalidatePath("/dogs");
  revalidatePath(`/dogs/${dogId}`);
  revalidatePath("/map");
  revalidatePath("/profile");
}

function revalidateFound(reportId: string) {
  revalidatePath("/sightings");
  revalidatePath(`/sightings/${reportId}`);
  revalidatePath("/map");
  revalidatePath("/profile");
}

export async function updateMissingDogReport(
  dogId: string,
  formData: FormData,
): Promise<ReportActionResult> {
  const parsed = missingReportSchema.safeParse(
    missingReportFromFormData(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to edit this report." };
  }

  if (!(await ownsMissingReport(supabase, dogId, user.id))) {
    return { success: false, message: "You can only edit your own missing-pet reports." };
  }

  const { error } = await supabase
    .from("dogs")
    .update({
      dog_name: parsed.data.dogName,
      breed: parsed.data.breed ?? null,
      description: parsed.data.description ?? null,
      circumstances: parsed.data.circumstances ?? null,
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
    })
    .eq("id", dogId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: `Could not update the report: ${error.message}` };
  }

  revalidateMissing(dogId);
  return { success: true, message: "Missing-pet report updated." };
}

export async function updateFoundAnimalReport(
  reportId: string,
  formData: FormData,
): Promise<ReportActionResult> {
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

  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to edit this report." };
  }

  if (!(await ownsFoundReport(supabase, reportId, user.id))) {
    return { success: false, message: "You can only edit your own found-animal reports." };
  }

  const { error } = await supabase
    .from("found_reports")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .eq("reporter_id", user.id);

  if (error) {
    return { success: false, message: `Could not update the report: ${error.message}` };
  }

  revalidateFound(reportId);
  return { success: true, message: "Found-animal report updated." };
}

export async function markMissingDogReunited(
  dogId: string,
): Promise<ReportActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to change this report." };
  }

  if (!(await ownsMissingReport(supabase, dogId, user.id))) {
    return { success: false, message: "You can only modify your own missing-pet reports." };
  }

  const { error } = await supabase
    .from("dogs")
    .update({ status: "reunited", closed_at: new Date().toISOString() })
    .eq("id", dogId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: `Could not mark the dog reunited: ${error.message}` };
  }

  revalidateMissing(dogId);
  return { success: true, message: "Report marked as reunited." };
}

export async function closeMissingDogReport(
  dogId: string,
): Promise<ReportActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to change this report." };
  }

  if (!(await ownsMissingReport(supabase, dogId, user.id))) {
    return { success: false, message: "You can only modify your own missing-pet reports." };
  }

  const { error } = await supabase
    .from("dogs")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", dogId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: `Could not close the report: ${error.message}` };
  }

  revalidateMissing(dogId);
  return { success: true, message: "Missing-pet report closed." };
}

export async function markFoundReportReunited(
  reportId: string,
): Promise<ReportActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to change this report." };
  }

  if (!(await ownsFoundReport(supabase, reportId, user.id))) {
    return { success: false, message: "You can only modify your own found-animal reports." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("found_reports")
    .update({ status: "reunited", closed_at: now, updated_at: now })
    .eq("id", reportId)
    .eq("reporter_id", user.id);

  if (error) {
    return { success: false, message: `Could not mark the report reunited: ${error.message}` };
  }

  revalidateFound(reportId);
  return { success: true, message: "Found-animal report marked as reunited." };
}

export async function closeFoundReport(
  reportId: string,
): Promise<ReportActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, message: "You must be signed in to change this report." };
  }

  if (!(await ownsFoundReport(supabase, reportId, user.id))) {
    return { success: false, message: "You can only modify your own found-animal reports." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("found_reports")
    .update({ status: "closed", closed_at: now, updated_at: now })
    .eq("id", reportId)
    .eq("reporter_id", user.id);

  if (error) {
    return { success: false, message: `Could not close the report: ${error.message}` };
  }

  revalidateFound(reportId);
  return { success: true, message: "Found-animal report closed." };
}
