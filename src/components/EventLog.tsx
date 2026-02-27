import { useGameState } from '../game/state';
import { useEffect, useRef } from 'react';

export function EventLog() {
  const G = useGameState();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [G.logs]);

  return (
    <div className="h-[130px] border-t-2 border-[#3d2e1a] bg-[#13100c] flex flex-col">
      <div className="font-['Cinzel'] text-[10px] text-[#8a7a60] tracking-[3px] px-3.5 py-1.5 border-b border-[#3d2e1a] bg-[#13100c]">
        EVENT LOG
      </div>
      <div ref={logRef} className="flex-1 overflow-y-auto px-3.5 py-1.5 no-scrollbar">
        {G.logs.map((log: any, i: number) => {
          const colorClass = 
            log.cls === 'ev-reward' ? 'text-[#c8962a]' :
            log.cls === 'ev-danger' ? 'text-[#c44040]' :
            log.cls === 'ev-special' ? 'text-[#e8b84b] italic' :
            'text-[#d4c4a0]';

          return (
            <div key={i} className={`text-[13px] leading-relaxed py-0.5 border-b border-[#3d2e1a]/30 last:border-0 ${colorClass}`}>
              <span className="text-[#4a3820] text-[11px] font-['Cinzel'] mr-1.5">{log.time}</span>
              <span dangerouslySetInnerHTML={{ __html: log.message }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
