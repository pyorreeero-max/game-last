import { useGameState } from '../game/state';
import { CharacterSvg } from './CharacterSvg';
import { EQUIP_SLOTS, EQUIPMENT_ITEMS, SOCIAL_TITLES } from '../game/data';
import { unequipItem } from '../game/actions';

export function LeftPanel() {
  const G = useGameState();

  const hpPct = Math.max(0, (G.hp / G.maxHp) * 100);
  const hpCol = hpPct > 60 ? 'linear-gradient(90deg,#2a6b2a,#4a9b4a)' : hpPct > 30 ? 'linear-gradient(90deg,#6b6b1a,#c4c040)' : 'linear-gradient(90deg,#6b1a1a,#c44040)';
  
  const titleObj = SOCIAL_TITLES.find(t => t.id === G.title) || SOCIAL_TITLES[1];

  return (
    <div className="w-[280px] bg-[#13100c] border-r-2 border-[#3d2e1a] flex flex-col overflow-y-auto">
      
      {/* Character Section */}
      <div className="p-4 border-b border-[#3d2e1a]">
        <div className="font-['Cinzel'] text-[11px] text-[#7a5a18] tracking-[3px] uppercase mb-2.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#3d2e1a]">
          CHARACTER
        </div>
        
        <div className="flex justify-center gap-2 my-4">
          <div className="flex flex-col gap-2">
            {EQUIP_SLOTS.filter(s => s.x === 'left').map(slot => (
              <EquipSlot key={slot.id} slotId={slot.id} label={slot.label} icon={slot.icon} />
            ))}
          </div>
          
          <div className="w-28 h-40 bg-gradient-to-b from-[#1a2530] via-[#0d1520] to-[#080d18] border border-[#3d2e1a] rounded relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-1 left-0 right-0 text-center font-['Cinzel'] text-[7px] tracking-[1px] text-[#7a5a18] z-10 pointer-events-none">IDLE</div>
            <CharacterSvg isOverlay={false} />
            <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col gap-2">
            {EQUIP_SLOTS.filter(s => s.x === 'right').map(slot => (
              <EquipSlot key={slot.id} slotId={slot.id} label={slot.label} icon={slot.icon} />
            ))}
          </div>
        </div>

        <div className="font-['Cinzel'] text-[14px] text-[#f0e0c0] text-center mt-2 tracking-[1px]">{G.name || 'Aelric'}</div>
        <div className="font-['IMFellEnglish'] text-[12px] text-[#7a5a18] text-center italic">{titleObj.label}</div>
      </div>

      {/* Survival Section */}
      <div className="p-3 px-4 border-b border-[#3d2e1a]">
        <div className="font-['Cinzel'] text-[11px] text-[#7a5a18] tracking-[3px] uppercase mb-2.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#3d2e1a]">
          SURVIVAL
        </div>
        <SurvivalBar label="HP" val={Math.ceil(G.hp)} max={G.maxHp} bg={hpCol} />
        <SurvivalBar label="HUNGER" val={Math.floor(G.hunger)} max={100} bg="linear-gradient(90deg, #6b2800, #c87820)" />
        <SurvivalBar label="THIRST" val={Math.floor(G.thirst)} max={100} bg="linear-gradient(90deg, #1a3a6b, #3070b8)" />
        <SurvivalBar label="SLEEP" val={Math.floor(G.sleep)} max={100} bg="linear-gradient(90deg, #2a1a60, #5040a0)" />
      </div>

      {/* Stats Section */}
      <div className="p-3 px-4 border-b border-[#3d2e1a]">
        <div className="font-['Cinzel'] text-[11px] text-[#7a5a18] tracking-[3px] uppercase mb-2.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#3d2e1a]">
          ATTRIBUTES
        </div>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1">
          {['str','dex','int','wis','vit','luk'].map(s => (
            <div key={s} className="flex items-center justify-between text-[12px]">
              <span className="text-[#8a7a60] font-['Cinzel'] text-[10px] tracking-[0.5px]">{s.toUpperCase()}</span>
              <span className="text-[#e8b84b] font-['Cinzel'] text-[11px] font-semibold">{G[s]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="p-3 px-4 flex-1">
        <div className="font-['Cinzel'] text-[11px] text-[#7a5a18] tracking-[3px] uppercase mb-2.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#3d2e1a]">
          SKILLS
        </div>
        {Object.entries(G.skills).map(([key, skill]: [string, any]) => (
          <div key={key} className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[11px] text-[#8a7a60] font-['Cinzel'] w-20 tracking-[0.3px] capitalize">{key.replace('_', ' ')}</span>
            <div className="flex-1 h-[5px] bg-black/50 border border-[#3d2e1a] rounded-[1px] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7a5a18] to-[#c8962a] rounded-[1px] transition-all duration-500" style={{ width: `${skill.xp}%` }} />
            </div>
            <span className="text-[10px] text-[#7a5a18] font-['Cinzel'] w-5 text-right">{skill.level}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

function EquipSlot({ slotId, label, icon }: { slotId: string, label: string, icon: string, key?: string }) {
  const G = useGameState();
  const itemId = G.equipment[slotId];
  const item = itemId ? EQUIPMENT_ITEMS[itemId] : null;

  if (item) {
    return (
      <div 
        onClick={() => unequipItem(slotId)}
        title={`${item.name} — click to unequip`}
        className="w-10 h-10 bg-[#201a13] border border-[#5a4228] rounded-sm flex flex-col items-center justify-center cursor-pointer relative hover:border-[#c8962a] transition-colors"
      >
        <span className="text-lg">{item.icon}</span>
      </div>
    );
  }

  return (
    <div 
      title={`${label} — empty`}
      className="w-10 h-10 bg-black/20 border border-dashed border-[#3d2e1a] rounded-sm flex flex-col items-center justify-center opacity-50"
    >
      <span className="text-sm opacity-40">{icon}</span>
    </div>
  );
}

function SurvivalBar({ label, val, max, bg }: { label: string, val: number, max: number, bg: string }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[11px] font-['Cinzel'] text-[#8a7a60] w-[46px] tracking-[0.5px]">{label}</span>
      <div className="flex-1 h-2 bg-black/50 border border-[#3d2e1a] rounded-[1px] overflow-hidden">
        <div className="h-full rounded-[1px] transition-all duration-500" style={{ width: `${pct}%`, background: bg }} />
      </div>
      <span className="text-[10px] text-[#8a7a60] w-7 text-right font-['Cinzel']">{val}</span>
    </div>
  );
}
