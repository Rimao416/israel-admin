// services/table.service.ts
import { Table, CreateTableData, UpdateTableData } from '@/types/table.types';

const API_URL = '/api/tables';

export const getTables = async (): Promise<Table[]> => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des tables');
  }
  
  return response.json();
};

export const getTableById = async (id: string): Promise<Table> => {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la table');
  }
  
  return response.json();
};

export const createTable = async (data: CreateTableData): Promise<Table> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création de la table');
  }
  
  return response.json();
};

export const updateTable = async (data: UpdateTableData): Promise<Table> => {
  const response = await fetch(`${API_URL}/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour de la table');
  }
  
  return response.json();
};

export const deleteTables = async (ids: string[]): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la suppression des tables');
  }
};