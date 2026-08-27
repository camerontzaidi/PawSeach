"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Map, { Marker, Popup, useMap } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type Report = {
  id: string;
  name: string;
  breed: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "Missing" | "Found";
};

type ReportMapProps = {
  reports: Report[];
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
};

function MapUpdater({
  center,
  zoom,
}: {
  center: { latitude: number; longitude: number };
  zoom: number;
}) {
  const { current: map } = useMap();

  useEffect(() => {
    map?.flyTo({
      center: [center.longitude, center.latitude],
      zoom,
      duration: 1000,
    });
  }, [map, center, zoom]);

  return null;
}

export default function ReportMap({
  reports,
  center = {
    latitude: 39.8283,
    longitude: -98.5795,
  },
  zoom = 4,
}: ReportMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1b5b51]">
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom,
        }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{
          width: "100%",
          height: "600px",
        }}
      >
        <MapUpdater center={center} zoom={zoom} />

        {reports.map((report) => (
          <Marker
            key={report.id}
            longitude={report.longitude}
            latitude={report.latitude}
            anchor="bottom"
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setSelectedReport(report);
            }}
          >
            <button
              type="button"
              aria-label={
                report.status === "Missing"
                  ? `Missing pet: ${report.name}`
                  : `Found animal: ${report.name}`
              }
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white text-lg font-bold text-white shadow-lg transition hover:scale-125 ${
                report.status === "Missing"
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {report.status === "Missing" ? "🐕" : "🐾"}
            </button>
          </Marker>
        ))}

        {selectedReport && (
          <Popup
            longitude={selectedReport.longitude}
            latitude={selectedReport.latitude}
            anchor="top"
            onClose={() => setSelectedReport(null)}
            closeOnClick={false}
          >
            <div className="min-w-[200px] p-2 text-[#003d35]">
              <div className="mb-2">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                    selectedReport.status === "Missing"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedReport.status === "Missing"
                    ? "Missing"
                    : "Found"}
                </span>
              </div>

              <h2 className="text-lg font-bold">
                {selectedReport.name}
              </h2>

              <p className="mt-1 text-sm">
                {selectedReport.breed}
              </p>

              <p className="mt-2 text-sm">
                📍 {selectedReport.location}
              </p>

              <Link
                href={
                  selectedReport.status === "Missing"
                    ? `/dogs/${selectedReport.id}`
                    : `/sightings/${selectedReport.id}`
                }
                className="mt-3 inline-block rounded-md bg-[#078c78] px-4 py-2 text-sm font-bold text-white"
              >
                View Report →
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}