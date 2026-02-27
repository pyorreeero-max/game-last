export const GOLD_TO_COPPER = 400;
export const SILVER_TO_COPPER = 20;
export const WALK_YARDS_PER_GAME_MIN = 88;

export const LOCATIONS: Record<string, any> = {
  poor_quarter: {
    name: 'Poor Quarter', desc: "Narrow alleys, stray dogs,\nthe smell of desperation",
    scene: 'scene-poor-quarter', icon: '🌆', timeIcon: '🌄',
    mapPos: { left: '25%', top: '55%', w: '30%', h: '20%' }, color: '#3a2010', x: 0, y: 0,
  },
  rich_quarter: {
    name: 'Rich Quarter', desc: "Stone townhouses, liveried servants,\nguards who watch the poor",
    scene: 'scene-rich-quarter', icon: '🏰', timeIcon: '☀️',
    mapPos: { left: '55%', top: '20%', w: '30%', h: '25%' }, color: '#102030', x: 700, y: -400,
  },
  market: {
    name: 'Market Square', desc: "Hawkers, pickpockets, merchants.\nThe heart of commerce.",
    scene: 'scene-market', icon: '🏪', timeIcon: '☀️',
    mapPos: { left: '35%', top: '35%', w: '25%', h: '20%' }, color: '#2a2010', x: 350, y: -200,
  },
  temple: {
    name: 'Temple of Saint Cuthbert', desc: "Incense and stone. The desperate\nand the pious mingle here.",
    scene: 'scene-temple', icon: '⛪', timeIcon: '🕯',
    mapPos: { left: '15%', top: '20%', w: '25%', h: '20%' }, color: '#100a20', x: -200, y: -500,
  },
  docks: {
    name: 'River Docks', desc: "Barges, salt air, foreign tongues.\nOpportunity and danger.",
    scene: 'scene-docks', icon: '⚓', timeIcon: '🌊',
    mapPos: { left: '60%', top: '60%', w: '30%', h: '20%' }, color: '#0a1420', x: 600, y: 450,
  },
  forest_road: {
    name: 'Forest Road', desc: "Three miles out. Quiet.\nBandits have been spotted.",
    scene: 'scene-forest', icon: '🌲', timeIcon: '🌿',
    mapPos: { left: '5%', top: '65%', w: '25%', h: '20%' }, color: '#081008', x: -3200, y: 1000,
  },
};

export const OUTFITS: Record<string, any> = {
  beggar: {
    name: "Beggar's Rags", desc: "Torn cloth, dirt-stained. The uniform of the forgotten.", price: 0, icon: '🧥',
    svgDefs: { bodyColor: '#5a4020', capeColor: '#3a2810', skinColor: '#c8956c', hairColor: '#2a1808', pantsColor: '#3a3020', shoesColor: '#2a1808', trimColor: '#4a3010' },
  },
  peasant: {
    name: "Peasant Garb", desc: "Simple woven wool. Serviceable. Signals honest labour.", price: 4 * SILVER_TO_COPPER, icon: '👔',
    svgDefs: { bodyColor: '#6a7040', capeColor: '#4a5030', skinColor: '#c8956c', hairColor: '#2a1808', pantsColor: '#504030', shoesColor: '#3a2010', trimColor: '#7a8050' },
  },
  travelling_robes: {
    name: "Travelling Robes", desc: "Dark wool robes, hooded. Worn by scholars and minor clergy.", price: 8 * SILVER_TO_COPPER, icon: '🧣',
    svgDefs: { bodyColor: '#2a2050', capeColor: '#1a1840', skinColor: '#c8956c', hairColor: '#2a1808', pantsColor: '#1a1a30', shoesColor: '#201828', trimColor: '#5050a0' },
  },
  fine_doublet: {
    name: "Fine Merchant's Doublet", desc: "Deep burgundy with brass buttons. Commands respect.", price: 2 * GOLD_TO_COPPER + 10 * SILVER_TO_COPPER, icon: '🎩',
    svgDefs: { bodyColor: '#6a1020', capeColor: '#8a1528', skinColor: '#c8956c', hairColor: '#2a1808', pantsColor: '#201030', shoesColor: '#201010', trimColor: '#c8962a' },
  },
  noble_attire: {
    name: "Minor Noble's Attire", desc: "Velvet and silk, embroidered cuffs. People bow their heads.", price: 8 * GOLD_TO_COPPER, icon: '👑',
    svgDefs: { bodyColor: '#4a0a60', capeColor: '#380850', skinColor: '#c8956c', hairColor: '#1a1008', pantsColor: '#1a0a30', shoesColor: '#100808', trimColor: '#d4af37' },
  },
};

