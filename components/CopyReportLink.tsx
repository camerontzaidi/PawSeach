"use client";

import { useState } from "react";

export default function CopyReportLink() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy report link:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-5 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
    >
      {copied ? "✓ Link Copied!" : "Copy Report Link"}
    </button>
  );
}