import { allSermons } from '../data/sermons';

export function useSermon(sermonId?: string) {
  const sermon = sermonId
    ? allSermons.find(s => s.id === sermonId)
    : null;

  return { sermon, allSermons };
}
