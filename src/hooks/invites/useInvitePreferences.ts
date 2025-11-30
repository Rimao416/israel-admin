// hooks/invites/useInvitePreferences.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBoissonPreferences,
  addBoissonPreference,
  removeBoissonPreference,
  updateBoissonQuantite,
  getLivreOr,
  createOrUpdateLivreOr,
  deleteLivreOr,
  getCadeaux,
  createCadeau,
  updateCadeau,
  deleteCadeau,
  markCadeauAsOffered,
} from '@/services/invite-preferences.service'
import type {
  CreateBoissonPreferenceData,
  UpdateLivreOrData,
  CreateCadeauData,
  UpdateCadeauData,
} from '@/types/invite-extended.types'

// ===== BOISSONS =====
export const useBoissonPreferences = (inviteId: string) => {
  return useQuery({
    queryKey: ['boissons', inviteId],
    queryFn: () => getBoissonPreferences(inviteId),
    enabled: !!inviteId,
  })
}

export const useAddBoissonPreference = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateBoissonPreferenceData) => addBoissonPreference(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boissons', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useRemoveBoissonPreference = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ inviteId, boissonId }: { inviteId: string; boissonId: string }) =>
      removeBoissonPreference(inviteId, boissonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boissons', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useUpdateBoissonQuantite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ inviteId, boissonId, quantite }: { 
      inviteId: string
      boissonId: string
      quantite: number 
    }) => updateBoissonQuantite(inviteId, boissonId, quantite),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boissons', variables.inviteId] })
    },
  })
}

// ===== LIVRE D'OR =====
export const useLivreOr = (inviteId: string) => {
  return useQuery({
    queryKey: ['livre-or', inviteId],
    queryFn: () => getLivreOr(inviteId),
    enabled: !!inviteId,
  })
}

export const useCreateOrUpdateLivreOr = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateLivreOrData) => createOrUpdateLivreOr(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['livre-or', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useDeleteLivreOr = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (inviteId: string) => deleteLivreOr(inviteId),
    onSuccess: (_, inviteId) => {
      queryClient.invalidateQueries({ queryKey: ['livre-or', inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', inviteId] })
    },
  })
}

// ===== CADEAUX =====
export const useCadeaux = (inviteId: string) => {
  return useQuery({
    queryKey: ['cadeaux', inviteId],
    queryFn: () => getCadeaux(inviteId),
    enabled: !!inviteId,
  })
}

export const useCreateCadeau = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateCadeauData) => createCadeau(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cadeaux', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useUpdateCadeau = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateCadeauData) => updateCadeau(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cadeaux', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['cadeau', data.id] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useDeleteCadeau = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ inviteId, cadeauId }: { inviteId: string; cadeauId: string }) =>
      deleteCadeau(inviteId, cadeauId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cadeaux', variables.inviteId] })
      queryClient.invalidateQueries({ queryKey: ['invite', variables.inviteId] })
    },
  })
}

export const useMarkCadeauAsOffered = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      inviteId, 
      cadeauId, 
      estOffert 
    }: { 
      inviteId: string
      cadeauId: string
      estOffert: boolean 
    }) => markCadeauAsOffered(inviteId, cadeauId, estOffert),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cadeaux', variables.inviteId] })
    },
  })
}

// ===== HOOK COMBINÉ POUR TOUTES LES PRÉFÉRENCES =====
export const useInvitePreferences = (inviteId: string) => {
  const boissons = useBoissonPreferences(inviteId)
  const livreOr = useLivreOr(inviteId)
  const cadeaux = useCadeaux(inviteId)
  
  return {
    boissons,
    livreOr,
    cadeaux,
    isLoading: boissons.isLoading || livreOr.isLoading || cadeaux.isLoading,
    error: boissons.error || livreOr.error || cadeaux.error,
  }
}