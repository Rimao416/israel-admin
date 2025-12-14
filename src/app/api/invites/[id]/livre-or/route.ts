import prisma from '@/lib/client'
import { NextRequest, NextResponse } from 'next/server'

// app/api/invites/[id]/livre-or/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const livreOr = await prisma.livreOr.findUnique({
      where: { inviteId: id },
    })

    if (!livreOr) {
      return NextResponse.json(
        { error: 'Livre d&apos;or non trouvé' },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { message } = body

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

    // Créer ou mettre à jour le livre d'or
    const livreOr = await prisma.livreOr.upsert({
      where: { inviteId: id },
      update: { message },
      create: {
        inviteId: id,
        message,
      },
    })

    return NextResponse.json(livreOr)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du livre d&apos;or' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.livreOr.delete({
      where: { inviteId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}