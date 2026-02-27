import { useGameState } from '../game/state';
import { CharacterSvg } from './CharacterSvg';
import { stopCurrentAction, resolveOverlayChoice } from '../game/actions';
import { LOCATIONS } from '../game/data';
import { formatGameTime } from '../game/engine';

export function ActionOverlay() {
  const G = useGameState();

  if (!G.activeAction) return null;

  const locName = LOCATIONS[G.location]?.name || G.location;

  return (
    <div className="fixed inset-0 z-[800] bg-black/75 flex items-center justify-center p-5 animate-[ao-in_0.2s_ease]">
      <div className="flex w-[820px] max-w-[98vw] h-[min(600px,90vh)] bg-gradient-to-br from-[#0d100a] via-[#080c07] to-[#060809] border border-[#5a4228] rounded-[3px] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(200,150,42,0.08)] overflow-hidden">
        
        {/* Left Column */}
        <div className="w-[220px] min-w-[180px] flex flex-col border-r border-[#3d2e1a] bg-black/30">
          <div className="relative flex-[0_0_260px] bg-gradient-to-b from-[#0d1a10] via-[#060d08] to-[#020404] border-b border-[#3d2e1a] flex items-center justify-center overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute top-2.5 left-0 right-0 text-center font-['Cinzel'] text-[9px] tracking-[3px] text-[#7a5a18] uppercase z-10">
              {G.poseLabel}
            </div>
            <div className="w-[85%] h-[90%] relative z-[1]">
              <CharacterSvg isOverlay={true} />
            </div>
          </div>
          
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
            <div className="font-['Cinzel'] text-[9px] text-[#7a5a18] tracking-[3px] mb-1">PARTY</div>
            
            <div className="flex items-center gap-1.5 p-1.5 bg-[#1a1510] border border-[#3d2e1a] rounded-sm">
              <span className="text-[16px]">🧑</span>
              <div className="flex-1 min-w-0">
                <div className="font-['Cinzel'] text-[9px] text-[#f0e0c0] whitespace-nowrap overflow-hidden text-ellipsis">YOU</div>
                <div className="h-[3px] bg-[#3d2e1a] rounded-[1px] mt-1">
                  <div className="h-full rounded-[1px] bg-gradient-to-r from-[#6b1a1a] to-[#c44040] transition-all" style={{ width: `${Math.max(0, Math.min(100, (G.hp / G.maxHp) * 100))}%` }} />
                </div>
              </div>
              <span className="font-['Cinzel'] text-[9px] text-[#8a7a60]">{Math.ceil(G.hp)}hp</span>
            </div>

            <div className="mt-auto pt-2 border-t border-[#3d2e1a]">
              <VitalRow label="🍖" val={Math.floor(G.hunger)} color="#c87820" />
              <VitalRow label="💧" val={Math.floor(G.thirst)} color="#3070b8" />
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3.5 px-5 pb-2.5 border-b border-[#3d2e1a] flex items-center gap-3 bg-black/20">
            <div className="font-['Cinzel'] text-[16px] text-[#c8962a] tracking-[3px] font-semibold flex-1 uppercase">
              {G.activeAction.title}
            </div>
            <div className="font-['Cinzel'] text-[9px] text-[#8a7a60] tracking-[1px] px-2 py-1 border border-[#3d2e1a] rounded-sm bg-[#1a1510] uppercase">
              {locName}
            </div>
            <div className="font-['Cinzel'] text-[9px] text-[#8a7a60] tracking-[1px] px-2 py-1 border border-[#3d2e1a] rounded-sm bg-[#1a1510]">
              {formatGameTime()}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 px-5 flex flex-col gap-0 no-scrollbar" id="ao-feed-wrap">
            <div id="ao-feed" className="flex flex-col">
              {G.activeAction.feed.map((f: any, i: number) => {
                const colorClass = 
                  f.type === 'reward' ? 'text-[#e8b84b]' :
                  f.type === 'danger' ? 'text-[#e05050]' :
                  f.type === 'special' ? 'text-[#ffe080]' :
                  f.type === 'xp' ? 'text-[#80ddff]' :
                  f.type === 'event' ? 'text-[#f0e0c0] italic' :
                  f.type === 'choice-made' ? 'text-[#8a7a60] italic' :
                  'text-[#d4c4a0]';

                return (
                  <div key={i} className="py-2 border-b border-white/5 flex gap-2.5 items-start animate-[ao-entry-in_0.25s_ease]">
                    <span className="font-['Cinzel'] text-[9px] text-[#8a7a60] opacity-70 min-w-[52px] pt-0.5">{f.time}</span>
                    <span className={`font-['IMFellEnglish'] text-[14px] leading-relaxed flex-1 ${colorClass}`} dangerouslySetInnerHTML={{ __html: f.text }} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-3">
            {G.pendingChoices && (
              <div className="flex flex-col gap-1.5">
                <div className="font-['Cinzel'] text-[10px] text-[#7a5a18] tracking-[2px] mb-2 px-0.5">{G.pendingChoices.title}</div>
                {G.pendingChoices.choices.map((c: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => resolveOverlayChoice(i)}
                    className="px-4 py-2.5 font-['IMFellEnglish'] text-[14px] bg-[#201a13] border border-[#3d2e1a] text-[#f0e0c0] rounded-sm text-left leading-snug hover:border-[#7a5a18] hover:bg-[#c8962a]/10 hover:text-[#e8b84b] transition-colors"
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-2.5 px-5 pb-3.5 border-t border-[#3d2e1a] bg-black/30 flex items-center gap-3.5">
            <button 
              onClick={() => stopCurrentAction()}
              className="font-['Cinzel'] text-[10px] tracking-[2px] px-4 py-2 bg-transparent border border-[#8b2020] text-[#c44040] rounded-sm hover:bg-[#8b2020] hover:text-white transition-colors"
            >
              ⏹ STOP & RETURN
            </button>
            <div className="flex-1 h-[3px] bg-white/10 rounded-sm overflow-hidden">
              <div id="ao-tick-bar" className="h-full w-0 bg-gradient-to-r from-[#7a5a18] to-[#c8962a] rounded-sm" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function VitalRow({ label, val, color }: { label: string, val: number, color: string }) {
  return (
    <div className="flex items-center gap-1 mb-1">
      <span className="font-['Cinzel'] text-[9px] text-[#8a7a60] w-[18px] text-center">{label}</span>
      <div className="flex-1 h-[5px] bg-white/5 rounded-[3px] overflow-hidden">
        <div className="h-full rounded-[3px] transition-all" style={{ width: `${val}%`, background: color }} />
      </div>
      <span className="font-['Cinzel'] text-[9px] text-[#8a7a60] min-w-[30px] text-right">{val}</span>
    </div>
  );
}
