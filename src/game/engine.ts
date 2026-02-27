import { G, emitChange } from './state';
import { SOCIAL_TITLES, ALL_TRAITS, GOLD_TO_COPPER, SILVER_TO_COPPER, RANDOM_EVENTS } from './data';
import { initNPCs, tickNPCs } from './npc';
import { giveStarterEquipment } from './actions';

export const BASE_GAME_MINS_PER_REAL_SEC = 2;
let lastTickTime = Date.now();
let gameInterval: any = null;

export function initGame() {
  if (gameInterval) clearInterval(gameInterval);
  lastTickTime = Date.now();
  initNPCs();
  giveStarterEquipment();
  gameInterval = setInterval(gameTick, 200);
  
  log('You wake in the gutter of Ashford\'s Poor Quarter. Your head pounds. Your stomach howls.', 'ev-info');
  log('In your pocket: 3 copper farthings. In your belly: nothing.', 'ev-info');
  log('The city does not care whether you live or die. That is the first lesson.', 'ev-special');
  log('→ Beg, scavenge, train your body — or recruit a crew and take what you need. ⏸ pauses time.', 'ev-info');
  
  emitChange();
}

export function gameTick() {
  if (G.gamePaused) { lastTickTime = Date.now(); return; }
  const now = Date.now();
  const realDelta = (now - lastTickTime) / 1000;
  lastTickTime = now;
  
  const gameMinsElapsed = realDelta * BASE_GAME_MINS_PER_REAL_SEC * G.gameSpeed;
  tickCleanliness(gameMinsElapsed);
  advanceTime(gameMinsElapsed, true);
  tickNPCs();
  
  // Map movement
  if (G.playerMapTarget && G.playerMapPos) {
    const dx = G.playerMapTarget.x - G.playerMapPos.x;
    const dy = G.playerMapTarget.y - G.playerMapPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const speed = 0.8 * G.gameSpeed;
    if (dist < speed + 0.1) {
      G.playerMapPos.x = G.playerMapTarget.x;
      G.playerMapPos.y = G.playerMapTarget.y;
      G.playerMapTarget = null;
    } else {
      G.playerMapPos.x += (dx / dist) * speed;
      G.playerMapPos.y += (dy / dist) * speed;
    }
  }
  
  emitChange();
}

export function advanceTime(minutes: number, silent = false) {
  G.minute += minutes;
  while (G.minute >= 60) { G.minute -= 60; G.hour++; }
  while (G.hour >= 24) { G.hour -= 24; G.day++; }
  
  const hrs = minutes / 60;
  G.hunger = Math.max(0, G.hunger - hrs * 1);
  G.thirst = Math.max(0, G.thirst - hrs * 2);
  G.sleep = Math.max(0, G.sleep - hrs * 1);
  
  if (!silent) checkSurvivalCrisis();
  
  if (silent) {
    if (G.pose === 'begging') gainSkillXP('begging', 0.05, null);
    if (G.pose === 'meditating') gainSkillXP('meditation', 0.08, null);
    if (G.pose === 'working') gainSkillXP('begging', 0.03, null);
    
    if (Math.floor(G.minute) < 1 && minutes > 0.5) {
      checkSurvivalCrisis();
      updateCharRank();
      
      if (!G.activeAction) {
        const elapsed = (Date.now() - G.lastEventTime) / 1000;
        if (elapsed > 90 && Math.random() < 0.15) {
          let pool = RANDOM_EVENTS.filter(e => e.id !== 'bandit_road' || G.location === 'forest_road');
          if (G.location === 'rich_quarter') pool = pool.filter(e => ['drunk_noble','guard_stop'].includes(e.id));
          if (G.location === 'poor_quarter' || G.location === 'market') pool = RANDOM_EVENTS.filter(e => e.id !== 'bandit_road');
          const event = pool[Math.floor(Math.random() * pool.length)];
          if (event) triggerEvent(event);
        }
      }
    }
  }
}

export function checkSurvivalCrisis() {
  if (G.hunger <= 0) {
    log('⚠ You collapse from starvation...', 'ev-danger');
    G.hunger = 20;
    G.location = 'temple';
  }
  if (G.thirst <= 0) {
    log('⚠ You pass out from thirst. You wake at the well.', 'ev-danger');
    G.thirst = 30;
  }
  if (G.sleep <= 0) {
    if (G.activeAction) {
      clearInterval(G.activeAction.interval);
      G.activeAction = null;
      G.pose = 'idle';
    }
    log('⚠ Exhaustion takes you. You collapse where you stand.', 'ev-danger');
    G.sleep = 45;
    advanceTime(180, true);
    const robRoll = Math.random();
    if (robRoll < 0.65 && G.copper > 0) {
      const amt = Math.min(G.copper, Math.floor(G.copper * (0.3 + Math.random() * 0.5)) + 1);
      G.copper -= amt;
      log(`While unconscious, someone took ${priceStr(amt)} from your pouch.`, 'ev-danger');
    } else if (robRoll < 0.80) {
      log('A priest found you and brought you to the temple.', 'ev-info');
      G.location = 'temple';
    } else {
      log('Somehow nobody bothered you. You wake in the same spot.', 'ev-info');
    }
  }
}

