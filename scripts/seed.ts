import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  const tables = [
    { numero: 1, nom: 'Grâce' },
    { numero: 2, nom: 'Éternelle' },
    { numero: 3, nom: 'Élégance' },
    { numero: 4, nom: 'Lumière' },
    { numero: 5, nom: 'Royale' },
    { numero: 6, nom: 'Pureté' },
    { numero: 7, nom: 'Destinée' },
    { numero: 8, nom: 'Harmonie' },
    { numero: 9, nom: 'Fidélité' },
    { numero: 10, nom: 'Espérance' },
    { numero: 11, nom: 'Rubis' },
    { numero: 12, nom: 'Plume' },
    { numero: 13, nom: 'Divine' },
    { numero: 14, nom: 'Éclat' },
    { numero: 15, nom: 'Vintage' },
    { numero: 16, nom: 'Soul' },
    { numero: 17, nom: 'Noble' },
    { numero: 18, nom: 'Miracle' },
    { numero: 19, nom: 'Velvète' },
    { numero: 20, nom: 'Perle' },
    { numero: 21, nom: 'Constellation' },
    { numero: 22, nom: 'Sérénité' },
    { numero: 23, nom: 'Majesté' },
    { numero: 24, nom: 'Trésor' },
    { numero: 25, nom: 'Bienveillance' },
    { numero: 26, nom: 'Providence' },
  ];

  // Supprimer toutes les tables existantes (optionnel)
  await prisma.invite.deleteMany();
  await prisma.table.deleteMany();
  console.log('🗑️  Tables existantes supprimées');

  // Créer les tables avec leurs invités
  const tablesAvecInvites = [
    {
      table: tables[0], // Table 1 - Grâce
      invites: [
        { nom: 'FRANCK', prenom: 'COUPLE', estCouple: true },
        { nom: 'GEDEON', prenom: 'COUPLE', estCouple: true },
        { nom: 'JOVAL', prenom: '' },
        { nom: 'KOBA', prenom: 'FREUD' },
      ],
    },
    {
      table: tables[1], // Table 2 - Éternelle
      invites: [
        { nom: 'THIERRY', prenom: '' },
        { nom: 'NDALA', prenom: 'AGRÉABLE COUPLE', estCouple: true },
      ],
    },
    {
      table: tables[2], // Table 3 - Élégance
      invites: [
        { nom: 'CORNEILLE', prenom: '' },
        { nom: 'BELLY', prenom: '' },
        { nom: 'LUCRESSE', prenom: '' },
        { nom: 'SARAH', prenom: '' },
        { nom: 'ALVYNE', prenom: '' },
        { nom: 'NOELLA', prenom: '' },
      ],
    },
    {
      table: tables[3], // Table 4 - Lumière
      invites: [
        { nom: 'VANESA', prenom: '' },
        { nom: 'GLOIRIA', prenom: '' },
        { nom: 'GRACE', prenom: 'ET SOEUR' },
        { nom: 'DAVID', prenom: '' },
        { nom: 'DAPHNEY', prenom: '' },
      ],
    },
    {
      table: tables[4], // Table 5 - Royale
      invites: [
        { nom: 'ABIGAEL', prenom: '' },
        { nom: 'REBECCA', prenom: '' },
        { nom: 'ARNAUD', prenom: '' },
        { nom: 'CHRISTY', prenom: '' },
        { nom: 'LUXENCE', prenom: '' },
      ],
    },
    {
      table: tables[5], // Table 6 - Pureté
      invites: [
        { nom: 'MOKUBA', prenom: 'PATRICK COUPLE', estCouple: true },
        { nom: 'SIMEON', prenom: 'BORIS COUPLE', estCouple: true },
        { nom: 'JEAN LOUIS', prenom: 'COUPLE', estCouple: true },
        { nom: 'LOSHA', prenom: 'COUPLE', estCouple: true },
        { nom: 'DEKA', prenom: 'SAMUEL' },
        { nom: 'BENJAMIN', prenom: '' },
      ],
    },
    {
      table: tables[6], // Table 7 - Destinée
      invites: [
        { nom: 'LILOLO', prenom: 'EXAUCÉ' },
        { nom: 'MPINDA', prenom: 'GLORIA' },
        { nom: 'JUMELLE', prenom: 'DEBORAH DORCAS' },
        { nom: 'KENDRA', prenom: '' },
        { nom: 'ELIE', prenom: '' },
        { nom: 'QEILLA', prenom: 'LOURY' },
      ],
    },
    {
      table: tables[7], // Table 8 - Harmonie
      invites: [
        { nom: 'SHEMBO', prenom: 'ENOCK' },
        { nom: 'STÉPHANE', prenom: '' },
        { nom: 'KASONGO', prenom: 'JOSUÉ' },
        { nom: 'ESDRAS', prenom: '' },
        { nom: 'JUNIOR', prenom: 'LEVI' },
        { nom: 'KIYIMBI', prenom: 'SAMUEL' },
      ],
    },
    {
      table: tables[8], // Table 9 - Fidélité
      invites: [
        { nom: 'PAUNI', prenom: 'JUNIOR' },
        { nom: 'BUKASA', prenom: 'NATHAN COUPLE', estCouple: true },
        { nom: 'SERPHI', prenom: '' },
        { nom: 'HADASSA', prenom: '' },
        { nom: 'MARCELINE', prenom: '' },
      ],
    },
    {
      table: tables[9], // Table 10 - Espérance
      invites: [
        { nom: 'MANGALA', prenom: 'CHRIS' },
        { nom: 'KBG', prenom: 'ELIEL COUPLE', estCouple: true },
        { nom: 'DANNIELLA', prenom: '' },
        { nom: 'ETBERGE', prenom: '' },
        { nom: 'KEREN', prenom: '' },
      ],
    },
    {
      table: tables[10], // Table 11 - Rubis
      invites: [
        { nom: 'MUTSIONGA', prenom: 'EMMANUEL COUPLE', estCouple: true },
        { nom: 'KABEMBO', prenom: 'GLODI COUPLE', estCouple: true },
        { nom: 'EASY', prenom: 'RACHIDY COUPLE', estCouple: true },
      ],
    },
    {
      table: tables[11], // Table 12 - Plume
      invites: [
        { nom: 'ALFREDO', prenom: '' },
        { nom: 'FLORA', prenom: 'MOÏSE COUPLE', estCouple: true },
        { nom: 'LÉO', prenom: 'ELIE' },
        { nom: 'LIPUTA', prenom: 'NAOMIE' },
        { nom: 'RUFFIN', prenom: '' },
      ],
    },
    {
      table: tables[12], // Table 13 - Divine
      invites: [
        { nom: 'AMB', prenom: 'JEAN' },
        { nom: 'BANZA', prenom: 'COUPLE', estCouple: true },
        { nom: 'QUEEN', prenom: 'HERMINE' },
      ],
    },
    {
      table: tables[13], // Table 14 - Éclat
      invites: [
        { nom: 'ZARA', prenom: 'JEREMY' },
        { nom: 'ZARA', prenom: 'GRÂCE' },
        { nom: 'SEPHORA', prenom: 'COUPLE', estCouple: true },
        { nom: 'JEREMY', prenom: 'COUPLE', estCouple: true },
      ],
    },
    {
      table: tables[14], // Table 15 - Vintage
      invites: [
        { nom: 'JOHANNE', prenom: 'ASHLEY' },
        { nom: 'KISOKA', prenom: 'CEDRICK COUPLE', estCouple: true },
        { nom: 'HANGA', prenom: 'JUDITH COUPLE', estCouple: true },
      ],
    },
    {
      table: tables[15], // Table 16 - Soul
      invites: [
        { nom: 'MANASSÉ', prenom: '' },
        { nom: 'CHRISTELLE', prenom: '' },
        { nom: 'WISDOM', prenom: 'JEHOVANIE' },
        { nom: 'REBECCA', prenom: '' },
        { nom: 'SAM', prenom: '' },
        { nom: 'GOSEN', prenom: 'NEO' },
      ],
    },
    {
      table: tables[16], // Table 17 - Noble
      invites: [
        { nom: 'JUSTIN', prenom: 'ET SON FRÈRE' },
        { nom: 'AHMADU', prenom: '' },
        { nom: 'EDO', prenom: '' },
      ],
    },
    {
      table: tables[17], // Table 18 - Miracle
      invites: [
        { nom: 'KENA', prenom: '' },
        { nom: 'WILLIAM', prenom: '' },
        { nom: 'NAWEJ', prenom: 'GRÂCE COUPLE', estCouple: true },
        { nom: 'MC', prenom: 'PRISCILLE' },
        { nom: 'CICILE', prenom: '' },
      ],
    },
    {
      table: tables[18], // Table 19 - Velvète
      invites: [
        { nom: 'MYRCIA', prenom: '' },
        { nom: 'STEVIE', prenom: '' },
        { nom: 'JOSIANNE', prenom: '' },
        { nom: 'JORDY', prenom: '' },
        { nom: 'EBEN', prenom: '' },
        { nom: 'BENI', prenom: '' },
      ],
    },
    {
      table: tables[19], // Table 20 - Perle
      invites: [
        { nom: 'JOSH', prenom: '' },
        { nom: 'AQUILAS', prenom: '' },
        { nom: 'CHADRACK', prenom: '' },
        { nom: 'SAPAULDI', prenom: '' },
        { nom: 'DAN', prenom: '' },
        { nom: 'ISRAEL', prenom: '' },
      ],
    },
    {
      table: tables[20], // Table 21 - Constellation
      invites: [
        { nom: 'MESHACK', prenom: '' },
        { nom: 'PAUL', prenom: '' },
        { nom: 'YANNICK', prenom: '' },
        { nom: 'LOVE', prenom: '' },
        { nom: 'EMMERAUDE', prenom: '' },
        { nom: 'ELISABETH', prenom: '' },
      ],
    },
    {
      table: tables[21], // Table 22 - Sérénité
      invites: [
        { nom: 'BK', prenom: '' },
        { nom: 'MAYGHENE', prenom: '' },
        { nom: 'MISHKA', prenom: '' },
        { nom: 'ESTHER', prenom: '' },
        { nom: 'TEDIKA', prenom: '' },
        { nom: 'BEN', prenom: '' },
      ],
    },
    {
      table: tables[22], // Table 23 - Majesté
      invites: [
        { nom: 'KASONGO', prenom: 'ROGER COUPLE', estCouple: true },
        { nom: 'BASUME', prenom: 'BEN COUPLE', estCouple: true },
        { nom: 'KAZONGO', prenom: 'COUPLE', estCouple: true },
        { nom: 'CONSTANTINE', prenom: '' },
        { nom: 'POUR TESTER ', prenom: 'COUPLE TEST' },
      ],
    },
  ];

  for (const item of tablesAvecInvites) {
    const tableCreated = await prisma.table.create({
      data: item.table,
    });
    console.log(`✅ Table ${tableCreated.numero} - ${tableCreated.nom} créée`);

    for (const invite of item.invites) {
      await prisma.invite.create({
        data: {
          nom: invite.nom,
          prenom: invite.prenom,
          tableId: tableCreated.id,
        },
      });
    }
    console.log(`   👥 ${item.invites.length} invités ajoutés`);
  }

  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });