"use client";

import { useState } from "react";

type MessagePetOwnerProps = {
dogName: string;
};

export default function MessagePetOwner({
dogName,
}: MessagePetOwnerProps) {
const [messageRequestSent, setMessageRequestSent] =
useState(false);

const [message, setMessage] =
useState("");

function handleSubmit(
event: React.FormEvent<HTMLFormElement>,
) {
event.preventDefault();


if (!message.trim()) {
  return;
}

/*
 * UI ONLY FOR NOW.
 *
 * Later this will:
 *
 * 1. Create a message request.
 * 2. Prevent duplicate requests.
 * 3. Notify the pet owner.
 * 4. Wait for the owner to accept.
 */

setMessageRequestSent(true);


}

if (messageRequestSent) {
return ( <section className="mt-6 rounded-xl border border-[#fbb12c]/60 bg-[#06483f] p-5 sm:p-6"> <div className="flex gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fbb12c] text-2xl text-[#003d35]">
⏳ </div>

```
      <div>
        <h3 className="text-xl font-bold">
          Message Request Sent
        </h3>

        <p className="mt-2 leading-relaxed text-[#c3ded8]">
          Your message request about{" "}
          <span className="font-bold text-white">
            {dogName}
          </span>{" "}
          has been sent to the pet owner.
        </p>

        <div className="mt-4 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
          <p className="font-semibold text-[#fbb12c]">
            Waiting for acceptance
          </p>

          <p className="mt-1 text-sm leading-relaxed text-[#b7d5ce]">
            The pet owner must accept your first message
            request before the conversation can continue.
          </p>
        </div>

        <p className="mt-4 text-sm text-[#b7d5ce]">
          You can only send one initial message request
          for this report.
        </p>
      </div>
    </div>
  </section>
);


}

return ( <section className="mt-6 rounded-xl border border-[#078c78]/70 bg-[#06483f] p-5 sm:p-6"> <div className="flex items-start gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#078c78] text-2xl">
💬 </div>


    <div>
      <h3 className="text-xl font-bold">
        Message the Pet Owner
      </h3>

      <p className="mt-1 leading-relaxed text-[#b7d5ce]">
        Have you seen {dogName} or have information
        that may help bring them home?
      </p>
    </div>
  </div>

  <div className="mt-5 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
    <p className="font-semibold text-[#fbb12c]">
      🛡️ Protected first message
    </p>

    <p className="mt-1 text-sm leading-relaxed text-[#b7d5ce]">
      Your first message is sent as a request. The pet
      owner must accept it before either person can
      continue the conversation.
    </p>
  </div>

  <form
    onSubmit={handleSubmit}
    className="mt-5"
  >
    <label
      htmlFor="message"
      className="mb-2 block text-sm font-semibold text-[#c3ded8]"
    >
      Your message
    </label>

    <textarea
      id="message"
      value={message}
      onChange={(event) =>
        setMessage(event.target.value)
      }
      required
      rows={5}
      placeholder={`Tell the owner what you know about ${dogName}...`}
      className="w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none"
    />

    <button
      type="submit"
      disabled={!message.trim()}
      className="mt-4 w-full rounded-md bg-[#078c78] px-6 py-3 font-bold text-white transition hover:bg-[#067966] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Send Message Request
    </button>
  </form>

  <p className="mt-4 text-center text-sm text-[#b7d5ce]">
    To reduce spam, you can send only one initial message
    request unless the pet owner accepts the conversation.
  </p>
</section>


);
}