export function tickCleanliness(gameMins: number) {
  const loss = gameMins * (2 / 1440);
  G.cleanliness = Math.max(0, G.cleanliness - loss);
  if (G.activeAction) {
    const dirtyActions = ['scavenging','logcarry','swimming','pushups','running'];
    if (dirtyActions.includes(G.activeAction.id)) {
      G.cleanliness = Math.max(0, G.cleanliness - gameMins * (1.5 / 1440));
    }
  }
}

export function damageHp(amount: number, source: string) {
  G.hp = Math.max(0, G.hp - amount);
  if (G.hp <= 0) {
    if (G.activeAction) {
      clearInterval(G.activeAction.interval);
      G.activeAction = null;
      G.pose = 'idle';
    }
    G.hp = Math.max(1, G.maxHp * 0.15);
    log(`⚠ You collapse from your injuries (${source || 'unknown'}). You wake later, broken.`, 'ev-danger');
    G.location = 'temple';
  }
}

export function healHp(amount: number) {
  G.hp = Math.min(G.maxHp, G.hp + amount);
}

export function addCopper(cp: number) {
  G.copper = Math.max(0, G.copper + cp);
  updateCharRank();
}

export function priceStr(copper: number) {
  const g = Math.floor(copper / GOLD_TO_COPPER);
  const s = Math.floor((copper % GOLD_TO_COPPER) / SILVER_TO_COPPER);
  const c = copper % SILVER_TO_COPPER;
  let parts = [];
  if (g > 0) parts.push(`<span class="text-[var(--gold)]">${g}gp</span>`);
  if (s > 0) parts.push(`<span class="text-[var(--silver)]">${s}sp</span>`);
  if (c > 0) parts.push(`<span class="text-[var(--copper)]">${c}cp</span>`);
  return parts.join(' ') || '<span class="text-[var(--copper)]">0cp</span>';
}

export function gainSkillXP(skillName: string, xp: number, message: string | null) {
  if (!(skillName in G.skills)) return;
  const skill = G.skills[skillName];
  skill.xp += xp;
  while (skill.xp >= 100) {
    skill.xp -= 100;
    skill.level += 1;
    log(`🌟 Your <span style="color:var(--gold-light)">${skillName.charAt(0).toUpperCase() + skillName.slice(1)}</span> skill reached level ${skill.level}!`, 'ev-special');
  }
  if (message) log(message, 'ev-info');
}

export function statXPRequired(currentLevel: number) {
  return Math.floor(20 * Math.pow(currentLevel, 2.2));
}

export function gainStatXP(stat: string, xp: number) {
  if (stat === 'luk') return;
  const xpKey = stat + 'XP';
  G[xpKey] = (G[xpKey] || 0) + xp;
  const required = statXPRequired(G[stat]);
  while (G[xpKey] >= required) {
    G[xpKey] -= required;
    G[stat]++;
    log(`💪 <span style="color:var(--gold-light)">${stat.toUpperCase()}</span> increased to <b>${G[stat]}</b>!`, 'ev-special');
  }
}

export function gainFame(amount: number, reason: string) {
  G.fame = Math.max(-100, Math.min(100, G.fame + amount));
  updateCharRank();
  if (reason) log(`Fame ${amount>0?'+':''}${amount}: ${reason}`, amount>0?'ev-reward':'ev-danger');
}

export function gainTrait(traitId: string) {
  if (!G.traits.includes(traitId) && ALL_TRAITS[traitId]) {
    G.traits.push(traitId);
    const t = ALL_TRAITS[traitId];
    log(`✦ New trait: ${t.icon} <strong>${t.label}</strong> — ${t.desc}`, 'ev-special');
  }
}

export function updateCharRank() {
  const totalCopp = G.copper;
  const eligible = SOCIAL_TITLES.filter(t => !t.special && totalCopp >= t.minWealth && G.fame >= t.fameReq);
  if (eligible.length > 0) {
    const best = eligible[eligible.length - 1];
    if (G.title !== best.id) {
      G.title = best.id;
    }
  }
}

export function log(message: string, cls = 'ev-info') {
  const h = G.hour % 12 || 12;
  const ampm = G.hour < 12 ? 'AM' : 'PM';
  const timeStr = `${h}:${String(Math.floor(G.minute)).padStart(2,'0')}${ampm}`;
  G.logs.push({ time: timeStr, message, cls });
  if (G.logs.length > 50) G.logs.shift();
  emitChange();
}

export function showToast(message: string) {
  G.toast = message;
  emitChange();
  setTimeout(() => {
    if (G.toast === message) {
      G.toast = null;
      emitChange();
    }
  }, 2500);
}

export function triggerEvent(event: any) {
  G.activeEvent = event;
  G.lastEventTime = Date.now();
  emitChange();
}

export function resolveEvent(choiceIndex: number) {
  if (G.activeEvent && G.activeEvent.choices[choiceIndex]) {
    G.activeEvent.choices[choiceIndex].action();
  }
  G.activeEvent = null;
  emitChange();
}

export function formatGameTime() {
  const h = Math.floor(G.hour) % 12 || 12;
  const ampm = G.hour < 12 ? 'AM' : 'PM';
  return `${h}:${String(Math.floor(G.minute)).padStart(2,'0')} ${ampm}`;
}