export const EQUIP_SLOTS = [
  { id:'head',  label:'Head',       icon:'🪖', x:'left', y:0  },
  { id:'neck',  label:'Necklace',   icon:'📿', x:'left', y:1  },
  { id:'cape',  label:'Cape',       icon:'🧣', x:'left', y:2  },
  { id:'lhand', label:'Left Hand',  icon:'🛡', x:'left', y:3  },
  { id:'rhand', label:'Right Hand', icon:'⚔', x:'right',y:0  },
  { id:'torso', label:'Torso',      icon:'🧥', x:'right',y:1  },
  { id:'legs',  label:'Legs',       icon:'👖', x:'right',y:2  },
  { id:'boots', label:'Boots',      icon:'👢', x:'right',y:3  },
];

export const EQUIPMENT_ITEMS: Record<string, any> = {
  tattered_hood: { id:'tattered_hood', slot:'head', name:'Tattered Hood', icon:'🪖', rarity:'common', desc:'Keeps the rain off. Barely.', stats:{ def:1 }, sellPrice:2 },
  leather_cap: { id:'leather_cap', slot:'head', name:'Leather Cap', icon:'🪖', rarity:'common', desc:'Light leather cap. Some protection.', stats:{ def:3 }, sellPrice:15 },
  iron_helm: { id:'iron_helm', slot:'head', name:'Iron Helmet', icon:'⛑', rarity:'uncommon', desc:'Solid iron. Turns glancing blows.', stats:{ def:8, str:1 }, sellPrice:80 },
  wooden_bead_necklace: { id:'wooden_bead_necklace', slot:'neck', name:'Wooden Beads', icon:'📿', rarity:'common', desc:'Simple prayer beads. Worn by pilgrims.', stats:{}, sellPrice:3 },
  copper_medallion: { id:'copper_medallion', slot:'neck', name:'Copper Medallion', icon:'🏅', rarity:'common', desc:'Stamped copper disc. Looks official.', stats:{ luk:1 }, sellPrice:12 },
  silver_pendant: { id:'silver_pendant', slot:'neck', name:'Silver Pendant', icon:'🔮', rarity:'uncommon', desc:'A serpent devouring its tail. Old magic, maybe.', stats:{ int:1, luk:1 }, sellPrice:60 },
  beggar_cloak: { id:'beggar_cloak', slot:'cape', name:"Beggar's Cloak", icon:'🧣', rarity:'common', desc:'Ragged wool. Smells of misery.', stats:{ def:1 }, sellPrice:1 },
  traveller_cloak: { id:'traveller_cloak', slot:'cape', name:"Traveller's Cloak", icon:'🧥', rarity:'common', desc:'Sturdy wool cloak. Protection from the elements.', stats:{ def:2, vit:1 }, sellPrice:20 },
  roughspun_tunic: { id:'roughspun_tunic', slot:'torso', name:'Roughspun Tunic', icon:'👕', rarity:'common', desc:'Scratchy, durable. What most people wear.', stats:{ def:2 }, sellPrice:4 },
  padded_gambeson: { id:'padded_gambeson', slot:'torso', name:'Padded Gambeson', icon:'🧥', rarity:'uncommon', desc:'Quilted armour. Absorbs impacts well.', stats:{ def:7, vit:1 }, sellPrice:90 },
  linen_trousers: { id:'linen_trousers', slot:'legs', name:'Linen Trousers', icon:'👖', rarity:'common', desc:'Simple but clean.', stats:{ def:1 }, sellPrice:3 },
  leather_breeches: { id:'leather_breeches', slot:'legs', name:'Leather Breeches', icon:'👖', rarity:'uncommon', desc:'Tough hide. Good for travel and combat.', stats:{ def:4, dex:1 }, sellPrice:35 },
  worn_sandals: { id:'worn_sandals', slot:'boots', name:'Worn Sandals', icon:'👡', rarity:'common', desc:'Better than bare feet. Barely.', stats:{}, sellPrice:1 },
  leather_boots: { id:'leather_boots', slot:'boots', name:'Leather Boots', icon:'👢', rarity:'common', desc:'Solid stitching. Good for the road.', stats:{ def:2, dex:1 }, sellPrice:18 },
  hobnail_boots: { id:'hobnail_boots', slot:'boots', name:'Hobnail Boots', icon:'👢', rarity:'uncommon', desc:'Iron-studded soles. Intimidating when you stamp.', stats:{ def:4, str:1 }, sellPrice:55 },
  rusty_dagger: { id:'rusty_dagger', slot:'rhand', name:'Rusty Dagger', icon:'🗡', rarity:'common', desc:'Pitted iron. Still kills.', stats:{ str:1, atk:3 }, sellPrice:5 },
  club: { id:'club', slot:'rhand', name:'Cudgel', icon:'🪓', rarity:'common', desc:'Heavy oak cudgel. Simple, effective.', stats:{ str:2, atk:5 }, sellPrice:8 },
  short_sword: { id:'short_sword', slot:'rhand', name:'Short Sword', icon:'⚔', rarity:'uncommon', desc:'Single-edged blade. Point ends fights quickly.', stats:{ str:2, dex:1, atk:9 }, sellPrice:60 },
  buckler: { id:'buckler', slot:'lhand', name:'Buckler', icon:'🛡', rarity:'common', desc:'Small round shield. Parries and punches.', stats:{ def:5 }, sellPrice:20 },
  torch: { id:'torch', slot:'lhand', name:'Torch', icon:'🔦', rarity:'common', desc:'Lights dark places. Can be used as a weapon.', stats:{ atk:2 }, sellPrice:2 },
};

