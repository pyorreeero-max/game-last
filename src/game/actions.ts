import { G, emitChange } from './state';
import { advanceTime, log, addCopper, showToast, priceStr, gainSkillXP, gainStatXP, damageHp, gainFame, gainTrait, formatGameTime } from './engine';
import { LOCATIONS, SILVER_TO_COPPER, EQUIPMENT_ITEMS } from './data';

export const ACTIONS: Record<string, any[]> = {
  poor_quarter: [
    { id: 'beg', name: 'Beg for Alms', icon: '🙏', desc: 'Hold out your hand and hope for mercy from passersby.', reward: 'Up to <span class="text-[var(--copper)]">5cp</span> per success', action: startBegging },
    { id: 'scavenge', name: 'Scavenge Rubbish', icon: '🗑', desc: 'Search refuse piles for anything useful or edible.', reward: 'Random items, <span class="text-[var(--copper)]">1-3cp</span>', action: scavengeAction },
    { id: 'sleep_alley', name: 'Sleep in Alleyway', icon: '💤', desc: 'Rest curled up in a doorway. Restores sleep, some risk of robbery.', reward: '+40 Sleep', action: sleepAction },
    { id: 'drink_well', name: 'Drink from Well', icon: '💧', desc: "The public well. Water is free, though not always clean.", reward: '+50 Thirst', action: drinkAction },
  ],
  rich_quarter: [
    { id: 'beg_rich', name: 'Beg at Rich Gates', icon: '🙏', desc: 'Nobles may toss coins... or have guards remove you.', reward: 'Up to <span class="text-[var(--silver)]">2sp</span> or arrest', action: () => { G.location='rich_quarter'; startBegging(); } },
    { id: 'watch_noble', name: 'Observe the Wealthy', icon: '👁', desc: 'Study the behaviour of nobles. Gain insight and Charisma XP.', reward: '+Charisma XP', action: () => gainSkillXP('charisma', 8, 'Watching the nobles, you note their mannerisms.') },
  ],
  market: [
    { id: 'buy_bread', name: 'Buy Bread (2cp)', icon: '🍞', desc: 'A loaf of stale bread. Fills your belly.', reward: '+25 Hunger', action: () => buyFood('bread', 2, 25, 0, '🍞 You eat a loaf of hard bread. It fills the gap.') },
    { id: 'buy_ale', name: 'Buy Ale (1cp)', icon: '🍺', desc: 'A pint of weak ale. Quenches thirst, slight fatigue.', reward: '+30 Thirst, -5 Sleep', action: () => buyFood('ale', 1, 0, 30, '🍺 Weak and sour, but your thirst fades.') },
    { id: 'buy_chicken', name: 'Buy Chicken (4cp)', icon: '🍗', desc: 'A roasted half-chicken. Proper food.', reward: '+50 Hunger', action: () => buyFood('chicken', 4, 50, 0, '🍗 You devour the chicken. First proper meal in days.') },
    { id: 'hawk_goods', name: 'Hawk Found Goods', icon: '📦', desc: 'Try to sell scavenged items to market stalls.', reward: 'Varies', action: () => {
      const sellable = G.inventory.filter((i: any) => i.sellPrice > 0);
      if (!sellable.length) { log('Nothing worth selling.', 'ev-info'); return; }
      let total = 0;
      sellable.forEach((item: any) => { total += item.sellPrice * item.qty; G.inventory = G.inventory.filter((i: any) => i.id !== item.id); });
      addCopper(total); gainSkillXP('haggling', 5, null);
      log(`Sold goods for ${priceStr(total)}.`, 'ev-reward');
    } },
    { id: 'odd_jobs', name: 'Seek Odd Jobs', icon: '🔨', desc: 'Ask merchants if they need help with lifting, carrying, errands.', reward: '<span class="text-[var(--copper)]">5-15cp</span> per job', action: () => {
      stopCurrentAction(true); G.pose = 'working'; G.poseLabel = 'Labouring'; advanceTime(60); G.hunger=Math.max(0,G.hunger-10);
      const earned = Math.floor(Math.random()*11)+5; addCopper(earned);
      log(`An hour of hauling goods. Earned ${priceStr(earned)}.`, 'ev-reward'); gainStatXP('str', 1);
      setTimeout(() => { G.pose = 'idle'; emitChange(); }, 3000);
    } },
  ],
  temple: [
    { id: 'pray', name: 'Pray at Altar', icon: '🕯', desc: 'Light a candle and offer a prayer. The monks may take pity.', reward: '+Blessing, +5 Church rep', action: () => {
      stopCurrentAction(true); G.pose = 'praying'; G.poseLabel = 'Praying'; advanceTime(15);
      G.reputation.church = Math.min(1000, G.reputation.church + 5);
      log('You kneel before the altar and whisper a prayer.', 'ev-info');
      setTimeout(() => { G.pose = 'idle'; emitChange(); }, 4000);
    } },
    { id: 'soup_kitchen', name: 'Temple Soup Kitchen', icon: '🥣', desc: 'The monks offer free thin soup to the destitute. Once per day.', reward: '+20 Hunger, +20 Thirst (free)', action: () => {
      // Need to track soupUsedToday in G
      if (G.soupUsedToday) { log('The monks have already fed you today.', 'ev-info'); return; }
      G.hunger=Math.min(100,G.hunger+20); G.thirst=Math.min(100,G.thirst+20); G.soupUsedToday=true; advanceTime(20);
      G.reputation.church=Math.min(1000,G.reputation.church+2); log('A monk ladles thin pottage. You eat gratefully.','ev-info');
    } },
    { id: 'meditate', name: 'Meditate in Chapel', icon: '🧘', desc: 'Sit in silence. Unusual for a beggar... perhaps there is something within you.', reward: '+Meditation XP, restores Sleep', action: () => {
      if (G.activeAction?.id === 'meditate') { stopCurrentAction(); return; }
      startAction({
        id:'meditate', pose:'meditating', poseLabel:'Meditating', title:'Deep Meditation',
        startMsg:'You settle into stillness. The noise of the world fades.',
        tickMs:5000,
        tickFn:() => { advanceTime(10,true); G.sleep=Math.min(100,G.sleep+2); gainSkillXP('meditation',3,null); gainStatXP('wis',0.2); addActionFeed('The silence deepens. Something shifts within.','info'); }
      });
    } },
  ],
  docks: [
    { id: 'dock_labour', name: 'Dock Labour', icon: '⚓', desc: 'Load and unload barges. Hard work. Honest pay.', reward: '<span class="text-[var(--copper)]">10-20cp</span> per session', action: () => {
      stopCurrentAction(true); G.pose = 'working'; G.poseLabel = 'Dock Labour'; advanceTime(90);
      G.hunger=Math.max(0,G.hunger-15); G.thirst=Math.max(0,G.thirst-10);
      const earned=Math.floor(Math.random()*11)+10; addCopper(earned);
      log(`A morning heaving cargo. Back aches. Earned ${priceStr(earned)}.`,'ev-reward'); gainStatXP('str',2);
      setTimeout(() => { G.pose = 'idle'; emitChange(); }, 4000);
    } },
    { id: 'fish', name: 'Fish the River', icon: '🎣', desc: 'Borrow or steal a line and fish. Free food if lucky.', reward: 'Random fish (food)', action: () => {
      if (G.activeAction?.id === 'fishing') { stopCurrentAction(); return; }
      startAction({
        id:'fishing', pose:'fishing', poseLabel:'Fishing', title:'Fishing',
        startMsg:'You find a quiet spot, bait your improvised hook, and cast your line.',
        tickMs:7000,
        tickFn:() => { advanceTime(15,true); gainSkillXP('perception',1,null); addActionFeed('Line drifts. Nothing biting. Patience.', 'info'); }
      });
    } },
  ],
  forest_road: [
    { id: 'gather_herbs', name: 'Gather Herbs', icon: '🌿', desc: 'Forage for medicinal herbs and edible plants.', reward: 'Herbs (sellable), +Perception XP', action: () => {
      stopCurrentAction(true); G.pose = 'scavenging'; G.poseLabel = 'Foraging'; advanceTime(45); gainSkillXP('perception',5,null);
      if (Math.random()<0.6) { addToInventory({id:'herbs',name:'Wild Herbs',icon:'🌿',qty:1,sellPrice:3,hunger:0}); log('Healing herbs gathered.','ev-reward'); }
      else { log('A long forage yields nothing useful.','ev-info'); }
      setTimeout(() => { G.pose = 'idle'; emitChange(); }, 3000);
    } },
    { id: 'sleep_forest', name: 'Sleep under Trees', icon: '💤', desc: 'Free sleep outside the city walls. Risk of bandit attack.', reward: '+60 Sleep, danger', action: () => {
      stopCurrentAction(true); G.pose = 'sleeping'; G.poseLabel = 'Sleeping'; advanceTime(300); G.sleep=Math.min(100,G.sleep+60);
      if (Math.random()<0.25 && G.copper>0) { const lost=Math.min(G.copper,Math.floor(G.copper*0.5)); G.copper-=lost; log(`Bandits took ${priceStr(lost)} while you slept.`,'ev-danger'); }
      else { log('You sleep beneath the forest canopy. Birdsong wakes you.','ev-info'); }
      G.pose = 'idle'; emitChange();
    } },
  ],
};

