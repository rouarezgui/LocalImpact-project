
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  MapPinned,
  Send,
  X,
} from "lucide-react";

import type { Coordinates } from "../../components/MapPicker";

const MapPicker = dynamic(
  () => import("../../components/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
        Chargement de la carte...
      </div>
    ),
  }
);

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: Coordinates | null;
  photoName: string | null;
  status: string;
  createdAt: string;
};

const STORAGE_KEY = "localimpact-reports";

export default function NewReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setPhoto(null);
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choisissez une image PNG, JPG ou WEBP.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    setError("");
    setSuccess("");
    setPhoto(file);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !title.trim() ||
      !description.trim() ||
      !category ||
      !location.trim()
    ) {
      setError(
        "Veuillez remplir tous les champs obligatoires."
      );
      return;
    }

    if (title.trim().length < 5) {
      setError(
        "Le titre doit contenir au moins 5 caractères."
      );
      return;
    }

    if (description.trim().length < 10) {
      setError(
        "La description doit contenir au moins 10 caractères."
      );
      return;
    }

    if (title.trim().length > 120) {
      setError(
        "Le titre ne doit pas dépasser 120 caractères."
      );
      return;
    }

    if (description.trim().length > 2000) {
      setError(
        "La description ne doit pas dépasser 2000 caractères."
      );
      return;
    }

    if (location.trim().length > 200) {
      setError(
        "L'adresse ne doit pas dépasser 200 caractères."
      );
      return;
    }

    try {
      const storedReports = localStorage.getItem(STORAGE_KEY);
      let reports: Report[] = [];

      if (storedReports) {
        const parsed: unknown = JSON.parse(storedReports);

        if (!Array.isArray(parsed)) {
          throw new Error("Format de stockage invalide.");
        }

        reports = parsed as Report[];
      }

      const report: Report = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        coordinates,
        photoName: photo?.name ?? null,
        status: "Nouveau",
        createdAt: new Date().toISOString(),
      };

      reports.push(report);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
      );

      setSuccess(
        `Votre signalement « ${report.title} » a été enregistré avec succès !`
      );

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setPhoto(null);
      setCoordinates(null);

      const photoInput = document.getElementById(
        "photo"
      ) as HTMLInputElement | null;

      if (photoInput) {
        photoInput.value = "";
      }
    } catch {
      setError(
        "Impossible d'enregistrer le signalement. Vérifiez l'espace de stockage de votre navigateur."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-bold">
            Local<span className="text-blue-600">Impact</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Participation citoyenne
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Signaler un problème
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Décrivez le problème rencontré dans votre quartier
          afin de faciliter sa prise en charge.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold"
            >
              Titre du signalement *
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
                setSuccess("");
              }}
              required
              minLength={5}
              maxLength={120}
              placeholder="Ex. : Lampadaire en panne"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold"
            >
              Catégorie *
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setError("");
                setSuccess("");
              }}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Sélectionner une catégorie
              </option>
              <option value="routes">
                Routes et voirie
              </option>
              <option value="eclairage">
                Éclairage public
              </option>
              <option value="espaces-verts">
                Espaces verts
              </option>
              <option value="proprete">Propreté</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Description *
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setError("");
                setSuccess("");
              }}
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Décrivez le problème et ses conséquences..."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-semibold"
            >
              Adresse ou lieu *
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                id="location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                required
                maxLength={200}
                placeholder="Ex. : Avenue Habib Bourguiba, Tunis"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <MapPinned size={18} className="text-blue-600" />
              Choisir sur la carte
            </h2>

            <p className="mb-3 text-sm text-slate-500">
              Cliquez sur la carte pour enregistrer les coordonnées
              exactes du problème. L&apos;adresse sera recherchée
              automatiquement.
            </p>

            <MapPicker
              position={coordinates}
              onSelect={setCoordinates}
              onAddressFound={setLocation}
            />

            {coordinates && (
              <button
                type="button"
                onClick={() => setCoordinates(null)}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Effacer la position sélectionnée
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor="photo"
              className="mb-2 block text-sm font-semibold"
            >
              Photo (facultative)
            </label>

            <label
              htmlFor="photo"
              className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <ImagePlus size={28} className="text-blue-600" />

              <span className="mt-3 break-all text-sm font-semibold">
                {photo ? photo.name : "Choisir une photo"}
              </span>

              <span className="mt-1 text-xs text-slate-500">
                PNG, JPG ou WEBP — 5 Mo maximum
              </span>
            </label>

            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              className="sr-only"
            />

            {photo && (
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);

                  const input = document.getElementById(
                    "photo"
                  ) as HTMLInputElement | null;

                  if (input) {
                    input.value = "";
                  }
                }}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Supprimer la photo
              </button>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <Send size={18} />
            Envoyer le signalement
          </button>

          <p className="text-xs leading-5 text-slate-500">
            Les signalements sont enregistrés dans le stockage local
            de ce navigateur. Les photos ne sont pas encore sauvegardées.
          </p>
        </form>
      </section>
    </main>
  );
}
