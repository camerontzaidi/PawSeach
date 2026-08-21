"use client";

import { useState } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type LocationPickerProps = {
  initialLatitude?: number;
  initialLongitude?: number;
  locationFieldName?: string;
  cityFieldName?: string;
  zipFieldName?: string;
};

type MapboxFeature = {
  id?: string;
  place_type?: string[];
  text?: string;
  place_name?: string;
  properties?: {
    short_code?: string;
  };
  context?: {
    id?: string;
    text?: string;
  }[];
};

type MapboxResponse = {
  features?: MapboxFeature[];
};

export default function LocationPicker({
  initialLatitude = 37.5485,
  initialLongitude = -121.9886,
  locationFieldName = "locationDescription",
  cityFieldName,
  zipFieldName,
}: LocationPickerProps) {
  const [latitude, setLatitude] =
    useState(initialLatitude);

  const [longitude, setLongitude] =
    useState(initialLongitude);

  const [isLoadingLocation, setIsLoadingLocation] =
    useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  async function updateLocationFields(
    lat: number,
    lng: number,
  ) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error(
        "NEXT_PUBLIC_MAPBOX_TOKEN is not configured.",
      );
      return;
    }

    setIsLoadingLocation(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=address,place,locality,postcode,region`,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to find the selected location.",
        );
      }

      const data =
        (await response.json()) as MapboxResponse;

      const features = data.features ?? [];

      if (features.length === 0) {
        setSelectedLocation("");
        return;
      }

      let city = "";
      let state = "";
      let zip = "";

      const placeFeature = features.find((feature) =>
        feature.place_type?.includes("place"),
      );

      const localityFeature = features.find((feature) =>
        feature.place_type?.includes("locality"),
      );

      const postcodeFeature = features.find((feature) =>
        feature.place_type?.includes("postcode"),
      );

      const regionFeature = features.find((feature) =>
        feature.place_type?.includes("region"),
      );

      city =
        placeFeature?.text ??
        localityFeature?.text ??
        "";

      state =
        regionFeature?.text ??
        "";

      zip =
        postcodeFeature?.text ??
        "";

      if (!zip) {
        const postcodeContext =
          features.find((feature) =>
            feature.context?.some((item) =>
              item.id?.startsWith("postcode."),
            ),
          );

        const postcodeFromContext =
          postcodeContext?.context?.find((item) =>
            item.id?.startsWith("postcode."),
          );

        zip =
          postcodeFromContext?.text ??
          "";
      }

      const location =
        city && state
          ? `${city}, ${state}`
          : city || state;

      setSelectedLocation(location);

      updateInputValue(
        locationFieldName,
        location,
      );

      if (cityFieldName) {
        updateInputValue(
          cityFieldName,
          city,
        );
      }

      if (zipFieldName) {
        updateInputValue(
          zipFieldName,
          zip,
        );
      }
    } catch (error) {
      console.error(
        "Mapbox reverse geocoding failed:",
        error,
      );

      setSelectedLocation("");
    } finally {
      setIsLoadingLocation(false);
    }
  }

  function updateInputValue(
    fieldName: string,
    value: string,
  ) {
    const input =
      document.querySelector<HTMLInputElement>(
        `input[name="${fieldName}"]`,
      );

    if (!input) {
      return;
    }

    input.value = value;

    input.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  }

  function handleMapClick(event: any) {
    const { lng, lat } = event.lngLat;

    setLatitude(lat);
    setLongitude(lng);

    updateLocationFields(lat, lng);
  }

  return (
    <div className="md:col-span-2">
      <div className="overflow-hidden rounded-xl border border-[#1b5b51]">
        <Map
          initialViewState={{
            longitude: initialLongitude,
            latitude: initialLatitude,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          }
          style={{
            width: "100%",
            height: "450px",
          }}
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" />

          <GeolocateControl
            position="top-right"
            trackUserLocation
          />

          <Marker
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <div className="text-3xl">
              📍
            </div>
          </Marker>
        </Map>
      </div>

      <p className="mt-3 text-sm text-[#b7d5ce]">
        Click the map to select the location.
      </p>

      {isLoadingLocation ? (
        <p className="mt-1 text-sm font-semibold text-[#fbb12c]">
          Finding location...
        </p>
      ) : selectedLocation ? (
        <p className="mt-1 text-sm font-semibold text-[#fbb12c]">
          📍 {selectedLocation}
          {zipFieldName && (
            <>
              {" "}
              {document.querySelector<HTMLInputElement>(
                `input[name="${zipFieldName}"]`,
              )?.value
                ? `• ${
                    document.querySelector<HTMLInputElement>(
                      `input[name="${zipFieldName}"]`,
                    )?.value
                  }`
                : ""}
            </>
          )}
        </p>
      ) : (
        <p className="mt-1 text-sm text-[#b7d5ce]">
          No location selected yet.
        </p>
      )}

      <input
        type="hidden"
        name="latitude"
        value={latitude}
      />

      <input
        type="hidden"
        name="longitude"
        value={longitude}
      />
    </div>
  );
}