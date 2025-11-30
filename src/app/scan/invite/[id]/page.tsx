"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Utensils,
  Hash,
  UserCheck,
  UserX,
  Settings,
  Eye,
  Download,
  Printer,
  QrCode
} from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { useInvite } from '@/hooks/invites/useInvite'
import { useUpdateInviteAttendance } from '@/hooks/invites/useUpdateInviteAttendance'
import { useMessages } from '@/context/useMessage'
import { useTheme } from '@/context/ThemeContext'
import { StatutConfirmation } from '@/types/table.types'
import InvitePreferencesForm from '@/components/invites/InvitePreferencesForm'

export default function InviteCompletePage() {
  const params = useParams()
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const inviteId = String(params.id)
  
  const [activeTab, setActiveTab] = useState<'info' | 'preferences'>('info')

  useEffect(() => {
    if (!inviteId || inviteId === 'undefined') {
      router.push('/dashboard/invites')
    }
  }, [inviteId, router])

  const { setMessage } = useMessages()
  const {
    data: invite,
    isLoading,
    error,
  } = useInvite(inviteId)

  const updateAttendance = useUpdateInviteAttendance()

  useEffect(() => {
    if (error) {
      setMessage('Invité non trouvé', 'error')
      router.push('/dashboard/invites')
    }
  }, [error, router, setMessage])

  const handleMarkPresent = async () => {
    if (!invite) return
    
    try {
      await updateAttendance.mutateAsync({
        id: invite.id,
        assiste: true
      })
      setMessage('Présence confirmée avec succès', 'success')
    } catch (err) {
      setMessage('Erreur lors de la confirmation de présence', 'error')
    }
  }

  const handleMarkAbsent = async () => {
    if (!invite) return
    
    try {
      await updateAttendance.mutateAsync({
        id: invite.id,
        assiste: false
      })
      setMessage('Absence enregistrée', 'success')
    } catch (err) {
      setMessage('Erreur lors de l\'enregistrement', 'error')
    }
  }

  const getConfirmationConfig = (status: StatutConfirmation) => {
    const configs = {
      [StatutConfirmation.OUI]: {
        color: 'text-green-600',
        icon: CheckCircle,
        label: 'Confirmé',
        bgLight: 'bg-green-50 border-green-200',
        bgDark: 'bg-green-500/10 border-green-500/30'
      },
      [StatutConfirmation.NON]: {
        color: 'text-red-600',
        icon: XCircle,
        label: 'Décliné',
        bgLight: 'bg-red-50 border-red-200',
        bgDark: 'bg-red-500/10 border-red-500/30'
      },
      [StatutConfirmation.EN_ATTENTE]: {
        color: 'text-yellow-600',
        icon: Clock,
        label: 'En attente',
        bgLight: 'bg-yellow-50 border-yellow-200',
        bgDark: 'bg-yellow-500/10 border-yellow-500/30'
      }
    }
    return configs[status]
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
      <div className={`h-32 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`h-96 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
        <div className={`h-96 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <PageHeader
            breadcrumb={["Invités", "Détails de l'invité"]}
            title="Gestion des invités"
          />
          <SkeletonLoader />
        </div>
      </DashboardLayout>
    )
  }

  if (!invite) return null

  const confirmConfig = getConfirmationConfig(invite.confirme || StatutConfirmation.EN_ATTENTE)
  const ConfirmIcon = confirmConfig.icon

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          breadcrumb={["Invités", `${invite.prenom} ${invite.nom}`]}
          title="Détails de l'invité"
        />

        {/* En-tête invité */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {invite.prenom[0]}{invite.nom[0]}
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invite.prenom} {invite.nom}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                        isDarkMode ? confirmConfig.bgDark : confirmConfig.bgLight
                      }`}>
                        <ConfirmIcon size={14} className={confirmConfig.color} />
                        <span className={`text-xs font-semibold ${confirmConfig.color}`}>
                          {confirmConfig.label}
                        </span>
                      </div>
                      {invite.assiste !== null && (
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                          invite.assiste
                            ? isDarkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                            : isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                        }`}>
                          {invite.assiste ? (
                            <>
                              <UserCheck size={14} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-600">Présent</span>
                            </>
                          ) : (
                            <>
                              <UserX size={14} className="text-red-600" />
                              <span className="text-xs font-semibold text-red-600">Absent</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm ml-20">
                  <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <Calendar size={14} />
                    <span>Ajouté le {formatDate(invite.createdAt)}</span>
                  </span>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/invites/${invite.id}/qr`)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isDarkMode
                      ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  <QrCode size={16} />
                  <span>QR Code</span>
                </button>
                {invite.assiste === null && (
                  <>
                    <button
                      onClick={handleMarkPresent}
                      disabled={updateAttendance.isPending}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                        isDarkMode
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      <UserCheck size={16} />
                      <span>Présent</span>
                    </button>
                    <button
                      onClick={handleMarkAbsent}
                      disabled={updateAttendance.isPending}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                        isDarkMode
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } disabled:opacity-50`}
                    >
                      <UserX size={16} />
                      <span>Absent</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className={`flex border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'info'
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={18} />
              <span>Informations</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'preferences'
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings size={18} />
              <span>Préférences</span>
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'info' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de contact */}
            <div className={`rounded-2xl border p-6 ${
              isDarkMode
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <User size={20} className="text-blue-500" />
                <span>Informations de contact</span>
              </h3>
              <div className="space-y-4">
                {invite.email && (
                  <div className="flex items-start space-x-3">
                    <Mail size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Email
                      </p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {invite.email}
                      </p>
                    </div>
                  </div>
                )}
                {invite.telephone && (
                  <div className="flex items-start space-x-3">
                    <Phone size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Téléphone
                      </p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {invite.telephone}
                      </p>
                    </div>
                  </div>
                )}
                {invite.table && (
                  <div className="flex items-start space-x-3">
                    <Utensils size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Table assignée
                      </p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        Table {invite.table.numero} - {invite.table.nom}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <Calendar size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                  <div>
                    <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      Dernière mise à jour
                    </p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {formatDate(invite.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className={`rounded-2xl border p-6 ${
              isDarkMode
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Statut de l'invitation
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Confirmation
                  </p>
                  <div className="flex items-center space-x-2">
                    <ConfirmIcon size={20} className={confirmConfig.color} />
                    <span className={`text-lg font-bold ${confirmConfig.color}`}>
                      {confirmConfig.label}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Présence
                  </p>
                  <div className="flex items-center space-x-2">
                    {invite.assiste === true ? (
                      <>
                        <UserCheck size={20} className="text-green-600" />
                        <span className="text-lg font-bold text-green-600">Présent</span>
                      </>
                    ) : invite.assiste === false ? (
                      <>
                        <UserX size={20} className="text-red-600" />
                        <span className="text-lg font-bold text-red-600">Absent</span>
                      </>
                    ) : (
                      <>
                        <Clock size={20} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Non défini
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    ID Invité
                  </p>
                  <div className="flex items-center space-x-2">
                    <Hash size={20} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {invite.id.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <InvitePreferencesForm inviteId={inviteId} />
        )}
      </div>
    </DashboardLayout>
  )
}