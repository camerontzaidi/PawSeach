import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Conversation = {
  id: string;
  dog_id: string;
  dog_name: string;
  requester_id: string;
  owner_id: string;
  requester_name: string;
  owner_name?: string | null;
  initial_message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
};

function statusClasses(status: Conversation["status"]) {
  if (status === "accepted") {
    return "border border-emerald-300/70 bg-emerald-400/30 text-emerald-50";
  }

  if (status === "declined") {
    return "border border-rose-300/70 bg-rose-400/30 text-rose-50";
  }

  return "border border-[#fbb12c]/80 bg-[#fbb12c]/25 text-[#ffe2a0]";
}

function statusLabel(status: Conversation["status"]) {
  return status.toUpperCase();
}

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/messages");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, dog_id, dog_name, requester_id, owner_id, requester_name, owner_name, initial_message, status, created_at, updated_at",
    )
    .or(`owner_id.eq.${user.id},requester_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Could not load conversations:", error);
  }

  const conversations = (data ?? []) as Conversation[];

  const incomingRequests = conversations.filter(
    (conversation) =>
      conversation.owner_id === user.id && conversation.status === "pending",
  );

  const otherConversations = conversations.filter(
    (conversation) =>
      !(
        conversation.owner_id === user.id &&
        conversation.status === "pending"
      ),
  );

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
          PawSearch Messaging
        </span>

        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Messages</h1>

        <p className="mt-3 max-w-2xl text-lg text-[#b7d5ce]">
          Review incoming message requests and continue conversations you have
          accepted.
        </p>

        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold">Message Requests</h2>
            <p className="mt-1 text-sm text-[#b7d5ce]">
              {incomingRequests.length} pending
            </p>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="mt-5 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 text-[#b7d5ce]">
              You do not have any pending message requests.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {incomingRequests.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block rounded-xl border border-[#fbb12c]/50 bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#9bbab3]">
                        Pet
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {conversation.dog_name}
                      </p>

                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#9bbab3]">
                        Message from
                      </p>
                      <p className="mt-1 text-[#c3ded8]">
                        {conversation.requester_name}
                      </p>

                      <p className="mt-4 line-clamp-2 text-sm text-[#b7d5ce]">
                        “{conversation.initial_message}”
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-10 min-w-28 shrink-0 items-center justify-center rounded-full px-4 py-2 text-center text-xs font-extrabold tracking-wide ${statusClasses(
                        conversation.status,
                      )}`}
                    >
                      {statusLabel(conversation.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Conversations</h2>

          {otherConversations.length === 0 ? (
            <div className="mt-5 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 text-[#b7d5ce]">
              No other conversations yet.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {otherConversations.map((conversation) => {
                const isOwner = conversation.owner_id === user.id;
                const otherPerson = isOwner
                  ? conversation.requester_name
                  : conversation.owner_name || "Pet Owner";

                const personLabel = isOwner
                  ? "Conversation with"
                  : "Owner";

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="block rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9bbab3]">
                          Pet
                        </p>
                        <p className="mt-1 text-xl font-bold">
                          {conversation.dog_name}
                        </p>

                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#9bbab3]">
                          {personLabel}
                        </p>
                        <p className="mt-1 text-[#c3ded8]">
                          {otherPerson}
                        </p>
                      </div>

                      <span
                        className={`inline-flex min-h-10 min-w-28 shrink-0 items-center justify-center rounded-full px-4 py-2 text-center text-xs font-extrabold tracking-wide ${statusClasses(
                          conversation.status,
                        )}`}
                      >
                        {statusLabel(conversation.status)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
