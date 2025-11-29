// app/dashboard/tables/page.tsx
'use client';

import { Table } from "@/types/table.types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useTables } from "@/hooks/tables/useTables";
import ActionModal from "@/components/common/ActionModal";
import { useDeleteTable } from "@/hooks/tables/useDeleteTable";
import { useTableStore } from "@/store/tableStore";
DataTable
import { Plus } from "lucide-react";
import { DataTable,FilterOption } from "@/components/common/Datatable";

export default function TablesPage() {
  const router = useRouter();
  const { data: tables, isLoading, isFetching, error, refetch } = useTables();
  const { mutate: deleteTables, isPending: isDeleting } = useDeleteTable();
  const { getTableStats } = useTableStore();
 
  // État pour le modal de suppression
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    tableIds: string[];
    tableName: string;
  }>({
    isOpen: false,
    tableIds: [],
    tableName: ''
  });

  // Ouvrir le modal de suppression
  const handleDeleteClick = useCallback((id: string) => {
    const table = tables?.find(t => t.id === id);
    const tableName = table ? `Table ${table.numero} - ${table.nom}` : 'table';
   
    setDeleteModal({
      isOpen: true,
      tableIds: [id],
      tableName: tableName
    });
  }, [tables]);

  // Confirmer suppression
  const handleConfirmDelete = () => {
    deleteTables(deleteModal.tableIds, {
      onSuccess: () => {
        setDeleteModal({ isOpen: false, tableIds: [], tableName: '' });
        console.log('Table supprimée avec succès');
        refetch();
      },
      onError: (error) => {
        console.error('Erreur lors de la suppression de la table:', error);
        setDeleteModal({ isOpen: false, tableIds: [], tableName: '' });
      },
    });
  };

  // Fermer le modal
  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, tableIds: [], tableName: '' });
    }
  };

  // Statistiques
  const stats = useMemo(() => getTableStats(), [tables, getTableStats]);

  // Pas de filtres pour les tables (ou ajoutez-en selon vos besoins)
  const filterOptions: FilterOption[] = useMemo(() => [], []);

  // Colonnes
  const columns: ColumnDef<Table>[] = useMemo(() => [
    {
      accessorKey: 'numero',
      header: 'N°',
      cell: ({ getValue }) => (
        <span className="font-bold text-lg text-primary">
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'nom',
      header: 'Nom de la table',
      cell: ({ getValue }) => (
        <span className="font-semibold text-lg">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: '_count.invites',
      header: 'Nombre d\'invités',
      cell: ({ row }) => {
        const count = row.original._count?.invites || 0;
        return (
          <span className="text-gray-700 dark:text-gray-300">
            {count} {count > 1 ? 'invités' : 'invité'}
          </span>
        );
      },
    },
    {
      id: 'confirmes',
      header: 'Confirmés',
      cell: ({ row }) => {
        const invites = row.original.invites || [];
        const confirmed = invites.filter(i => i.confirme === 'OUI').length;
        const total = invites.length;
        return (
          <span className="text-green-600 dark:text-green-400 font-medium">
            {confirmed}/{total}
          </span>
        );
      },
    },
    {
      id: 'presents',
      header: 'Présents',
      cell: ({ row }) => {
        const invites = row.original.invites || [];
        const attending = invites.filter(i => i.assiste === true).length;
        const total = invites.length;
        return (
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {attending}/{total}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date de création',
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {date.toLocaleDateString('fr-FR')}
          </span>
        );
      },
    },
  ], []);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* En-tête avec statistiques */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestion des tables
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stats.totalTables} tables • {stats.totalInvites} invités
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/tables/add')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter une table
            </button>
          </div>
        </div>

        {/* DataTable avec actions */}
        <DataTable
          data={tables || []}
          columns={columns}
          title="Liste des tables"
          loading={isLoading || isFetching}
          error={error?.message || null}
          onView={(id) => router.push(`/dashboard/tables/${id}/view`)}
          onEdit={(id) => router.push(`/dashboard/tables/${id}/edit`)}
          onDelete={handleDeleteClick}
          onViewDetails={(table) => router.push(`/dashboard/tables/${table.id}/view`)}
          filterOptions={filterOptions}
          keyExtractor={(table) => table.id}
        />
      </div>
     
      {/* Modal de confirmation de suppression */}
      <ActionModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.tableName}
        itemCount={deleteModal.tableIds.length}
        isProcessing={isDeleting}
        actionType="delete"
      />
    </DashboardLayout>
  );
}