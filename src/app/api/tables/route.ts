// app/api/tables/route.ts
import prisma from '@/lib/client';
import { NextResponse } from 'next/server';

// POST: création de table
export async function POST(req: Request) {
  try {
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

    // Vérifier l'unicité du numéro
    const existingTable = await prisma.table.findUnique({
      where: { numero }
    });

    if (existingTable) {
      return NextResponse.json(
        { message: 'Une table avec ce numéro existe déjà.' },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
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

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error('[TABLE_POST]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la table.', error },
      { status: 500 }
    );
  }
}

// GET: récupération de toutes les tables
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
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
      },
      orderBy: {
        numero: 'asc'
      }
    });

    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error('[TABLE_GET]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des tables.', error },
      { status: 500 }
    );
  }
}

// DELETE: suppression de tables
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

    await prisma.table.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json(
      { message: 'Tables supprimées avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[TABLE_DELETE]', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression des tables.', error },
      { status: 500 }
    );
  }
}