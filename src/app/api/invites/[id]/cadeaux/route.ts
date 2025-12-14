import prisma from "@/lib/client"
import { NextRequest, NextResponse } from "next/server"

// app/api/invites/[id]/cadeaux/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const cadeaux = await prisma.cadeau.findMany({
      where: { inviteId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(cadeaux)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cadeaux' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const {
      categorie,
      appareilElectromenager,
      description,
      montantEspeces,
      notes,
    } = body

    // Vérifier si l'invité existe
    const invite = await prisma.invite.findUnique({
      where: { id },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invité non trouvé' },
        { status: 404 }
      )
    }

    // Créer le cadeau
    const cadeau = await prisma.cadeau.create({
      data: {
        inviteId: id,
        categorie,
        appareilElectromenager,
        description,
        montantEspeces: montantEspeces ? parseFloat(montantEspeces) : null,
        notes,
      },
    })

    return NextResponse.json(cadeau, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l&apos;ajout du cadeau' },
      { status: 500 }
    )
  }
}