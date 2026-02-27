import React, { useState } from 'react';
import { useGameState } from '../game/state';
import { CITY_DISTRICTS, CITY_ROADS, CITY_BUILDINGS, CITY_WALL_OUTER, RIVER_PATH } from '../game/data';
import { travelTo } from '../game/actions';

export function MapPanel() {
  const G = useGameState();
  const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 800 / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;

    if ((e.target as Element).closest('[data-district],[data-building]')) return;

    G.playerMapTarget = { x: svgX, y: svgY };
  };

  const handleDistrictClick = (e: React.MouseEvent, dk: string) => {
    e.stopPropagation();
    const d = CITY_DISTRICTS[dk];
    if (!d) return;
    if (d.gameId && d.gameId !== G.location) {
      travelTo(d.gameId);
      const pts = d.polygon.split(' ').map((p: string) => p.split(',').map(Number));
      const cx = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      G.playerMapTarget = { x: cx, y: cy };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as Element;
    const title = target.querySelector('title')?.textContent;
    if (title) {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, text: title });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div className="flex-1 relative bg-gradient-to-br from-[#0a1208] to-[#0d1a0a] overflow-hidden border-b-2 border-[#3d2e1a]">
      <svg 
        viewBox="0 0 800 800" 
        className="w-full h-full cursor-crosshair bg-[#060d04]"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <filter id="map-glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="map-glow-strong">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <pattern id="ground-texture" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="#080e06"/>
            <circle cx="1" cy="1" r="0.5" fill="#060c04" opacity="0.6"/>
            <circle cx="5" cy="4" r="0.4" fill="#050a03" opacity="0.5"/>
            <circle cx="3" cy="7" r="0.3" fill="#070c05" opacity="0.4"/>
          </pattern>
        </defs>

        <rect width="800" height="800" fill="url(#ground-texture)"/>

        <path d={RIVER_PATH} stroke="#1a4a7a" strokeWidth="24" fill="none" opacity="0.9"/>
        <path d={RIVER_PATH} stroke="#2060a0" strokeWidth="14" fill="none" opacity="0.75"/>
        <path d={RIVER_PATH} stroke="#3080c0" strokeWidth="6" fill="none" opacity="0.6"/>

        <polygon points={CITY_WALL_OUTER} fill="none" stroke="#8a7040" strokeWidth="9" opacity="0.95"/>
        <polygon points={CITY_WALL_OUTER} fill="none" stroke="#c0a060" strokeWidth="3" opacity="0.8"/>

        {Object.entries(CITY_DISTRICTS).map(([dk, d]) => {
          const isCurrent = G.location === d.gameId;
          return (
            <polygon 
              key={dk}
              points={d.polygon}
              fill={d.fillColor}
              stroke={isCurrent ? '#c8962a' : d.borderColor}
              strokeWidth={isCurrent ? 2.5 : 1.5}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => handleDistrictClick(e, dk)}
              data-district={dk}
            >
              <title>{d.name}</title>
            </polygon>
          );
        })}

        {CITY_ROADS.map(([x1,y1,x2,y2], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a3818" strokeWidth="3.5" opacity="0.9"/>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#786040" strokeWidth="1.5" opacity="0.7"/>
          </g>
        ))}

        {CITY_BUILDINGS.map(b => {
          const accent: Record<string, string> = {
            home:'#5a4020', shop:'#806020', tavern:'#804010', church:'#604080',
            guild:'#405820', blacksmith:'#504040', merchant:'#705020',
            workshop:'#403020', mansion:'#304060', bank:'#804040',
            market:'#786020', healer:'#305020', bathhouse:'#205040',
            castle:'#404068', misc:'#383828',
          };
          return (
            <g key={b.id}>
              <rect 
                x={b.x} y={b.y} width={b.w} height={b.h}
                fill={b.color} stroke={accent[b.type] || '#505020'} strokeWidth="1.5" opacity="0.95"
                rx="1" className="cursor-pointer hover:brightness-125"
                data-building={b.id}
              >
                <title>{b.label || b.type}</title>
              </rect>
              <line x1={b.x} y1={b.y} x2={b.x+b.w} y2={b.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
            </g>
          );
        })}

        {Object.entries(CITY_DISTRICTS).map(([dk, d]) => (
          <text 
            key={`lbl-${dk}`} x={d.labelX} y={d.labelY} textAnchor="middle"
            fontFamily="Cinzel,serif" fontSize="8" fill={G.location===d.gameId ? '#e8c060' : 'rgba(255,255,240,0.75)'}
            pointerEvents="none" letterSpacing="1"
          >
            {d.name.toUpperCase()}
          </text>
        ))}

        {G.npcs.map((npc: any, i: number) => (
          <circle 
            key={npc.id} cx={npc.x} cy={npc.y} r="3" fill={npc.color} opacity="0.8" 
            className="cursor-pointer hover:r-4 transition-all"
            onClick={(e) => { e.stopPropagation(); G.selectedNpcId = npc.id; }}
          >
            <title>{npc.short} — {npc.occLabel}</title>
          </circle>
        ))}

        {G.playerMapPos && (
          <g>
            <circle cx={G.playerMapPos.x} cy={G.playerMapPos.y} r="5.5" fill="rgba(40,100,200,0.3)" filter="url(#map-glow-strong)"/>
            <circle cx={G.playerMapPos.x} cy={G.playerMapPos.y} r="4" fill="#4090ff" stroke="#80c0ff" strokeWidth="1.5" filter="url(#map-glow)">
              <animate attributeName="r" values="4;5.5;4" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.85;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {G.playerMapTarget && (
          <circle cx={G.playerMapTarget.x} cy={G.playerMapTarget.y} r="6" fill="none" stroke="#4090ff" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        )}
      </svg>
      {tooltip && (
        <div 
          className="absolute pointer-events-none bg-[#0a0804]/95 border border-[#6a4020] px-2.5 py-2 text-[10px] text-[#c8b080] font-['Cinzel'] rounded-sm z-10"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
