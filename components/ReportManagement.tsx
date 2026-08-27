"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  closeFoundReport,
  closeMissingDogReport,
  markFoundReportReunited,
  markMissingDogReunited,
} from "@/app/actions/report-management";

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
      <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
        Update your report or change its status.
      </p>

      {message && <p className="mt-3 text-sm text-[#fbb12c]">{message}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={editHref}
          className="rounded-md bg-[#078c78] px-5 py-3 font-bold text-white transition hover:bg-[#067966]"
        >
          Edit Report
        </Link>

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
          </button>
        )}
      </div>
    </section>
  );
}
