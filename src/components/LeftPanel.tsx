import { useGameState } from '../game/state';
import { CharacterSvg } from './CharacterSvg';

export function LeftPanel() {
  const G = useGameState();

  return (
    <div className="w-[280px] bg-[#13100c] border-r-2 border-[#3d2e1a] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#3d2e1a]">
        <div className="font-['Cinzel'] text-[11px] text-[#7a5a18] tracking-[3px] uppercase mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#3d2e1a]">
          CHARACTER
        </div>

        <div className="w-full h-[420px] bg-gradient-to-b from-[#1d2731] via-[#101822] to-[#0a101a] border border-[#3d2e1a] rounded relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-2 left-0 right-0 text-center font-['Cinzel'] text-[9px] tracking-[1px] text-[#b99657] z-10 pointer-events-none uppercase">
            {G.poseLabel || G.pose || 'Idle'}
          </div>
          <CharacterSvg isOverlay={false} />
          <div className="absolute bottom-0 left-0 right-0 h-[36%] bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="p-4 text-[11px] text-[#8a7a60] font-['IMFellEnglish'] italic leading-relaxed">
        The left panel now shows only your live character animation. Open the <span className="text-[#c8962a] not-italic font-['Cinzel']">CHARACTER</span> tab on the right for equipment, stats, level and details.
      </div>
    </div>
  );
}