export function performAction(id: string) {
  const allActions = Object.values(ACTIONS).flat();
  const action = allActions.find((a: any) => a.id === id);
  if (action) action.action();
}

export function stopCurrentAction(silent = false) {
  if (!G.activeAction) return;
  clearInterval(G.activeAction.interval);
  if (G.activeAction.stopFn) G.activeAction.stopFn();
  G.activeAction = null;
  G.pendingChoices = null;
  G.pose = 'idle';
  if (!silent) log('You stop what you were doing.', 'ev-info');
  emitChange();
}

export function startAction(cfg: any) {
  stopCurrentAction(true);
  G.pose = cfg.pose;
  G.poseLabel = cfg.poseLabel || cfg.id;
  G.activeAction = {
    id: cfg.id, pose: cfg.pose, title: cfg.title,
    feed: [], stopFn: cfg.stopFn || null, interval: null, _ticks: 0,
    tickMs: cfg.tickMs || 4000,
  };
  if (cfg.startMsg) addActionFeed(cfg.startMsg, 'info');
  
  G.activeAction.interval = setInterval(() => {
    if (!G.activeAction) return;
    if (G.gamePaused) return;
    if (G.pendingChoices) return;
    cfg.tickFn();
    emitChange();
  }, cfg.tickMs || 4000);
  emitChange();
}

