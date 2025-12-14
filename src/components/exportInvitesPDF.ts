// utils/exportInvitesPDF.ts
import { Invite } from '@/types/table.types';

export const exportInvitesToPDF = (invites: Invite[]) => {
  const stats = {
    total: invites.length,
    confirmed: invites.filter(i => i.confirme === 'OUI').length,
    attended: invites.filter(i => i.assiste === true).length,
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Liste des Invités</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24pt;
          color: #1e40af;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 11pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #2563eb;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: bold;
          font-size: 10pt;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 9pt;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        tr:hover {
          background-color: #f3f4f6;
        }
        .link {
          color: #2563eb;
          text-decoration: none;
          word-break: break-all;
          font-size: 8pt;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 9pt;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          padding: 15px;
          background-color: #f0f9ff;
          border-radius: 8px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 18pt;
          font-weight: bold;
          color: #1e40af;
        }
        .stat-label {
          font-size: 9pt;
          color: #666;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Liste des Invités</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 15%;">Nom</th>
            <th style="width: 15%;">Prénom</th>
            <th style="width: 10%;">Table</th>
            <th style="width: 55%;">Lien Personnel</th>
          </tr>
        </thead>
        <tbody>
          ${invites.map((invite, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${invite.nom}</strong></td>
              <td>${invite.prenom}</td>
              <td>${invite.table ? `N°${invite.table.numero}` : '-'}</td>
              <td>
                <a href="https://israel-kappa.vercel.app/${invite.id}" class="link">
                  https://israel-kappa.vercel.app/${invite.id}
                </a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Document confidentiel • ${stats.total} invité(s) répertorié(s)</p>
      </div>
    </body>
    </html>
  `;

  // Créer un blob et télécharger
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invites_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Message d'information
  alert('✅ Fichier HTML généré !\n\nOuvrez le fichier dans votre navigateur et utilisez Ctrl+P (ou Cmd+P sur Mac) puis "Enregistrer au format PDF".');
};