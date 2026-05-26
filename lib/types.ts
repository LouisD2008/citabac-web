export type Citation = {
  id: number;
  auteur: string;
  oeuvre: string;
  citation: string;
  theme: string;
  mouvement?: string | null;
  objet?: string | null;
  explication?: string | null;
};

export const hasExplication = (c: Citation) =>
  !!c.explication && c.explication.trim().length > 0;

// Mirrors the Flutter client-side fallback mappings until the DB has the columns.
export const AUTEUR_MOUVEMENT: Record<string, string> = {
  Montaigne: 'Humanisme',
  Molière: 'Classicisme',
  Racine: 'Classicisme',
  Voltaire: 'Lumières',
  'Victor Hugo': 'Romantisme',
  Flaubert: 'Réalisme',
  Zola: 'Réalisme',
  Baudelaire: 'Symbolisme',
  Camus: 'Existentialisme',
  Sartre: 'Existentialisme',
};

export const AUTEUR_OBJET: Record<string, string> = {
  Molière: 'Théâtre',
  Racine: 'Théâtre',
  'Victor Hugo': 'Poésie',
  Baudelaire: 'Poésie',
  Voltaire: "Littérature d'idées",
  Montaigne: "Littérature d'idées",
  Flaubert: 'Roman & Récit',
  Zola: 'Roman & Récit',
  Camus: 'Roman & Récit',
  Sartre: 'Roman & Récit',
};

export const THEMES = [
  'Tous', 'Liberté', 'Amour', 'Pouvoir', 'Nature',
  'Société', 'Temps/Mort', 'Identité', 'Justice',
];

export const OBJETS = [
  'Tous', 'Poésie', "Littérature d'idées", 'Roman & Récit', 'Théâtre',
];

export const MOUVEMENTS = [
  'Tous', 'Humanisme', 'Classicisme', 'Lumières', 'Romantisme',
  'Réalisme', 'Symbolisme', 'Existentialisme',
];

export const OEUVRES_PAR_AUTEUR: Record<string, string[]> = {
  'Molière': ['Toutes', 'Le Misanthrope', 'Dom Juan', 'Tartuffe', "L'Avare", 'Le Bourgeois gentilhomme', 'Les Femmes savantes', 'Le Malade imaginaire', "L'École des femmes"],
  'Voltaire': ['Toutes', 'Candide', 'Zadig', 'Dictionnaire philosophique', "L'Ingénu", 'Micromégas', 'Lettres philosophiques', 'Traité sur la tolérance'],
  'Victor Hugo': ['Toutes', 'Les Misérables', 'Les Contemplations', 'Notre-Dame de Paris', 'Hernani', 'Ruy Blas', 'Les Châtiments'],
  'Baudelaire': ['Toutes', 'Les Fleurs du Mal', 'Le Spleen de Paris'],
  'Camus': ['Toutes', "L'Étranger", 'La Peste', 'Le Mythe de Sisyphe', "L'Homme révolté", 'La Chute', 'Noces', 'Le Premier Homme'],
  'Sartre': ['Toutes', 'Huis Clos', 'La Nausée', 'Les Mains sales', 'Les Mots', "L'Être et le Néant", "L'Existentialisme est un humanisme"],
  'Flaubert': ['Toutes', 'Madame Bovary', "L'Éducation sentimentale", 'Bouvard et Pécuchet', 'Salammbô', 'Un cœur simple'],
  'Zola': ['Toutes', 'Germinal', 'Nana', "L'Assommoir", 'Au Bonheur des Dames', 'La Bête humaine', 'Thérèse Raquin', "J'Accuse"],
  'Racine': ['Toutes', 'Phèdre', 'Andromaque', 'Britannicus', 'Bérénice', 'Iphigénie', 'Athalie', 'Bajazet'],
  'Montaigne': ['Toutes', 'Essais'],
};

export const themeAccent = (theme: string): string => {
  const colors: Record<string, string> = {
    'Amour': '#E57373',
    'Liberté': '#81C784',
    'Pouvoir': '#9575CD',
    'Nature': '#4DB6AC',
    'Société': '#64B5F6',
    'Temps/Mort': '#90A4AE',
    'Identité': '#FFB74D',
    'Justice': '#F06292',
    'Tous': '#6C63FF',
  };
  return colors[theme] ?? '#6C63FF';
};

export const themeGradientTop = (theme: string): string => {
  const colors: Record<string, string> = {
    'Amour': '#3D0A0A',
    'Liberté': '#0A2A0A',
    'Pouvoir': '#1A0A3D',
    'Nature': '#0A2A25',
    'Société': '#0A1A3D',
    'Temps/Mort': '#1A1A1A',
    'Identité': '#2A1A0A',
    'Justice': '#3D0A1A',
  };
  return colors[theme] ?? '#0F0F1A';
};
