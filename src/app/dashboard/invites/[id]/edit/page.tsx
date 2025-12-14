'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { useInviteStore } from '@/store/inviteStore'
import { InviteEtendu } from '@/types/invite-extended.types'
import InviteForm from '@/components/forms/InviteForm'
import { updateInvite, getInviteById } from '@/services/invite.service'
import { getTables } from '@/services/table.service'
import { useMessages } from '@/context/useMessage'
import { InviteFormData } from '@/components/forms/InviteForm'
import { useTheme } from '@/context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { StatutConfirmation } from '@/types/table.types'

export default function EditInvitePage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setMessage } = useMessages()
  const { setLoading, setError } = useInviteStore()
  const { isDarkMode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tables, setTables] = useState<Array<{ id: string; numero: number; nom: string }>>([])
  const [isLoadingTables, setIsLoadingTables] = useState(true)
 
  const inviteId = params.id as string
  
  // Vérification de l'ID et redirection si invalide
  useEffect(() => {
    if (!inviteId) {
      setMessage('ID d&apos;invité invalide', 'error')
      router.push('/dashboard/invites')
    }
  }, [inviteId, router, setMessage])

  // Charger l'invité
  const {
    data: invite,
    isLoading: isLoadingInvite,
    status,
  } = useQuery<InviteEtendu>({
    queryKey: ['invite', inviteId],
    queryFn: async () => {
      const data = await getInviteById(inviteId)
      // Transformer Invite en InviteEtendu
      return {
        ...data,
        confirme: data.confirme || StatutConfirmation.EN_ATTENTE,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        boissons: data.boissons || [],
        livreOr: data.livreOr || null,
        cadeaux: data.cadeaux || [],
      } as InviteEtendu
    },
    enabled: !!inviteId,
  })

  // Charger les tables
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

  // Gestion des erreurs de chargement de l'invité
  useEffect(() => {
    if (status === 'error') {
      setMessage('Invité non trouvé', 'error')
      router.push('/dashboard/invites')
    }
  }, [status, router, setMessage])

  const onSubmit = async (data: InviteFormData) => {
    if (!invite) return
    
    setIsSubmitting(true)
    setLoading(true)
    
    try {
      const inviteUpdateData = {
        id: inviteId,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || null,
        telephone: data.telephone || null,
        confirme: data.confirme,
        assiste: data.assiste ?? false,
        tableId: data.tableId,
      }

      console.log('Données envoyées à l&apos;API:', inviteUpdateData);

      const updatedInvite = await updateInvite(inviteUpdateData)

      const formattedInvite: InviteEtendu = {
        id: updatedInvite.id,
        nom: updatedInvite.nom,
        prenom: updatedInvite.prenom,
        email: updatedInvite.email,
        telephone: updatedInvite.telephone,
        confirme: updatedInvite.confirme || StatutConfirmation.EN_ATTENTE,
        assiste: updatedInvite.assiste,
        tableId: updatedInvite.tableId,
        createdAt: new Date(updatedInvite.createdAt),
        updatedAt: new Date(updatedInvite.updatedAt),
        table: updatedInvite.table,
        boissons: updatedInvite.boissons || [],
        livreOr: updatedInvite.livreOr || null,
        cadeaux: updatedInvite.cadeaux || [],
      }

      // Mise à jour du cache React Query
      queryClient.setQueryData<InviteEtendu[]>(['invites'], (old = []) =>
        old ? old.map(i => i.id === inviteId ? formattedInvite : i) : []
      )

      // Mise à jour du cache pour l'invité spécifique
      queryClient.setQueryData(['invite', inviteId], formattedInvite)

      // Invalidation des queries pour forcer le rechargement
      await queryClient.invalidateQueries({ queryKey: ['invites'] })
      await queryClient.invalidateQueries({ queryKey: ['invites', data.tableId] })
      await queryClient.invalidateQueries({ queryKey: ['invite', inviteId] })
      await queryClient.invalidateQueries({ queryKey: ['tables'] })
      await queryClient.invalidateQueries({ queryKey: ['table', data.tableId] })

      setMessage('Invité mis à jour avec succès', 'success')
      router.push('/dashboard/invites')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      setError(errorMessage)
      setMessage(errorMessage, 'error')
      console.error('Erreur lors de la mise à jour:', err);
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  // État de chargement
  if (isLoadingInvite || isLoadingTables) {
    return (
      <DashboardLayout>
        <div className="max-w-full">
          <PageHeader
            breadcrumb={['Invités', 'Modifier un invité']}
            title="Gestion des invités"
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
          breadcrumb={['Invités', 'Modifier un invité']}
          title='Gestion des invités'
        />
       
        <div className={`
          rounded-lg p-6 shadow-sm transition-all duration-300
          ${isDarkMode
            ? 'bg-gray-800/90 border border-gray-700 shadow-gray-900/20'
            : 'bg-white border border-gray-200 shadow-gray-100/50'
          }
        `}>
          {invite && (
            <InviteForm
              onSubmit={onSubmit}
              initialData={invite}
              isSubmitting={isSubmitting}
              submitButtonText='Mettre à jour'
              tables={tables}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}