'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { InviteEtendu } from '@/types/invite-extended.types'
import InviteForm from '@/components/forms/InviteForm'
import { createInvite } from '@/services/invite.service'
import { getTables } from '@/services/table.service'
import { useMessages } from '@/context/useMessage'
import { InviteFormData } from '@/components/forms/InviteForm'
import { useTheme } from '@/context/ThemeContext'
import { useInviteStore } from '@/store/inviteStore'

export default function AddInvitePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setMessage } = useMessages()
  const { setLoading, setError } = useInviteStore()
  const { isDarkMode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tables, setTables] = useState<Array<{ id: string; numero: number; nom: string }>>([])
  const [isLoadingTables, setIsLoadingTables] = useState(true)

  // Charger les tables au montage pour le sélecteur
  useEffect(() => {
    const loadTables = async () => {
      try {
        setIsLoadingTables(true)
        const tablesData = await getTables()
        setTables(tablesData.map(t => ({
          id: t.id,
          numero: t.numero,
          nom: t.nom
        })))
      } catch (error) {
        console.error('Erreur lors du chargement des tables:', error)
        setMessage('Erreur lors du chargement des tables', 'error')
      } finally {
        setIsLoadingTables(false)
      }
    }

    loadTables()
  }, [setMessage])

  const onSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true)
    setLoading(true)
    
    try {
      const newInvite = await createInvite({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || undefined,
        telephone: data.telephone || undefined,
        confirme: data.confirme,
        assiste: data.assiste ?? false,
        tableId: data.tableId,
      })
     
      const formattedInvite: InviteEtendu = {
        id: newInvite.id,
        nom: newInvite.nom,
        prenom: newInvite.prenom,
        email: newInvite.email,
        telephone: newInvite.telephone,
        confirme: newInvite.confirme,
        assiste: newInvite.assiste,
        tableId: newInvite.tableId,
        createdAt: new Date(newInvite.createdAt),
        updatedAt: new Date(newInvite.updatedAt),
        table: newInvite.table,
        boissons: newInvite.boissons || [],
        livreOr: newInvite.livreOr || null,
        cadeaux: newInvite.cadeaux || [],
      }
     
      // Mise à jour du cache React Query
      queryClient.setQueryData<InviteEtendu[]>(['invites'], (old = []) => [
        ...old,
        formattedInvite,
      ])

      // Invalider et refetch les requêtes liées
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      queryClient.invalidateQueries({ queryKey: ['invites', data.tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['table', data.tableId] })
     
      setMessage('Invité créé avec succès', 'success')
      router.push('/dashboard/invites')
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

  if (isLoadingTables) {
    return (
      <DashboardLayout>
        <div className='max-w-full'>
          <PageHeader
            breadcrumb={['Invités', 'Ajouter un nouvel invité']}
            title='Gestion des invités'
          />
          <div className={`
            rounded-lg p-6 shadow-sm transition-all duration-300 flex justify-center items-center h-64
            ${isDarkMode
              ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
              : 'bg-white border border-gray-200 shadow-gray-100/50'
            }
          `}>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Chargement des tables...
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
          breadcrumb={['Invités', 'Ajouter un nouvel invité']}
          title='Gestion des invités'
        />
       
        <div className={`
          rounded-lg p-6 shadow-sm transition-all duration-300
          ${isDarkMode
            ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
            : 'bg-white border border-gray-200 shadow-gray-100/50'
          }
        `}>
          <InviteForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitButtonText='Ajouter '
            tables={tables}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}