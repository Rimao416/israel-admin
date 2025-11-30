// app/api/invites/[id]/boissons/route.ts
import prisma from '@/lib/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const boissons = await prisma.boissonPreference.findMany({
      where: { inviteId: params.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(boissons)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des boissons' },
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
    const { boisson, quantite = 1 } = body

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

    // Créer la préférence de boisson
    const preference = await prisma.boissonPreference.create({
      data: {
        inviteId: params.id,
        boisson,
        quantite,
      },
    })

    return NextResponse.json(preference, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cette boisson a déjà été ajoutée' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la boisson' },
      { status: 500 }
    )
  }
}
