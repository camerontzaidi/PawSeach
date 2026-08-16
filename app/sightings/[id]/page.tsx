import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type FoundReport = {
  id: string;
  breed: string | null;
  color: string;
  size: string;
  collar_status: string;
  found_at: string;
  city: string;
  zip_code: string;
  details: string | null;
  status: string;
};

type FoundPhoto = {
  storage_path: string;
  is_primary: boolean;
};

export default async function FoundDogReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("found_reports")
    .select(
      "id, breed, color, size, collar_status, found_at, city, zip_code, details, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const report = data as FoundReport;

  const { data: photoRows } = await supabase
    .from("found_report_photos")
    .select("storage_path, is_primary")
    .eq("found_report_id", id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  const photos = ((photoRows ?? []) as FoundPhoto[]).map((photo) => {
    const { data: publicUrl } = supabase.storage
      .from("found-report-photos")
      .getPublicUrl(photo.storage_path);
    return publicUrl.publicUrl;
  });

  const primaryPhoto = photos[0];

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Found Dog Report</h1>
        <p className="mt-2 text-[#b7d5ce]">
          Help reunite this pet with their family.
        </p>

        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
          <div
            className="flex h-80 items-center justify-center rounded-lg bg-[#003d35] bg-contain bg-center bg-no-repeat text-6xl"
            style={
              primaryPhoto
                ? { backgroundImage: `url(${primaryPhoto})` }
                : undefined
            }
          >
            {!primaryPhoto && "🐕"}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold">
                {report.breed || "Unknown breed"}
              </h2>
              <p className="mt-1 text-[#b7d5ce]">
                {report.color} · {report.size}
              </p>
            </div>

            <span className="h-fit rounded-full bg-[#078c78] px-4 py-2 font-bold text-white">
              {report.status.replaceAll("_", " ")}
            </span>
          </div>

          <div className="mt-8 rounded-lg border border-[#1b5b51] p-5">
            <h3 className="text-xl font-bold">Animal Information</h3>
            <div className="mt-4 space-y-2 text-[#c3ded8]">
              <p>Color: {report.color}</p>
              <p>Approximate size: {report.size}</p>
              <p>Collar: {report.collar_status}</p>
              {report.details && <p>{report.details}</p>}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
            <h3 className="text-xl font-bold">Found Information</h3>
            <div className="mt-4 space-y-3 text-[#c3ded8]">
              <p>
                📅 Date Found:{" "}
                {new Date(`${report.found_at}T00:00:00`).toLocaleDateString()}
              </p>
              <p>
                📍 Location: {report.city}, {report.zip_code}
              </p>
            </div>
          </div>

          {photos.length > 1 && (
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
              <h3 className="text-xl font-bold">Additional Photos</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {photos.slice(1).map((photoUrl) => (
                  <div
                    key={photoUrl}
                    className="h-48 rounded-lg bg-[#003d35] bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${photoUrl})` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
            <h3 className="text-xl font-bold">Think This Is Your Dog?</h3>
            <p className="mt-3 text-[#c3ded8]">
              Contact and ownership verification will be added as a separate
              workflow. Do not send reward money or sensitive information
              based only on an unverified ownership claim.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