export const INTERESTS: Record<string, any> = {
  roguery:      { icon:'🎭', name:'Roguery',       wpReq:0,  desc:'Live by cunning and shadow. Unlocks rackets, smuggling, gang expansion, and territory control.' },
  soldiering:   { icon:'⚔️', name:'Soldiering',    wpReq:5,  desc:'Forge yourself for war. Unlocks mercenary work, bodyguard hire, and weapon mastery.' },
  merchantry:   { icon:'⚖️', name:'Merchantry',    wpReq:5,  desc:'Build wealth through trade. Unlocks market stalls, loan-sharking, and guild access.' },
  craftsmanship:{ icon:'🔨', name:'Craftsmanship', wpReq:5,  desc:'Learn a trade. Unlocks smithing, leatherwork, brewing, and selling your own goods.' },
  scholarship:  { icon:'📜', name:'Scholarship',   wpReq:10, desc:'Pursue knowledge. Unlocks reading, scribing, alchemy, and the temple library.' },
};

export const SOCIAL_TITLES = [
  { id:'slave',      label:'Slave',          minWealth:-999, fameReq:-999, special:false, guardGreet:'Get away, worm.' },
  { id:'vagrant',    label:'Vagrant',        minWealth:0,    fameReq:-10,  special:false, guardGreet:'Move along.' },
  { id:'serf',       label:'Serf',           minWealth:50,   fameReq:-5,   special:false, guardGreet:'Keep to your place.' },
  { id:'peasant',    label:'Peasant',        minWealth:200,  fameReq:0,    special:false, guardGreet:'Peasant. Move on.' },
  { id:'commoner',   label:'Commoner',       minWealth:1000, fameReq:5,    special:false, guardGreet:'Citizen. Go on.' },
  { id:'freeman',    label:'Freeman',        minWealth:3000, fameReq:10,   special:false, guardGreet:'Freeman. Evening.' },
  { id:'merchant',   label:'Merchant',       minWealth:10000,fameReq:15,   special:false, guardGreet:'Merchant. Safe travels.' },
  { id:'guild_member',label:'Guild Member',  minWealth:5000, fameReq:20,   special:true,  guardGreet:'Good evening, Guild Brother.' },
  { id:'squire',     label:'Squire',         minWealth:0,    fameReq:25,   special:true,  guardGreet:'Squire. Good day.' },
  { id:'knight',     label:'Knight',         minWealth:0,    fameReq:40,   special:true,  guardGreet:'Sir Knight. At your service.' },
  { id:'lord',       label:'Lord',           minWealth:50000,fameReq:50,   special:true,  guardGreet:'My Lord. How may we assist?' },
  { id:'noble',      label:'Noble',          minWealth:100000,fameReq:60,  special:true,  guardGreet:'Your Lordship.' },
];

