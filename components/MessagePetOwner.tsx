"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  createMessageRequest,
  type MessageRequestResult,
} from "@/app/messages/actions";

type MessagePetOwnerProps = {
  dogId: string;
  dogName: string;
  existingConversationId?: string | null;
  existingStatus?: "pending" | "accepted" | "declined" | null;
};

export default function MessagePetOwner({
  dogId,
  dogName,
  existingConversationId = null,
  existingStatus = null,
}: MessagePetOwnerProps) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<MessageRequestResult | null>(
    existingConversationId
      ? {
          success: true,
          message: "",
          conversationId: existingConversationId,
          status: existingStatus ?? "pending",
        }
      : null,
  );
  const [isPending, startTransition] = useTransition();

  const conversationId = result?.conversationId ?? existingConversationId;
  const status = result?.status ?? existingStatus;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = message.trim();
    if (!body) return;

    startTransition(async () => {
      const requestResult = await createMessageRequest(dogId, body);
      setResult(requestResult);
      if (requestResult.success) setMessage("");
    });
  }

  if (conversationId) {
    const accepted = status === "accepted";
    const declined = status === "declined";

    return (
      <section className="mt-6 rounded-xl border border-[#fbb12c]/60 bg-[#06483f] p-5 sm:p-6">
        <h3 className="text-xl font-bold">
          {accepted
            ? "Conversation Accepted"
            : declined
              ? "Message Request Declined"
              : "Message Request Sent"}
        </h3>

        <p className="mt-2 leading-relaxed text-[#c3ded8]">
          {accepted
            ? `The owner of ${dogName} accepted your request.`
            : declined
              ? `The owner of ${dogName} declined this request. No additional messages can be sent for this report.`
              : `Your one initial message about ${dogName} is waiting for the owner to review it.`}
        </p>

        {accepted && (
          <Link
            href={`/messages/${conversationId}`}
            className="mt-4 inline-block rounded-md bg-[#078c78] px-5 py-2.5 font-bold text-white"
          >
            Open Conversation →
          </Link>
        )}

        {!accepted && !declined && (
          <div className="mt-4 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
            <p className="font-semibold text-[#fbb12c]">Waiting for acceptance</p>
            <p className="mt-1 text-sm text-[#b7d5ce]">
              You cannot send a second message unless the owner accepts this request.
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-xl border border-[#078c78]/70 bg-[#06483f] p-5 sm:p-6">
      <h3 className="text-xl font-bold">💬 Message the Pet Owner</h3>
      <p className="mt-2 text-[#b7d5ce]">
        Have you seen {dogName} or have information that may help?
      </p>

      <div className="mt-5 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
        <p className="font-semibold text-[#fbb12c]">🛡️ Protected first message</p>
        <p className="mt-1 text-sm text-[#b7d5ce]">
          You may send one initial message request. The owner must accept it
          before additional messaging is enabled.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          minLength={2}
          maxLength={2000}
          rows={5}
          placeholder={`Tell the owner what you know about ${dogName}...`}
          className="w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white"
        />

        <button
          type="submit"
          disabled={!message.trim() || isPending}
          className="mt-4 w-full rounded-md bg-[#078c78] px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Message Request"}
        </button>
      </form>

      {result && !result.success && (
        <p className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
          {result.message}
        </p>
      )}
    </section>
  );
}
