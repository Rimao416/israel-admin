// types/table.type.ts

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
export enum StatutConfirmation {
  OUI = 'OUI',
  NON = 'NON',
  EN_ATTENTE = 'EN_ATTENTE'
}

export type InviteBase = {
  nom: string;
  prenom: string;
  email?: string | null;
  telephone?: string | null;
  confirme?: StatutConfirmation;
  assiste?: boolean | null;
  tableId: string;
};

export type Invite = InviteBase & {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  table?: Table;
};

export type InviteFormData = Omit<InviteBase, 'tableId'> & {
  tableId?: string;
};

export type CreateInviteData = InviteBase;

export type UpdateInviteData = InviteBase & {
  id: string;
};