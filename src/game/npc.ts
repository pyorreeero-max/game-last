import { G } from './state';
import { CITY_DISTRICTS } from './data';

const NPC_FIRST_M = ['Aldric','Brom','Cavel','Dag','Edmund','Fyrd','Gareth','Hob','Ivo','Jak','Kern','Leif','Mael','Ned','Oswin','Picard','Quillan','Rand','Seth','Tomas','Ulric','Vern','Wulf','Xen','Yves','Alf','Bert','Cole','Drew','Eamon'];
const NPC_FIRST_F = ['Ada','Brid','Cela','Dena','Elis','Frea','Gwyn','Hild','Ina','Jana','Kira','Lora','Maud','Nora','Orla','Petra','Quen','Ros','Sela','Tilda','Una','Vera','Wren','Ysa','Zara','Agna','Bess','Cass','Dora','Elva'];
const NPC_LAST   = ['Ashby','Brent','Crane','Dale','Finn','Grey','Hall','Ives','Kell','Lane','Marsh','Nash','Oake','Perry','Quinn','Reed','Stone','Thorn','Vane','Wode','Baker','Cooper','Smith','Tanner','Fisher','Carter','Miller','Webb','Ward','Cole'];
const NPC_NICKNAMES = ['the Red','the Short','One-Eye','Scar','Halfhand','the Loud','Crooked','the Fat','the Lean','Swift','Slow','the Bold','the Quiet','Iron','Lucky'];

const NPC_PERSONALITY_TRAITS = ['greedy','generous','lazy','industrious','cowardly','brave','suspicious','trusting','cruel','kind','vain','humble','shrewd','naive','hot_tempered','patient','ambitious','content','dishonest','principled','vengeful','forgiving'];
const NPC_PHYSICAL_TRAITS = ['strong','sickly','fast','slow','scarred','attractive','plain','fat','thin','tall','short','one_arm','limping','half_blind','calloused_hands','weathered'];
const NPC_SECRET_TRAITS = ['in_debt','hiding_from_someone','petty_thief','informant','illegitimate_child','former_soldier','drunkard','gambler','religious_fanatic','secret_wealth','blackmail_target','has_contraband','mourning'];

const NPC_OCCUPATIONS: Record<string, any[]> = {
  poor_quarter: [
    { id:'beggar',      label:'Beggar',          icon:'🤲', color:'#c87040', goal:'earn_coin' },
    { id:'scavenger',   label:'Scavenger',       icon:'🔍', color:'#a06030', goal:'earn_coin' },
    { id:'labourer',    label:'Day Labourer',    icon:'⛏',  color:'#a08050', goal:'earn_coin' },
    { id:'rag_picker',  label:'Rag Picker',      icon:'🧻', color:'#906030', goal:'earn_coin' },
    { id:'street_tough',label:'Street Tough',    icon:'👊', color:'#c05030', goal:'power' },
    { id:'washerwoman', label:'Washerwoman',     icon:'🧺', color:'#9070a0', goal:'earn_coin' },
    { id:'drunk',       label:'Town Drunk',      icon:'🍺', color:'#807050', goal:'drink' },
  ],
  market: [
    { id:'stallholder', label:'Stall Keeper',    icon:'🏪', color:'#c0a040', goal:'earn_coin' },
    { id:'errand_boy',  label:'Errand Boy',      icon:'📦', color:'#a09050', goal:'earn_coin' },
    { id:'pickpocket',  label:'Pickpocket',      icon:'👜', color:'#c06030', goal:'earn_coin' },
    { id:'trader',      label:'Merchant',        icon:'💰', color:'#d0b030', goal:'wealth' },
    { id:'porter',      label:'Porter',          icon:'🎒', color:'#807050', goal:'earn_coin' },
    { id:'street_food', label:'Food Seller',     icon:'🥖', color:'#b08040', goal:'earn_coin' },
  ],
  rich_quarter: [
    { id:'servant',     label:'Servant',         icon:'🧹', color:'#8090b0', goal:'please_master' },
    { id:'guard_priv',  label:'Private Guard',   icon:'🛡',  color:'#6080a0', goal:'duty' },
    { id:'steward',     label:'Steward',         icon:'📋', color:'#7090b0', goal:'order' },
    { id:'noble_youth', label:'Noble Youth',     icon:'👑', color:'#80b0e0', goal:'pleasure' },
  ],
  temple: [
    { id:'monk',        label:'Monk',            icon:'📿', color:'#a080e0', goal:'piety' },
    { id:'pilgrim',     label:'Pilgrim',         icon:'🙏', color:'#9070c0', goal:'piety' },
    { id:'healer',      label:'Herbalist',       icon:'🌿', color:'#60a060', goal:'help' },
    { id:'beggar_tmp',  label:'Temple Beggar',   icon:'🤲', color:'#c07040', goal:'earn_coin' },
  ],
  docks: [
    { id:'docker',      label:'Docker',          icon:'⚓', color:'#60a0c0', goal:'earn_coin' },
    { id:'sailor',      label:'Sailor',          icon:'🚢', color:'#5090b0', goal:'adventure' },
    { id:'fisherman',   label:'Fisherman',       icon:'🎣', color:'#5080a0', goal:'earn_coin' },
    { id:'smuggler',    label:'Smuggler',        icon:'📦', color:'#508060', goal:'wealth' },
    { id:'shipwright',  label:'Shipwright',      icon:'🔨', color:'#607050', goal:'craft' },
  ],
  forest_road: [
    { id:'traveller',   label:'Traveller',       icon:'🎒', color:'#80a060', goal:'travel' },
    { id:'gate_guard',  label:'Gate Guard',      icon:'⚔',  color:'#708090', goal:'duty' },
    { id:'hunter',      label:'Hunter',          icon:'🏹', color:'#708060', goal:'earn_coin' },
  ],
};

