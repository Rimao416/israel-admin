import prisma from '@/lib/client'
import { NextRequest, NextResponse } from 'next/server'

// app/api/invites/[id]/boissons/[boissonId]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; boissonId: string } }
) {
  try {
    await prisma.boissonPreference.delete({
      where: { id: params.boissonId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; boissonId: string } }
) {
  try {
    const body = await request.json()
    const { quantite } = body

    const preference = await prisma.boissonPreference.update({
      where: { id: params.boissonId },
      data: { quantite },
    })

    return NextResponse.json(preference)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
