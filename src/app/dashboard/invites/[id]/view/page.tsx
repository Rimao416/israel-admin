"use client"
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import QRCode from 'qrcode'
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  QrCode,
  UserCheck,
  UserX,
  Printer,
  Share2,
  AlertCircle,
  Utensils,
  Hash
} from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { useInvite } from '@/hooks/invites/useInvite'
import { useUpdateInviteAttendance } from '@/hooks/invites/useUpdateInviteAttendance'
import { useMessages } from '@/context/useMessage'
import { useTheme } from '@/context/ThemeContext'
import { StatutConfirmation } from '@/types/table.types'

export default function InviteDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const inviteId = String(params.id)
  const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

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

  // Générer le QR Code
  useEffect(() => {
    if (invite && qrCodeCanvasRef.current) {
      generateQRCode()
    }
  }, [invite, isDarkMode])

  const generateQRCode = async () => {
    if (!invite) return
    
    setIsGeneratingQR(true)
    try {
      // URL de scan qui confirmera automatiquement la présence
      const qrData = `${window.location.origin}/scan/invite/${invite.id}`
      
      const canvas = qrCodeCanvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: isDarkMode ? '#ffffff' : '#000000',
            light: isDarkMode ? '#1e293b' : '#ffffff'
          }
        })
        
        // Générer aussi en data URL pour téléchargement
        const dataUrl = await QRCode.toDataURL(qrData, {
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        setQrCodeDataUrl(dataUrl)
      }
    } catch (err) {
      console.error('Erreur génération QR:', err)
      setMessage('Erreur lors de la génération du QR code', 'error')
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl || !invite) return
    
    const link = document.createElement('a')
    link.download = `qrcode-${invite.nom}-${invite.prenom}.png`
    link.href = qrCodeDataUrl
    link.click()
    setMessage('QR Code téléchargé avec succès', 'success')
  }

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow && invite) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${invite.prenom} ${invite.nom}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .container {
                text-align: center;
                padding: 40px;
              }
              h1 { margin-bottom: 10px; font-size: 24px; }
              .info { margin: 20px 0; color: #666; }
              img { border: 2px solid #000; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${invite.prenom} ${invite.nom}</h1>
              <div class="info">
                ${invite.table ? `Table ${invite.table.numero} - ${invite.table.nom}` : ''}
              </div>
              <img src="${qrCodeDataUrl}" alt="QR Code" />
              <div class="info" style="margin-top: 20px;">
                Scannez ce code pour confirmer la présence
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => printWindow.print(), 250)
    }
  }

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
                    <span>Ajouté le {format(new Date(invite.createdAt), 'd MMMM yyyy', { locale: fr })}</span>
                  </span>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex items-center space-x-2">
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
                      <span>Marquer présent</span>
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
                      <span>Marquer absent</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
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
                    {format(new Date(invite.updatedAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className={`rounded-2xl border p-6 ${
            isDarkMode
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <QrCode size={20} className="text-purple-500" />
              <span>QR Code de présence</span>
            </h3>
            
            <div className="space-y-4">
              <div className={`flex justify-center p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'
              }`}>
                <canvas ref={qrCodeCanvasRef} className="max-w-full h-auto" />
              </div>

              <div className={`p-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    Le scan de ce QR code confirmera automatiquement la présence de l'invité
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadQR}
                  disabled={!qrCodeDataUrl || isGeneratingQR}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Download size={16} />
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={handlePrintQR}
                  disabled={!qrCodeDataUrl || isGeneratingQR}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isDarkMode
                      ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Printer size={16} />
                  <span>Imprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques supplémentaires */}
        <div className={`rounded-2xl border p-6 ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Statut de l'invitation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </DashboardLayout>
  )
}