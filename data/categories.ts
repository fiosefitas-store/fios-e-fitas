export const CATEGORIES = [
  {
    label: 'Laços',
    slug: 'lacos',
    subcategories: [
      'Tiaras',
      'Laço de cetim',
      'Laço gourgurão',
      'Laço de crochê',
      'Laço de linho',
      'Faixinhas',
      'Teen & adulto',
    ],
    note: 'O tamanho em cm varia a cada laço.',
  },
  { label: 'Bolsas', slug: 'bolsas', subcategories: ['Adulto', 'Infantil'] },
  { label: 'Linha Bebê', slug: 'linha-bebe', subcategories: ['Sapatinhos', 'Mantas', 'Faixinhas'] },
  { label: 'Amigurumi', slug: 'amigurumi', subcategories: [] },
  { label: 'Kits Presente', slug: 'kits-presente', subcategories: ['Bebês', 'Crianças'] },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.slug] = c;
  return acc;
}, {} as Record<string, typeof CATEGORIES[number]>);