export const RANDOM_EVENTS = [
  {
    id: 'drunk_noble',
    title: 'Drunken Nobleman!',
    text: 'A portly nobleman stumbles from a tavern, his purse swinging loosely at his belt. He looks at you with unfocused eyes. "You there! You! What day is it?!" His purse is practically falling open.',
    icon: '🍷',
    choices: [
      { text: '🙏 Beg for coin', action: () => { /* Handled in engine */ } },
      { text: '✋ Steal from purse', action: () => { /* Handled in engine */ } },
      { text: '🚶 Walk away', action: () => { /* Handled in engine */ } },
    ]
  },
  {
    id: 'merchant_dropped',
    title: 'A Merchant Drops His Purse',
    text: 'A hurrying merchant trips on the cobblestones ahead of you. His purse flies from his belt and lands at your feet, coins spilling out.',
    icon: '💰',
    choices: [
      { text: '✋ Keep the coins', action: () => { /* Handled in engine */ } },
      { text: '🤝 Return it honestly', action: () => { /* Handled in engine */ } },
    ]
  },
  {
    id: 'bandit_road',
    title: 'Bandits on the Road!',
    text: 'Two rough-looking men step from the treeline, blocking the road. "Your coin or your fingers," the larger one growls.',
    icon: '⚔️',
    choices: [
      { text: '💨 RUN', action: () => { /* Handled in engine */ } },
      { text: '💰 Pay them off', action: () => { /* Handled in engine */ } },
      { text: '🗣️ Talk your way out', action: () => { /* Handled in engine */ } },
    ]
  },
  {
    id: 'guard_stop',
    title: 'City Guard Stop',
    text: 'A guard plants himself in front of you. "Oi. Haven\'t seen you before. What\'s your business in this quarter? Beggars aren\'t welcome here."',
    icon: '⚔',
    choices: [
      { text: '🙇 Be humble', action: () => { /* Handled in engine */ } },
      { text: '💰 Bribe (2sp)', action: () => { /* Handled in engine */ } },
      { text: '🚶 Push past rudely', action: () => { /* Handled in engine */ } },
    ]
  },
];

