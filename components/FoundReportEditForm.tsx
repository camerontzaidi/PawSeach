"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";
import { updateFoundAnimalReport } from "@/app/actions/report-management";
import type { FoundReportRecord } from "@/lib/reports/data";

const inputStyle = "w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white focus:border-[#fbb12c] focus:outline-none";

export default function FoundReportEditForm({ report }: { report: FoundReportRecord }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateFoundAnimalReport(report.id, formData);
      setMessage(result.message);
      if (result.success) router.push(`/sightings/${report.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {message && <p className="rounded-lg border border-[#1b5b51] p-4 text-[#fbb12c]">{message}</p>}
      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <h2 className="mb-5 text-2xl font-bold">Animal Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="breed" defaultValue={report.breed ?? ""} placeholder="Breed" className={inputStyle} />
          <input name="color" required defaultValue={report.color} placeholder="Color" className={inputStyle} />
          <select name="size" defaultValue={report.size} className={inputStyle}><option value="unknown">Unknown size</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select>
          <select name="collar" defaultValue={report.collar_status} className={inputStyle}><option value="unsure">Unsure about collar</option><option value="yes">Collar</option><option value="no">No collar</option></select>
        </div>
      </section>
      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <h2 className="mb-5 text-2xl font-bold">Found Location</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="dateFound" type="date" required defaultValue={report.found_at} className={inputStyle} />
          <input name="city" required defaultValue={report.city} placeholder="City, State" className={inputStyle} />
          <input name="zip" required defaultValue={report.zip_code} placeholder="ZIP" className={inputStyle} />
          <div className="md:col-span-2"><LocationPicker initialLatitude={Number(report.latitude ?? 37.5485)} initialLongitude={Number(report.longitude ?? -121.9886)} cityFieldName="city" zipFieldName="zip" /></div>
        </div>
      </section>
      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <textarea name="description" rows={6} defaultValue={report.details ?? ""} placeholder="Additional details" className={inputStyle} />
      </section>
      <button disabled={isPending} className="w-full rounded-md bg-[#fbb12c] px-8 py-4 text-lg font-bold text-[#003d35] disabled:opacity-60">{isPending ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}
