"use client";

import { useState } from "react";

type ContactPetOwnerProps = {
dogName: string;
};

export default function ContactPetOwner({
dogName,
}: ContactPetOwnerProps) {
const [submitted, setSubmitted] =
useState(false);

function handleSubmit(
event: React.FormEvent<HTMLFormElement>,
) {
event.preventDefault();


/*
 * UI ONLY FOR NOW.
 *
 * Later, this form can send the
 * message/contact request to Supabase.
 */

setSubmitted(true);


}

if (submitted) {
return ( <section className="mt-6 rounded-xl border border-[#078c78] bg-[#06483f] p-5 sm:p-6"> <div className="flex gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#078c78] text-2xl">
✓ </div>

```
      <div>
        <h3 className="text-xl font-bold">
          Contact information submitted
        </h3>

        <p className="mt-2 leading-relaxed text-[#c3ded8]">
          Thanks for reaching out about{" "}
          <span className="font-bold text-white">
            {dogName}
          </span>
          . The pet owner will be able to review your message.
        </p>

        <p className="mt-4 text-sm leading-relaxed text-[#b7d5ce]">
          Create a PawSearch account to communicate
          directly and securely within the app.
        </p>
      </div>
    </div>
  </section>
);


}

return ( <section className="mt-6 rounded-xl border border-[#fbb12c]/60 bg-[#06483f] p-5 sm:p-6"> <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"> <div> <div className="flex items-center gap-3"> <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbb12c] text-2xl text-[#003d35]">
💬 </div>


        <div>
          <h3 className="text-xl font-bold">
            Contact About This Pet
          </h3>

          <p className="mt-1 text-sm text-[#b7d5ce]">
            Have you seen {dogName} or have information
            that may help?
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-lg border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-sm sm:max-w-xs">
      <p className="font-bold text-[#fbb12c]">
        💬 Want to message securely?
      </p>

      <p className="mt-1 text-[#b7d5ce]">
        Create an account to communicate directly
        with pet owners inside PawSearch.
      </p>
    </div>
  </div>

  <form
    onSubmit={handleSubmit}
    className="mt-6 space-y-4"
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <input
        type="text"
        name="name"
        required
        placeholder="Your name *"
        className="rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none"
      />

      <input
        type="text"
        name="contact"
        required
        placeholder="Email or phone number *"
        className="rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none"
      />
    </div>

    <textarea
      name="message"
      required
      rows={5}
      placeholder={`Tell the owner what you know about ${dogName}...`}
      className="w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none"
    />

    <button
      type="submit"
      className="w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
    >
      Send Information
    </button>
  </form>

  <div className="mt-5 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
    <p className="text-sm leading-relaxed text-[#b7d5ce]">
      <span className="font-bold text-[#fbb12c]">
        PawSearch Messaging:
      </span>{" "}
      With a PawSearch account, you can securely send
      a message request to the pet owner without publicly
      sharing your personal contact information. The owner
      must accept your first message request before a
      conversation can continue.
    </p>
  </div>
</section>


);
}