export const ALL_TRAITS: Record<string, any> = {
  iron_fists:  { id:'iron_fists',  label:'Iron Fists',     icon:'👊', desc:'Years of push-ups have hardened your hands. +10% STR training speed.', category:'body' },
  tireless:    { id:'tireless',    label:'Tireless',       icon:'🏃', desc:'Your lungs have been tempered by miles of running. Sleep drains 15% slower.', category:'body' },
  iron_stomach:{ id:'iron_stomach',label:'Iron Stomach',   icon:'🦾', desc:'You can eat almost anything. Hunger drains 10% slower.', category:'body' },
  sharp_eyes:  { id:'sharp_eyes',  label:'Sharp Eyes',     icon:'👁', desc:'You notice things others miss. Perception events +50% chance.', category:'mind' },
  patient:     { id:'patient',     label:'Patient',        icon:'⏳', desc:'You have learned to wait. Contemplation XP +20%.', category:'mind' },
  ruthless:    { id:'ruthless',    label:'Ruthless',       icon:'🗡', desc:'You do not hesitate. Crime success +8%. People are slightly afraid of you.', category:'mind' },
  silver_tongue:{ id:'silver_tongue',label:'Silver Tongue', icon:'💬', desc:'Words come easily to you. Charisma checks +15%.', category:'social' },
  street_wise: { id:'street_wise', label:'Street-Wise',    icon:'🏚', desc:'The streets have taught you. Begging and scavenging +10% rewards.', category:'social' },
  notorious:   { id:'notorious',   label:'Notorious',      icon:'💀', desc:'Your name is known for dark deeds. Gang members fear and obey you. Guards watch you.', category:'social' },
  survivor:    { id:'survivor',    label:'Survivor',       icon:'🔥', desc:'You have been to the edge and returned. HP regen +50% while sleeping.', category:'rare' },
  lucky:       { id:'lucky',       label:'Touched by Luck',icon:'🍀', desc:'Things fall your way at odd moments. LUK effectively +2 for all rolls.', category:'rare' },
  iron_will:   { id:'iron_will',   label:'Iron Will',      icon:'🔩', desc:'You have chosen pain over comfort. STR training XP +15% permanently.', category:'body' },
  soft_hands:  { id:'soft_hands',  label:'Soft Hands',     icon:'🫳', desc:'You have a habit of resting when things get hard. STR training XP -5%.', category:'body' },
};

export const TRAINING_EXERCISES: Record<string, any[]> = {
  str: [
    { id:'pushups', name:'Push-ups', icon:'💪', desc:'Build raw upper body strength.', locations:null, locationWarn:null,
      startMsg: (loc: string) => loc==='forest_road'||loc==='poor_quarter' ? 'You drop to the ground and begin pushing. The cobblestones bite into your knuckles.' : loc==='market' ? 'You begin push-ups in the market. Merchants stare.' : 'You find a clear patch and begin.' },
    { id:'logcarry', name:'Log Carry', icon:'🪵', desc:'Haul heavy timber for brutal strength.', locations:['forest_road','docks'],
      locationWarn:'No logs here. Head to the Forest Road or Docks.',
      startMsg: (loc: string) => loc==='forest_road' ? 'You heft a fallen oak onto your shoulders. Two hundred pounds. Perfect.' : 'You hoist a dock timber onto your back.' },
  ],
  dex: [
    { id:'footwork', name:'Footwork Drills', icon:'🦶', desc:'Agility and quick-step drills.', locations:null, locationWarn:null,
      startMsg: () => 'You begin quick-stepping drills — lateral shuffles, pivots, balance shifts.' },
    { id:'knife_juggle', name:'Knife Juggling', icon:'🗡', desc:'Risky dexterity work with blades.', locations:null, locationWarn:null,
      startMsg: () => 'You practice flipping a knife through the air. One mistake costs a finger.' },
  ],
  int: [
    { id:'study', name:'Study Texts', icon:'📜', desc:'Read scrolls and texts. Requires sect access.', locations:null, locationWarn:null, sectOnly: true,
      startMsg: () => 'You open the texts and study with full concentration.' },
    { id:'chess', name:'Chess Problems', icon:'♟', desc:'Calculate positions. Requires a chessboard.', locations:['market','rich_quarter','temple'], locationWarn:'No chessboard nearby. Try the Market, Temple or Rich Quarter.', sectOnly: false,
      startMsg: () => 'You work chess positions in your mind, calculating three moves ahead.' },
  ],
  wis: [
    { id:'contemplate', name:'Contemplate', icon:'🤔', desc:'Sit and reflect to draw lessons from experience.', locations:null, locationWarn:null,
      startMsg: () => 'You find a quiet spot, sit with your thoughts, and let your mind work.' },
    { id:'observe', name:'Observe People', icon:'👁', desc:'Study human behaviour from the shadows.', locations:null, locationWarn:null,
      startMsg: () => 'You lean against a wall and watch. People reveal everything when they think no one is paying attention.' },
  ],
  vit: [
    { id:'running', name:'Long Run', icon:'🏃', desc:'Run for endurance and toughness.', locations:null, locationWarn:null,
      startMsg: (loc: string) => loc==='forest_road' ? 'You set off at a steady pace along the forest road. Cold air, clear head.' : loc==='market' ? 'You start running through the market. This seems like a bad idea.' : 'You begin running laps through the streets.' },
    { id:'swimming', name:'Cold Swimming', icon:'🌊', desc:'Swim for full-body conditioning.', locations:['docks','forest_road'],
      locationWarn:'No water nearby. Go to the River Docks or Forest Road.',
      startMsg: (loc: string) => loc==='docks' ? 'You plunge into the river. The cold hits like a hammer.' : 'You dive into a deep forest pool.' },
  ],
};

