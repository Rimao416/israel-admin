// app/dashboard/tables/[id]/edit/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { useTableStore } from '@/store/tableStore'
import TableForm from '@/components/forms/TableForm'
import { updateTable, getTableById } from '@/services/table.service'
import { useMessages } from '@/context/useMessage'
import { TableFormData } from '@/components/forms/TableForm'
import { useTheme } from '@/context/ThemeContext'
import { useQuery } from '@tanstack/react-query'

export default function EditTablePage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setMessage } = useMessages()
  const { setLoading, setError } = useTableStore()
  const { isDarkMode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tableId = params.id as string

  // Vérification de l'ID et redirection si invalide
  useEffect(() => {
    if (!tableId) {
      setMessage('ID de table invalide', 'error')
      router.push('/dashboard/tables')
    }
  }, [tableId, router, setMessage])

  // Charger la table
  const {
    data: table,
    isLoading: isLoadingTable,
    status,
  } = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const data = await getTableById(tableId)
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    },
    enabled: !!tableId,
  })

  // Gestion des erreurs de chargement de la table
  useEffect(() => {
    if (status === 'error') {
      setMessage('Table non trouvée', 'error')
      router.push('/dashboard/tables')
    }
  }, [status, router, setMessage])

  const onSubmit = async (data: TableFormData) => {
    if (!table) return

    setIsSubmitting(true)
    setLoading(true)

    try {
      const tableUpdateData = {
        id: tableId,
        numero: data.numero,
        nom: data.nom,
      }

      console.log('Données envoyées à l\'API:', tableUpdateData)

      const updatedTable = await updateTable(tableUpdateData)

      const formattedTable = {
        ...updatedTable,
        createdAt: new Date(updatedTable.createdAt),
        updatedAt: new Date(updatedTable.updatedAt),
      }

      // Mise à jour du cache React Query
      queryClient.setQueryData(['tables'], (old: typeof formattedTable[] = []) =>
        old ? old.map(t => t.id === tableId ? formattedTable : t) : []
      )

      // Mise à jour du cache pour la table spécifique
      queryClient.setQueryData(['table', tableId], formattedTable)

      // Invalidation des queries pour forcer le rechargement
      await queryClient.invalidateQueries({ queryKey: ['tables'] })
      await queryClient.invalidateQueries({ queryKey: ['table', tableId] })

      setMessage('Table mise à jour avec succès', 'success')
      router.push('/dashboard/tables')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      setError(errorMessage)
      setMessage(errorMessage, 'error')
      console.error('Erreur lors de la mise à jour:', err)
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  // État de chargement
  if (isLoadingTable) {
    return (
      <DashboardLayout>
        <div className="max-w-full">
          <PageHeader
            breadcrumb={['Tables', 'Modifier une table']}
            title="Gestion des tables"
          />
          <div className={`
            rounded-lg p-6 shadow-sm transition-all duration-300 flex justify-center items-center h-64
            ${isDarkMode
              ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
              : 'bg-white border border-gray-200 shadow-gray-100/50'
            }
          `}>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Chargement des données...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='max-w-full'>
        <PageHeader
          breadcrumb={['Tables', 'Modifier une table']}
          title='Gestion des tables'
        />

        <div className={`
          rounded-lg p-6 shadow-sm transition-all duration-300
          ${isDarkMode
            ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
            : 'bg-white border border-gray-200 shadow-gray-100/50'
          }
        `}>
          {table && (
            <TableForm
              onSubmit={onSubmit}
              initialData={table}
              isSubmitting={isSubmitting}
              submitButtonText='Mettre à jour'
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}