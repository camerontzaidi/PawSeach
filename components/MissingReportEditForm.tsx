"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";
import { updateMissingDogReport } from "@/app/actions/report-management";
import type { MissingReportRecord } from "@/lib/reports/data";

const inputStyle = "w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white focus:border-[#fbb12c] focus:outline-none";

export default function MissingReportEditForm({ report }: { report: MissingReportRecord }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateMissingDogReport(report.id, formData);
      setMessage(result.message);
      if (result.success) router.push(`/dogs/${report.id}`);
    });
  }

  const lastSeen = report.last_seen_at ? new Date(report.last_seen_at).toISOString().slice(0, 16) : "";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {message && <p className="rounded-lg border border-[#1b5b51] p-4 text-[#fbb12c]">{message}</p>}
      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <h2 className="mb-5 text-2xl font-bold">Pet Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="dogName" required defaultValue={report.dog_name} placeholder="Dog name" className={inputStyle} />
          <input name="breed" defaultValue={report.breed ?? ""} placeholder="Breed" className={inputStyle} />
          <input name="primaryColor" required defaultValue={report.primary_color ?? ""} placeholder="Primary color" className={inputStyle} />
          <input name="secondaryColor" defaultValue={report.secondary_color ?? ""} placeholder="Secondary color" className={inputStyle} />
          <select name="sex" defaultValue={report.sex ?? "unknown"} className={inputStyle}><option value="unknown">Unknown sex</option><option value="male">Male</option><option value="female">Female</option></select>
          <select name="size" defaultValue={report.size ?? "unknown"} className={inputStyle}><option value="unknown">Unknown size</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select>
          <input name="estimatedBirthYear" type="number" defaultValue={report.estimated_birth_year ?? ""} placeholder="Estimated birth year" className={inputStyle} />
          <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3"><input name="microchipped" type="checkbox" defaultChecked={Boolean(report.microchipped)} /> Microchipped</label>
        </div>
      </section>

      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <h2 className="mb-5 text-2xl font-bold">Last Seen</h2>
        <input name="lastSeenAt" type="datetime-local" required defaultValue={lastSeen} className={inputStyle} />
        <label className="mt-4 flex items-center gap-3"><input name="timeIsApproximate" type="checkbox" defaultChecked={Boolean(report.time_is_approximate)} /> Time is approximate</label>
        <input name="locationDescription" required defaultValue={report.location_description ?? ""} placeholder="Location description" className={`${inputStyle} mt-4`} />
        <div className="mt-4"><LocationPicker initialLatitude={Number(report.latitude ?? 37.5485)} initialLongitude={Number(report.longitude ?? -121.9886)} locationFieldName="locationDescription" /></div>
      </section>

      <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
        <textarea name="description" rows={4} defaultValue={report.description ?? ""} placeholder="Description" className={inputStyle} />
        <textarea name="circumstances" rows={4} defaultValue={report.circumstances ?? ""} placeholder="What happened?" className={`${inputStyle} mt-4`} />
        <label className="mt-4 flex items-center gap-3"><input name="rewardOffered" type="checkbox" defaultChecked={Boolean(report.reward_offered)} /> Reward offered</label>
        <input name="rewardAmount" type="number" min="0" step="0.01" defaultValue={report.reward_amount ?? ""} placeholder="Reward amount" className={`${inputStyle} mt-4`} />
      </section>

      <button disabled={isPending} className="w-full rounded-md bg-[#fbb12c] px-8 py-4 text-lg font-bold text-[#003d35] disabled:opacity-60">{isPending ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}
