// app/dashboard/tables/[id]/view/page.tsx
"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Hash,
  Users,
  Calendar,
  CheckCircle,
  UserCheck,
  Edit,
  Utensils
} from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { useTable } from '@/hooks/tables/useTable'
import { useTheme } from '@/context/ThemeContext'

export default function TableViewPage() {
  const params = useParams()
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const tableId = String(params.id)

  useEffect(() => {
    if (!tableId || tableId === 'undefined') {
      router.push('/dashboard/tables')
    }
  }, [tableId, router])

  const {
    data: table,
    isLoading,
    error,
  } = useTable(tableId)

  useEffect(() => {
    if (error) {
      router.push('/dashboard/tables')
    }
  }, [error, router])

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
            breadcrumb={["Tables", "Détails de la table"]}
            title="Gestion des tables"
          />
          <SkeletonLoader />
        </div>
      </DashboardLayout>
    )
  }

  if (!table) return null

  const inviteCount = table._count?.invites || 0
  const confirmedCount = table.invites?.filter(i => i.confirme === 'OUI').length || 0
  const attendingCount = table.invites?.filter(i => i.assiste === true).length || 0

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          breadcrumb={["Tables", `Table ${table.numero}`]}
          title="Détails de la table"
        />

        {/* En-tête table */}
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
                    {table.numero}
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Table {table.numero}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {table.nom}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm ml-20">
                  <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <Calendar size={14} />
                    <span>Créée le {formatDate(table.createdAt)}</span>
                  </span>
                </div>
              </div>

              {/* Action rapide */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/tables/${table.id}/edit`)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <Edit size={16} />
                  <span>Modifier</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className={`rounded-2xl border p-6 ${
            isDarkMode
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Utensils size={20} className="text-blue-500" />
              <span>Informations</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Hash size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                <div>
                  <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Numéro
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {table.numero}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                <div>
                  <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Nom de la table
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {table.nom}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar size={18} className={isDarkMode ? 'text-slate-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                <div>
                  <p className={`text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Dernière mise à jour
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {formatDate(table.updatedAt)}
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
              Statistiques des invités
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Total invités
                </p>
                <div className="flex items-center space-x-2">
                  <Users size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {inviteCount}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Confirmés
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {confirmedCount}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Présents
                </p>
                <div className="flex items-center space-x-2">
                  <UserCheck size={20} className="text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">
                    {attendingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des invités */}
        {table.invites && table.invites.length > 0 && (
          <div className={`rounded-2xl border p-6 ${
            isDarkMode
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Invités assignés
            </h3>
            <div className="space-y-2">
              {table.invites.map((invite) => (
                <div
                  key={invite.id}
                  onClick={() => router.push(`/dashboard/invites/${invite.id}/view`)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    isDarkMode
                      ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {invite.prenom} {invite.nom}
                      </p>
                      {invite.email && (
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {invite.email}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {invite.confirme === 'OUI' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmé
                        </span>
                      )}
                      {invite.assiste === true && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Présent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}