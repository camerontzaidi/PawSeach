import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FoundReportEditForm from "@/components/FoundReportEditForm";
import { getCurrentUserId, getFoundReport } from "@/lib/reports/data";

export default async function EditFoundReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, userId] = await Promise.all([getFoundReport(id), getCurrentUserId()]);
  if (!userId) redirect("/login");
  if (!result) notFound();
  if (result.report.reporter_id !== userId) redirect(`/sightings/${id}`);

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href={`/sightings/${id}`} className="text-sm font-semibold text-[#b7d5ce] hover:text-[#fbb12c]">← Back to Report</Link>
        <h1 className="mt-6 text-4xl font-bold">Edit Found Animal Report</h1>
        <p className="mt-3 text-[#b7d5ce]">Update the report using its current Supabase values.</p>
        <FoundReportEditForm report={result.report} />
      </div>
    </main>
  );
}
