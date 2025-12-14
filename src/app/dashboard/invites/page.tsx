// app/dashboard/invites/page.tsx
'use client';
import { ManagementPageConfig } from "@/types/management.type";
import { Invite, StatutConfirmation } from "@/types/table.types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ManagementPage from "@/components/common/ManagementPage";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useInvites } from "@/hooks/invites/useInvites";
import ActionModal from "@/components/common/ActionModal";
import { useDeleteInvite } from "@/hooks/invites/useDeleteInvite";
import { useInviteStore } from "@/store/inviteStore";
import { useUpdateInviteConfirmation } from "@/hooks/invites/useUpdateInviteConfirmation";
import { useUpdateInviteAttendance } from "@/hooks/invites/useUpdateInviteAttendance";
import { exportInvitesToPDF } from "@/components/exportInvitesPDF";
export default function InvitesPage() {
  const router = useRouter();
  const { data: invites, isLoading, isFetching, error, refetch } = useInvites();
  const { mutate: deleteInvites, isPending: isDeleting } = useDeleteInvite();
  const { mutate: updateConfirmation } = useUpdateInviteConfirmation();
  const { mutate: updateAttendance } = useUpdateInviteAttendance();
  const { getInviteStats } = useInviteStore();
 
  // État pour le modal de suppression
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    inviteIds: string[];
    inviteName: string;
  }>({
    isOpen: false,
    inviteIds: [],
    inviteName: ''
  });

  // 🔥 Fonction pour exporter en PDF
  const handleExportPDF = useCallback(() => {
    if (invites && invites.length > 0) {
      exportInvitesToPDF(invites);
    } else {
      alert('Aucun invité à exporter');
    }
  }, [invites]);

  // Ouvrir le modal de suppression
  const handleDeleteClick = useCallback((id: string) => {
    const invite = invites?.find(i => i.id === id);
    const inviteName = invite ? `${invite.prenom} ${invite.nom}` : 'invité';
   
    setDeleteModal({
      isOpen: true,
      inviteIds: [id],
      inviteName: inviteName
    });
  }, [invites]);

  // Confirmer suppression
  const handleConfirmDelete = () => {
    deleteInvites(deleteModal.inviteIds, {
      onSuccess: () => {
        setDeleteModal({ isOpen: false, inviteIds: [], inviteName: '' });
        console.log('Invité supprimé avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de la suppression de l\'invité:', error);
        setDeleteModal({ isOpen: false, inviteIds: [], inviteName: '' });
      },
    });
  };

  // Fermer le modal
  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, inviteIds: [], inviteName: '' });
    }
  };

  // Statistiques
  const stats = useMemo(() => getInviteStats(), [invites, getInviteStats]);

  // Filtres
  const filterOptions = useMemo(() => [
    {
      key: 'confirme',
      label: 'Confirmation',
      options: [
        { value: 'OUI', label: 'Confirmé' },
        { value: 'NON', label: 'Décliné' },
        { value: 'EN_ATTENTE', label: 'En attente' }
      ],
    },
    {
      key: 'assiste',
      label: 'Présence',
      options: [
        { value: 'true', label: 'Présent' },
        { value: 'false', label: 'Absent' },
        { value: 'null', label: 'Non renseigné' }
      ],
    },
  ], []);

  // Config de la page de gestion
  const invitesConfig: ManagementPageConfig<Invite> = useMemo(() => ({
    title: 'Gestion des invités',
    description: `${stats.total} invités • ${stats.confirmed} confirmés • ${stats.attended} présents`,
    useDataHook: () => ({
      data: invites,
      isLoading,
      isFetching,
      error: error ?? undefined,
      refetch,
    }),
    columns: [
      {
        accessorKey: 'nom',
        header: 'Nom',
        cell: ({ getValue }) => (
          <span className="font-semibold">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'prenom',
        header: 'Prénom',
        cell: ({ getValue }) => (
          <span className="font-semibold">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'table',
        header: 'Table',
        cell: ({ row }) => {
          const table = row.original.table;
          return table ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">N°{table.numero}</span>
              <span className="text-gray-500">-</span>
              <span className="text-gray-700">{table.nom}</span>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => {
          const email = getValue() as string | null;
          return (
            <span className="text-gray-500 text-sm">
              {email || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'telephone',
        header: 'Téléphone',
        cell: ({ getValue }) => {
          const tel = getValue() as string | null;
          return (
            <span className="text-gray-500 text-sm">
              {tel || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'confirme',
        header: 'Confirmation',
        cell: ({ getValue, row }) => {
          const status = getValue() as StatutConfirmation;
          const statusConfig = {
            OUI: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmé' },
            NON: { bg: 'bg-red-100', text: 'text-red-800', label: 'Décliné' },
            EN_ATTENTE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' }
          };
          const config = statusConfig[status];
         
          return (
            <select
              data-no-row-click
              value={status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                updateConfirmation({
                  id: row.original.id,
                  confirme: e.target.value as StatutConfirmation
                });
              }}
              className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} cursor-pointer`}
            >
              <option value="EN_ATTENTE">En attente</option>
              <option value="OUI">Confirmé</option>
              <option value="NON">Décliné</option>
            </select>
          );
        },
      },
      {
        accessorKey: 'assiste',
        header: 'Présence',
        cell: ({ getValue, row }) => {
          const assiste = getValue() as boolean | null;
         
          if (assiste === null) {
            return (
              <select
                data-no-row-click
                value="null"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.value !== 'null') {
                    updateAttendance({
                      id: row.original.id,
                      assiste: e.target.value === 'true'
                    });
                  }
                }}
                className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 cursor-pointer"
              >
                <option value="null">Non renseigné</option>
                <option value="true">Présent</option>
                <option value="false">Absent</option>
              </select>
            );
          }
         
          return (
            <select
              data-no-row-click
              value={assiste.toString()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                updateAttendance({
                  id: row.original.id,
                  assiste: e.target.value === 'true'
                });
              }}
              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                assiste
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              <option value="true">Présent</option>
              <option value="false">Absent</option>
            </select>
          );
        },
      },
    ] as ColumnDef<Invite>[],
    addNewButton: {
      label: 'Ajouter un invité',
      onClick: () => router.push('/dashboard/invites/add'),
    },
    // 🔥 Ajout du bouton secondaire pour l'export PDF
    secondaryButton: {
      label: 'Exporter PDF',
      onClick: handleExportPDF,
    },
    actions: [
      {
        label: 'Voir',
        variant: 'primary',
        onClick: (id) => router.push(`/dashboard/invites/${id}/view`),
      },
      {
        label: 'Modifier',
        variant: 'secondary',
        onClick: (id) => router.push(`/dashboard/invites/${id}/edit`),
      },
      {
        label: 'Supprimer',
        variant: 'danger',
        onClick: (id) => handleDeleteClick(id),
      },
    ],
    filters: filterOptions,
    onViewDetails: (invite) => router.push(`/dashboard/invites/${invite.id}/view`),
  }), [invites, isLoading, isFetching, error, refetch, router, handleDeleteClick, handleExportPDF, stats, filterOptions, updateConfirmation, updateAttendance]);

  return (
    <DashboardLayout>
      <ManagementPage config={invitesConfig} />
     
      {/* Modal de confirmation de suppression */}
      <ActionModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.inviteName}
        itemCount={deleteModal.inviteIds.length}
        isProcessing={isDeleting}
        actionType="delete"
      />
    </DashboardLayout>
  );
}