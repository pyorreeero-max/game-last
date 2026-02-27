import { useEffect, useRef } from 'react';
import { G } from '../game/state';
import { getPoseSvg } from '../game/animation';

export function CharacterSvg({ isOverlay = false }: { isOverlay?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    let frameId: number;
    const loop = (timestamp: number) => {
      if (svgRef.current && !G.gamePaused) {
        const t = timestamp / 1000;
        const pose = isOverlay ? G.pose : 'idle'; // Main sheet is always idle
        svgRef.current.innerHTML = getPoseSvg(pose, t, G.gameSpeed, G.outfit, G.equipment, isOverlay ? 'ao' : 'main');
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isOverlay]);

  return <svg ref={svgRef} viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" />;
}
