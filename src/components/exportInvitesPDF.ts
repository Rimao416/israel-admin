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
        .instructions {
          background-color: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .instructions h3 {
          margin: 0 0 10px 0;
          color: #92400e;
          font-size: 12pt;
        }
        .instructions p {
          margin: 5px 0;
          font-size: 9pt;
          color: #78350f;
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
        .link-cell {
          position: relative;
        }
        .link-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .link {
          color: #2563eb;
          text-decoration: none;
          word-break: break-all;
          font-size: 9pt;
          font-family: 'Courier New', monospace;
          background-color: #eff6ff;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          border: 1px solid #bfdbfe;
          user-select: all;
          cursor: text;
        }
        .copy-btn {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 8pt;
          white-space: nowrap;
          transition: background-color 0.2s;
        }
        .copy-btn:hover {
          background-color: #1d4ed8;
        }
        .copy-btn:active {
          background-color: #1e40af;
        }
        .copied {
          background-color: #10b981 !important;
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
        
        /* Styles pour l'impression */
        @media print {
          .instructions {
            display: none;
          }
          .copy-btn {
            display: none;
          }
          .link {
            background-color: white;
            border: none;
            padding: 2px;
          }
        }
      </style>
      <script>
        function copyToClipboard(text, buttonId) {
          navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(buttonId);
            const originalText = btn.textContent;
            btn.textContent = '✓ Copié';
            btn.classList.add('copied');
            
            setTimeout(() => {
              btn.textContent = originalText;
              btn.classList.remove('copied');
            }, 2000);
          }).catch(err => {
            alert('Erreur lors de la copie: ' + err);
          });
        }

        function selectLink(linkId) {
          const link = document.getElementById(linkId);
          const range = document.createRange();
          range.selectNodeContents(link);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      </script>
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

      <div class="instructions">
        <h3>💡 Instructions pour copier les liens :</h3>
        <p><strong>Méthode 1 :</strong> Cliquez sur le bouton "📋 Copier" à droite de chaque lien</p>
        <p><strong>Méthode 2 :</strong> Triple-cliquez sur le lien pour le sélectionner, puis Ctrl+C (ou Cmd+C sur Mac)</p>
        <p><strong>Méthode 3 :</strong> Cliquez sur le lien pour le sélectionner automatiquement, puis copiez</p>
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
          ${invites.map((invite, index) => {
            const link = `https://israel-kappa.vercel.app/${invite.id}`;
            return `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${invite.nom}</strong></td>
              <td>${invite.prenom}</td>
              <td>${invite.table ? `N°${invite.table.numero}` : '-'}</td>
              <td class="link-cell">
                <div class="link-container">
                  <span class="link" id="link-${index}" onclick="selectLink('link-${index}')" title="Cliquez pour sélectionner">
                    ${link}
                  </span>
                  <button class="copy-btn" id="btn-${index}" onclick="copyToClipboard('${link}', 'btn-${index}')">
                    📋 Copier
                  </button>
                </div>
              </td>
            </tr>
          `}).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Document confidentiel • ${stats.total} invité(s) répertorié(s)</p>
        <p style="margin-top: 10px; font-size: 8pt; color: #999;">
          Pour imprimer en PDF: Fichier → Imprimer → Enregistrer au format PDF
        </p>
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

  // Message d'information amélioré
  alert('✅ Fichier HTML généré avec succès !\n\n📋 Le fichier contient des boutons "Copier" pour chaque lien.\n\n🖨️ Pour générer le PDF:\n1. Ouvrez le fichier dans votre navigateur\n2. Utilisez Ctrl+P (ou Cmd+P sur Mac)\n3. Sélectionnez "Enregistrer au format PDF"');
};