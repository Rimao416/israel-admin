"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Utensils,
  Calendar,
  AlertCircle,
  Loader2,
  UserCheck,
  ArrowRight
} from 'lucide-react'
import { useInvite } from '@/hooks/invites/useInvite'
import { useUpdateInviteAttendance } from '@/hooks/invites/useUpdateInviteAttendance'
import { useMessages } from '@/context/useMessage'
import { useTheme } from '@/context/ThemeContext'
import { StatutConfirmation } from '@/types/table.types'

export default function InviteScanPage() {
  const params = useParams()
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const inviteId = String(params.id)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { setMessage } = useMessages()
  const {
    data: invite,
    isLoading,
    error,
  } = useInvite(inviteId)

  const updateAttendance = useUpdateInviteAttendance()

  useEffect(() => {
    if (error) {
      setErrorMessage('Invité non trouvé')
    }
  }, [error])

  // Confirmer automatiquement la présence au chargement
  useEffect(() => {
    if (invite && !isProcessing && !scanSuccess && invite.assiste !== true) {
      confirmAttendance()
    }
  }, [invite])

  const confirmAttendance = async () => {
    if (!invite || isProcessing) return

    setIsProcessing(true)
    try {
      await updateAttendance.mutateAsync({
        id: invite.id,
        assiste: true
      })
      setScanSuccess(true)
      setMessage('Présence confirmée avec succès !', 'success')
    } catch (err) {
      setErrorMessage('Erreur lors de la confirmation de présence')
      setMessage('Erreur lors de la confirmation', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-md w-full text-center space-y-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <Loader2 size={48} className="animate-spin mx-auto text-blue-500" />
        <h2 className="text-2xl font-bold">Vérification en cours...</h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
          Veuillez patienter
        </p>
      </div>
    </div>
  )

  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-2xl border p-8 text-center space-y-4 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <XCircle size={48} className="text-red-500" />
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Erreur
        </h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
          {errorMessage || 'Une erreur est survenue'}
        </p>
        <button
          onClick={() => router.push('/dashboard/invites')}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
            isDarkMode
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Retour à la liste
        </button>
      </div>
    </div>
  )

  if (isLoading || isProcessing) {
    return <LoadingState />
  }

  if (errorMessage || !invite) {
    return <ErrorState />
  }

  const getConfirmationConfig = (status: StatutConfirmation) => {
    const configs = {
      [StatutConfirmation.OUI]: {
        color: 'text-green-600',
        icon: CheckCircle,
        label: 'Confirmé'
      },
      [StatutConfirmation.NON]: {
        color: 'text-red-600',
        icon: XCircle,
        label: 'Décliné'
      },
      [StatutConfirmation.EN_ATTENTE]: {
        color: 'text-yellow-600',
        icon: AlertCircle,
        label: 'En attente'
      }
    }
    return configs[status]
  }

  const confirmConfig = getConfirmationConfig(invite.confirme || StatutConfirmation.EN_ATTENTE)
  const ConfirmIcon = confirmConfig.icon

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-2xl w-full rounded-2xl border overflow-hidden ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* En-tête de succès */}
        <div className={`p-8 text-center border-b ${
          scanSuccess
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10'
            : invite.assiste === true
            ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
            : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
        } ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            scanSuccess || invite.assiste === true
              ? 'bg-green-500/20'
              : 'bg-blue-500/20'
          }`}>
            {scanSuccess || invite.assiste === true ? (
              <UserCheck size={48} className="text-green-500" />
            ) : (
              <User size={48} className="text-blue-500" />
            )}
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {scanSuccess
              ? 'Présence confirmée !'
              : invite.assiste === true
              ? 'Déjà enregistré'
              : 'Scan réussi'}
          </h1>
          
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {scanSuccess
              ? 'L\'invité a été marqué comme présent'
              : invite.assiste === true
              ? 'Cet invité est déjà marqué comme présent'
              : 'Vérification des informations...'}
          </p>
        </div>

        {/* Informations de l'invité */}
        <div className="p-8 space-y-6">
          {/* Nom */}
          <div className="text-center pb-6 border-b border-dashed">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              {invite.prenom[0]}{invite.nom[0]}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {invite.prenom} {invite.nom}
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                isDarkMode
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-green-50 border-green-200'
              }`}>
                <ConfirmIcon size={14} className={confirmConfig.color} />
                <span className={`text-xs font-semibold ${confirmConfig.color}`}>
                  {confirmConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-4">
            {invite.email && (
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <Mail size={18} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Email
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {invite.email}
                  </p>
                </div>
              </div>
            )}

            {invite.telephone && (
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <Phone size={18} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Téléphone
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {invite.telephone}
                  </p>
                </div>
              </div>
            )}

            {invite.table && (
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <Utensils size={18} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Table assignée
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Table {invite.table.numero} - {invite.table.nom}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
              }`}>
                <Calendar size={18} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  Heure de scan
                </p>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {formatDate(new Date())}
                </p>
              </div>
            </div>
          </div>

          {/* Statut de présence */}
          {(scanSuccess || invite.assiste === true) && (
            <div className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-500" />
                <div className="flex-1">
                  <p className={`font-semibold text-green-600`}>
                    Présence enregistrée
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400/80' : 'text-green-700/80'}`}>
                    L'invité peut maintenant accéder à l'événement
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => router.push(`/dashboard/invites/${invite.id}`)}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                isDarkMode
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <span>Voir les détails complets</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/dashboard/invites')}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Retour à la liste des invités
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}