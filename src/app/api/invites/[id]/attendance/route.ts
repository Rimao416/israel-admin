// app/api/invites/[id]/attendance/route.ts
import prisma from '@/lib/client';
import { NextResponse } from 'next/server';

// PATCH: mise à jour de la présence
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { assiste } = body;

    if (typeof assiste !== 'boolean') {
      return NextResponse.json(
        { message: 'Le statut de présence doit être un booléen.' },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.update({
      where: { id },
      data: { assiste },
      include: { table: true }
    });

    return NextResponse.json(invite, { status: 200 });
  } catch (error) {
    console.error('[INVITE_ATTENDANCE_PATCH]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la présence.', error },
      { status: 500 }
    );
  }
}