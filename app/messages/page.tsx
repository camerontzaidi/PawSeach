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
    return "border-gray-300 bg-gray-100 text-gray-700";
  }

  if (status === "declined") {
    return "border-gray-300 bg-gray-50 text-gray-500";
  }

  return "border-[#fbb12c] bg-[#fff7df] text-gray-800";
}

function statusLabel(status: Conversation["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Messages
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Review message requests and continue conversations about missing
            and found pets.
          </p>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              01
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black">
                Message Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {incomingRequests.length}{" "}
                {incomingRequests.length === 1 ? "pending request" : "pending requests"}
              </p>
            </div>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-500">
              You do not have any pending message requests.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {incomingRequests.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#fbb12c] hover:shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Pet
                      </p>

                      <p className="mt-1 text-xl font-bold text-black">
                        {conversation.dog_name}
                      </p>

                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Message from
                      </p>

                      <p className="mt-1 text-gray-700">
                        {conversation.requester_name}
                      </p>

                      <p className="mt-4 line-clamp-2 text-sm text-gray-500">
                        “{conversation.initial_message}”
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-10 min-w-28 shrink-0 items-center justify-center rounded-full border px-4 py-2 text-center text-xs font-bold ${statusClasses(
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

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              02
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black">
                Conversations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your existing message conversations
              </p>
            </div>
          </div>

          {otherConversations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-500">
              No other conversations yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
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
                    className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#fbb12c] hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Pet
                        </p>

                        <p className="mt-1 text-xl font-bold text-black">
                          {conversation.dog_name}
                        </p>

                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          {personLabel}
                        </p>

                        <p className="mt-1 text-gray-700">
                          {otherPerson}
                        </p>
                      </div>

                      <span
                        className={`inline-flex min-h-10 min-w-28 shrink-0 items-center justify-center rounded-full border px-4 py-2 text-center text-xs font-bold ${statusClasses(
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