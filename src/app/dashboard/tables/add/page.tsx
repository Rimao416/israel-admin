// app/dashboard/tables/add/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import TableForm from '@/components/forms/TableForm'
import { createTable } from '@/services/table.service'
import { useMessages } from '@/context/useMessage'
import { TableFormData } from '@/components/forms/TableForm'
import { useTheme } from '@/context/ThemeContext'
import { useTableStore } from '@/store/tableStore'

export default function AddTablePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setMessage } = useMessages()
  const { setLoading, setError } = useTableStore()
  const { isDarkMode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: TableFormData) => {
    setIsSubmitting(true)
    setLoading(true)

    try {
      const newTable = await createTable({
        numero: data.numero,
        nom: data.nom,
      })

      // Mise à jour du cache React Query
      queryClient.setQueryData<typeof newTable[]>(['tables'], (old = []) => [
        ...old,
        newTable,
      ])

      // Invalider et refetch les requêtes liées
      queryClient.invalidateQueries({ queryKey: ['tables'] })

      setMessage('Table créée avec succès', 'success')
      router.push('/dashboard/tables')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      setError(errorMessage)
      setMessage(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className='max-w-full'>
        <PageHeader
          breadcrumb={['Tables', 'Ajouter une nouvelle table']}
          title='Gestion des tables'
        />

        <div className={`
          rounded-lg p-6 shadow-sm transition-all duration-300
          ${isDarkMode
            ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
            : 'bg-white border border-gray-200 shadow-gray-100/50'
          }
        `}>
          <TableForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitButtonText='Ajouter la table'
          />
        </div>
      </div>
    </DashboardLayout>
  )
}