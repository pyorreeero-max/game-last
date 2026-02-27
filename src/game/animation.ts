import { OUTFITS } from './data';

function adj(hex: string, amount: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (n & 255) + amount));
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function defs(d: any, s: string) {
  return `<defs>
    <filter id="sh${s}" x="-20%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="rgba(0,0,0,0.45)"/></filter>
    <linearGradient id="body${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adj(d.bodyColor, 22)}"/><stop offset="100%" stop-color="${d.bodyColor}"/></linearGradient>
    <linearGradient id="skin${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adj(d.skinColor, 18)}"/><stop offset="100%" stop-color="${d.skinColor}"/></linearGradient>
  </defs>`;
}

function head(d: any, x: number, y: number, t: number, s: string) {
  const blink = Math.sin(t * 1.7) > 0.95;
  return `<g>
    <ellipse cx="${x}" cy="${y}" rx="10" ry="12" fill="url(#skin${s})" filter="url(#sh${s})"/>
    <path d="M ${x - 11} ${y - 2} Q ${x} ${y - 18} ${x + 11} ${y - 2} L ${x + 8} ${y - 10} Q ${x} ${y - 15} ${x - 8} ${y - 10} Z" fill="${d.hairColor}"/>
    ${blink
      ? `<line x1="${x - 5}" y1="${y + 1}" x2="${x - 1}" y2="${y + 1}" stroke="#2a1b11" stroke-width="1.4"/><line x1="${x + 1}" y1="${y + 1}" x2="${x + 5}" y2="${y + 1}" stroke="#2a1b11" stroke-width="1.4"/>`
      : `<circle cx="${x - 3.5}" cy="${y + 1}" r="1.4" fill="#20140d"/><circle cx="${x + 3.5}" cy="${y + 1}" r="1.4" fill="#20140d"/>`
    }
    <path d="M ${x - 4} ${y + 7} Q ${x} ${y + 9} ${x + 4} ${y + 7}" stroke="#7b4e34" stroke-width="1" fill="none"/>
  </g>`;
}

