"use client";

import { useState } from "react";

import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  type MapMouseEvent,
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
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedZip, setSelectedZip] = useState("");

  function updateInputValue(fieldName: string, value: string) {
    const selector = 'input[name="' + fieldName + '"]';

    const input =
      document.querySelector<HTMLInputElement>(selector);

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
      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        lng +
        "," +
        lat +
        ".json?access_token=" +
        token +
        "&types=address,place,locality,postcode,region";

      const response = await fetch(url);

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
        setSelectedZip("");
        return;
      }

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

      const city =
        placeFeature?.text ??
        localityFeature?.text ??
        "";

      const state =
        regionFeature?.text ??
        "";

      let zip =
        postcodeFeature?.text ??
        "";

      if (!zip) {
        for (const feature of features) {
          const postcodeContext =
            feature.context?.find((item) =>
              item.id?.startsWith("postcode."),
            );

          if (postcodeContext?.text) {
            zip = postcodeContext.text;
            break;
          }
        }
      }

      const cityState =
        city && state
          ? city + ", " + state
          : city || state;

      setSelectedLocation(cityState);
      setSelectedZip(zip);

      /*
       * Missing-pet report:
       * locationDescription = City, State
       * zip = ZIP
       */

      if (locationFieldName) {
        updateInputValue(
          locationFieldName,
          cityState,
        );
      }

      /*
       * Found-pet report:
       * city = City, State
       * zip = ZIP
       */

      if (cityFieldName) {
        updateInputValue(
          cityFieldName,
          cityState,
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
      setSelectedZip("");
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

  function handleMapClick(event: MapMouseEvent) {
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
          {selectedZip
            ? " • " + selectedZip
            : ""}
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