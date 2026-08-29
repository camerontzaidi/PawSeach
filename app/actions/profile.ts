"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateProfilePreferences(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const city = String(formData.get("city") ?? "").trim() || null;
  const zipCode = String(formData.get("zipCode") ?? "").trim() || null;

  await supabase
    .from("profiles")
    .update({
      city,
      zip_code: zipCode,
      notify_nearby_sightings: formData.get("notifyNearbySightings") === "on",
      notify_contact_requests: formData.get("notifyContactRequests") === "on",
      notify_product_updates: formData.get("notifyProductUpdates") === "on",
    })
    .eq("id", user.id);

  revalidatePath("/me");
  revalidatePath("/profile");
}
