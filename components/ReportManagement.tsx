"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ReportManagementProps = {
  reportId: string;
  status: string;
};

export default function ReportManagement({
  reportId,
  status,
}: ReportManagementProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const normalizedStatus = status.toLowerCase();

  const isClosed = normalizedStatus === "closed";
  const isFound =
    normalizedStatus === "found" ||
    normalizedStatus === "reunited";

  // --------------------------------------------------
  // MARK REUNITED / FOUND
  // --------------------------------------------------

  const handleMarkReunited = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this pet as reunited?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.alert("You must be logged in.");
        return;
      }

      const { error } = await supabase
        .from("dogs")
        .update({
          status: "reunited",
        })
        .eq("id", reportId);

      if (error) {
        console.error("MARK REUNITED ERROR:", error);

        window.alert(
          `Unable to mark the pet as reunited.\n\n${error.message}`
        );

        return;
      }

      // Tell the user exactly what happened
      window.alert("Moved to Found section.");

      // Refresh the page so the new status appears
      router.refresh();

    } catch (error) {
      console.error("MARK REUNITED ERROR:", error);

      window.alert(
        "Something went wrong while updating the report."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CLOSE REPORT
  // --------------------------------------------------

  const handleCloseReport = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to close this report?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.alert("You must be logged in.");
        return;
      }

      const { error } = await supabase
        .from("dogs")
        .update({
          status: "closed",
        })
        .eq("id", reportId);

      if (error) {
        console.error("CLOSE REPORT ERROR:", error);

        window.alert(
          `Unable to close the report.\n\n${error.message}`
        );

        return;
      }

      window.alert("Moved to Closed section.");

      router.refresh();

    } catch (error) {
      console.error("CLOSE REPORT ERROR:", error);

      window.alert(
        "Something went wrong while closing the report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">

      <h3 className="text-xl font-bold">
        Manage Report
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
        Update or change the status of your report.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">

        {/* EDIT */}
        <Link
          href={`/dogs/${reportId}/edit`}
          className={`rounded-md bg-[#078c78] px-5 py-3 font-bold text-white transition hover:bg-[#067966] ${
            loading
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          Edit Report
        </Link>

        {/* CLOSE REPORT */}
        {!isClosed && (
          <button
            type="button"
            onClick={handleCloseReport}
            disabled={loading}
            className="rounded-md border border-[#fbb12c] px-5 py-3 font-bold text-[#fbb12c] transition hover:bg-[#fbb12c] hover:text-[#003d35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Close Report"}
          </button>
        )}

        {/* MARK REUNITED */}
        {!isFound && !isClosed && (
          <button
            type="button"
            onClick={handleMarkReunited}
            disabled={loading}
            className="rounded-md border border-[#078c78] px-5 py-3 font-bold text-[#078c78] transition hover:bg-[#078c78] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Mark Reunited"}
          </button>
        )}

      </div>

      {/* CURRENT STATUS */}

      <div className="mt-5 border-t border-[#1b5b51] pt-5">

        <p className="text-sm text-[#9bbab3]">
          Current status
        </p>

        <p className="mt-1 font-bold capitalize text-[#c3ded8]">
          {normalizedStatus.replaceAll("_", " ")}
        </p>

      </div>

    </section>
  );
}

