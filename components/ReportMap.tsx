"use client";

import { useState } from "react";
import Link from "next/link";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type Report = {
  id: string;
  name: string;
  breed: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "Missing";
};

type ReportMapProps = {
  reports: Report[];
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
};

const DEFAULT_CENTER = {
  latitude: 39.8283,
  longitude: -98.5795,
};

export default function ReportMap({
  reports,
  center = DEFAULT_CENTER,
  zoom = 4,
}: ReportMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-8 text-center">
        <h2 className="text-xl font-bold text-white">
          Map unavailable
        </h2>
        <p className="mt-2 text-sm text-[#b7d5ce]">
          PawSearch could not load the map because the Mapbox access token is
          not configured.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1b5b51]">
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom,
        }}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{
          width: "100%",
          height: "600px",
        }}
        reuseMaps
      >
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
              aria-label={`Missing pet: ${report.name}`}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-red-600 text-lg font-bold text-white shadow-lg transition hover:scale-125"
            >
              🐕
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
              <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                Missing
              </span>

              <h2 className="mt-2 text-lg font-bold">
                {selectedReport.name}
              </h2>

              <p className="mt-1 text-sm">
                {selectedReport.breed}
              </p>

              <p className="mt-2 text-sm">
                📍 {selectedReport.location}
              </p>

              <Link
                href={`/dogs/${selectedReport.id}`}
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
