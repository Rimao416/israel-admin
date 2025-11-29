// services/invite.service.ts
import { Invite, CreateInviteData, UpdateInviteData } from '@/types/table.types';

const API_URL = '/api/invites';

export const getInvites = async (tableId?: string): Promise<Invite[]> => {
  const url = tableId ? `${API_URL}?tableId=${tableId}` : API_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des invités');
  }
  
  return response.json();
};

export const getInviteById = async (id: string): Promise<Invite> => {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'invité');
  }
  
  return response.json();
};

export const createInvite = async (data: CreateInviteData): Promise<Invite> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création de l\'invité');
  }
  
  return response.json();
};

export const updateInvite = async (data: UpdateInviteData): Promise<Invite> => {
  const response = await fetch(`${API_URL}/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour de l\'invité');
  }
  
  return response.json();
};

export const deleteInvites = async (ids: string[]): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la suppression des invités');
  }
};

export const updateInviteConfirmation = async (
  id: string, 
  confirme: 'OUI' | 'NON' | 'EN_ATTENTE'
): Promise<Invite> => {
  const response = await fetch(`${API_URL}/${id}/confirmation`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ confirme }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour de la confirmation');
  }
  
  return response.json();
};

export const updateInviteAttendance = async (
  id: string, 
  assiste: boolean
): Promise<Invite> => {
  const response = await fetch(`${API_URL}/${id}/attendance`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assiste }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour de la présence');
  }
  
  return response.json();
};