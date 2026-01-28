// Backend-aligned types
export interface Subscription {
  id: number;
  membre_id: number;
  membre_nom: string;
  type_abonnement: 'MONTHLY' | '3_MONTHS' | '6_MONTHS' | 'ANNUAL';
  type_abonnement_display: string;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

export interface Member {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
  email?: string;
  actif?: boolean;
  date_inscription?: string;
  subscription?: Subscription;
}

export interface Activity {
  id: number;
  code_act: string;
  nom_act: string;
  tarif_mensuel: number;
  capacite: number;
  photo?: string;
}

export interface Enrollment {
  id: number;
  membre_id: number;
  membre_nom: string;
  membre_prenom: string;
  activite_id: number;
  activite_nom: string;
  date_inscription: string;
}

export interface DashboardStats {
  totalMembers: number;
  totalActivities: number;
  totalEnrollments: number;
  mostPopularActivity: {
    nom: string;
    inscriptions: number;
  } | null;
  leastPopularActivity: {
    nom: string;
    inscriptions: number;
  } | null;
}

export interface ActivityStats {
  code_act: string;
  nom_act: string;
  tarif_mensuel: number;
  capacite: number;
  nb_inscriptions: number;
  places_disponibles: number;
}