export function addActionFeed(text: string, type: string = 'info') {
  if (!G.activeAction) {
    log(text, type === 'reward' ? 'ev-reward' : type === 'danger' ? 'ev-danger' : type === 'special' ? 'ev-special' : 'ev-info');
    return;
  }
  const entry = { text, type, time: formatGameTime() };
  G.activeAction.feed.push(entry);
  if (G.activeAction.feed.length > 80) G.activeAction.feed.shift();
  emitChange();
}

export function showInlineChoice(title: string, choices: any[]) {
  G.pendingChoices = { title, choices };
  addActionFeed('— A decision is required —', 'event');
  emitChange();
}

export function resolveOverlayChoice(idx: number) {
  if (!G.pendingChoices) return;
  const choice = G.pendingChoices.choices[idx];
  const choiceText = choice?.text?.replace(/^\S+ /, '') || '';
  G.pendingChoices = null;
  if (G.activeAction) addActionFeed(`▶ ${choiceText}`, 'choice-made');
  if (choice?.fn) choice.fn();
  emitChange();
}

export function travelTo(locationId: string) {
  const loc = LOCATIONS[locationId];
  if (!loc || locationId === G.location) return;

  const dx = loc.x - LOCATIONS[G.location].x;
  const dy = loc.y - LOCATIONS[G.location].y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const travelMins = dist / 88; // 88 yards per min
  const distStr = dist >= 1760 ? `${(dist/1760).toFixed(1)} miles` : `${Math.round(dist)} yards`;
  const timeStr = travelMins < 60 ? `${Math.round(travelMins)} min` : `${(travelMins/60).toFixed(1)} hrs`;
  const fromName = LOCATIONS[G.location]?.name || G.location;
  
  G.location = locationId;

  const tickCount = Math.max(1, Math.min(4, Math.round(travelMins / 5)));
  const tickMs = Math.max(1500, Math.min(4000, (travelMins * 200) / tickCount));
  let ticksDone = 0;

  startAction({
    id: 'travel_' + locationId,
    pose: 'walking',
    poseLabel: 'Travelling',
    title: `To ${loc.name}`,
    startMsg: `You leave <span class="text-[var(--text-bright)]">${fromName}</span>, heading for <span class="text-[var(--text-bright)]">${loc.name}</span>. ${distStr}, about ${timeStr}.`,
    tickMs,
    tickFn: () => {
      ticksDone++;
      advanceTime(travelMins / tickCount);

      if (ticksDone < tickCount) {
        if (Math.random() < 0.45) {
          addActionFeed('The cobblestones give way to mud. Dogs bark somewhere distant.', 'info');
        } else {
          addActionFeed('A cart rattles past, the driver not acknowledging you.', 'info');
        }
      } else {
        addActionFeed(`You arrive at <span class="text-[var(--text-bright)]">${loc.name}</span>.`, 'special');
        log(`You walk ${distStr} to <span class="text-[var(--text-bright)]">${loc.name}</span>. (~${timeStr})`, 'ev-info');
        stopCurrentAction(true);
        G.pose = 'idle';
        G.activeTab = 'actions';
      }
    },
  });
}

