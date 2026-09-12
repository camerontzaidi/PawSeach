import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  respondToMessageRequest,
  sendConversationMessage,
} from "../actions";

type Conversation = {
  id: string;
  dog_id: string;
  dog_name: string;
  requester_id: string;
  owner_id: string;
  requester_name: string;
  owner_name: string | null;
  initial_message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/messages/${id}`);

  const { data } = await supabase
    .from("conversations")
    .select("id, dog_id, dog_name, requester_id, owner_id, requester_name, owner_name, initial_message, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const conversation = data as Conversation;
  const isOwner = conversation.owner_id === user.id;
  const isRequester = conversation.requester_id === user.id;

  if (!isOwner && !isRequester) notFound();

  let messages: Message[] = [];

  if (conversation.status === "accepted") {
    const { data: messageData } = await supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    messages = (messageData ?? []) as Message[];
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/messages" className="text-sm font-semibold text-[#b7d5ce]">
          ← Back to Messages
        </Link>

        <section className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Regarding {conversation.dog_name}
          </span>

          <h1 className="mt-2 text-3xl font-bold">
            {isOwner
              ? conversation.requester_name
              : conversation.owner_name || "Pet Owner"}
          </h1>

          <Link
            href={`/dogs/${conversation.dog_id}`}
            className="mt-2 inline-block text-sm font-semibold text-[#9bd8c9]"
          >
            View missing pet report
          </Link>

          {conversation.status !== "accepted" && (
            <div className="mt-7 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5">
              <p className="text-sm font-semibold text-[#fbb12c]">
                Initial message request
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[#c3ded8]">
                {conversation.initial_message}
              </p>
            </div>
          )}

          {conversation.status === "pending" && isOwner && (
            <div className="mt-6 rounded-xl border border-[#fbb12c]/50 bg-[#003d35] p-5">
              <h2 className="text-xl font-bold">Accept this message request?</h2>
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Until you accept, the requester cannot send another message.
              </p>

              <div className="mt-5 flex gap-3">
                <form action={respondToMessageRequest} className="flex-1">
                  <input type="hidden" name="conversationId" value={conversation.id} />
                  <input type="hidden" name="decision" value="accepted" />
                  <button type="submit" className="w-full rounded-md bg-[#078c78] px-5 py-3 font-bold">
                    Accept
                  </button>
                </form>

                <form action={respondToMessageRequest} className="flex-1">
                  <input type="hidden" name="conversationId" value={conversation.id} />
                  <input type="hidden" name="decision" value="declined" />
                  <button type="submit" className="w-full rounded-md border border-red-400/50 px-5 py-3 font-bold text-red-200">
                    Decline
                  </button>
                </form>
              </div>
            </div>
          )}

          {conversation.status === "pending" && isRequester && (
            <div className="mt-6 rounded-xl border border-[#fbb12c]/50 bg-[#003d35] p-5">
              <h2 className="font-bold text-[#fbb12c]">Waiting for acceptance</h2>
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Additional messaging is disabled until the owner accepts.
              </p>
            </div>
          )}

          {conversation.status === "declined" && (
            <div className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 p-5">
              <h2 className="font-bold text-red-200">Request declined</h2>
              <p className="mt-2 text-sm text-red-100/80">
                This conversation is closed.
              </p>
            </div>
          )}

          {conversation.status === "accepted" && (
            <>
              <div className="mt-7 space-y-4">
                <div
                  className={`flex ${
                    conversation.requester_id === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      conversation.requester_id === user.id
                        ? "bg-[#078c78] text-white"
                        : "bg-[#003d35] text-[#c3ded8]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {conversation.initial_message}
                    </p>
                  </div>
                </div>

                {messages.map((message) => {
                  const mine = message.sender_id === user.id;
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-3 ${
                          mine
                            ? "bg-[#078c78] text-white"
                            : "bg-[#003d35] text-[#c3ded8]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form action={sendConversationMessage} className="mt-7">
                <input type="hidden" name="conversationId" value={conversation.id} />
                <textarea
                  name="body"
                  required
                  minLength={2}
                  maxLength={2000}
                  rows={4}
                  placeholder="Write a message..."
                  className="w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white"
                />
                <button type="submit" className="mt-3 w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]">
                  Send Message
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
