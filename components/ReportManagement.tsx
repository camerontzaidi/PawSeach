"use client";

import Link from "next/link";

type ReportManagementProps = {
  reportId: string;
  status: string;
};

export default function ReportManagement({
  reportId,
  status,
}: ReportManagementProps) {
  const handleCloseReport = () => {
    const confirmed = window.confirm(
      "Are you sure you want to close this report? This means the report is no longer active."
    );

    if (!confirmed) return;

    // TODO: Replace with the backend Close Report action
    console.log("Close report:", reportId);
  };

  const handleMarkReunited = () => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this pet as reunited?"
    );

    if (!confirmed) return;

    // TODO: Replace with the backend Mark Reunited action
    console.log("Mark report as reunited:", reportId);
  };

  const normalizedStatus = status.toLowerCase();

  const isClosed = normalizedStatus === "closed";
  const isReunited = normalizedStatus === "reunited";

  return (
    <section className="mt-6 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">
      <h3 className="text-xl font-bold">Manage Report</h3>

      <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
        Update or change the status of your report.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {/* Edit */}
        <Link
          href={`/dogs/${reportId}/edit`}
          className="rounded-md bg-[#078c78] px-5 py-3 font-bold text-white transition hover:bg-[#067966]"
        >
          Edit Report
        </Link>

        {/* Close Report */}
        {!isClosed && !isReunited && (
          <button
            type="button"
            onClick={handleCloseReport}
            className="rounded-md border border-[#fbb12c] px-5 py-3 font-bold text-[#fbb12c] transition hover:bg-[#fbb12c] hover:text-[#003d35]"
          >
            Close Report
          </button>
        )}

        {/* Mark Reunited */}
        {!isReunited && !isClosed && (
          <button
            type="button"
            onClick={handleMarkReunited}
            className="rounded-md border border-[#078c78] px-5 py-3 font-bold text-[#078c78] transition hover:bg-[#078c78] hover:text-white"
          >
            Mark Reunited
          </button>
        )}
      </div>
    </section>
  );
}