function limb(x: number, y: number, len: number, ang: number, w: number, col: string, s: string) {
  return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${len}" rx="${w / 2}" fill="${col}" filter="url(#sh${s})" transform="rotate(${ang},${x},${y})"/>`;
}

function commonBody(d: any, bodyY: number, torsoH: number, s: string) {
  return `<rect x="34" y="${bodyY}" width="32" height="${torsoH}" rx="8" fill="url(#body${s})" filter="url(#sh${s})"/>
    <line x1="36" y1="${bodyY + torsoH * 0.45}" x2="64" y2="${bodyY + torsoH * 0.45}" stroke="${d.trimColor}" stroke-width="2" opacity="0.75"/>`;
}

function poseIdle(d: any, t: number, s: string) {
  const b = Math.sin(t * 1.4) * 1.8;
  const arm = Math.sin(t * 0.9) * 4;
  return defs(d, s) + `<ellipse cx="50" cy="156" rx="18" ry="4" fill="rgba(0,0,0,0.27)"/>
    <g transform="translate(0,${-b})">
      ${commonBody(d, 66, 62, s)}
      ${limb(38, 74, 34, -8 + arm, 8, d.bodyColor, s)}
      ${limb(62, 74, 34, 8 - arm, 8, d.bodyColor, s)}
      <ellipse cx="35" cy="108" rx="4" ry="3.2" fill="${d.skinColor}"/>
      <ellipse cx="65" cy="108" rx="4" ry="3.2" fill="${d.skinColor}"/>
      ${head(d, 50, 42, t, s)}
    </g>
    ${limb(44, 128, 25, -2, 10, d.pantsColor, s)}
    ${limb(56, 128, 25, 2, 10, d.pantsColor, s)}
    <ellipse cx="43" cy="156" rx="7" ry="3.5" fill="${d.shoesColor}"/>
    <ellipse cx="57" cy="156" rx="7" ry="3.5" fill="${adj(d.shoesColor, -8)}"/>`;
}

function poseWalk(d: any, t: number, speed: number, s: string) {
  const ph = t * (2.8 + Math.min(speed, 3));
  const leg = Math.sin(ph) * 25;
  const arm = -leg * 0.7;
  const bob = Math.abs(Math.sin(ph)) * 2;
  return defs(d, s) + `<ellipse cx="50" cy="156" rx="18" ry="3.8" fill="rgba(0,0,0,0.25)"/>
    <g transform="translate(0,${-bob})">
      ${commonBody(d, 66, 62, s)}
      ${limb(38, 74, 34, arm, 8, d.bodyColor, s)}
      ${limb(62, 74, 34, -arm, 8, d.bodyColor, s)}
      <ellipse cx="34" cy="106" rx="4" ry="3" fill="${d.skinColor}"/>
      <ellipse cx="66" cy="106" rx="4" ry="3" fill="${d.skinColor}"/>
      ${head(d, 50, 41, t, s)}
    </g>
    ${limb(44, 128, 26, leg, 10, d.pantsColor, s)}
    ${limb(56, 128, 26, -leg, 10, adj(d.pantsColor, -10), s)}
    <ellipse cx="42" cy="156" rx="8" ry="3.5" fill="${d.shoesColor}" transform="rotate(${leg * 0.3},42,156)"/>
    <ellipse cx="58" cy="156" rx="8" ry="3.5" fill="${adj(d.shoesColor, -8)}" transform="rotate(${-leg * 0.3},58,156)"/>`;
}

function poseRun(d: any, t: number, s: string) {
  const ph = t * 5;
  const f = Math.sin(ph) * 38;
  const b = Math.abs(Math.sin(ph * 2)) * 2.8;
  return defs(d, s) + `<ellipse cx="50" cy="156" rx="16" ry="3" fill="rgba(0,0,0,0.24)"/>
    <g transform="translate(0,${-b}) rotate(8,50,96)">
      ${commonBody(d, 68, 60, s)}
      ${limb(38, 74, 33, -f * 0.85, 8, d.bodyColor, s)}
      ${limb(62, 74, 33, f * 0.85, 8, d.bodyColor, s)}
      <ellipse cx="35" cy="105" rx="4" ry="3" fill="${d.skinColor}"/>
      <ellipse cx="65" cy="105" rx="4" ry="3" fill="${d.skinColor}"/>
      ${head(d, 52, 42, t, s)}
    </g>
    ${limb(44, 129, 27, f, 10, d.pantsColor, s)}
    ${limb(56, 129, 27, -f, 10, adj(d.pantsColor, -12), s)}
    <ellipse cx="42" cy="156" rx="8" ry="3.2" fill="${d.shoesColor}"/>
    <ellipse cx="58" cy="156" rx="8" ry="3.2" fill="${adj(d.shoesColor, -8)}"/>`;
}

function poseBegging(d: any, t: number, s: string) {
  const sway = Math.sin(t * 1.4) * 1.2;
  return defs(d, s) + `<ellipse cx="50" cy="152" rx="24" ry="4" fill="rgba(0,0,0,0.24)"/>
    <ellipse cx="38" cy="140" rx="14" ry="8" fill="${d.pantsColor}"/>
    <ellipse cx="62" cy="140" rx="14" ry="8" fill="${adj(d.pantsColor, -8)}"/>
    <g transform="translate(${sway},0)">
      <rect x="36" y="78" width="28" height="52" rx="8" fill="url(#body${s})" filter="url(#sh${s})"/>
      <g transform="rotate(55,38,90)">${limb(38, 86, 26, 0, 8, d.bodyColor, s)}</g>
      <g transform="rotate(-70,62,90)">${limb(62, 86, 26, 0, 8, d.bodyColor, s)}</g>
      <ellipse cx="30" cy="105" rx="4" ry="3" fill="${d.skinColor}"/>
      <ellipse cx="70" cy="95" rx="4" ry="3" fill="${d.skinColor}"/>
      ${head(d, 50, 54, t, s)}
    </g>`;
}

function posePushups(d: any, t: number, s: string) {
  const p = (Math.sin(t * 2.8) + 1) / 2;
  const y = 98 - p * 15;
  const armLen = 11 + p * 16;
  return defs(d, s) + `<ellipse cx="50" cy="124" rx="32" ry="4" fill="rgba(0,0,0,0.28)"/>
    <rect x="26" y="${y}" width="42" height="10" rx="4" fill="url(#body${s})" filter="url(#sh${s})"/>
    <rect x="64" y="${y + 1}" width="14" height="9" rx="4" fill="${d.pantsColor}"/>
    <ellipse cx="82" cy="${y + 8}" rx="8" ry="3.2" fill="${d.shoesColor}"/>
    <ellipse cx="18" cy="${y + 4}" rx="9" ry="8" fill="url(#skin${s})" filter="url(#sh${s})"/>
    <ellipse cx="18" cy="${y - 2}" rx="10" ry="5" fill="${d.hairColor}"/>
    <g transform="rotate(88,40,${y + 6})">
      <rect x="36" y="${y + 6}" width="8" height="${armLen}" rx="4" fill="${d.bodyColor}" filter="url(#sh${s})"/>
      <ellipse cx="40" cy="${y + 6 + armLen}" rx="4.5" ry="2.8" fill="${d.skinColor}"/>
    </g>
    <g transform="rotate(88,54,${y + 6})">
      <rect x="50" y="${y + 6}" width="8" height="${armLen}" rx="4" fill="${adj(d.bodyColor, -10)}" filter="url(#sh${s})"/>
      <ellipse cx="54" cy="${y + 6 + armLen}" rx="4.5" ry="2.8" fill="${d.skinColor}"/>
    </g>`;
}

function poseSleep(d: any, t: number, s: string) {
  const r = Math.sin(t * 1.2) * 1.5;
  return defs(d, s) + `<rect x="10" y="126" width="80" height="24" rx="4" fill="#4d3320"/>
    <rect x="16" y="118" width="68" height="10" rx="4" fill="#7e5a36"/>
    <ellipse cx="50" cy="136" rx="26" ry="10" fill="${d.bodyColor}" transform="translate(0,${-r})"/>
    <ellipse cx="31" cy="129" rx="8" ry="7" fill="url(#skin${s})"/>
    <ellipse cx="67" cy="141" rx="10" ry="5" fill="${d.pantsColor}"/>
    <text x="72" y="111" font-size="10" fill="rgba(220,232,255,0.7)">Z</text>
    <text x="78" y="100" font-size="8" fill="rgba(220,232,255,0.6)">z</text>`;
}

function poseMeditate(d: any, t: number, s: string) {
  const b = Math.sin(t * 1.1) * 1.4;
  const aura = 0.28 + (Math.sin(t * 2) + 1) * 0.16;
  return defs(d, s) + `<ellipse cx="50" cy="151" rx="25" ry="4" fill="rgba(0,0,0,0.24)"/>
    <ellipse cx="50" cy="144" rx="25" ry="8" fill="rgba(126,102,210,${aura})"/>
    <ellipse cx="36" cy="136" rx="12" ry="6" fill="${d.pantsColor}"/>
    <ellipse cx="64" cy="136" rx="12" ry="6" fill="${adj(d.pantsColor, -8)}"/>
    <rect x="34" y="84" width="32" height="44" rx="8" fill="url(#body${s})" filter="url(#sh${s})" transform="translate(0,${-b})"/>
    <ellipse cx="36" cy="107" rx="6" ry="3" fill="${d.skinColor}"/>
    <ellipse cx="64" cy="107" rx="6" ry="3" fill="${d.skinColor}"/>
    ${head(d, 50, 62 - b, t, s)}`;
}

function poseWork(d: any, t: number, s: string) {
  const hit = -28 + ((Math.sin(t * 5.6) + 1) / 2) * 44;
  return defs(d, s) + `<ellipse cx="50" cy="156" rx="18" ry="4" fill="rgba(0,0,0,0.26)"/>
    ${commonBody(d, 66, 62, s)}
    ${limb(38, 74, 34, 8, 8, d.bodyColor, s)}
    <g transform="rotate(${hit},62,78)">
      ${limb(62, 74, 30, 0, 8, d.bodyColor, s)}
      <rect x="63" y="40" width="4" height="34" rx="2" fill="#85643d"/>
      <rect x="58" y="34" width="14" height="8" rx="2" fill="#6f7076"/>
    </g>
    ${head(d, 50, 42, t, s)}
    ${limb(44, 128, 25, -2, 10, d.pantsColor, s)}
    ${limb(56, 128, 25, 2, 10, d.pantsColor, s)}
    <ellipse cx="43" cy="156" rx="7" ry="3.4" fill="${d.shoesColor}"/>
    <ellipse cx="57" cy="156" rx="7" ry="3.4" fill="${adj(d.shoesColor, -8)}"/>`;
}

function poseFish(d: any, t: number, s: string) {
  const sway = Math.sin(t * 1.7) * 1.8;
  const wave = Math.sin(t * 2.1) * 3;
  return defs(d, s) + `<ellipse cx="50" cy="156" rx="18" ry="3.8" fill="rgba(0,0,0,0.25)"/>
    <g transform="translate(0,${-sway})">
      ${commonBody(d, 66, 62, s)}
      ${limb(38, 74, 34, 10, 8, d.bodyColor, s)}
      ${limb(62, 74, 34, -18, 8, d.bodyColor, s)}
      <line x1="70" y1="88" x2="112" y2="58" stroke="#8f6d40" stroke-width="3"/>
      <path d="M112 58 Q127 ${71 + wave} 121 ${95 + wave}" stroke="#d9e3f0" stroke-width="1.2" fill="none"/>
      ${head(d, 50, 42, t, s)}
    </g>
    ${limb(44, 128, 25, -2, 10, d.pantsColor, s)}
    ${limb(56, 128, 25, 2, 10, d.pantsColor, s)}
    <ellipse cx="43" cy="156" rx="7" ry="3.4" fill="${d.shoesColor}"/>
    <ellipse cx="57" cy="156" rx="7" ry="3.4" fill="${adj(d.shoesColor, -8)}"/>`;
}

function poseSwim(d: any, t: number, s: string) {
  const roll = Math.sin(t * 2.3) * 5;
  const arm = Math.sin(t * 4.4) * 26;
  return defs(d, s) + `<rect x="0" y="108" width="100" height="52" fill="rgba(38,108,148,0.62)"/>
    <path d="M0 116 Q20 ${114 + roll*0.3} 40 116 T80 116 T120 116" stroke="rgba(138,210,245,0.85)" stroke-width="2" fill="none"/>
    <g transform="translate(0,${roll * 0.4})">
      <ellipse cx="52" cy="123" rx="22" ry="9" fill="${d.bodyColor}"/>
      <ellipse cx="28" cy="120" rx="8.5" ry="7.5" fill="url(#skin${s})"/>
      <ellipse cx="68" cy="120" rx="6" ry="3" fill="${d.skinColor}"/>
      <g transform="rotate(${arm},68,120)"><ellipse cx="75" cy="120" rx="7" ry="3" fill="${d.skinColor}"/></g>
      <g transform="rotate(${-arm},40,126)"><ellipse cx="33" cy="126" rx="7" ry="3" fill="${d.skinColor}"/></g>
    </g>`;
}

export function getPoseSvg(pose: string, t: number, spd: number, outfitId: string, _equipment: any, suffix: string) {
  const d = OUTFITS[outfitId]?.svgDefs || OUTFITS.beggar.svgDefs;
  switch (pose) {
    case 'walking':
      return poseWalk(d, t, spd, suffix);
    case 'running':
      return poseRun(d, t, suffix);
    case 'pushups':
      return posePushups(d, t, suffix);
    case 'begging':
      return poseBegging(d, t, suffix);
    case 'sleeping':
      return poseSleep(d, t, suffix);
    case 'meditating':
    case 'contemplating':
    case 'observing':
    case 'praying':
      return poseMeditate(d, t, suffix);
    case 'working':
    case 'scavenging':
    case 'logcarry':
      return poseWork(d, t, suffix);
    case 'fishing':
      return poseFish(d, t, suffix);
    case 'swimming':
      return poseSwim(d, t, suffix);
    default:
      return poseIdle(d, t, suffix);
  }
}
