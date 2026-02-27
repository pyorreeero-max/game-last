import React, { useMemo, useState } from 'react';
import { useGameState } from '../game/state';
import { CITY_DISTRICTS, CITY_ROADS, CITY_BUILDINGS, CITY_WALL_OUTER, RIVER_PATH, CITY_POPULATION_TOTAL } from '../game/data';
import { travelTo } from '../game/actions';

export function MapPanel() {
  const G = useGameState();
  const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

  const citizenPoints = useMemo(() => (
    Array.from({ length: CITY_POPULATION_TOTAL }, (_, i) => {
      const col = i % 40;
      const row = Math.floor(i / 40);
      const jitterX = Math.sin(i * 1.7) * 2.2;
      const jitterY = Math.cos(i * 1.1) * 2.2;
      return {
        x: 122 + col * 14.2 + jitterX,
        y: 188 + row * 16.5 + jitterY,
      };
    })
  ), []);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 800 / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;

    if ((e.target as Element).closest('[data-district],[data-building]')) return;

    G.playerMapTarget = { x: svgX, y: svgY };
    if (!G.activeAction || G.activeAction.id.startsWith('travel_')) {
      G.pose = 'walking';
      G.poseLabel = 'Walking';
      G.mapMoveMode = 'manual';
    }
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
    <div className="flex-1 relative bg-gradient-to-br from-[#120d08] to-[#1f1710] overflow-hidden border-b-2 border-[#58462f]">
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full cursor-crosshair bg-[#1b140d]"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <filter id="map-glow"><feGaussianBlur stdDeviation="1.7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <pattern id="parchment" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#251b11"/>
            <circle cx="4" cy="5" r="0.7" fill="#3a2b1a"/>
            <circle cx="15" cy="12" r="0.8" fill="#3e2f1e"/>
            <path d="M0 10 H20 M10 0 V20" stroke="#2e2216" strokeWidth="0.5" opacity="0.4"/>
          </pattern>
          <radialGradient id="city-core" cx="50%" cy="48%" r="56%">
            <stop offset="0%" stopColor="#4a3722" />
            <stop offset="68%" stopColor="#2b2015" />
            <stop offset="100%" stopColor="#18120c" />
          </radialGradient>
        </defs>

        <rect width="800" height="800" fill="url(#parchment)"/>
        <circle cx="398" cy="410" r="372" fill="url(#city-core)" opacity="0.75"/>

        <path d={RIVER_PATH} stroke="#184f73" strokeWidth="34" fill="none" opacity="0.55"/>
        <path d={RIVER_PATH} stroke="#2c82b5" strokeWidth="16" fill="none" opacity="0.85"/>

        <polygon points={CITY_WALL_OUTER} fill="none" stroke="#7c6243" strokeWidth="14" opacity="0.9"/>
        <polygon points={CITY_WALL_OUTER} fill="none" stroke="#c9a67a" strokeWidth="4" opacity="0.8"/>

        {citizenPoints.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={1.45} fill={i % 7 === 0 ? '#f6e2c6' : '#d0b190'} opacity={0.28 + (i % 10) * 0.02} />
        ))}

        {Object.entries(CITY_DISTRICTS).map(([dk, d]) => {
          const isCurrent = G.location === d.gameId;
          return (
            <polygon
              key={dk}
              points={d.polygon}
              fill={d.fillColor}
              stroke={isCurrent ? '#ffdc89' : d.borderColor}
              strokeWidth={isCurrent ? 3 : 2}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleDistrictClick(e, dk)}
              data-district={dk}
            >
              <title>{d.name}</title>
            </polygon>
          );
        })}

        {CITY_ROADS.map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3e3020" strokeWidth="8" opacity="0.8"/>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8d7149" strokeWidth="3" opacity="0.85"/>
          </g>
        ))}

        {CITY_BUILDINGS.map(b => (
          <g key={b.id}>
            <rect
              x={b.x} y={b.y} width={b.w} height={b.h}
              fill={b.color} stroke="#d9ba86" strokeWidth="1.1" opacity="0.95"
              rx="1.5" className="cursor-pointer hover:brightness-125"
              data-building={b.id}
            >
              <title>{b.label || b.type}</title>
            </rect>
            <path d={`M ${b.x} ${b.y} L ${b.x + b.w / 2} ${b.y - 5} L ${b.x + b.w} ${b.y}`} fill="#7f5e3a" opacity="0.75"/>
          </g>
        ))}

        {Object.entries(CITY_DISTRICTS).map(([dk, d]) => (
          <text
            key={`lbl-${dk}`} x={d.labelX} y={d.labelY} textAnchor="middle"
            fontFamily="Cinzel,serif" fontSize="10" fill={G.location === d.gameId ? '#ffe7aa' : 'rgba(255,240,215,0.9)'}
            pointerEvents="none" letterSpacing="1.2"
          >
            {d.name.toUpperCase()}
          </text>
        ))}

        <text x="400" y="44" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="18" fill="#f0d4a6" letterSpacing="2">
          MEDIEVAL CITY OF HALROW
        </text>
        <text x="400" y="66" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="12" fill="#dfc290" letterSpacing="1">
          ESTIMATED POPULATION: {CITY_POPULATION_TOTAL} CITIZENS
        </text>

        {G.npcs.map((npc: any) => (
          <circle
            key={npc.id} cx={npc.x} cy={npc.y} r="3.1" fill={npc.color} opacity="0.85"
            className="cursor-pointer hover:r-4 transition-all"
            onClick={(e) => { e.stopPropagation(); G.selectedNpcId = npc.id; }}
          >
            <title>{npc.short} — {npc.occLabel}</title>
          </circle>
        ))}

        {G.playerMapPos && (
          <g>
            <circle cx={G.playerMapPos.x} cy={G.playerMapPos.y} r="7" fill="rgba(255,211,128,0.22)" filter="url(#map-glow)"/>
            <circle cx={G.playerMapPos.x} cy={G.playerMapPos.y} r="4.5" fill="#ffd17e" stroke="#fff1cf" strokeWidth="1.5">
              <animate attributeName="r" values="4.5;6;4.5" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {G.playerMapTarget && (
          <circle cx={G.playerMapTarget.x} cy={G.playerMapTarget.y} r="7" fill="none" stroke="#ffe0a8" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
        )}
      </svg>
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-[#1a120a]/95 border border-[#9e7a4f] px-2.5 py-2 text-[10px] text-[#f0d5a8] font-['Cinzel'] rounded-sm z-10"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
