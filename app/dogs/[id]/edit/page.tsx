import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MissingReportEditForm from "@/components/MissingReportEditForm";
import { getCurrentUserId, getMissingReport } from "@/lib/reports/data";

export default async function EditDogReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, userId] = await Promise.all([getMissingReport(id), getCurrentUserId()]);
  if (!userId) redirect("/login");
  if (!result) notFound();
  if (result.report.owner_id !== userId) redirect(`/dogs/${id}`);

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href={`/dogs/${id}`} className="text-sm font-semibold text-[#b7d5ce] hover:text-[#fbb12c]">← Back to Report</Link>
        <h1 className="mt-6 text-4xl font-bold">Edit Missing Pet Report</h1>
        <p className="mt-3 text-[#b7d5ce]">This form is prepopulated from Supabase and saves through the owner-protected backend action.</p>
        <MissingReportEditForm report={result.report} />
      </div>
    </main>
  );
}
