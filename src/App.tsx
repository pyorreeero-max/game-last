import { useEffect } from 'react';
import { useGameState } from './game/state';
import { initGame, resolveEvent } from './game/engine';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { MapPanel } from './components/MapPanel';
import { RightPanel } from './components/RightPanel';
import { EventLog } from './components/EventLog';
import { ActionOverlay } from './components/ActionOverlay';

export default function App() {
  const G = useGameState();

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0d0a07] text-[#d4c4a0] font-serif overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(40, 20, 0, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(20, 10, 0, 0.3) 0%, transparent 50%)' }}>
      
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        
        <div className="flex-1 flex flex-col border-x-2 border-[#3d2e1a] overflow-hidden">
          <MapPanel />
          <EventLog />
        </div>
        
        <RightPanel />
      </div>

      <ActionOverlay />

      {/* Event Popup */}
      {G.activeEvent && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[499] block" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-[#1a1510] border-2 border-[#c8962a] rounded-[3px] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(200,150,42,0.2)] z-[500] overflow-hidden animate-[popup-in_0.2s_ease]">
            <div className="bg-gradient-to-r from-[#0d0a07] to-[#c8962a]/10 px-4 py-3.5 border-b border-[#3d2e1a] font-['Cinzel'] text-[13px] text-[#c8962a] tracking-[1px]">
              {G.activeEvent.icon} {G.activeEvent.title}
            </div>
            <div className="p-4">
              <div className="font-['IMFellEnglish'] text-[15px] text-[#f0e0c0] leading-relaxed mb-4">
                {G.activeEvent.text}
              </div>
              <div className="flex flex-col gap-2">
                {G.activeEvent.choices.map((c: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => resolveEvent(i)}
                    className="px-4 py-2.5 font-['Cinzel'] text-[11px] tracking-[1px] bg-[#201a13] border border-[#3d2e1a] text-[#d4c4a0] rounded-sm text-left uppercase hover:border-[#7a5a18] hover:text-[#c8962a] hover:bg-[#c8962a]/5 transition-colors"
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      <div className={`fixed bottom-8 right-8 bg-[#1a1510] border border-[#7a5a18] px-5 py-3 font-['Cinzel'] text-[12px] text-[#c8962a] rounded-sm z-[600] tracking-[0.5px] max-w-[300px] text-center transition-all duration-300 ${G.toast ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
        {G.toast}
      </div>

    </div>
  );
}
