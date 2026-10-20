// Filtres de la "Recherche Ciblée" en Parasitologie.
// Utilisé à la fois par l'écran de sélection (pour compter les cas) et par le jeu (pour choisir le cas).

// Mêmes catégories exclues du jeu qu'avant
export const GAME_EXCLUDED_CATEGORIES = ['entomology', 'overview'];

export const EMPTY_FILTERS = { categories: [], classes: [], eosinophilia: 'any' };

// La classe d'un organisme peut être un objet {en, fr} ou un simple texte
export function getClassLabel(organism, lang = 'en') {
  const c = organism && organism.class;
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c[lang] || c.en || '';
}

// filters = { categories: ['protozoa', ...], classes: ['<classe en anglais>', ...], eosinophilia: 'any' | 'yes' | 'no' }
// Plusieurs choix dans un même groupe = "OU" ; plusieurs groupes = "ET"
export function applyParasiteFilters(list, filters) {
  if (!filters) return list;
  const categories = filters.categories || [];
  const classes = filters.classes || [];
  const eosinophilia = filters.eosinophilia || 'any';

  return list.filter((o) => {
    if (categories.length > 0 && !categories.includes(o.category)) return false;
    if (classes.length > 0 && !classes.includes(getClassLabel(o, 'en'))) return false;
    if (eosinophilia === 'yes' && o.eosinophilia !== true) return false;
    if (eosinophilia === 'no' && o.eosinophilia !== false) return false;
    return true;
  });
}