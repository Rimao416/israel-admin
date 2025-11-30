import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
// app/api/invites/[id]/cadeaux/[cadeauId]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; cadeauId: string } }
) {
  try {
    const body = await request.json()
    const {
      categorie,
      appareilElectromenager,
      description,
      montantEspeces,
      notes,
      estOffert,
    } = body

    const cadeau = await prisma.cadeau.update({
      where: { id: params.cadeauId },
      data: {
        categorie,
        appareilElectromenager,
        description,
        montantEspeces: montantEspeces ? parseFloat(montantEspeces) : null,
        notes,
        estOffert,
      },
    })

    return NextResponse.json(cadeau)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du cadeau' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; cadeauId: string } }
) {
  try {
    await prisma.cadeau.delete({
      where: { id: params.cadeauId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}