export function startBegging() {
  if (G.activeAction?.id === 'begging') { stopCurrentAction(); return; }
  startAction({
    id: 'begging', pose: 'begging', poseLabel: 'Begging', title: 'Begging for Alms',
    startMsg: 'You lower yourself to the cobblestones and hold out your hand. The city flows around you like water around a stone.',
    tickMs: 2500,
    tickFn: () => {
      advanceTime(5, true);
      if (Math.random() < 0.65) {
        const cp = Math.floor(Math.random() * 3) + 1;
        addCopper(cp);
        addActionFeed(`Someone drops ${priceStr(cp)} without meeting your eyes.`, 'reward');
        gainSkillXP('begging', 1, null);
      } else {
        addActionFeed('People stream past without a glance. You wait.', 'info');
      }
      if (G.interests.includes('roguery')) {
        G.territory[G.location] = Math.min(100, (G.territory[G.location] || 0) + 0.5);
        if (Math.random() < 0.08) {
          G.infamy = (G.infamy || 0) + 1;
        }
      }
    },
  });
}

export function scavengeAction() {
  if (G.activeAction?.id === 'scavenging') { stopCurrentAction(); return; }
  startAction({
    id: 'scavenging', pose: 'scavenging', poseLabel: 'Scavenging', title: 'Searching for Scraps',
    startMsg: 'You begin sifting through refuse piles, broken crates, and the discarded remains of other people\'s lives.',
    tickMs: 2500,
    tickFn: () => {
      advanceTime(8, true);
      G.hunger = Math.max(0, G.hunger - 0.5);
      gainSkillXP('perception', 0.5, null);
      
      if (Math.random() < 0.3) {
        const cp = Math.floor(Math.random() * 3) + 1;
        addCopper(cp);
        addActionFeed(`Midden heap: ${priceStr(cp)} from a discarded purse.`, 'reward');
      } else if (Math.random() < 0.5) {
        addToInventory({id:'rag',name:'Old Rag',icon:'🧻',qty:1,sellPrice:1,hunger:0});
        addActionFeed('A torn rag. A rag-picker might pay.', 'info');
      } else {
        addActionFeed('Twenty minutes of digging. Nothing but mud and despair.', 'info');
      }
      
      if (G.hunger < 8) { stopCurrentAction(); addActionFeed('You\'re too hungry to continue. Find food first.', 'danger'); }
    },
  });
}

