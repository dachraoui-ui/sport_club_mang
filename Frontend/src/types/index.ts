// Backend-aligned types
export interface Member {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
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
