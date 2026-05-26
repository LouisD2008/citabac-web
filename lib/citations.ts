'use client';

<<<<<<< HEAD
import { getSupabase } from './supabase';
=======
import { supabase } from './supabase';
>>>>>>> 5369747a648835d1218998dbd1be46a1cd33c3cf
import { Citation, AUTEUR_MOUVEMENT, AUTEUR_OBJET } from './types';

const USE_SERVER_SIDE_MOUVEMENT_OBJET = false;

export type FetchFilters = {
  auteur?: string;
  theme?: string;
  oeuvre?: string;
  objet?: string;
  mouvement?: string;
};

export async function fetchCitations(filters: FetchFilters): Promise<Citation[]> {
<<<<<<< HEAD
  const supabase = getSupabase();
=======
>>>>>>> 5369747a648835d1218998dbd1be46a1cd33c3cf
  let q = supabase.from('citations').select('*');

  if (filters.auteur && filters.auteur !== 'Tous') q = q.eq('auteur', filters.auteur);
  if (filters.theme && filters.theme !== 'Tous') q = q.eq('theme', filters.theme);
  if (filters.oeuvre && filters.oeuvre !== 'Toutes') q = q.eq('oeuvre', filters.oeuvre);

  if (USE_SERVER_SIDE_MOUVEMENT_OBJET) {
    if (filters.mouvement && filters.mouvement !== 'Tous') q = q.eq('mouvement', filters.mouvement);
    if (filters.objet && filters.objet !== 'Tous') q = q.eq('objet', filters.objet);
  }

  const { data, error } = await q.order('id');
  if (error) throw new Error(`Erreur Supabase : ${error.message}`);

  let results = (data ?? []) as Citation[];

  if (!USE_SERVER_SIDE_MOUVEMENT_OBJET) {
    if (filters.mouvement && filters.mouvement !== 'Tous') {
      const auteursInMouvement = new Set(
        Object.entries(AUTEUR_MOUVEMENT)
          .filter(([, v]) => v === filters.mouvement)
          .map(([k]) => k)
      );
      results = results.filter((c) => auteursInMouvement.has(c.auteur));
    }
    if (filters.objet && filters.objet !== 'Tous') {
      const auteursInObjet = new Set(
        Object.entries(AUTEUR_OBJET)
          .filter(([, v]) => v === filters.objet)
          .map(([k]) => k)
      );
      results = results.filter((c) => auteursInObjet.has(c.auteur));
    }
  }

  return results;
}

export async function fetchByIds(ids: number[]): Promise<Citation[]> {
  if (ids.length === 0) return [];
<<<<<<< HEAD
  const supabase = getSupabase();
=======
>>>>>>> 5369747a648835d1218998dbd1be46a1cd33c3cf
  const { data, error } = await supabase.from('citations').select('*').in('id', ids);
  if (error) throw new Error(`Erreur Supabase : ${error.message}`);
  return (data ?? []) as Citation[];
}

export async function fetchAuteurs(): Promise<string[]> {
<<<<<<< HEAD
  const supabase = getSupabase();
=======
>>>>>>> 5369747a648835d1218998dbd1be46a1cd33c3cf
  const { data, error } = await supabase.from('citations').select('auteur').order('auteur');
  if (error) return ['Tous'];
  const all = Array.from(new Set((data ?? []).map((r) => r.auteur as string))).sort();
  return ['Tous', ...all];
}
