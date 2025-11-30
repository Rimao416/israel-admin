"use client"
import { useState } from 'react'
import {
  Wine,
  BookOpen,
  Gift,
  Plus,
  Trash2,
  Check,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useMessages } from '@/context/useMessage'
import {
  useInvitePreferences,
  useAddBoissonPreference,
  useRemoveBoissonPreference,
  useCreateOrUpdateLivreOr,
  useCreateCadeau,
  useDeleteCadeau,
} from '@/hooks/invites/useInvitePreferences'
import {
  TypeBoisson,
  CategorieCadeau,
  AppareilElectromenager,
  BOISSON_LABELS,
  CATEGORIE_CADEAU_LABELS,
  APPAREIL_LABELS,
  BOISSONS_DISPONIBLES,
  CATEGORIES_CADEAUX,
  APPAREILS_DISPONIBLES,
  MESSAGE_LIVRE_OR_DEFAULT,
} from '@/types/invite-extended.types'

interface InvitePreferencesFormProps {
  inviteId: string
}

export default function 
({ inviteId }: InvitePreferencesFormProps) {
  const { isDarkMode } = useTheme()
  const { setMessage } = useMessages()
  
  const { boissons, livreOr, cadeaux, isLoading } = useInvitePreferences(inviteId)
  
  const addBoisson = useAddBoissonPreference()
  const removeBoisson = useRemoveBoissonPreference()
  const updateLivreOr = useCreateOrUpdateLivreOr()
  const createCadeau = useCreateCadeau()
  const deleteCadeau = useDeleteCadeau()
  
  const [livreOrMessage, setLivreOrMessage] = useState(
    livreOr.data?.message || MESSAGE_LIVRE_OR_DEFAULT
  )
  const [selectedCategorie, setSelectedCategorie] = useState<CategorieCadeau | null>(null)
  const [selectedAppareil, setSelectedAppareil] = useState<AppareilElectromenager | null>(null)
  const [cadeauDescription, setCadeauDescription] = useState('')
  const [montantEspeces, setMontantEspeces] = useState('')
  
  const [openSections, setOpenSections] = useState({
    boissons: true,
    livreOr: true,
    cadeaux: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleAddBoisson = async (boisson: TypeBoisson) => {
    try {
      await addBoisson.mutateAsync({
        inviteId,
        boisson,
        quantite: 1,
      })
      setMessage('Boisson ajoutée avec succès', 'success')
    } catch (error) {
      setMessage('Erreur lors de l\'ajout de la boisson', 'error')
    }
  }

  const handleRemoveBoisson = async (boissonId: string) => {
    try {
      await removeBoisson.mutateAsync({ inviteId, boissonId })
      setMessage('Boisson retirée', 'success')
    } catch (error) {
      setMessage('Erreur lors de la suppression', 'error')
    }
  }

  const handleSaveLivreOr = async () => {
    try {
      await updateLivreOr.mutateAsync({
        inviteId,
        message: livreOrMessage,
      })
      setMessage('Livre d\'or mis à jour', 'success')
    } catch (error) {
      setMessage('Erreur lors de la mise à jour', 'error')
    }
  }

  const handleAddCadeau = async () => {
    if (!selectedCategorie) {
      setMessage('Veuillez sélectionner une catégorie', 'error')
      return
    }

    try {
      const data: any = {
        inviteId,
        categorie: selectedCategorie,
      }

      if (selectedCategorie === CategorieCadeau.APPAREILS_ELECTROMENAGERS) {
        if (!selectedAppareil) {
          setMessage('Veuillez sélectionner un appareil', 'error')
          return
        }
        data.appareilElectromenager = selectedAppareil
      } else if (selectedCategorie === CategorieCadeau.DONS_ESPECES) {
        if (!montantEspeces) {
          setMessage('Veuillez entrer un montant', 'error')
          return
        }
        data.montantEspeces = parseFloat(montantEspeces)
      } else {
        if (!cadeauDescription) {
          setMessage('Veuillez entrer une description', 'error')
          return
        }
        data.description = cadeauDescription
      }

      await createCadeau.mutateAsync(data)
      setMessage('Cadeau ajouté avec succès', 'success')
      
      // Reset form
      setSelectedCategorie(null)
      setSelectedAppareil(null)
      setCadeauDescription('')
      setMontantEspeces('')
    } catch (error) {
      setMessage('Erreur lors de l\'ajout du cadeau', 'error')
    }
  }

  const handleDeleteCadeau = async (cadeauId: string) => {
    try {
      await deleteCadeau.mutateAsync({ inviteId, cadeauId })
      setMessage('Cadeau supprimé', 'success')
    } catch (error) {
      setMessage('Erreur lors de la suppression', 'error')
    }
  }

  const boissonIds = new Set(boissons.data?.map(b => b.boisson) || [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className={`h-48 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`} />
        <div className={`h-48 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`} />
        <div className={`h-48 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Boissons */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection('boissons')}
          className={`w-full p-4 flex items-center justify-between transition-colors ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Wine size={24} className="text-purple-500" />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Préférences de boissons
            </h3>
            {boissons.data && boissons.data.length > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              }`}>
                {boissons.data.length}
              </span>
            )}
          </div>
          {openSections.boissons ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {openSections.boissons && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BOISSONS_DISPONIBLES.map((boisson) => {
                const isSelected = boissonIds.has(boisson)
                const boissonData = boissons.data?.find(b => b.boisson === boisson)
                
                return (
                  <button
                    key={boisson}
                    onClick={() => isSelected ? handleRemoveBoisson(boissonData!.id) : handleAddBoisson(boisson)}
                    disabled={addBoisson.isPending || removeBoisson.isPending}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? isDarkMode
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-purple-500 bg-purple-50'
                        : isDarkMode
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isSelected
                          ? 'text-purple-600'
                          : isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {BOISSON_LABELS[boisson]}
                      </span>
                      {isSelected && <Check size={18} className="text-purple-600" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Livre d'or */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection('livreOr')}
          className={`w-full p-4 flex items-center justify-between transition-colors ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <BookOpen size={24} className="text-blue-500" />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Livre d{"'"}or
            </h3>
          </div>
          {openSections.livreOr ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {openSections.livreOr && (
          <div className="p-4 space-y-4">
            <textarea
              value={livreOrMessage}
              onChange={(e) => setLivreOrMessage(e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Écrivez votre message..."
            />
            <button
              onClick={handleSaveLivreOr}
              disabled={updateLivreOr.isPending}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                isDarkMode
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } disabled:opacity-50`}
            >
              {updateLivreOr.isPending ? 'Enregistrement...' : 'Enregistrer le message'}
            </button>
          </div>
        )}
      </div>

      {/* Cadeaux */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection('cadeaux')}
          className={`w-full p-4 flex items-center justify-between transition-colors ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Gift size={24} className="text-green-500" />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Cadeaux
            </h3>
            {cadeaux.data && cadeaux.data.length > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                {cadeaux.data.length}
              </span>
            )}
          </div>
          {openSections.cadeaux ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {openSections.cadeaux && (
          <div className="p-4 space-y-4">
            {/* Sélection catégorie */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Catégorie de cadeau
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES_CADEAUX.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategorie(cat)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedCategorie === cat
                        ? isDarkMode
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : isDarkMode
                        ? 'border-slate-600 text-slate-300 hover:border-slate-500'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {CATEGORIE_CADEAU_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Champs conditionnels */}
            {selectedCategorie === CategorieCadeau.APPAREILS_ELECTROMENAGERS && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Sélectionnez un appareil
                </label>
                <select
                  value={selectedAppareil || ''}
                  onChange={(e) => setSelectedAppareil(e.target.value as AppareilElectromenager)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">-- Choisir --</option>
                  {APPAREILS_DISPONIBLES.map((app) => (
                    <option key={app} value={app}>
                      {APPAREIL_LABELS[app]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCategorie === CategorieCadeau.DONS_ESPECES && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Montant (€)
                </label>
                <div className="relative">
                  <DollarSign size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="number"
                    value={montantEspeces}
                    onChange={(e) => setMontantEspeces(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
              </div>
            )}

            {selectedCategorie && 
             selectedCategorie !== CategorieCadeau.APPAREILS_ELECTROMENAGERS && 
             selectedCategorie !== CategorieCadeau.DONS_ESPECES && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <input
                  type="text"
                  value={cadeauDescription}
                  onChange={(e) => setCadeauDescription(e.target.value)}
                  placeholder="Ex: Table en bois, Chaise moderne..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>
            )}

            <button
              onClick={handleAddCadeau}
              disabled={!selectedCategorie || createCadeau.isPending}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                isDarkMode
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } disabled:opacity-50`}
            >
              <Plus size={18} />
              <span>Ajouter le cadeau</span>
            </button>

            {/* Liste des cadeaux */}
            {cadeaux.data && cadeaux.data.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cadeaux sélectionnés
                </h4>
                {cadeaux.data.map((cadeau) => (
                  <div
                    key={cadeau.id}
                    className={`p-4 rounded-lg border flex items-start justify-between ${
                      isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {CATEGORIE_CADEAU_LABELS[cadeau.categorie]}
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {cadeau.appareilElectromenager && APPAREIL_LABELS[cadeau.appareilElectromenager]}
                        {cadeau.description}
                        {cadeau.montantEspeces && `${cadeau.montantEspeces.toFixed(2)} €`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCadeau(cadeau.id)}
                      disabled={deleteCadeau.isPending}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}