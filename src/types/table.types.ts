// types/table.types.ts
import { 
  BoissonPreference, 
  LivreOr, 
  Cadeau,
  StatutConfirmation 
} from './invite-extended.types';

export { StatutConfirmation };

export type TableBase = {
  numero: number;
  nom: string;
};

export type Table = TableBase & {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  invites?: Invite[];
  _count?: {
    invites: number;
  };
};

export type TableFormData = TableBase;

export type CreateTableData = TableBase;

export type UpdateTableData = TableBase & {
  id: string;
};

// Types pour les invités
export type InviteBase = {
  nom: string;
  prenom: string;
  email?: string | null;
  telephone?: string | null;
  confirme?: StatutConfirmation;
  assiste?: boolean | null;
  tableId: string;
};

// ✅ CORRECTION: Ajouter les relations optionnelles au type Invite
export type Invite = InviteBase & {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  table?: Table;
  
  // Relations optionnelles (pour les réponses API enrichies)
  boissons?: BoissonPreference[];
  livreOr?: LivreOr | null;
  cadeaux?: Cadeau[];
};

export type InviteFormData = Omit<InviteBase, 'tableId'> & {
  tableId?: string;
};

export type CreateInviteData = InviteBase;

export type UpdateInviteData = InviteBase & {
  id: string;
};