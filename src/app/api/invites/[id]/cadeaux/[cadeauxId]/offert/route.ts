import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

// app/api/invites/[id]/cadeaux/[cadeauId]/offert/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; cadeauId: string } }
) {
  try {
    const body = await request.json()
    const { estOffert } = body

    const cadeau = await prisma.cadeau.update({
      where: { id: params.cadeauId },
      data: { estOffert },
    })

    return NextResponse.json(cadeau)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
