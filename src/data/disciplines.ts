export type DisciplineId = 'desain' | 'sosial' | 'motion' | 'foto' | 'uiux';

export const disciplines: { id: DisciplineId; id_label: string; en_label: string }[] = [
  { id: 'desain', id_label: 'Desain Grafis', en_label: 'Graphic Design' },
  { id: 'sosial', id_label: 'Konten Sosial', en_label: 'Social Content' },
  { id: 'motion', id_label: 'Video & Motion', en_label: 'Video & Motion' },
  { id: 'foto', id_label: 'Fotografi', en_label: 'Photography' },
  { id: 'uiux', id_label: 'UI/UX', en_label: 'UI/UX' },
];

export function disciplineLabel(id: string, lang: 'id' | 'en'): string {
  const d = disciplines.find((x) => x.id === id);
  if (!d) return id;
  return lang === 'id' ? d.id_label : d.en_label;
}