const GOAL_DISTRICTS: Record<string, string[]> = {
  earn_coin:    ['poor_quarter','market','docks'],
  wealth:       ['market','rich_quarter'],
  power:        ['poor_quarter','market'],
  drink:        ['poor_quarter','docks'],
  piety:        ['temple'],
  duty:         ['rich_quarter','forest_road'],
  pleasure:     ['market','rich_quarter'],
  please_master:['rich_quarter'],
  order:        ['rich_quarter'],
  adventure:    ['docks','forest_road'],
  help:         ['temple','poor_quarter'],
  craft:        ['docks','market'],
  travel:       ['forest_road','market'],
};

function getDistrictCenter(dk: string) {
  const d = CITY_DISTRICTS[dk];
  if (!d) return { x: 400, y: 400 };
  const pts = d.polygon.split(' ').map((p: string) => p.split(',').map(Number));
  const cx = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
  return { x: cx, y: cy };
}

function getGoalActivity(goal: string) {
  const acts: Record<string, string[]> = {
    earn_coin: ['Looking for work','Begging','Selling odds and ends','Hauling goods','Running errands'],
    wealth:    ['Negotiating a deal','Counting stock','Meeting a buyer'],
    power:     ['Watching corners','Collecting dues','Looking for trouble'],
    drink:     ['Drinking','Looking for drink','Sleeping it off'],
    piety:     ['Praying','Listening to a sermon','Doing penance'],
    duty:      ['Standing watch','Patrolling','Cleaning armour'],
    pleasure:  ['Idling','Watching the crowd','Being seen'],
    please_master:['Running household errands','Cleaning','Fetching water'],
    order:     ['Inventorying goods','Writing ledgers'],
    adventure: ['Watching ships','Telling stories','Looking for a berth'],
    help:      ['Tending the sick','Picking herbs','Carrying supplies'],
    craft:     ['Repairing tools','Measuring timber','Splicing rope'],
    travel:    ['Resting at the gate','Asking for directions','Watching the road'],
  };
  const pool = acts[goal] || ['Going about business'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateNPC(districtId: string, index: number) {
  const isFemale = Math.random() < 0.38;
  const names = isFemale ? NPC_FIRST_F : NPC_FIRST_M;
  const firstName = names[Math.floor(Math.random() * names.length)];
  const lastName  = NPC_LAST[Math.floor(Math.random() * NPC_LAST.length)];
  const hasNick   = Math.random() < 0.18;
  const nick      = hasNick ? NPC_NICKNAMES[Math.floor(Math.random() * NPC_NICKNAMES.length)] : null;
  const displayName = nick ? `${firstName} "${nick}" ${lastName}` : `${firstName} ${lastName}`;
  const shortName   = nick ? `${firstName} ${nick}` : `${firstName} ${lastName}`;

  const occPool = NPC_OCCUPATIONS[districtId] || NPC_OCCUPATIONS.poor_quarter;
  const occ     = occPool[Math.floor(Math.random() * occPool.length)];

  const age = 16 + Math.floor(Math.random() * 52);

  const shuffle = (a: any[]) => a.slice().sort(()=>Math.random()-0.5);
  const personality = shuffle(NPC_PERSONALITY_TRAITS).slice(0, 2 + Math.floor(Math.random()*3));
  const physical    = shuffle(NPC_PHYSICAL_TRAITS).slice(0, 1 + Math.floor(Math.random()*2));
  const secret      = Math.random() < 0.45 ? [shuffle(NPC_SECRET_TRAITS)[0]] : [];

  const longGoal  = occ.goal;
  const shortGoals= ['find_food','earn_today','rest_somewhere','talk_to_someone','buy_something','avoid_guards'];
  const shortGoal = shortGoals[Math.floor(Math.random() * shortGoals.length)];

  const relation = Math.random() < 0.6 ? 'neutral' : Math.random() < 0.5 ? 'friendly' : 'suspicious';

  return {
    id:       `npc_${index}`,
    name:     displayName,
    short:    shortName,
    age,
    sex:      isFemale ? 'f' : 'm',
    occ:      occ.id,
    occLabel: occ.label,
    occIcon:  occ.icon,
    home:     districtId,
    color:    occ.color,
    traits:   { personality, physical, secret },
    longGoal,
    shortGoal,
    relation,
    lastTalked: null,
    x:0, y:0, tx:0, ty:0,
    speed: 0.15 + Math.random() * 0.3,
    districtId,
    waitTicks: Math.floor(Math.random() * 250),
    activity: getGoalActivity(occ.goal),
  };
}

export function initNPCs() {
  if (G.npcs && G.npcs.length > 0) return;
  G.npcs = [];
  const districtKeys = Object.keys(CITY_DISTRICTS).filter(k => k !== 'castle');
  const weights: Record<string, number> = { poor_quarter:9, market:8, docks:6, temple:4, rich_quarter:4, forest_road:2, castle:0 };
  let idx = 0;
  for (const dk of districtKeys) {
    const count = weights[dk] || 2;
    for (let i = 0; i < count; i++) {
      const npc = generateNPC(dk, idx++);
      const c   = getDistrictCenter(dk);
      npc.x  = c.x + (Math.random()-0.5)*80;
      npc.y  = c.y + (Math.random()-0.5)*60;
      npc.tx = npc.x; npc.ty = npc.y;
      G.npcs.push(npc);
    }
  }
}

export function pickNpcTarget(npc: any) {
  const goalDists = GOAL_DISTRICTS[npc.longGoal] || [npc.home];
  const targetDist = Math.random() < 0.7
    ? goalDists[Math.floor(Math.random() * goalDists.length)]
    : npc.home;
  npc.districtId = targetDist;
  const c = getDistrictCenter(targetDist);
  npc.tx = c.x + (Math.random()-0.5)*90;
  npc.ty = c.y + (Math.random()-0.5)*70;
  npc.waitTicks = 80 + Math.floor(Math.random() * 220);
  if (Math.random() < 0.15) {
    npc.shortGoal = ['find_food','earn_today','rest_somewhere','talk_to_someone','buy_something','avoid_guards'][Math.floor(Math.random()*6)];
    npc.activity  = getGoalActivity(npc.longGoal);
  }
}

export function tickNPCs() {
  G.npcs.forEach((npc: any) => {
    if (npc.waitTicks > 0) { npc.waitTicks--; return; }
    const dx = npc.tx - npc.x;
    const dy = npc.ty - npc.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < npc.speed + 0.1) {
      npc.x = npc.tx; npc.y = npc.ty;
      pickNpcTarget(npc);
    } else {
      npc.x += (dx / dist) * npc.speed * G.gameSpeed;
      npc.y += (dy / dist) * npc.speed * G.gameSpeed;
    }
  });
}
