"use client";

import { useEffect, useState } from "react";

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
  center?: [number, number];
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
  cityFieldName = "city",
  zipFieldName = "zip_code",
}: LocationPickerProps) {
  const [latitude, setLatitude] =
    useState(initialLatitude);

  const [longitude, setLongitude] =
    useState(initialLongitude);

  const [mapLatitude, setMapLatitude] =
    useState(initialLatitude);

  const [mapLongitude, setMapLongitude] =
    useState(initialLongitude);

  const [isLoadingLocation, setIsLoadingLocation] =
    useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [selectedCity, setSelectedCity] =
    useState("");

  const [selectedZip, setSelectedZip] =
    useState("");

  const [searchLocation, setSearchLocation] =
    useState("");

  function updateInputValue(
    fieldName: string,
    value: string,
  ) {
    const selector =
      'input[name="' +
      fieldName +
      '"]';

    const input =
      document.querySelector<HTMLInputElement>(
        selector,
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

  async function reverseGeocode(
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

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Unable to find the selected location.",
        );
      }

      const data =
        (await response.json()) as MapboxResponse;

      const features =
        data.features ?? [];

      if (features.length === 0) {
        return;
      }

      const placeFeature =
        features.find((feature) =>
          feature.place_type?.includes("place"),
        );

      const localityFeature =
        features.find((feature) =>
          feature.place_type?.includes("locality"),
        );

      const postcodeFeature =
        features.find((feature) =>
          feature.place_type?.includes("postcode"),
        );

      const regionFeature =
        features.find((feature) =>
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
              item.id?.startsWith(
                "postcode.",
              ),
            );

          if (postcodeContext?.text) {
            zip =
              postcodeContext.text;

            break;
          }
        }
      }

      let cityState = "";

      if (city && state) {
        cityState =
          city + ", " + state;
      } else if (city) {
        cityState = city;
      } else {
        cityState = state;
      }

      setSelectedLocation(
        cityState,
      );

      setSelectedCity(
        city,
      );

      setSelectedZip(
        zip,
      );

      updateInputValue(
        locationFieldName,
        cityState,
      );

      updateInputValue(
        cityFieldName,
        city,
      );

      updateInputValue(
        zipFieldName,
        zip,
      );
    } catch (error) {
      console.error(
        "Mapbox reverse geocoding failed:",
        error,
      );
    } finally {
      setIsLoadingLocation(
        false,
      );
    }
  }

  async function geocodeLocation(
    location: string,
  ) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error(
        "NEXT_PUBLIC_MAPBOX_TOKEN is not configured.",
      );

      return;
    }

    if (!location.trim()) {
      return;
    }

    try {
      const encodedLocation =
        encodeURIComponent(
          location,
        );

      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodedLocation +
        ".json?access_token=" +
        token +
        "&limit=1";

      const response =
        await fetch(url);

      if (!response.ok) {
        return;
      }

      const data =
        (await response.json()) as MapboxResponse;

      const feature =
        data.features?.[0];

      if (
        !feature ||
        !feature.center
      ) {
        return;
      }

      const lng =
        feature.center[0];

      const lat =
        feature.center[1];

      setLatitude(
        lat,
      );

      setLongitude(
        lng,
      );

      setMapLatitude(
        lat,
      );

      setMapLongitude(
        lng,
      );

      await reverseGeocode(
        lat,
        lng,
      );
    } catch (error) {
      console.error(
        "Mapbox location search failed:",
        error,
      );
    }
  }

  function handleMapClick(
    event: MapMouseEvent,
  ) {
    const lng =
      event.lngLat.lng;

    const lat =
      event.lngLat.lat;

    setLatitude(
      lat,
    );

    setLongitude(
      lng,
    );

    reverseGeocode(
      lat,
      lng,
    );
  }

  useEffect(() => {
    const selector =
      'input[name="' +
      locationFieldName +
      '"]';

    const input =
      document.querySelector<HTMLInputElement>(
        selector,
      );

    if (!input) {
      return;
    }

    let timeoutId:
      | ReturnType<
          typeof setTimeout
        >
      | undefined;

    function handleLocationInput() {
      const value =
        input.value.trim();

      setSearchLocation(
        value,
      );

      if (timeoutId) {
        clearTimeout(
          timeoutId,
        );
      }

      if (
        value.length < 3
      ) {
        return;
      }

      timeoutId =
        setTimeout(() => {
          geocodeLocation(
            value,
          );
        }, 800);
    }

    input.addEventListener(
      "input",
      handleLocationInput,
    );

    return () => {
      input.removeEventListener(
        "input",
        handleLocationInput,
      );

      if (timeoutId) {
        clearTimeout(
          timeoutId,
        );
      }
    };
  }, [
    locationFieldName,
  ]);

  return (
    <div className="md:col-span-2">
      <div className="overflow-hidden rounded-xl border border-[#1b5b51]">
        <Map
          key={
            mapLatitude +
            "-" +
            mapLongitude
          }
          initialViewState={{
            longitude:
              mapLongitude,
            latitude:
              mapLatitude,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={
            process.env
              .NEXT_PUBLIC_MAPBOX_TOKEN
          }
          style={{
            width: "100%",
            height: "450px",
          }}
          onClick={
            handleMapClick
          }
        >
          <NavigationControl
            position="top-right"
          />

          <GeolocateControl
            position="top-right"
            trackUserLocation
          />

          <Marker
            longitude={
              longitude
            }
            latitude={
              latitude
            }
            anchor="bottom"
          >
            <div className="text-3xl">
              📍
            </div>
          </Marker>
        </Map>
      </div>

      <p className="mt-3 text-sm text-[#b7d5ce]">
        Type a location above or click the map
        to select the location.
      </p>

      {isLoadingLocation ? (
        <p className="mt-1 text-sm font-semibold text-[#fbb12c]">
          Finding location...
        </p>
      ) : selectedLocation ? (
        <p className="mt-1 text-sm font-semibold text-[#fbb12c]">
          📍 {selectedLocation}

          {selectedZip
            ? " • " +
              selectedZip
            : ""}
        </p>
      ) : searchLocation ? (
        <p className="mt-1 text-sm text-[#b7d5ce]">
          Searching for{" "}
          {searchLocation}...
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
        readOnly
      />

      <input
        type="hidden"
        name="longitude"
        value={longitude}
        readOnly
      />

      <input
        type="hidden"
        name={cityFieldName}
        value={selectedCity}
        readOnly
      />

      <input
        type="hidden"
        name={zipFieldName}
        value={selectedZip}
        readOnly
      />
    </div>
  );
}