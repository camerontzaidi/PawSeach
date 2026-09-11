"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type MessageRequestResult = {
  success: boolean;
  message: string;
  conversationId?: string;
  status?: "pending" | "accepted" | "declined";
};

function cleanMessage(value: unknown) {
  return String(value ?? "").trim();
}

function validMessage(body: string) {
  return body.length >= 2 && body.length <= 2000;
}

export async function createMessageRequest(
  dogId: string,
  rawMessage: string,
): Promise<MessageRequestResult> {
  const body = cleanMessage(rawMessage);

  if (!validMessage(body)) {
    return {
      success: false,
      message: "Message must be between 2 and 2000 characters.",
    };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Sign in before contacting a pet owner." };
  }

  const { data: dog, error: dogError } = await supabase
    .from("dogs")
    .select("id, owner_id, dog_name, status")
    .eq("id", dogId)
    .maybeSingle();

  if (dogError || !dog) {
    return { success: false, message: "This missing-pet report could not be found." };
  }

  if (dog.owner_id === user.id) {
    return { success: false, message: "You cannot message your own report." };
  }

  if (!["missing", "spotted"].includes(String(dog.status).toLowerCase())) {
    return {
      success: false,
      message: "This report is no longer accepting new message requests.",
    };
  }

  const requesterName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "PawSearch User";

  const { data: conversation, error: insertError } = await supabase
    .from("conversations")
    .insert({
      dog_id: dog.id,
      requester_id: user.id,
      owner_id: dog.owner_id,
      requester_name: requesterName,
      dog_name: dog.dog_name,
      initial_message: body,
      status: "pending",
    })
    .select("id, status")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: existing } = await supabase
        .from("conversations")
        .select("id, status")
        .eq("dog_id", dogId)
        .eq("requester_id", user.id)
        .maybeSingle();

      return {
        success: false,
        message: "You have already sent your one initial message request for this pet.",
        conversationId: existing?.id,
        status: existing?.status as MessageRequestResult["status"],
      };
    }

    return {
      success: false,
      message: `Could not send the message request: ${insertError.message}`,
    };
  }

  revalidatePath(`/dogs/${dogId}`);
  revalidatePath("/messages");

  return {
    success: true,
    message: "Message request sent.",
    conversationId: conversation.id,
    status: conversation.status as MessageRequestResult["status"],
  };
}

export async function respondToMessageRequest(formData: FormData): Promise<void> {
  const conversationId = String(formData.get("conversationId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!conversationId || !["accepted", "declined"].includes(decision)) {
    redirect("/messages");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/messages/${conversationId}`);
  }

  const ownerName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name ||
    [user.user_metadata?.first_name, user.user_metadata?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user.email?.split("@")[0] ||
    "PawSearch User";

  const now = new Date().toISOString();
  const update =
    decision === "accepted"
      ? {
          status: "accepted",
          owner_name: ownerName,
          accepted_at: now,
          declined_at: null,
          updated_at: now,
        }
      : {
          status: "declined",
          owner_name: ownerName,
          declined_at: now,
          accepted_at: null,
          updated_at: now,
        };

  const { error } = await supabase
    .from("conversations")
    .update(update)
    .eq("id", conversationId)
    .eq("owner_id", user.id)
    .eq("status", "pending");

  if (error) console.error("Could not respond to message request:", error);

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  redirect(`/messages/${conversationId}`);
}

export async function sendConversationMessage(formData: FormData): Promise<void> {
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = cleanMessage(formData.get("body"));

  if (!conversationId || !validMessage(body)) {
    redirect(conversationId ? `/messages/${conversationId}` : "/messages");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/messages/${conversationId}`);
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, requester_id, owner_id, status")
    .eq("id", conversationId)
    .maybeSingle();

  const isParticipant =
    conversation &&
    (conversation.requester_id === user.id || conversation.owner_id === user.id);

  if (!conversation || !isParticipant || conversation.status !== "accepted") {
    redirect(`/messages/${conversationId}`);
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body,
  });

  if (error) console.error("Could not send message:", error);

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  redirect(`/messages/${conversationId}`);
}
