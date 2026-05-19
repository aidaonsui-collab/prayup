import { createContext, useContext } from 'react';
import type { MoodId, TemplateId } from '../../lib/data';

export type RitualCtx = {
  mood: MoodId;
  setMood: (m: MoodId) => void;
  heart: string;
  setHeart: (s: string) => void;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  intention: string;
  setIntention: (s: string) => void;
};

export const RitualContext = createContext<RitualCtx | null>(null);

export function useRitual() {
  const v = useContext(RitualContext);
  if (!v) throw new Error('useRitual must be used inside <RitualContext.Provider>');
  return v;
}
