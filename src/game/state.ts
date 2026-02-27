import { useState, useEffect } from 'react';

export const G: any = {
  copper: 3,
  hunger: 70, thirst: 80, sleep: 90,
  hp: 100, maxHp: 100,
  str: 4, strXP: 0,
  dex: 5, dexXP: 0,
  int: 6, intXP: 0,
  wis: 4, wisXP: 0,
  vit: 5, vitXP: 0,
  luk: 3, lukXP: 0,
  skills: {
    begging: { xp: 0, level: 1 },
    perception: { xp: 0, level: 1 },
    charisma: { xp: 0, level: 1 },
    stealth: { xp: 0, level: 1 },
    haggling: { xp: 0, level: 1 },
    meditation: { xp: 0, level: 0 },
    read_people: { xp: 0, level: 0 },
    intimidation: { xp: 0, level: 0 },
  },
  rankState: { base: 'vagrant', path: null, pathRank: null, events: [], crimes: 0, fameDark: 0, jurisdiction: 'ashford' },
  npcs: [],
  day: 1, hour: 6, minute: 0,
  location: 'poor_quarter',
  outfit: 'beggar',
  ownedOutfits: ['beggar'],
  inventory: [],
  reputation: { guards: -10, merchants: -20, beggars: 0, nobles: -40, church: 0 },
  lastEventTime: Date.now(),
  gang: [],
  gangRep: 0,
  guildRank: null,
  pose: 'idle',
  poseLabel: 'Idle',
  age: 19,
  title: 'vagrant',
  fame: 0,
  traits: [],
  profession: 'Beggar',
  equipment: { head: null, cape: null, neck: null, torso: 'roughspun_tunic', legs: 'linen_trousers', boots: null, rhand: null, lhand: null },
  cleanliness: 80,
  lastBathDay: 0,
  knownNPCs: {},
  willpower: 5,
  interests: [],
  territory: { poor_quarter: 0, market: 0, docks: 0, rich_quarter: 0, temple: 0, forest_road: 0 },
  infamy: 0,
  rackets: {},

  // React specific UI state
  logs: [],
  toast: null,
  activeEvent: null,
  activeAction: null,
  pendingChoices: null,
  gameSpeed: 1,
  gamePaused: false,
  playerMapPos: null,
  playerMapTarget: null,
  mapMoveMode: null,
  selectedNpcId: null,
  activeTab: 'actions',
};

const listeners = new Set<() => void>();

export function emitChange() {
  listeners.forEach(l => l());
}

export function useGameState() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  return G;
}
