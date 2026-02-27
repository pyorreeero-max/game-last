import { useGameState, emitChange } from '../game/state';
import { LOCATIONS, OUTFITS, INTERESTS, TRAINING_EXERCISES, EQUIP_SLOTS, EQUIPMENT_ITEMS, SOCIAL_TITLES } from '../game/data';
import { performAction, stopCurrentAction, startTraining, buyFood, addToInventory, ACTIONS, equipItem, unequipItem } from '../game/actions';
import { priceStr, updateCharRank } from '../game/engine';

export function RightPanel() {
  const G = useGameState();

  const tabs = [
    { id: 'character', label: 'CHARACTER' },
    { id: 'actions', label: 'ACTIONS' },
    { id: 'market', label: 'MARKET' },
    { id: 'train', label: 'TRAIN' },
    { id: 'gang', label: 'GANG' },
    { id: 'inventory', label: 'INVENTORY' },
    { id: 'interests', label: 'INTERESTS' },
  ];

  return (
    <div className="w-[320px] bg-[#13100c] flex flex-col overflow-hidden">
      <div className="flex border-b border-[#3d2e1a] bg-[#13100c] overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { G.activeTab = t.id; }}
            className={`px-3 py-2.5 font-['Cinzel'] text-[10px] tracking-[1.5px] whitespace-nowrap border-b-2 transition-colors ${G.activeTab === t.id ? 'text-[#c8962a] border-[#c8962a]' : 'text-[#8a7a60] border-transparent hover:text-[#c8962a]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#1a1510]">
        {G.activeTab === 'character' && <CharacterTab />}
        {G.activeTab === 'actions' && <ActionsTab />}
        {G.activeTab === 'market' && <MarketTab />}
        {G.activeTab === 'train' && <TrainTab />}
        {G.activeTab === 'inventory' && <InventoryTab />}
        {G.activeTab === 'interests' && <InterestsTab />}
        {G.activeTab === 'gang' && <GangTab />}
      </div>
    </div>
  );
}


function CharacterTab() {
  const G = useGameState();
  const titleObj = SOCIAL_TITLES.find((t: any) => t.id === G.title) || SOCIAL_TITLES[0];
  const level = Math.floor((G.str + G.dex + G.int + G.wis + G.vit + G.luk) / 3);
  const totalXP = ['str','dex','int','wis','vit'].reduce((sum, stat) => sum + (G[stat + 'XP'] || 0), 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[#201a13] border border-[#3d2e1a] rounded-sm p-3">
        <div className="font-['Cinzel'] text-[15px] text-[#f0e0c0]">{G.name || 'Aelric'}</div>
        <div className="text-[11px] text-[#b99657] font-['Cinzel'] mt-0.5">{titleObj?.label || 'Wanderer'}</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3 text-[11px]">
          <div><span className="text-[#8a7a60]">Level:</span> <span className="text-[#e8b84b]">{level}</span></div>
          <div><span className="text-[#8a7a60]">XP Pool:</span> <span className="text-[#e8b84b]">{Math.floor(totalXP)}</span></div>
          <div><span className="text-[#8a7a60]">Rank:</span> <span className="text-[#d8c7a1]">{G.rankState?.base || 'vagrant'}</span></div>
          <div><span className="text-[#8a7a60]">Location:</span> <span className="text-[#d8c7a1]">{LOCATIONS[G.location]?.name || G.location}</span></div>
        </div>
      </div>

      <div className="bg-[#201a13] border border-[#3d2e1a] rounded-sm p-3">
        <div className="font-['Cinzel'] text-[10px] text-[#7a5a18] tracking-[2px] uppercase mb-2">Worn Items</div>
        <div className="grid grid-cols-2 gap-2">
          {EQUIP_SLOTS.map((slot: any) => {
            const itemId = G.equipment[slot.id];
            const item = itemId ? EQUIPMENT_ITEMS[itemId] : null;
            return (
              <button
                key={slot.id}
                onClick={() => item && unequipItem(slot.id)}
                className={`text-left p-2 rounded-sm border text-[11px] ${item ? 'border-[#7a5a18] bg-[#261e14] hover:border-[#c8962a]' : 'border-[#3d2e1a] bg-[#17120e] text-[#6e614f]'}`}
              >
                <div className="font-['Cinzel'] text-[10px] tracking-[0.8px]">{slot.label}</div>
                <div className="mt-1">{item ? `${item.icon || ''} ${item.name}` : '? empty ?'}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#201a13] border border-[#3d2e1a] rounded-sm p-3">
        <div className="font-['Cinzel'] text-[10px] text-[#7a5a18] tracking-[2px] uppercase mb-2">Core Stats</div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          {['str','dex','int','wis','vit','luk'].map(stat => (
            <div key={stat} className="bg-[#17120e] border border-[#3d2e1a] rounded-sm px-2 py-1.5 text-center">
              <div className="text-[#8a7a60] text-[9px] font-['Cinzel'] uppercase">{stat}</div>
              <div className="text-[#e8b84b] font-['Cinzel'] text-[13px]">{G[stat]}</div>
              {stat !== 'luk' && <div className="text-[#6e614f] text-[9px]">xp {Math.floor(G[stat + 'XP'] || 0)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionsTab() {
  const G = useGameState();
  const locActions = ACTIONS[G.location] || [];
  const locName = LOCATIONS[G.location]?.name || G.location;

  return (
    <div className="flex flex-col gap-2">
      <div className="font-['IMFellEnglish'] text-[12px] text-[#8a7a60] italic mb-2">
        Actions at <span className="text-[#f0e0c0]">{locName}</span>:
      </div>
      
      {locActions.length === 0 && (
        <div className="p-5 text-center text-[#8a7a60] italic font-['IMFellEnglish']">
          Nothing to do here at the moment.
        </div>
      )}

      {locActions.map((action: any) => {
        const isThisActive = G.activeAction?.id === action.id || 
          (action.id === 'beg' && G.activeAction?.id === 'begging') ||
          (action.id === 'beg_rich' && G.activeAction?.id === 'begging') ||
          (action.id === 'scavenge' && G.activeAction?.id === 'scavenging') ||
          (action.id === 'meditate' && G.activeAction?.id === 'meditate') ||
          (action.id === 'fish' && G.activeAction?.id === 'fishing');
        const isOtherActive = G.activeAction && !isThisActive;

        return (
          <div key={action.id} className={`bg-[#201a13] border border-[#3d2e1a] rounded-sm p-3 flex items-center gap-3 transition-colors ${isOtherActive ? 'opacity-50' : 'hover:border-[#7a5a18] hover:bg-[#c8962a]/5'}`}>
            <div className="text-[22px] w-[30px] text-center">{action.icon}</div>
            <div className="flex-1">
              <div className="font-['Cinzel'] text-[13px] text-[#f0e0c0] mb-1">{action.name}</div>
              <div className="text-[11px] text-[#8a7a60] italic leading-tight">{action.desc}</div>
              <div className="text-[11px] mt-1" dangerouslySetInnerHTML={{ __html: action.reward }} />
            </div>
            {isThisActive ? (
              <button onClick={() => stopCurrentAction()} className="px-3 py-2 font-['Cinzel'] text-[10px] tracking-[1px] bg-[#8b2020] border border-[#c44040] text-white rounded-sm min-w-[56px]">STOP</button>
            ) : (
              <button onClick={() => performAction(action.id)} className="px-3 py-2 font-['Cinzel'] text-[10px] tracking-[1px] bg-[#6b3a1f] border border-[#5a4228] text-[#c8962a] rounded-sm hover:bg-[#c8962a] hover:text-black min-w-[56px] transition-colors">DO IT</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MarketTab() {
  const G = useGameState();

  const buyOrEquip = (id: string) => {
    const item = OUTFITS[id];
    if (G.ownedOutfits.includes(id)) {
      G.outfit = id;
      updateCharRank();
    } else {
      if (G.copper < item.price) return;
      G.copper -= item.price;
      G.ownedOutfits.push(id);
      G.outfit = id;
      updateCharRank();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="font-['IMFellEnglish'] text-[13px] text-[#8a7a60] italic mb-2">
        The market stalls offer an array of clothing and goods.
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(OUTFITS).map(([id, item]: [string, any]) => {
          if (item.price === 0) return null;
          const owned = G.ownedOutfits.includes(id);
          const equipped = G.outfit === id;
          const canBuy = G.copper >= item.price;
          
          return (
            <div key={id} className="bg-[#201a13] border border-[#3d2e1a] rounded-sm p-3 flex flex-col gap-2 hover:border-[#5a4228] transition-colors">
              <div className="flex gap-3 items-start">
                <div className="w-12 h-14 border border-[#3d2e1a] bg-[#0d0a07] flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-['Cinzel'] text-[12px] text-[#f0e0c0] mb-1">{item.name}</div>
                  <div className="text-[10px] text-[#8a7a60] italic leading-tight">{item.desc}</div>
                  {!owned ? (
                    <div className="text-[11px] mt-1" dangerouslySetInnerHTML={{ __html: priceStr(item.price) }} />
                  ) : (
                    <div className="text-[10px] text-[#4a9b4a] mt-1">Owned</div>
                  )}
                </div>
              </div>
              <button 
                disabled={!owned && !canBuy}
                onClick={() => buyOrEquip(id)}
                className={`w-full py-1.5 font-['Cinzel'] text-[10px] tracking-[1px] rounded-sm transition-colors uppercase ${
                  equipped ? 'bg-[#2a6b2a]/30 border-[#2a6b2a] text-[#4a9b4a]' :
                  owned ? 'bg-[#3c3214]/50 border-[#5a4228] text-[#8a7a60]' :
                  canBuy ? 'bg-[#6b3a1f] border-[#7a5a18] text-[#c8962a] hover:bg-[#c8962a] hover:text-black' :
                  'opacity-40 cursor-not-allowed bg-[#6b3a1f] border-[#7a5a18] text-[#c8962a]'
                }`}
              >
                {equipped ? 'EQUIPPED' : owned ? 'EQUIP' : 'BUY'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrainTab() {
  const G = useGameState();
  const TRAINABLE = ['str','dex','int','wis','vit'];

  return (
    <div className="flex flex-col gap-4">
      <div className="font-['Cinzel'] text-[10px] text-[#7a5a18] tracking-[2px] uppercase border-b border-[#3d2e1a] pb-1">
        Physical & Mental Training
      </div>
      
      {TRAINABLE.map(stat => {
        const lvl = G[stat];
        const xp = G[stat+'XP'] || 0;
        const req = Math.floor(20 * Math.pow(lvl, 2.2));
        const pct = Math.min(100, (xp / req) * 100);
        const exercises = TRAINING_EXERCISES[stat] || [];

        return (
          <div key={stat} className="bg-[#201a13] border border-[#3d2e1a] rounded-sm p-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-['Cinzel'] text-[11px] text-[#8a7a60] w-7 tracking-[1px]">{stat.toUpperCase()}</span>
              <span className="font-['Cinzel'] text-[13px] text-[#e8b84b] font-semibold w-6 text-center">{lvl}</span>
              <div className="flex-1 h-1.5 bg-black/40 border border-[#3d2e1a] rounded-[1px] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7a5a18] to-[#c8962a] transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[9px] text-[#8a7a60] font-['Cinzel'] w-10 text-right">{Math.floor(xp)}/{req}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {exercises.map(ex => {
                const isThis = G.activeAction?.id === ex.id;
                const isOther = G.activeAction && !isThis;
                return (
                  <button 
                    key={ex.id}
                    onClick={() => startTraining(stat, ex.id, false)}
                    className={`font-['Cinzel'] text-[9px] tracking-[1px] px-2 py-1 rounded-sm transition-colors border ${
                      isThis ? 'bg-[#7a5a18] text-white border-[#7a5a18]' : 
                      'bg-[#1a1510] text-[#8a7a60] border-[#3d2e1a] hover:text-[#c8962a] hover:border-[#7a5a18]'
                    } ${isOther ? 'opacity-40' : ''}`}
                  >
                    {isThis ? '⏹ STOP' : `${ex.icon} ${ex.name}`}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventoryTab() {
  const G = useGameState();
  const totalSlots = 24;

  const useItem = (index: number) => {
    const item = G.inventory[index];
    if (!item) return;
    if (item.hunger > 0) {
      G.hunger = Math.min(100, G.hunger + item.hunger);
      item.qty -= 1;
      if (item.qty <= 0) G.inventory.splice(index, 1);
      emitChange();
    } else if (item.slot) {
      equipItem(item.id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="font-['Cinzel'] text-[10px] text-[#8a7a60] tracking-[2px] mb-2">
        CARRIED ITEMS ({G.inventory.length}/{totalSlots} slots)
      </div>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const item = G.inventory[i];
          if (item) {
            return (
              <div 
                key={i} 
                onClick={() => useItem(i)}
                title={item.name}
                className="aspect-square bg-[#0d0a07] border border-[#3d2e1a] rounded-[1px] flex items-center justify-center text-[20px] cursor-pointer hover:border-[#7a5a18] relative transition-colors"
              >
                {item.icon}
                {item.qty > 1 && <span className="absolute bottom-0.5 right-1 text-[9px] text-[#c8962a] font-['Cinzel']">{item.qty}</span>}
              </div>
            );
          }
          return <div key={i} className="aspect-square bg-[#0d0a07] border border-[#3d2e1a] rounded-[1px] flex items-center justify-center text-[20px] opacity-20">·</div>;
        })}
      </div>
      <div className="font-['IMFellEnglish'] text-[12px] text-[#8a7a60] italic">
        Click an item to use or examine it.
      </div>
    </div>
  );
}

function InterestsTab() {
  const G = useGameState();
  const maxSlots = Math.min(4, 1 + Math.floor(Math.max(0, G.willpower - 5) / 5));

  const selectInterest = (id: string) => {
    if (G.interests.includes(id)) {
      G.interests = G.interests.filter((x: string) => x !== id);
    } else {
      if (G.interests.length >= maxSlots) return;
      if (INTERESTS[id].wpReq > G.willpower) return;
      G.interests.push(id);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#3d2e1a]/50">
        <span className="font-['Cinzel'] text-[9px] text-[#8a7a60] tracking-[1px]">WP {G.willpower}</span>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full border border-[#3d2e1a] transition-all ${i < maxSlots ? 'bg-[#c8962a] border-[#e8b84b] shadow-[0_0_4px_#c8962a]' : 'bg-[#0d0a07]'}`} />
          ))}
        </div>
        <span className="font-['Cinzel'] text-[9px] text-[#8a7a60]">{G.interests.length}/{maxSlots} active</span>
      </div>

      {Object.entries(INTERESTS).map(([id, it]: [string, any]) => {
        const active = G.interests.includes(id);
        const locked = !active && it.wpReq > G.willpower;

        return (
          <div 
            key={id}
            onClick={() => !locked && selectInterest(id)}
            className={`bg-[#201a13] border rounded-[3px] p-2.5 relative transition-colors ${
              active ? 'border-[#c8962a] border-l-[3px] bg-[#c8962a]/10' : 
              locked ? 'border-[#3d2e1a] opacity-45 cursor-not-allowed' : 
              'border-[#3d2e1a] cursor-pointer hover:border-[#7a5a18] hover:bg-[#c8962a]/5'
            }`}
          >
            {active && <div className="absolute top-2 right-2 bg-[#c8962a] text-black font-['Cinzel'] text-[8px] px-1.5 py-0.5 rounded-[1px] tracking-[1px]">ACTIVE</div>}
            <div>
              <span className="text-[16px] mr-1.5 align-middle">{it.icon}</span>
              <span className="font-['Cinzel'] text-[11px] text-[#f0e0c0] tracking-[1px]">{it.name}</span>
            </div>
            <div className="text-[11px] text-[#8a7a60] italic mt-1 leading-snug">{it.desc}</div>
            {locked && <div className="text-[10px] text-[#7a5a18] font-['Cinzel'] mt-1">Requires {it.wpReq} WP</div>}
          </div>
        );
      })}
    </div>
  );
}

function GangTab() {
  const G = useGameState();
  const members = G.gang || [];
  
  return (
    <div className="flex flex-col gap-2">
      <div className="font-['Cinzel'] text-[10px] text-[#7a5a18] tracking-[2px] uppercase border-b border-[#3d2e1a] pb-1 mb-2">
        YOUR CREW ({members.length + 1} members incl. you)
      </div>
      {members.length === 0 ? (
        <div className="font-['IMFellEnglish'] text-[12px] text-[#8a7a60] italic p-2 text-center">
          You are alone. Scout the alleys to find people worth recruiting.
        </div>
      ) : (
        members.map((m: any) => (
          <div key={m.id} className="flex items-center gap-2 p-2 bg-[#201a13] border border-[#3d2e1a] rounded-sm">
            <span className="text-lg">🧑‍🦯</span>
            <div className="flex-1">
              <div className="font-['Cinzel'] text-[11px] text-[#f0e0c0] tracking-[0.5px]">{m.name}</div>
              <div className="text-[10px] text-[#8a7a60] font-['Cinzel']">STR {m.str}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
