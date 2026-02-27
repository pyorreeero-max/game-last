import { useGameState } from '../game/state';
import { formatGameTime, priceStr } from '../game/engine';

export function TopBar() {
  const G = useGameState();
  
  return (
    <div className="bg-[#13100c] border-b-2 border-[#3d2e1a] px-5 py-2.5 flex items-center justify-between">
      <div className="font-['Cinzel'] text-[22px] text-[#c8962a] tracking-[3px] font-bold" style={{ textShadow: '0 0 20px rgba(200,150,42,0.4)' }}>
        RAGS TO RICHES
      </div>
      
      <div className="flex items-center gap-2">
        <div className="font-['Cinzel'] text-[13px] text-[#8a7a60] tracking-[2px] min-w-[160px] text-center">
          Day {G.day} · {formatGameTime()}
        </div>
        <div className="flex gap-[3px] items-center">
          <button 
            className={`w-8 h-6 bg-[#201a13] border border-[#5a4228] text-[#c8962a] text-xs rounded-sm transition-all flex items-center justify-center hover:bg-[#c8962a] hover:text-black ${G.gamePaused ? 'bg-[#8b2020] border-[#c44040] text-white' : ''}`}
            onClick={() => { G.gamePaused = !G.gamePaused; }}
          >
            {G.gamePaused ? '▶' : '⏸'}
          </button>
          {[1, 2, 3, 5].map(s => (
            <button
              key={s}
              className={`w-7 h-6 border text-[10px] font-['Cinzel'] rounded-sm transition-all flex items-center justify-center tracking-[0.5px] ${G.gameSpeed === s ? 'bg-[#c8962a] text-black border-[#c8962a] font-bold' : 'bg-[#201a13] border-[#3d2e1a] text-[#8a7a60] hover:border-[#7a5a18] hover:text-[#c8962a]'}`}
              onClick={() => { G.gameSpeed = s; G.gamePaused = false; }}
            >
              {s}x
            </button>
          ))}
        </div>
        <div className="font-['Cinzel'] text-[9px] text-[#7a5a18] tracking-[1px] min-w-[28px] text-center">
          {G.gameSpeed === 1 ? 'NORMAL' : G.gameSpeed === 2 ? 'FAST' : G.gameSpeed === 3 ? 'QUICK' : 'FASTEST'}
        </div>
      </div>
      
      <div className="flex gap-4 items-center" dangerouslySetInnerHTML={{ __html: priceStr(G.copper) }} />
    </div>
  );
}
