import prisma from '@/lib/client'
import { NextRequest, NextResponse } from 'next/server'
// app/api/invites/[id]/livre-or/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const livreOr = await prisma.livreOr.findUnique({
      where: { inviteId: params.id },
    })

    if (!livreOr) {
      return NextResponse.json(
        { error: 'Livre d\'or non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(livreOr)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { message } = body

    // Vérifier si l'invité existe
    const invite = await prisma.invite.findUnique({
      where: { id: params.id },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invité non trouvé' },
        { status: 404 }
      )
    }

    // Créer ou mettre à jour le livre d'or
    const livreOr = await prisma.livreOr.upsert({
      where: { inviteId: params.id },
      update: { message },
      create: {
        inviteId: params.id,
        message,
      },
    })

    return NextResponse.json(livreOr)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du livre d\'or' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.livreOr.delete({
      where: { inviteId: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}