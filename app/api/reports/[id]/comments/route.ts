import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { MAX_COMMENT_LENGTH } from "@/features/reports/domain/report-rules";
import { reportErrorResponse } from "@/features/reports/presentation/report-error-response";
import { getCurrentUser } from "@/lib/auth/dal";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const commentSchema = z.object({
  content: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
});

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const comments = await reportsContainer.listComments.execute({
      reportId: id,
    });

    return NextResponse.json(comments);
  } catch (error) {
    return reportErrorResponse(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Format JSON invalide." },
        { status: 400 }
      );
    }

    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Le commentaire doit contenir de 1 à 500 caractères." },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    const comment = await reportsContainer.addComment.execute({
      reportId: id,
      userId: currentUser.id,
      content: validation.data.content,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return reportErrorResponse(error);
  }
}
