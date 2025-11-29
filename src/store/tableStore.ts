// store/tableStore.ts
import { create } from 'zustand';
import { Table } from '@/types/table.types';

interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  isLoading: boolean;
  error: string | null;
 
  // Actions
  setTables: (tables: Table[]) => void;
  addTable: (table: Table) => void;
  updateTable: (updatedTable: Table) => void;
  deleteTable: (id: string) => void;
  selectTable: (table: Table | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
 
  // Helper methods
  getTableById: (id: string) => Table | undefined;
  getTableByNumero: (numero: number) => Table | undefined;
  getTablesOrderedByNumero: () => Table[];
  getTableStats: () => {
    totalTables: number;
    totalInvites: number;
    totalConfirmed: number;
    totalAttending: number;
  };
}

export const useTableStore = create<TableState>((set, get) => ({
  tables: [],
  selectedTable: null,
  isLoading: false,
  error: null,

  setTables: (tables) => set({ tables }),
 
  addTable: (table) =>
    set((state) => ({
      tables: [...state.tables, table],
    })),

  updateTable: (updatedTable) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === updatedTable.id ? updatedTable : table
      ),
    })),

  deleteTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((table) => table.id !== id),
    })),

  selectTable: (table) => set({ selectedTable: table }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Helper methods
  getTableById: (id: string) => {
    const { tables } = get();
    return tables.find(table => table.id === id);
  },

  getTableByNumero: (numero: number) => {
    const { tables } = get();
    return tables.find(table => table.numero === numero);
  },

  getTablesOrderedByNumero: () => {
    const { tables } = get();
    return [...tables].sort((a, b) => a.numero - b.numero);
  },

  getTableStats: () => {
    const { tables } = get();
    
    const stats = tables.reduce((acc, table) => {
      const inviteCount = table._count?.invites || 0;
      acc.totalInvites += inviteCount;
      
      // Si vous avez accès aux invités détaillés
      if (table.invites) {
        acc.totalConfirmed += table.invites.filter(i => i.confirme === 'OUI').length;
        acc.totalAttending += table.invites.filter(i => i.assiste === true).length;
      }
      
      return acc;
    }, {
      totalTables: tables.length,
      totalInvites: 0,
      totalConfirmed: 0,
      totalAttending: 0,
    });

    return stats;
  }
}));