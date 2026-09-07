"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedZip, setSelectedZip] =
    useState("");

  const [searchLocation, setSearchLocation] =
    useState("");

  const [suggestions, setSuggestions] =
    useState<MapboxFeature[]>([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const searchTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  function getContextValue(
    feature: MapboxFeature,
    type: string,
  ) {
    if (feature.place_type?.includes(type)) {
      return feature.text ?? "";
    }

    const contextItem = feature.context?.find(
      (item) =>
        item.id?.startsWith(`${type}.`),
    );

    return contextItem?.text ?? "";
  }

  function updateLocationFromFeature(
    feature: MapboxFeature,
  ) {
    if (!feature.center) {
      return;
    }

    const lng = feature.center[0];
    const lat = feature.center[1];

    const city =
      getContextValue(feature, "place") ||
      getContextValue(feature, "locality");

    const state =
      getContextValue(feature, "region");

    const zip =
      getContextValue(feature, "postcode");

    /*
     * Only display:
     *
     * City, State ZIP
     *
     * Never display the street address.
     */
    let locationLabel = "";

    if (city && state && zip) {
      locationLabel =
        `${city}, ${state} ${zip}`;
    } else if (city && state) {
      locationLabel =
        `${city}, ${state}`;
    } else if (city && zip) {
      locationLabel =
        `${city} ${zip}`;
    } else if (city) {
      locationLabel = city;
    } else if (feature.text) {
      locationLabel = feature.text;
    }

    setLatitude(lat);
    setLongitude(lng);

    setMapLatitude(lat);
    setMapLongitude(lng);

    setSearchLocation(locationLabel);

    setSelectedLocation(locationLabel);

    setSelectedCity(city);

    setSelectedState(state);

    setSelectedZip(zip);

    setSuggestions([]);

    setShowSuggestions(false);
  }

  async function searchLocations(
    value: string,
  ) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error(
        "NEXT_PUBLIC_MAPBOX_TOKEN is not configured.",
      );

      return;
    }

    if (value.trim().length < 2) {
      setSuggestions([]);

      setShowSuggestions(false);

      return;
    }

    try {
      setIsLoadingLocation(true);

      const encodedLocation =
        encodeURIComponent(value);

      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodedLocation +
        ".json?access_token=" +
        token +
        "&types=place,locality,address" +
        "&limit=5";

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Unable to search locations.",
        );
      }

      const data =
        (await response.json()) as MapboxResponse;

      const results =
        data.features ?? [];

      setSuggestions(results);

      setShowSuggestions(
        results.length > 0,
      );
    } catch (error) {
      console.error(
        "Mapbox location search failed:",
        error,
      );

      setSuggestions([]);
    } finally {
      setIsLoadingLocation(false);
    }
  }

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value =
      event.target.value;

    setSearchLocation(value);

    setSelectedLocation("");

    setSelectedCity("");

    setSelectedState("");

    setSelectedZip("");

    if (searchTimeoutRef.current) {
      clearTimeout(
        searchTimeoutRef.current,
      );
    }

    searchTimeoutRef.current =
      setTimeout(() => {
        searchLocations(value);
      }, 400);
  }

  async function reverseGeocode(
    lat: number,
    lng: number,
  ) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
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
        return;
      }

      const data =
        (await response.json()) as MapboxResponse;

      const feature =
        data.features?.[0];

      if (!feature) {
        return;
      }

      updateLocationFromFeature(
        feature,
      );
    } catch (error) {
      console.error(
        "Mapbox reverse geocoding failed:",
        error,
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }

  function handleMapClick(
    event: MapMouseEvent,
  ) {
    const lng =
      event.lngLat.lng;

    const lat =
      event.lngLat.lat;

    setLatitude(lat);

    setLongitude(lng);

    setMapLatitude(lat);

    setMapLongitude(lng);

    reverseGeocode(
      lat,
      lng,
    );
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(
          searchTimeoutRef.current,
        );
      }
    };
  }, []);

  return (
    <div className="relative md:col-span-2">
      {/* LOCATION SEARCH */}

      <div className="relative">
        <label
          htmlFor={locationFieldName}
          className="mb-2 block text-sm font-semibold text-[#c3ded8]"
        >
          Last Seen Location
        </label>

        <input
          id={locationFieldName}
          name={locationFieldName}
          value={searchLocation}
          onChange={handleSearchChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search for a city or location *"
          required
          autoComplete="off"
          className="w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none"
        />

        {isLoadingLocation && (
          <p className="mt-2 text-sm text-[#fbb12c]">
            Searching locations...
          </p>
        )}

        {showSuggestions &&
          suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#1b5b51] bg-[#003d35] shadow-xl">
              {suggestions.map(
                (feature) => {
                  const city =
                    getContextValue(
                      feature,
                      "place",
                    ) ||
                    getContextValue(
                      feature,
                      "locality",
                    );

                  const state =
                    getContextValue(
                      feature,
                      "region",
                    );

                  const zip =
                    getContextValue(
                      feature,
                      "postcode",
                    );

                  /*
                   * Dropdown also only displays
                   * City, State ZIP.
                   */
                  let label = "";

                  if (
                    city &&
                    state &&
                    zip
                  ) {
                    label =
                      `${city}, ${state} ${zip}`;
                  } else if (
                    city &&
                    state
                  ) {
                    label =
                      `${city}, ${state}`;
                  } else if (
                    city
                  ) {
                    label = city;
                  } else {
                    label =
                      feature.text ??
                      "Unknown location";
                  }

                  return (
                    <button
                      key={
                        feature.id ??
                        feature.place_name ??
                        label
                      }
                      type="button"
                      onClick={() =>
                        updateLocationFromFeature(
                          feature,
                        )
                      }
                      className="flex w-full items-center gap-3 border-b border-[#1b5b51] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#06483f]"
                    >
                      <span>
                        📍
                      </span>

                      <span>
                        {label}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          )}
      </div>

      {/* MAP */}

      <div className="mt-4 overflow-hidden rounded-xl border border-[#1b5b51]">
      <Map
        longitude={mapLongitude}
        latitude={mapLatitude}
        zoom={12}
        onMove={(event) => {
          setMapLongitude(event.viewState.longitude);
          setMapLatitude(event.viewState.latitude);
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

      {/* HELPER TEXT */}

      <p className="mt-3 text-sm text-[#b7d5ce]">
        Search for a location above or select a
        location on the map to automatically fill
        the city, state, and ZIP code.
      </p>

      {/* SELECTED LOCATION */}

      {selectedLocation && (
        <p className="mt-2 text-sm font-semibold text-[#fbb12c]">
          📍 {selectedLocation}
        </p>
      )}

      {/* HIDDEN FORM VALUES */}

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
        name="state"
        value={selectedState}
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