export const CITY_DISTRICTS: Record<string, any> = {
  poor_quarter: { name: 'Poor Quarter', color: '#3a2010', fillColor: 'rgba(140,75,35,0.75)', borderColor: '#c07840', polygon: '60,520 80,480 110,460 160,450 220,445 280,450 310,470 320,510 310,560 280,590 220,610 150,620 100,610 65,580', labelX: 185, labelY: 535, access: { minRank: 'vagrant', minClean: 0 }, gameId: 'poor_quarter' },
  market: { name: 'Market District', color: '#2a2010', fillColor: 'rgba(120,100,35,0.75)', borderColor: '#d0b030', polygon: '280,400 340,375 410,370 450,380 470,410 460,460 430,490 390,500 340,500 300,490 270,460 265,430', labelX: 365, labelY: 440, access: { minRank: 'vagrant', minClean: 10 }, gameId: 'market' },
  rich_quarter: { name: 'Noble Quarter', color: '#102030', fillColor: 'rgba(30,80,140,0.75)', borderColor: '#60b0e0', polygon: '300,160 360,140 430,145 490,160 530,190 540,240 520,280 480,310 430,325 370,320 320,300 290,265 280,220 285,185', labelX: 410, labelY: 240, access: { minRank: 'freeman', minClean: 60 }, gameId: 'rich_quarter' },
  temple: { name: 'Temple Grounds', color: '#100a20', fillColor: 'rgba(70,40,130,0.75)', borderColor: '#a080e0', polygon: '80,280 120,255 175,250 220,255 250,275 260,310 250,350 220,375 175,385 130,380 90,360 70,330 72,300', labelX: 165, labelY: 320, access: { minRank: 'vagrant', minClean: 20 }, gameId: 'temple' },
  docks: { name: 'River Docks', color: '#0a1420', fillColor: 'rgba(25,70,110,0.75)', borderColor: '#3090b0', polygon: '500,540 545,520 600,515 650,520 690,540 710,575 700,620 665,650 600,665 540,660 500,640 480,610 480,575', labelX: 590, labelY: 590, access: { minRank: 'vagrant', minClean: 0 }, gameId: 'docks' },
  forest_road: { name: 'City Gate / Forest Road', color: '#081008', fillColor: 'rgba(30,60,25,0.75)', borderColor: '#508040', polygon: '140,660 200,645 270,640 300,650 310,680 295,710 250,730 190,740 145,730 115,710 112,685', labelX: 215, labelY: 692, access: { minRank: 'vagrant', minClean: 0 }, gameId: 'forest_road' },
  castle: { name: 'Castle Keep', color: '#1a1a2a', fillColor: 'rgba(50,50,100,0.85)', borderColor: '#8080c0', polygon: '370,60 430,55 480,70 510,100 515,140 495,165 450,175 400,170 365,150 350,120 355,90', labelX: 432, labelY: 120, access: { minRank: 'knight', minClean: 80 }, gameId: null },
};

