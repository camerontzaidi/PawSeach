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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/messages/${id}`);
  }

  const { data } = await supabase
    .from("conversations")
    .select(
      "id, dog_id, dog_name, requester_id, owner_id, requester_name, owner_name, initial_message, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const conversation = data as Conversation;

  const isOwner = conversation.owner_id === user.id;
  const isRequester = conversation.requester_id === user.id;

  if (!isOwner && !isRequester) {
    notFound();
  }

  let messages: Message[] = [];

  if (conversation.status === "accepted") {
    const { data: messageData } = await supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    messages = (messageData ?? []) as Message[];
  }

  const otherPerson = isOwner
    ? conversation.requester_name
    : conversation.owner_name || "Pet Owner";

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/messages"
          className="text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back to Messages
        </Link>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Conversation
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {otherPerson}
            </h1>

            <Link
              href={`/dogs/${conversation.dog_id}`}
              className="mt-3 inline-block text-sm font-semibold text-gray-600 underline underline-offset-4 transition hover:text-black"
            >
              View {conversation.dog_name}&apos;s report
            </Link>
          </div>

          {conversation.status !== "accepted" && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Initial message
              </p>

              <p className="mt-3 whitespace-pre-wrap text-gray-700">
                {conversation.initial_message}
              </p>
            </div>
          )}

          {conversation.status === "pending" && isOwner && (
            <div className="mt-6 rounded-2xl border border-[#fbb12c] bg-[#fff9e8] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  01
                </div>

                <div>
                  <h2 className="text-lg font-bold text-black">
                    Message request
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Accept this request to start a conversation with{" "}
                    {conversation.requester_name}.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <form action={respondToMessageRequest} className="flex-1">
                  <input
                    type="hidden"
                    name="conversationId"
                    value={conversation.id}
                  />

                  <input
                    type="hidden"
                    name="decision"
                    value="accepted"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#fbb12c] px-5 py-3 font-bold text-black transition hover:bg-[#ffc34d]"
                  >
                    Accept Request
                  </button>
                </form>

                <form action={respondToMessageRequest} className="flex-1">
                  <input
                    type="hidden"
                    name="conversationId"
                    value={conversation.id}
                  />

                  <input
                    type="hidden"
                    name="decision"
                    value="declined"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    Decline
                  </button>
                </form>
              </div>
            </div>
          )}

          {conversation.status === "pending" && isRequester && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  01
                </div>

                <div>
                  <h2 className="text-lg font-bold text-black">
                    Waiting for acceptance
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Your message request has been sent. You can send another
                    message once the owner accepts the request.
                  </p>
                </div>
              </div>
            </div>
          )}

          {conversation.status === "declined" && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                  01
                </div>

                <div>
                  <h2 className="text-lg font-bold text-black">
                    Request declined
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    This conversation is closed and no additional messages can
                    be sent.
                  </p>
                </div>
              </div>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      conversation.requester_id === user.id
                        ? "bg-[#fbb12c] text-black"
                        : "bg-gray-100 text-gray-700"
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
                    <div
                      key={message.id}
                      className={`flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          mine
                            ? "bg-[#fbb12c] text-black"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">
                          {message.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form action={sendConversationMessage} className="mt-7">
                <input
                  type="hidden"
                  name="conversationId"
                  value={conversation.id}
                />

                <label
                  htmlFor="message-body"
                  className="mb-2 block text-sm font-semibold text-black"
                >
                  Message
                </label>

                <textarea
                  id="message-body"
                  name="body"
                  required
                  minLength={2}
                  maxLength={2000}
                  rows={4}
                  placeholder="Write a message..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
                />

                <button
                  type="submit"
                  className="mt-3 w-full rounded-xl bg-[#fbb12c] px-6 py-3 font-bold text-black transition hover:bg-[#ffc34d]"
                >
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