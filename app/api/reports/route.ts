
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/dal";

const categoryMap: Record<string, "ROADS" | "LIGHTING" | "GREEN_SPACES" | "CLEANLINESS" | "OTHER"> = {
  routes: "ROADS",
  eclairage: "LIGHTING",
  "espaces-verts": "GREEN_SPACES",
  proprete: "CLEANLINESS",
  autre: "OTHER",
};

const statusMap: Record<string, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "RÃ©solu",
  REJECTED: "RejetÃ©",
};

function formatReport(report: {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
  createdAt: Date;
}) {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: Object.entries(categoryMap).find(
      ([, value]) => value === report.category
    )?.[0] ?? "autre",
    location: report.address,
    coordinates: {
      lat: report.latitude,
      lng: report.longitude,
    },
    photoName: report.photoUrl,
    status: statusMap[report.status] ?? report.status,
    createdAt: report.createdAt.toISOString(),
  };
}

// GET : rÃ©cupÃ©rer tous les signalements
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports.map(formatReport));
  } catch (error) {
    console.error("Erreur GET reports :", error);

    return NextResponse.json(
      { message: "Impossible de rÃ©cupÃ©rer les signalements." },
      { status: 500 }
    );
  }
}

// POST : crÃ©er un signalement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      category,
      location,
      coordinates,
    } = body;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      typeof location !== "string" ||
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lng !== "number"
    ) {
      return NextResponse.json(
        { message: "Veuillez fournir toutes les informations obligatoires, y compris la position sur la carte." },
        { status: 400 }
      );
    }

    if (
      title.trim().length < 5 ||
      title.trim().length > 120 ||
      description.trim().length < 10 ||
      description.trim().length > 2000 ||
      location.trim().length > 200 ||
      !categoryMap[category]
    ) {
      return NextResponse.json(
        { message: "Les informations du signalement sont invalides." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté pour créer un signalement." },
        { status: 401 }
      );
    }

    const report = await prisma.report.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: categoryMap[category],
        address: location.trim(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        creatorId: currentUser.id,
      },
    });

    return NextResponse.json(formatReport(report), { status: 201 });
  } catch (error) {
    console.error("Erreur POST reports :", error);

    return NextResponse.json(
      { message: "Impossible de crÃ©er le signalement." },
      { status: 500 }
    );
  }
}

