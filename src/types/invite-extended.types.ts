// types/invite-extended.types.ts

// ===== ENUMS =====
export enum StatutConfirmation {
  OUI = 'OUI',
  NON = 'NON',
  EN_ATTENTE = 'EN_ATTENTE'
}

export enum TypeBoisson {
  COCA_COLA = 'COCA_COLA',
  FANTA = 'FANTA',
  BOGA = 'BOGA',
  JUS_DE_FRUIT = 'JUS_DE_FRUIT',
  CELESTIA = 'CELESTIA'
}

export enum CategorieCadeau {
  APPAREILS_ELECTROMENAGERS = 'APPAREILS_ELECTROMENAGERS',
  MEUBLES = 'MEUBLES',
  USTENSILES_CUISINE = 'USTENSILES_CUISINE',
  DONS_ESPECES = 'DONS_ESPECES'
}

export enum AppareilElectromenager {
  AIR_FRYER = 'AIR_FRYER',
  MACHINE_A_LAVER = 'MACHINE_A_LAVER',
  FRIGO = 'FRIGO',
  MIXEUR = 'MIXEUR',
  TELEVISION = 'TELEVISION',
  MINI_FOUR_ELECTRIQUE = 'MINI_FOUR_ELECTRIQUE'
}

// ===== LABELS POUR L'AFFICHAGE =====
export const BOISSON_LABELS: Record<TypeBoisson, string> = {
  [TypeBoisson.COCA_COLA]: 'Coca-Cola',
  [TypeBoisson.FANTA]: 'Fanta',
  [TypeBoisson.BOGA]: 'Boga',
  [TypeBoisson.JUS_DE_FRUIT]: 'Jus de Fruit',
  [TypeBoisson.CELESTIA]: 'Celestia'
}

export const CATEGORIE_CADEAU_LABELS: Record<CategorieCadeau, string> = {
  [CategorieCadeau.APPAREILS_ELECTROMENAGERS]: 'Appareils électroménagers',
  [CategorieCadeau.MEUBLES]: 'Meubles',
  [CategorieCadeau.USTENSILES_CUISINE]: 'Ustensiles de cuisine',
  [CategorieCadeau.DONS_ESPECES]: 'Dons en espèces'
}

export const APPAREIL_LABELS: Record<AppareilElectromenager, string> = {
  [AppareilElectromenager.AIR_FRYER]: 'Air Fryer',
  [AppareilElectromenager.MACHINE_A_LAVER]: 'Machine à laver',
  [AppareilElectromenager.FRIGO]: 'Frigo',
  [AppareilElectromenager.MIXEUR]: 'Mixeur',
  [AppareilElectromenager.TELEVISION]: 'Télévision',
  [AppareilElectromenager.MINI_FOUR_ELECTRIQUE]: 'Mini four électrique'
}

// ===== TYPES DE BASE =====
export type BoissonPreference = {
  id: string;
  inviteId: string;
  boisson: TypeBoisson;
  quantite: number;
  createdAt: string | Date;
}

export type LivreOr = {
  id: string;
  inviteId: string;
  message: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type Cadeau = {
  id: string;
  inviteId: string;
  categorie: CategorieCadeau;
  appareilElectromenager?: AppareilElectromenager | null;
  description?: string | null;
  montantEspeces?: number | null;
  estOffert: boolean;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ===== TYPE INVITE ÉTENDU =====
export type InviteEtendu = {
  id: string;
  nom: string;
  prenom: string;
  email?: string | null;
  telephone?: string | null;
  confirme: StatutConfirmation;
  assiste?: boolean | null;
  tableId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // Relations optionnelles
  table?: {
    id: string;
    numero: number;
    nom: string;
  };
  boissons?: BoissonPreference[];
  livreOr?: LivreOr | null;
  cadeaux?: Cadeau[];
}

// ===== TYPES POUR LES FORMULAIRES =====
export type CreateBoissonPreferenceData = {
  inviteId: string;
  boisson: TypeBoisson;
  quantite?: number;
}

export type UpdateLivreOrData = {
  inviteId: string;
  message: string;
}

export type CreateCadeauData = {
  inviteId: string;
  categorie: CategorieCadeau;
  appareilElectromenager?: AppareilElectromenager;
  description?: string;
  montantEspeces?: number;
  notes?: string;
}

export type UpdateCadeauData = CreateCadeauData & {
  id: string;
  estOffert?: boolean;
}

// ===== TYPES POUR LES RÉPONSES API =====
export type BoissonPreferenceResponse = {
  success: boolean;
  data?: BoissonPreference;
  error?: string;
}

export type LivreOrResponse = {
  success: boolean;
  data?: LivreOr;
  error?: string;
}

export type CadeauResponse = {
  success: boolean;
  data?: Cadeau;
  error?: string;
}

// ===== CONSTANTES =====
export const MESSAGE_LIVRE_OR_DEFAULT = 
  "Toutes nos félicitations pour votre mariage ! Nous vous souhaitons tout le bonheur du monde et une vie remplie d'amour, de joie et de complicité. Que votre union soit bénie et que chaque jour soit une nouvelle célébration de votre amour."

export const BOISSONS_DISPONIBLES = Object.values(TypeBoisson)
export const APPAREILS_DISPONIBLES = Object.values(AppareilElectromenager)
export const CATEGORIES_CADEAUX = Object.values(CategorieCadeau)