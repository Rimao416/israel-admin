// app/api/invites/[id]/route.ts
import prisma from '@/lib/client';
import { NextResponse } from 'next/server';

// GET: récupération d'un invité par ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const invite = await prisma.invite.findUnique({
      where: { id },
      include: {
        table: true,
      }
    });

    if (!invite) {
      return NextResponse.json(
        { message: 'Invité non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json(invite, { status: 200 });
  } catch (error) {
    console.error('[INVITE_GET_BY_ID]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'invité.', error },
      { status: 500 }
    );
  }
}

// PUT: mise à jour d'un invité
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nom, prenom, email, telephone, confirme, assiste, tableId } = body;

    if (!nom || typeof nom !== 'string') {
      return NextResponse.json(
        { message: 'Le nom est requis.' },
        { status: 400 }
      );
    }

    if (!prenom || typeof prenom !== 'string') {
      return NextResponse.json(
        { message: 'Le prénom est requis.' },
        { status: 400 }
      );
    }

    if (!tableId || typeof tableId !== 'string') {
      return NextResponse.json(
        { message: 'La table est requise.' },
        { status: 400 }
      );
    }

    // Vérifier que la table existe
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      return NextResponse.json(
        { message: 'La table spécifiée n\'existe pas.' },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.update({
      where: { id },
      data: {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email?.trim() || null,
        telephone: telephone?.trim() || null,
        confirme,
        assiste: assiste ?? null,
        tableId,
      },
      include: {
        table: true,
      }
    });

    return NextResponse.json(invite, { status: 200 });
  } catch (error) {
    console.error('[INVITE_PUT]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de l\'invité.', error },
      { status: 500 }
    );
  }
}

// DELETE: suppression d'un invité
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.invite.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Invité supprimé avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[INVITE_DELETE]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de l\'invité.', error },
      { status: 500 }
    );
  }
}