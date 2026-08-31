"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useState, useTransition } from "react";
import {
  closeFoundReport,
  closeMissingDogReport,
  markFoundReportReunited,
  markMissingDogReunited,
} from "@/app/actions/report-management";
=======
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
>>>>>>> mapping-week

type ReportManagementProps = {
  reportId: string;
  status: string;
  reportType: "missing" | "found";
};

export default function ReportManagement({
  reportId,
  status,
  reportType,
}: ReportManagementProps) {
<<<<<<< HEAD
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const normalizedStatus = status.toLowerCase();
  const isClosed = normalizedStatus === "closed";
  const isReunited = normalizedStatus === "reunited";
  const editHref =
    reportType === "missing"
      ? `/dogs/${reportId}/edit`
      : `/sightings/${reportId}/edit`;

  function runAction(kind: "close" | "reunite") {
    const prompt =
      kind === "close"
        ? "Are you sure you want to close this report? It will no longer appear as active."
        : "Are you sure you want to mark this report as reunited?";

    if (!window.confirm(prompt)) return;

    startTransition(async () => {
      const result =
        reportType === "missing"
          ? kind === "close"
            ? await closeMissingDogReport(reportId)
            : await markMissingDogReunited(reportId)
          : kind === "close"
            ? await closeFoundReport(reportId)
            : await markFoundReportReunited(reportId);

      setMessage(result.message);
      if (result.success) window.location.reload();
    });
  }

  return (
    <section className="mt-6 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">
      <h3 className="text-xl font-bold">Manage Report</h3>
=======
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

>>>>>>> mapping-week
      <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
        Update your report or change its status.
      </p>

      {message && <p className="mt-3 text-sm text-[#fbb12c]">{message}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
<<<<<<< HEAD
        <Link
          href={editHref}
          className="rounded-md bg-[#078c78] px-5 py-3 font-bold text-white transition hover:bg-[#067966]"
=======

        {/* EDIT */}
        <Link
          href={`/dogs/${reportId}/edit`}
          className={`rounded-md bg-[#078c78] px-5 py-3 font-bold text-white transition hover:bg-[#067966] ${
            loading
              ? "pointer-events-none opacity-50"
              : ""
          }`}
>>>>>>> mapping-week
        >
          Edit Report
        </Link>

<<<<<<< HEAD
        {!isClosed && !isReunited && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction("close")}
            className="rounded-md border border-[#fbb12c] px-5 py-3 font-bold text-[#fbb12c] transition hover:bg-[#fbb12c] hover:text-[#003d35] disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Close Report"}
          </button>
        )}

        {!isReunited && !isClosed && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction("reunite")}
            className="rounded-md border border-[#078c78] px-5 py-3 font-bold text-[#078c78] transition hover:bg-[#078c78] hover:text-white disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Mark Reunited"}
=======
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
>>>>>>> mapping-week
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
<<<<<<< HEAD
=======

>>>>>>> mapping-week
