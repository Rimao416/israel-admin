// services/invite-preferences.service.ts
import {
  BoissonPreference,
  LivreOr,
  Cadeau,
  CreateBoissonPreferenceData,
  UpdateLivreOrData,
  CreateCadeauData,
  UpdateCadeauData,
  TypeBoisson
} from '@/types/invite-extended.types'

const API_URL = '/api/invites'

// ===== BOISSONS =====
export const getBoissonPreferences = async (inviteId: string): Promise<BoissonPreference[]> => {
  const response = await fetch(`${API_URL}/${inviteId}/boissons`)
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des boissons')
  }
  
  return response.json()
}

export const addBoissonPreference = async (data: CreateBoissonPreferenceData): Promise<BoissonPreference> => {
  const response = await fetch(`${API_URL}/${data.inviteId}/boissons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de l\'ajout de la boisson')
  }
  
  return response.json()
}

export const removeBoissonPreference = async (
  inviteId: string,
  boissonId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/${inviteId}/boissons/${boissonId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la suppression de la boisson')
  }
}

export const updateBoissonQuantite = async (
  inviteId: string,
  boissonId: string,
  quantite: number
): Promise<BoissonPreference> => {
  const response = await fetch(`${API_URL}/${inviteId}/boissons/${boissonId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantite }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la mise à jour')
  }
  
  return response.json()
}

// ===== LIVRE D'OR =====
export const getLivreOr = async (inviteId: string): Promise<LivreOr | null> => {
  const response = await fetch(`${API_URL}/${inviteId}/livre-or`)
  
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Erreur lors de la récupération du livre d\'or')
  }
  
  return response.json()
}

export const createOrUpdateLivreOr = async (data: UpdateLivreOrData): Promise<LivreOr> => {
  const response = await fetch(`${API_URL}/${data.inviteId}/livre-or`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la mise à jour du livre d\'or')
  }
  
  return response.json()
}

export const deleteLivreOr = async (inviteId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${inviteId}/livre-or`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la suppression')
  }
}

// ===== CADEAUX =====
export const getCadeaux = async (inviteId: string): Promise<Cadeau[]> => {
  const response = await fetch(`${API_URL}/${inviteId}/cadeaux`)
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des cadeaux')
  }
  
  return response.json()
}

export const createCadeau = async (data: CreateCadeauData): Promise<Cadeau> => {
  const response = await fetch(`${API_URL}/${data.inviteId}/cadeaux`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de l\'ajout du cadeau')
  }
  
  return response.json()
}

export const updateCadeau = async (data: UpdateCadeauData): Promise<Cadeau> => {
  const response = await fetch(`${API_URL}/${data.inviteId}/cadeaux/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la mise à jour du cadeau')
  }
  
  return response.json()
}

export const deleteCadeau = async (inviteId: string, cadeauId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${inviteId}/cadeaux/${cadeauId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la suppression du cadeau')
  }
}

export const markCadeauAsOffered = async (
  inviteId: string,
  cadeauId: string,
  estOffert: boolean
): Promise<Cadeau> => {
  const response = await fetch(`${API_URL}/${inviteId}/cadeaux/${cadeauId}/offert`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estOffert }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la mise à jour')
  }
  
  return response.json()
}

// ===== RÉCUPÉRER TOUTES LES PRÉFÉRENCES D'UN INVITÉ =====
export const getInviteWithPreferences = async (inviteId: string) => {
  const response = await fetch(`${API_URL}/${inviteId}?include=preferences`)
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des informations')
  }
  
  return response.json()
}