export const CITY_BUILDINGS = [
  { id:'pq_tanner',    type:'workshop',   x:180, y:558, w:22, h:18, label:"Tanner's Yard",  districtId:'poor_quarter', color:'#6a3010', rankReq:'vagrant', cleanReq:0 },
  { id:'pq_rag_shop',  type:'shop',       x:210, y:558, w:20, h:16, label:'Rag Merchant',   districtId:'poor_quarter', color:'#5a4020', rankReq:'vagrant', cleanReq:0 },
  { id:'pq_alehouse',  type:'tavern',     x:242, y:555, w:28, h:22, label:"The Broken Mug", districtId:'poor_quarter', color:'#4a3010', rankReq:'vagrant', cleanReq:0 },
  { id:'pq_healer',    type:'healer',     x:152, y:558, w:19, h:16, label:'Herbwife',       districtId:'poor_quarter', color:'#2a4020', rankReq:'vagrant', cleanReq:0 },
  { id:'pq_bathhouse', type:'bathhouse',  x:152, y:590, w:24, h:18, label:'Public Baths',   districtId:'poor_quarter', color:'#204040', rankReq:'vagrant', cleanReq:0 },
  { id:'mkt_square',   type:'market',     x:340, y:415, w:60, h:45, label:'Market Square',  districtId:'market', color:'#6a5820', rankReq:'vagrant', cleanReq:10 },
  { id:'mkt_baker',    type:'shop',       x:295, y:415, w:22, h:18, label:"Baker's",        districtId:'market', color:'#7a5020', rankReq:'vagrant', cleanReq:10 },
  { id:'mkt_smith',    type:'blacksmith', x:410, y:415, w:30, h:22, label:'Blacksmith',     districtId:'market', color:'#3a3030', rankReq:'vagrant', cleanReq:10 },
  { id:'mkt_inn',      type:'tavern',     x:410, y:467, w:28, h:24, label:'The Silver Cup', districtId:'market', color:'#5a4010', rankReq:'vagrant', cleanReq:20 },
  { id:'mkt_guild',    type:'guild',      x:355, y:378, w:32, h:22, label:"Merchants' Guild",districtId:'market', color:'#405020', rankReq:'commoner', cleanReq:40 },
  { id:'rq_bank',      type:'bank',       x:388, y:252, w:30, h:20, label:'Alderman Bank',  districtId:'rich_quarter', color:'#402040', rankReq:'merchant', cleanReq:70 },
  { id:'rq_inn',       type:'tavern',     x:456, y:252, w:28, h:22, label:"The Gold Hart",  districtId:'rich_quarter', color:'#403010', rankReq:'commoner', cleanReq:60 },
  { id:'tmp_church',   type:'church',     x:130, y:280, w:70, h:55, label:'St. Cuthbert',   districtId:'temple', color:'#382868', rankReq:'vagrant', cleanReq:20 },
  { id:'tmp_hospital', type:'healer',     x:174, y:340, w:36, h:28, label:'Almoner House',  districtId:'temple', color:'#204030', rankReq:'vagrant', cleanReq:0 },
  { id:'dck_fishmkt',  type:'market',    x:635, y:543, w:38, h:25, label:'Fish Market',     districtId:'docks', color:'#1e3040', rankReq:'vagrant', cleanReq:0 },
  { id:'dck_tavern',   type:'tavern',    x:510, y:578, w:30, h:24, label:"Salty Dog",       districtId:'docks', color:'#2a2010', rankReq:'vagrant', cleanReq:0 },
  { id:'gt_inn',       type:'tavern',    x:245, y:660, w:32, h:26, label:"Traveller's Rest", districtId:'forest_road', color:'#3a2c14', rankReq:'vagrant', cleanReq:0 },
];

export const CITY_ROADS = [
  [310, 160, 310, 760], [60, 460, 740, 460], [170, 300, 170, 660], [170, 300, 550, 300],
  [550, 300, 550, 650], [470, 460, 470, 650], [175, 460, 175, 380], [175, 380, 260, 300],
  [310, 300, 310, 460], [280, 400, 280, 500], [450, 380, 450, 510], [280, 460, 450, 460],
  [310, 160, 430, 80],
];

export const CITY_WALL_OUTER = '50,460 55,380 60,280 85,200 120,145 180,105 250,85 320,75 420,65 500,75 565,100 620,135 670,180 700,240 720,320 730,400 725,490 710,575 690,650 650,720 590,760 510,780 420,785 330,780 240,765 160,750 100,720 65,680 50,620 45,540';
export const RIVER_PATH = 'M 740,340 Q 760,420 740,510 Q 720,580 700,640 Q 680,700 650,740 Q 620,770 580,785';
