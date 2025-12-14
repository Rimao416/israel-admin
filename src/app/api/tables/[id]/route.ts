// app/api/tables/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

// GET: récupération d'une table par ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        invites: {
          orderBy: {
            nom: 'asc'
          }
        },
        _count: {
          select: {
            invites: true,
          }
        }
      }
    });

    if (!table) {
      return NextResponse.json(
        { message: 'Table non trouvée.' },
        { status: 404 }
      );
    }

    return NextResponse.json(table, { status: 200 });
  } catch (error) {
    console.error('[TABLE_GET_BY_ID]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la table.', error },
      { status: 500 }
    );
  }
}

// PUT: mise à jour d'une table
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { numero, nom } = body;

    if (!numero || typeof numero !== 'number') {
      return NextResponse.json(
        { message: 'Le numéro de table est requis et doit être un nombre.' },
        { status: 400 }
      );
    }

    if (!nom || typeof nom !== 'string') {
      return NextResponse.json(
        { message: 'Le nom de la table est requis.' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du numéro (sauf pour la table actuelle)
    const existingTable = await prisma.table.findFirst({
      where: {
        numero,
        NOT: { id }
      }
    });

    if (existingTable) {
      return NextResponse.json(
        { message: 'Une autre table avec ce numéro existe déjà.' },
        { status: 400 }
      );
    }

    const table = await prisma.table.update({
      where: { id },
      data: {
        numero,
        nom: nom.trim(),
      },
      include: {
        invites: true,
        _count: {
          select: {
            invites: true,
          }
        }
      }
    });

    return NextResponse.json(table, { status: 200 });
  } catch (error) {
    console.error('[TABLE_PUT]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la table.', error },
      { status: 500 }
    );
  }
}

// DELETE: suppression d'une table
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.table.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Table supprimée avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[TABLE_DELETE]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la table.', error },
      { status: 500 }
    );
  }
}