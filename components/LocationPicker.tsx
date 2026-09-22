"use client";

import { useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  type MapMouseEvent,
  type MapRef,
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
  const mapRef = useRef<MapRef | null>(null);

  const [latitude, setLatitude] =
    useState(initialLatitude);

  const [longitude, setLongitude] =
    useState(initialLongitude);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [selectedCity, setSelectedCity] =
    useState("");

  const [selectedZip, setSelectedZip] =
    useState("");

  const [hasSelectedLocation, setHasSelectedLocation] =
    useState(false);

  const [isLoadingLocation, setIsLoadingLocation] =
    useState(false);

  function getContextValue(
    feature: MapboxFeature,
    type: string,
  ) {
    if (feature.place_type?.includes(type)) {
      return feature.text ?? "";
    }

    const contextItem = feature.context?.find((item) =>
      item.id?.startsWith(`${type}.`),
    );

    return contextItem?.text ?? "";
  }

  async function getReverseGeocode(
    lat: number,
    lng: number,
    type: "address" | "place" | "locality" | "postcode",
  ) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      return null;
    }

    const url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      `${lng},${lat}` +
      `.json?access_token=${encodeURIComponent(token)}` +
      `&types=${type}` +
      "&limit=1";

    const response = await fetch(url);

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        `Mapbox ${type} lookup failed:`,
        response.status,
        errorText,
      );

      return null;
    }

    const data =
      (await response.json()) as MapboxResponse;

    return data.features?.[0] ?? null;
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
      /*
       * Get the closest address.
       */
      const addressFeature =
        await getReverseGeocode(
          lat,
          lng,
          "address",
        );

      /*
       * Get the city/place.
       */
      const placeFeature =
        await getReverseGeocode(
          lat,
          lng,
          "place",
        );

      /*
       * Some locations use locality instead
       * of place.
       */
      const localityFeature =
        placeFeature ??
        (await getReverseGeocode(
          lat,
          lng,
          "locality",
        ));

      /*
       * Get the ZIP independently.
       */
      const postcodeFeature =
        await getReverseGeocode(
          lat,
          lng,
          "postcode",
        );

      /*
       * Determine city.
       */
      const city =
        getContextValue(
          addressFeature ?? {},
          "place",
        ) ||
        getContextValue(
          addressFeature ?? {},
          "locality",
        ) ||
        getContextValue(
          localityFeature ?? {},
          "place",
        ) ||
        getContextValue(
          localityFeature ?? {},
          "locality",
        ) ||
        localityFeature?.text ||
        "";

      /*
       * Determine state.
       */
      const state =
        getContextValue(
          addressFeature ?? {},
          "region",
        ) ||
        getContextValue(
          localityFeature ?? {},
          "region",
        );

      /*
       * Determine ZIP.
       */
      const zip =
        postcodeFeature?.text ??
        getContextValue(
          addressFeature ?? {},
          "postcode",
        ) ??
        "";

      /*
       * Build the location label.
       */
      let locationLabel = "";

      if (city && state && zip) {
        locationLabel = `${city}, ${state} ${zip}`;
      } else if (city && state) {
        locationLabel = `${city}, ${state}`;
      } else if (city && zip) {
        locationLabel = `${city} ${zip}`;
      } else if (city) {
        locationLabel = city;
      } else {
        locationLabel = "Selected map location";
      }

      setSelectedLocation(locationLabel);
      setSelectedCity(city);
      setSelectedZip(zip);

      /*
       * Keep the selected coordinates exactly
       * where the user clicked.
       */
      setLatitude(lat);
      setLongitude(lng);

      /*
       * Zoom slightly closer after selection.
       */
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 700,
      });
    } catch (error) {
      console.error(
        "Mapbox reverse geocoding failed:",
        error,
      );

      /*
       * The coordinates are still valid even if
       * reverse geocoding fails.
       */
      setSelectedLocation(
        "Selected map location",
      );

      setSelectedCity("");
      setSelectedZip("");
    } finally {
      setIsLoadingLocation(false);
    }
  }

  function handleMapClick(
    event: MapMouseEvent,
  ) {
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;

    /*
     * Save the exact location immediately.
     */
    setLatitude(lat);
    setLongitude(lng);

    /*
     * The user has now selected a location.
     */
    setHasSelectedLocation(true);

    /*
     * Clear the previous location while
     * the new one is being looked up.
     */
    setSelectedLocation("");
    setSelectedCity("");
    setSelectedZip("");

    void reverseGeocode(lat, lng);
  }

  return (
    <div className="relative md:col-span-2">
      <div className="mb-3">
        <label className="block text-sm font-semibold text-black">
          Last Seen Location *
        </label>

        <p className="mt-1 text-sm leading-6 text-gray-600">
          Click the map to select where your pet was
          last seen.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white">
        <Map
          ref={mapRef}
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
          scrollZoom={true}
          dragPan={true}
          dragRotate={false}
          doubleClickZoom={true}
          touchZoomRotate={true}
          keyboard={true}
        >
          <NavigationControl
            position="top-right"
            showCompass={false}
            showZoom={false}
          />

          <GeolocateControl
            position="top-right"
            trackUserLocation
          />

          {hasSelectedLocation && (
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <div className="text-3xl">
                📍
              </div>
            </Marker>
          )}
        </Map>

        <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
          <button
            type="button"
            onClick={() =>
              mapRef.current?.zoomIn({
                duration: 250,
              })
            }
            className="flex h-10 w-10 items-center justify-center border-b border-gray-200 text-xl font-bold text-black transition hover:bg-gray-100"
            aria-label="Zoom in"
          >
            +
          </button>

          <button
            type="button"
            onClick={() =>
              mapRef.current?.zoomOut({
                duration: 250,
              })
            }
            className="flex h-10 w-10 items-center justify-center text-xl font-bold text-black transition hover:bg-gray-100"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      {isLoadingLocation && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm font-medium text-gray-500">
            Finding the selected location...
          </p>
        </div>
      )}

      {!hasSelectedLocation &&
        !isLoadingLocation && (
          <div className="mt-3 rounded-xl border border-gray-300 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-black">
              📍 Select a location on the map
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Click the map to select the location
              where your pet was last seen.
            </p>
          </div>
        )}

      {hasSelectedLocation &&
        !isLoadingLocation && (
          <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-black">
              📍{" "}
              {selectedLocation ||
                "Selected map location"}
            </p>

            {!selectedZip && (
              <p className="mt-1 text-xs text-gray-500">
                ZIP code could not be determined for
                this exact location.
              </p>
            )}
          </div>
        )}

      <input
        type="hidden"
        name={locationFieldName}
        value={selectedLocation}
        required
        readOnly
      />

      <input
        type="hidden"
        name={cityFieldName}
        value={selectedCity}
        required
        readOnly
      />

      <input
        type="hidden"
        name={zipFieldName}
        value={selectedZip}
        required
        readOnly
      />

      <input
        type="hidden"
        name="latitude"
        value={latitude}
        required
        readOnly
      />

      <input
        type="hidden"
        name="longitude"
        value={longitude}
        required
        readOnly
      />
    </div>
  );
}