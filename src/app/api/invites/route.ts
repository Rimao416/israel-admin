// app/api/invites/route.ts
import prisma from '@/lib/client';
import { NextResponse } from 'next/server';
import { StatutConfirmation } from '@/types/table.types';

// POST: création d'invité
export async function POST(req: Request) {
  try {
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

    const invite = await prisma.invite.create({
      data: {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email?.trim() || null,
        telephone: telephone?.trim() || null,
        confirme: confirme || StatutConfirmation.EN_ATTENTE,
        assiste: assiste ?? null,
        tableId,
      },
      include: {
        table: true,
      }
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error('[INVITE_POST]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'invité.', error },
      { status: 500 }
    );
  }
}

// GET: récupération de tous les invités
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tableId = searchParams.get('tableId');

    let whereClause: any = {};
    
    if (tableId) {
      whereClause.tableId = tableId;
    }

    const invites = await prisma.invite.findMany({
      where: whereClause,
      include: {
        table: true,
      },
      orderBy: [
        { nom: 'asc' },
        { prenom: 'asc' }
      ]
    });

    return NextResponse.json(invites, { status: 200 });
  } catch (error) {
    console.error('[INVITE_GET]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des invités.', error },
      { status: 500 }
    );
  }
}

// DELETE: suppression d'invités
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'Aucun ID fourni pour la suppression.' },
        { status: 400 }
      );
    }

    await prisma.invite.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json(
      { message: 'Invités supprimés avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[INVITE_DELETE]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression des invités.', error },
      { status: 500 }
    );
  }
}