export function sleepAction() {
  if (G.sleep >= 100) { showToast('You are not tired enough to sleep.'); return; }
  if (G.activeAction?.id === 'sleeping') { stopCurrentAction(); return; }
  startAction({
    id:'sleeping', pose:'sleeping', poseLabel:'Sleeping', title:'Sleeping',
    startMsg: 'You find a place to sleep.',
    tickMs: 6000,
    tickFn: () => {
      advanceTime(90, true);
      G.sleep = Math.min(100, G.sleep + 18);
      G.hp = Math.min(G.maxHp, G.hp + 8);
      const zs = ['z','z z','Z','Z Z','zzz'];
      addActionFeed(zs[Math.floor(Math.random()*zs.length)] + ' ...', 'info');
      
      if (Math.random() < 0.1) {
        const amt = Math.min(G.copper, Math.floor(G.copper * (0.15 + Math.random() * 0.35)) + 1);
        if (amt > 0) {
          G.copper -= amt;
          addActionFeed(`You stir. Your pouch feels lighter. ${priceStr(amt)} gone.`, 'danger');
        }
      }
      if (G.sleep >= 100) {
        addActionFeed('You wake feeling rested. The city is already moving.', 'special');
        log('You slept and woke refreshed.', 'ev-info');
        stopCurrentAction(true);
      }
    },
  });
}

export function drinkAction() {
  G.thirst = Math.min(100, G.thirst + 50);
  advanceTime(5);
  log('You drink deeply from the public well.', 'ev-info');
}

export function buyFood(id: string, cost: number, hungerGain: number, thirstGain: number, message: string) {
  if (G.copper < cost) { showToast(`Need ${priceStr(cost)}.`); return; }
  addCopper(-cost);
  G.hunger = Math.min(100, G.hunger + hungerGain);
  G.thirst = Math.min(100, G.thirst + thirstGain);
  advanceTime(5);
  log(message, 'ev-info');
}

export function unequipItem(slot: string) {
  const itemId = G.equipment[slot];
  if (!itemId) return;
  const item = EQUIPMENT_ITEMS[itemId];
  if (item) addToInventory({ ...item, qty:1 });
  G.equipment[slot] = null;
  emitChange();
}

export function equipItem(itemId: string) {
  const item = EQUIPMENT_ITEMS[itemId];
  if (!item) return;
  const slot = item.slot;
  if (G.equipment[slot]) {
    const old = G.equipment[slot];
    addToInventory({ ...EQUIPMENT_ITEMS[old], qty:1, icon:EQUIPMENT_ITEMS[old]?.icon||'📦' });
  }
  G.equipment[slot] = itemId;
  const idx = G.inventory.findIndex((i: any) => i.id === itemId);
  if (idx !== -1) {
    G.inventory[idx].qty--;
    if (G.inventory[idx].qty <= 0) G.inventory.splice(idx, 1);
  }
  log(`Equipped: ${item.name}`, 'ev-info');
  emitChange();
}

