
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  LocateFixed,
  LoaderCircle,
  MapPin,
  X,
} from "lucide-react";

export type Coordinates = {
  lat: number;
  lng: number;
};

type MapPickerProps = {
  position: Coordinates | null;
  onSelect: (coordinates: Coordinates) => void;
  onAddressFound: (address: string) => void;
};

const TUNIS: Coordinates = {
  lat: 36.8065,
  lng: 10.1815,
};

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

async function getAddressFromCoordinates(
  coordinates: Coordinates
): Promise<string | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(coordinates.lat),
    lon: String(coordinates.lng),
    zoom: "18",
    addressdetails: "1",
    "accept-language": "fr",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer l'adresse.");
  }

  const data: { display_name?: string } = await response.json();

  return data.display_name ?? null;
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (coordinates: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapPositionController({
  position,
}: {
  position: Coordinates | null;
}) {
  const map = useMap();

  if (position) {
    map.flyTo([position.lat, position.lng], 16, {
      animate: true,
      duration: 0.8,
    });
  }

  return null;
}

export default function MapPicker({
  position,
  onSelect,
  onAddressFound,
}: MapPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [locationError, setLocationError] = useState("");

  async function selectLocation(coordinates: Coordinates) {
    onSelect(coordinates);
    setLocationError("");
    setIsSearchingAddress(true);

    try {
      const address = await getAddressFromCoordinates(coordinates);

      if (address) {
        onAddressFound(address);
      } else {
        setLocationError(
          "Adresse introuvable pour cet emplacement. Vous pouvez la saisir manuellement."
        );
      }
    } catch {
      setLocationError(
        "L&apos;adresse n'a pas pu être récupérée. Vous pouvez la saisir manuellement."
      );
    } finally {
      setIsSearchingAddress(false);
    }
  }

  function locateMe() {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "La géolocalisation n'est pas prise en charge par votre navigateur."
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const currentPosition: Coordinates = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        };

        void selectLocation(currentPosition);
        setIsLocating(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Accès à la position refusé. Autorisez la géolocalisation dans votre navigateur."
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError(
            "La localisation a pris trop de temps. Réessayez."
          );
        } else {
          setLocationError(
            "Impossible de récupérer votre position actuelle."
          );
        }

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function clearPosition() {
    void selectLocation(TUNIS);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={locateMe}
          disabled={isLocating || isSearchingAddress}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <LocateFixed size={18} />
          )}

          {isLocating
            ? "Localisation..."
            : "Utiliser ma position actuelle"}
        </button>

        {position && (
          <button
            type="button"
            onClick={clearPosition}
            disabled={isSearchingAddress}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <X size={17} />
            Recentrer sur Tunis
          </button>
        )}
      </div>

      {locationError && (
        <p
          role="alert"
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          {locationError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={[TUNIS.lat, TUNIS.lng]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-80 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onSelect={(coordinates) => {
              void selectLocation(coordinates);
            }}
          />

          <MapPositionController position={position} />

          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={markerIcon}
            />
          )}
        </MapContainer>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MapPin size={18} className="text-blue-600" />
          Localisation du signalement
        </p>

        <p
          aria-live="polite"
          className="mt-2 text-sm text-slate-600"
        >
          {position
            ? `Latitude : ${position.lat.toFixed(6)} · Longitude : ${position.lng.toFixed(6)}`
            : "Cliquez sur la carte ou utilisez votre position actuelle."}
        </p>

        {isSearchingAddress && (
          <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
            <LoaderCircle size={16} className="animate-spin" />
            Recherche de l&apos;adresse...
          </p>
        )}

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Cliquez sur la carte pour choisir un emplacement.
          L&apos;adresse sera recherchée automatiquement. Vous pouvez
          toujours la modifier manuellement dans le champ Adresse.
        </p>
      </div>
    </div>
  );
}
