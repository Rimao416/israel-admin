// store/inviteStore.ts
import { create } from 'zustand';
import { Invite, StatutConfirmation } from '@/types/table.types';

interface InviteState {
  invites: Invite[];
  selectedInvite: Invite | null;
  isLoading: boolean;
  error: string | null;
 
  // Actions
  setInvites: (invites: Invite[]) => void;
  addInvite: (invite: Invite) => void;
  updateInvite: (updatedInvite: Invite) => void;
  deleteInvite: (id: string) => void;
  selectInvite: (invite: Invite | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
 
  // Helper methods
  getInviteById: (id: string) => Invite | undefined;
  getInvitesByTable: (tableId: string) => Invite[];
  getInvitesByStatut: (statut: StatutConfirmation) => Invite[];
  getConfirmedInvites: () => Invite[];
  getAttendingInvites: () => Invite[];
  getInviteStats: () => {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    attended: number;
    notAttended: number;
  };
  searchInvites: (query: string) => Invite[];
}

export const useInviteStore = create<InviteState>((set, get) => ({
  invites: [],
  selectedInvite: null,
  isLoading: false,
  error: null,

  setInvites: (invites) => set({ invites }),
 
  addInvite: (invite) =>
    set((state) => ({
      invites: [...state.invites, invite],
    })),

  updateInvite: (updatedInvite) =>
    set((state) => ({
      invites: state.invites.map((invite) =>
        invite.id === updatedInvite.id ? updatedInvite : invite
      ),
    })),

  deleteInvite: (id) =>
    set((state) => ({
      invites: state.invites.filter((invite) => invite.id !== id),
    })),

  selectInvite: (invite) => set({ selectedInvite: invite }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Helper methods
  getInviteById: (id: string) => {
    const { invites } = get();
    return invites.find(invite => invite.id === id);
  },

  getInvitesByTable: (tableId: string) => {
    const { invites } = get();
    return invites.filter(invite => invite.tableId === tableId);
  },

  getInvitesByStatut: (statut: StatutConfirmation) => {
    const { invites } = get();
    return invites.filter(invite => invite.confirme === statut);
  },

  getConfirmedInvites: () => {
    const { invites } = get();
    return invites.filter(invite => invite.confirme === StatutConfirmation.OUI);
  },

  getAttendingInvites: () => {
    const { invites } = get();
    return invites.filter(invite => invite.assiste === true);
  },

  getInviteStats: () => {
    const { invites } = get();
    
    return {
      total: invites.length,
      confirmed: invites.filter(i => i.confirme === StatutConfirmation.OUI).length,
      declined: invites.filter(i => i.confirme === StatutConfirmation.NON).length,
      pending: invites.filter(i => i.confirme === StatutConfirmation.EN_ATTENTE).length,
      attended: invites.filter(i => i.assiste === true).length,
      notAttended: invites.filter(i => i.assiste === false).length,
    };
  },

  searchInvites: (query: string) => {
    const { invites } = get();
    const lowerQuery = query.toLowerCase();
    
    return invites.filter(invite =>
      invite.nom.toLowerCase().includes(lowerQuery) ||
      invite.prenom.toLowerCase().includes(lowerQuery) ||
      invite.email?.toLowerCase().includes(lowerQuery) ||
      invite.telephone?.includes(query)
    );
  }
}));