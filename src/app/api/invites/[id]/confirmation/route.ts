// app/api/invites/[id]/confirmation/route.ts
import prisma from '@/lib/client';
import { NextResponse } from 'next/server';

// PATCH: mise à jour de la confirmation
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { confirme } = body;

    if (!confirme || !['OUI', 'NON', 'EN_ATTENTE'].includes(confirme)) {
      return NextResponse.json(
        { message: 'Statut de confirmation invalide.' },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.update({
      where: { id },
      data: { confirme },
      include: { table: true }
    });

    return NextResponse.json(invite, { status: 200 });
  } catch (error) {
    console.error('[INVITE_CONFIRMATION_PATCH]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la confirmation.', error },
      { status: 500 }
    );
  }
}