export function giveStarterEquipment() {
  G.equipment.torso = 'roughspun_tunic';
  G.equipment.legs  = 'linen_trousers';
  addToInventory({ id:'worn_sandals',          name:'Worn Sandals',        icon:'👡', qty:1, slot:'boots', sellPrice:1 });
  addToInventory({ id:'beggar_cloak',          name:"Beggar's Cloak",      icon:'🧣', qty:1, slot:'cape',  sellPrice:1 });
  addToInventory({ id:'rusty_dagger',          name:'Rusty Dagger',        icon:'🗡', qty:1, slot:'rhand', sellPrice:5, atk:3 });
  addToInventory({ id:'torch',                 name:'Torch',               icon:'🔦', qty:1, slot:'lhand', sellPrice:2 });
  addToInventory({ id:'wooden_bead_necklace',  name:'Wooden Beads',        icon:'📿', qty:1, slot:'neck',  sellPrice:3 });
}

export function addToInventory(item: any) {
  const existing = G.inventory.find((i: any) => i.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    G.inventory.push({...item});
  }
  emitChange();
}

export function startTraining(stat: string, exerciseId: string, forcePassive?: boolean) {
  if (G.activeAction?.id === exerciseId) { stopCurrentAction(); return; }
  
  const isPassive = forcePassive !== undefined ? forcePassive : true;
  const poseMap: Record<string, string> = { pushups:'pushups', running:'running', logcarry:'logcarry', footwork:'running', swimming:'swimming', observe:'observing', knife_juggle:'working', study:'meditating', chess:'meditating', contemplate:'contemplating' };
  const pose = poseMap[exerciseId] || 'working';

  const tickFn = () => {
    if (G.hunger < 10 || G.thirst < 5) {
      stopCurrentAction();
      if (!isPassive) addActionFeed(`Too ${G.hunger < 10 ? 'hungry' : 'thirsty'} to continue.`, 'danger');
      else log(`Stopped training — too ${G.hunger < 10 ? 'hungry' : 'thirsty'}.`, 'ev-danger');
      return;
    }
    advanceTime(8, true);
    G.hunger = Math.max(0, G.hunger - (stat==='vit'||stat==='str' ? 1.8 : 0.8));
    G.thirst = Math.max(0, G.thirst - (stat==='vit'||stat==='str' ? 2.5 : 1.0));
    const xpMult = isPassive ? 0.1 : 1.0;
    const baseXP = Math.max(0.05, 3.5 - G[stat] * 0.13);
    const xp = baseXP * (0.7 + Math.random() * 0.6) * xpMult;
    gainStatXP(stat, xp);
    
    if (isPassive) {
      G.pose = pose;
    } else {
      addActionFeed(`+${xp.toFixed(2)} ${stat.toUpperCase()} XP`, 'xp');
      if (G.activeAction) G.activeAction._ticks = (G.activeAction._ticks || 0) + 1;
      
      if (exerciseId === 'pushups' && Math.random() < 0.12 && !G.pendingChoices) {
        if (G.activeAction._ticks > 1) {
          addActionFeed('Your hands ache against the ground. Knuckles raw.', 'event');
          showInlineChoice('Your hands are burning. Rest a moment or push through?', [
            { text: '✋ Take a short break', fn: () => { addActionFeed('You sit back and shake out your hands.', 'info'); } },
            { text: '💪 No — pain is the teacher.', fn: () => { addActionFeed('You grit your teeth and keep going.', 'xp'); gainStatXP(stat, 1.5); } },
          ]);
        }
      }
    }
  };

  if (isPassive) {
    stopCurrentAction(true);
    G.pose = pose;
    G.poseLabel = 'Training';
    G.activeAction = { id: exerciseId, pose, title: 'Training', feed: [], stopFn: null, _ticks: 0, tickMs: 4000, interval: null };
    log(`[PASSIVE] Training started. (10% XP rate)`, 'ev-info');
    G.activeAction.interval = setInterval(() => {
      if (!G.activeAction) return;
      if (G.gamePaused) return;
      tickFn();
      emitChange();
    }, 4000);
    emitChange();
  } else {
    startAction({
      id: exerciseId, pose, poseLabel: 'Training', title: 'Active Training',
      startMsg: 'You begin your training.',
      tickMs: 3500,
      tickFn,
    });
  }
}
