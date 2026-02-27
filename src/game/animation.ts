import { OUTFITS, EQUIPMENT_ITEMS } from './data';

function adjustColor(hex: string, amount: number) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}

let _gradUID = 0;
let _currentGradSuffix = 'g0';

function gradDefs(d: any, suffix: string) {
  _currentGradSuffix = suffix;
  const s = suffix;
  return `<defs>
    <filter id="sh${s}" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
    </filter>
    <linearGradient id="bG${s}" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${d.bodyColor}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="${adjustColor(d.bodyColor,22)}"/>
      <stop offset="100%" stop-color="${d.bodyColor}" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="cG${s}" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${adjustColor(d.capeColor,20)}"/>
      <stop offset="100%" stop-color="${d.capeColor}"/>
    </linearGradient>
    <linearGradient id="fG${s}" x1="0.2" y1="0" x2="0.8" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${adjustColor(d.skinColor,18)}"/>
      <stop offset="100%" stop-color="${d.skinColor}"/>
    </linearGradient>
    <linearGradient id="hG${s}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${adjustColor(d.hairColor,28)}"/>
      <stop offset="100%" stop-color="${d.hairColor}"/>
    </linearGradient>
  </defs>`;
}

const sh = (s: string) => `filter="url(#sh${s})"`;
const bG = (s: string) => `fill="url(#bG${s})"`;
const cG = (s: string) => `fill="url(#cG${s})"`;
const fG = (s: string) => `fill="url(#fG${s})"`;
const hG = (s: string) => `fill="url(#hG${s})"`;

function head(d: any, cx: number, cy: number, tilt=0, t: number, suffix: string) {
  const blink = (Math.sin(t * 1.15) > 0.96);
  const sx = cx, sy = cy;
  return `
  <g transform="rotate(${tilt},${sx},${sy})">
    <ellipse cx="${sx}" cy="${sy}" rx="11" ry="13" ${fG(suffix)} ${sh(suffix)}/>
    <ellipse cx="${sx}" cy="${sy-10}" rx="12" ry="7" fill="${d.hairColor}"/>
    <ellipse cx="${sx-10}" cy="${sy-2}" rx="2.5" ry="4" fill="${d.hairColor}"/>
    <ellipse cx="${sx+10}" cy="${sy-2}" rx="2.5" ry="4" fill="${d.hairColor}"/>
    <ellipse cx="${sx-11}" cy="${sy+3}" rx="2" ry="2.5" fill="${adjustColor(d.skinColor,-5)}"/>
    <ellipse cx="${sx+11}" cy="${sy+3}" rx="2" ry="2.5" fill="${adjustColor(d.skinColor,-5)}"/>
    ${blink
      ? `<path d="M${sx-6} ${sy+1} Q${sx-4} ${sy-1} ${sx-2} ${sy+1}" stroke="${d.hairColor}" stroke-width="1.8" fill="none"/>
         <path d="M${sx+2} ${sy+1} Q${sx+4} ${sy-1} ${sx+6} ${sy+1}" stroke="${d.hairColor}" stroke-width="1.8" fill="none"/>`
      : `<ellipse cx="${sx-4}" cy="${sy+1}" rx="2.2" ry="2.6" fill="#1a0f08"/>
         <ellipse cx="${sx+4}" cy="${sy+1}" rx="2.2" ry="2.6" fill="#1a0f08"/>
         <ellipse cx="${sx-3.2}" cy="${sy}" rx="0.7" ry="0.7" fill="rgba(255,255,255,0.7)"/>
         <ellipse cx="${sx+4.8}" cy="${sy}" rx="0.7" ry="0.7" fill="rgba(255,255,255,0.7)"/>
         <path d="M${sx-7} ${sy-4} Q${sx-4} ${sy-5.5} ${sx-1} ${sy-4}" stroke="${d.hairColor}" stroke-width="1" fill="none"/>
         <path d="M${sx+1} ${sy-4} Q${sx+4} ${sy-5.5} ${sx+7} ${sy-4}" stroke="${d.hairColor}" stroke-width="1" fill="none"/>`
    }
    <rect x="${sx-2}" y="${sy+5}" width="4" height="6" rx="2" fill="${adjustColor(d.skinColor,-8)}"/>
    <path d="M${sx-4} ${sy+12} Q${sx} ${sy+14} ${sx+4} ${sy+12}" stroke="#8a5a40" stroke-width="1" fill="none"/>
  </g>`;
}

function renderHelm(eq: string, cx: number, cy: number, tilt=0) {
  if (!eq) return '';
  switch(eq) {
    case 'tattered_hood': return `<path d="M${cx-10} ${cy-8} Q${cx} ${cy-22} Q${cx+10} ${cy-8}" fill="#3a2810" opacity="0.85" transform="rotate(${tilt},${cx},${cy})"/>`;
    case 'leather_cap': return `<path d="M${cx-11} ${cy-6} Q${cx-8} ${cy-20} Q${cx} ${cy-22} Q${cx+8} ${cy-20} Q${cx+11} ${cy-6}" fill="#5a3a18" opacity="0.9" transform="rotate(${tilt},${cx},${cy})"/>`;
    case 'iron_helm': return `<path d="M${cx-12} ${cy-4} L${cx-12} ${cy-18} Q${cx} ${cy-25} L${cx+12} ${cy-18} L${cx+12} ${cy-4} Z" fill="#707870" opacity="0.92" stroke="#505850" stroke-width="0.8" transform="rotate(${tilt},${cx},${cy})"/><line x1="${cx-13}" y1="${cy-8}" x2="${cx-9}" y2="${cy-4}" stroke="#505850" stroke-width="1" transform="rotate(${tilt},${cx},${cy})"/>`;
    default: return '';
  }
}

function renderNeck(eq: string, cx: number, torsoTop: number) {
  if (!eq) return '';
  switch(eq) {
    case 'wooden_bead_necklace': return `<ellipse cx="${cx}" cy="${torsoTop+8}" rx="9" ry="3" fill="none" stroke="#8a6030" stroke-width="2.5" stroke-dasharray="3 2"/>`;
    case 'copper_medallion': return `<ellipse cx="${cx}" cy="${torsoTop+10}" rx="8" ry="2.5" fill="none" stroke="#b87820" stroke-width="1.5"/><circle cx="${cx}" cy="${torsoTop+14}" r="3.5" fill="#b87820" opacity="0.9"/>`;
    case 'silver_pendant': return `<ellipse cx="${cx}" cy="${torsoTop+9}" rx="8" ry="2.5" fill="none" stroke="#a0a8b0" stroke-width="1.5"/><path d="M${cx-3} ${torsoTop+13} L${cx} ${torsoTop+18} L${cx+3} ${torsoTop+13} Z" fill="#a0a8b0" opacity="0.85"/>`;
    default: return '';
  }
}

function renderCape(eq: string, cx: number, torsoTop: number, sway: number) {
  if (!eq) return '';
  switch(eq) {
    case 'beggar_cloak': return `<path d="M${cx-8} ${torsoTop} Q${cx-22+sway} ${torsoTop+40} ${cx-18+sway} ${torsoTop+75}" stroke="#3a2810" stroke-width="8" fill="none" opacity="0.6" stroke-linecap="round"/><path d="M${cx+8} ${torsoTop} Q${cx+22-sway} ${torsoTop+40} ${cx+18-sway} ${torsoTop+75}" stroke="#3a2810" stroke-width="8" fill="none" opacity="0.5" stroke-linecap="round"/>`;
    case 'traveller_cloak': return `<path d="M${cx-10} ${torsoTop-5} Q${cx-28+sway*1.5} ${torsoTop+35} ${cx-20+sway} ${torsoTop+80}" stroke="#2a2038" stroke-width="12" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M${cx+10} ${torsoTop-5} Q${cx+28-sway*1.5} ${torsoTop+35} ${cx+20-sway} ${torsoTop+80}" stroke="#2a2038" stroke-width="12" fill="none" opacity="0.65" stroke-linecap="round"/><path d="M${cx-10} ${torsoTop-5} Q${cx} ${torsoTop-12} ${cx+10} ${torsoTop-5}" fill="#2a2038" opacity="0.8"/>`;
    default: return '';
  }
}

function renderTorso(eq: string, cx: number, torsoTop: number, torsoH: number) {
  if (!eq) return '';
  switch(eq) {
    case 'roughspun_tunic': return `<path d="M${cx-6} ${torsoTop} Q${cx} ${torsoTop+8} ${cx+6} ${torsoTop}" fill="none" stroke="#7a7040" stroke-width="1.5" opacity="0.8"/>`;
    case 'padded_gambeson': return `<rect x="${cx-17}" y="${torsoTop}" width="34" height="${torsoH}" rx="4" fill="#6a5830" opacity="0.75"/>${[0,7,14,21].map(dy=>`<line x1="${cx-16}" y1="${torsoTop+dy}" x2="${cx+16}" y2="${torsoTop+dy}" stroke="#5a4820" stroke-width="1" opacity="0.6"/>`).join('')}<path d="M${cx-6} ${torsoTop} Q${cx} ${torsoTop+8} ${cx+6} ${torsoTop}" fill="none" stroke="#8a7848" stroke-width="1.5"/>`;
    default: return '';
  }
}

function renderLegs(eq: string, lLegX: number, rLegX: number, legsY: number, legsH: number) {
  if (!eq) return '';
  switch(eq) {
    case 'linen_trousers': return `<rect x="${lLegX-5}" y="${legsY}" width="10" height="${legsH}" rx="3" fill="#a09060" opacity="0.7"/><rect x="${rLegX-5}" y="${legsY}" width="10" height="${legsH}" rx="3" fill="#a09060" opacity="0.65"/>`;
    case 'leather_breeches': return `<rect x="${lLegX-6}" y="${legsY}" width="11" height="${legsH}" rx="3" fill="#5a3a18" opacity="0.8"/><rect x="${rLegX-6}" y="${legsY}" width="11" height="${legsH}" rx="3" fill="#4a3010" opacity="0.75"/><line x1="${lLegX}" y1="${legsY+5}" x2="${lLegX}" y2="${legsY+legsH-3}" stroke="#3a2810" stroke-width="1" opacity="0.5"/><line x1="${rLegX}" y1="${legsY+5}" x2="${rLegX}" y2="${legsY+legsH-3}" stroke="#3a2810" stroke-width="1" opacity="0.5"/>`;
    default: return '';
  }
}

function renderBoots(eq: string, lx: number, rx: number, y: number) {
  if (!eq) return '';
  switch(eq) {
    case 'worn_sandals': return `<ellipse cx="${lx}" cy="${y+1}" rx="7" ry="3.5" fill="#8a7050" opacity="0.8"/><ellipse cx="${rx}" cy="${y+1}" rx="7" ry="3.5" fill="#7a6040" opacity="0.75"/><line x1="${lx-5}" y1="${y-3}" x2="${lx+5}" y2="${y-3}" stroke="#8a7050" stroke-width="1.5"/><line x1="${rx-5}" y1="${y-3}" x2="${rx+5}" y2="${y-3}" stroke="#7a6040" stroke-width="1.5"/>`;
    case 'leather_boots': return `<path d="M${lx-7} ${y-8} L${lx-7} ${y+2} Q${lx} ${y+5} L${lx+7} ${y+2} L${lx+7} ${y-4}" fill="#5a3818" opacity="0.85"/><path d="M${rx-7} ${y-8} L${rx-7} ${y+2} Q${rx} ${y+5} L${rx+7} ${y+2} L${rx+7} ${y-4}" fill="#4a3010" opacity="0.8"/>`;
    case 'hobnail_boots': return `<path d="M${lx-8} ${y-10} L${lx-8} ${y+2} Q${lx} ${y+6} L${lx+8} ${y+2} L${lx+8} ${y-6}" fill="#3a3020" opacity="0.88"/><path d="M${rx-8} ${y-10} L${rx-8} ${y+2} Q${rx} ${y+6} L${rx+8} ${y+2} L${rx+8} ${y-6}" fill="#302820" opacity="0.82"/>${[-5,-1,3].map(ox=>`<circle cx="${lx+ox}" cy="${y+3}" r="1.2" fill="#707070"/><circle cx="${rx+ox}" cy="${y+3}" r="1.2" fill="#606060"/>`).join('')}`;
    default: return '';
  }
}

function renderRHand(eq: string, handX: number, handY: number) {
  if (!eq) return '';
  switch(eq) {
    case 'rusty_dagger': return `<line x1="${handX}" y1="${handY-2}" x2="${handX+4}" y2="${handY-18}" stroke="#7a7060" stroke-width="3" stroke-linecap="round"/><line x1="${handX+1}" y1="${handY-14}" x2="${handX+7}" y2="${handY-14}" stroke="#7a6030" stroke-width="2"/>`;
    case 'club': return `<line x1="${handX}" y1="${handY-2}" x2="${handX+3}" y2="${handY-20}" stroke="#6a4018" stroke-width="4" stroke-linecap="round"/><ellipse cx="${handX+4}" cy="${handY-20}" rx="5" ry="4" fill="#5a3010"/>`;
    case 'short_sword': return `<line x1="${handX-1}" y1="${handY}" x2="${handX+6}" y2="${handY-28}" stroke="#a0a8b0" stroke-width="3" stroke-linecap="round"/><line x1="${handX-5}" y1="${handY-12}" x2="${handX+9}" y2="${handY-12}" stroke="#8a7020" stroke-width="3"/><ellipse cx="${handX}" cy="${handY-4}" rx="3" ry="4" fill="#8a7020"/>`;
    default: return '';
  }
}

function renderLHand(eq: string, handX: number, handY: number) {
  if (!eq) return '';
  switch(eq) {
    case 'buckler': return `<ellipse cx="${handX-6}" cy="${handY-6}" rx="9" ry="10" fill="#7a6030" opacity="0.85" stroke="#5a4020" stroke-width="1"/><ellipse cx="${handX-6}" cy="${handY-6}" rx="6" ry="7" fill="none" stroke="#9a8040" stroke-width="1"/><circle cx="${handX-6}" cy="${handY-6}" r="2" fill="#9a8040"/>`;
    case 'torch': return `<line x1="${handX}" y1="${handY}" x2="${handX-3}" y2="${handY-22}" stroke="#8a5020" stroke-width="4" stroke-linecap="round"/><ellipse cx="${handX-3}" cy="${handY-23}" rx="4" ry="5" fill="#e87820" opacity="0.85"/><ellipse cx="${handX-3}" cy="${handY-25}" rx="3" ry="4" fill="#f0a030" opacity="0.7"/>`;
    default: return '';
  }
}

function poseIdle(d: any, t: number, eq: any, suffix: string) {
  const breathe = Math.sin(t * 1.2) * 1.5;
  const sway = Math.sin(t * 0.8) * 3;
  return gradDefs(d, suffix) + `
  <ellipse cx="50" cy="157" rx="18" ry="3.5" fill="rgba(0,0,0,0.35)"/>
  ${renderCape(eq.cape, 50, 67, sway)}
  <g transform="translate(0,${-breathe})">
    <rect x="33" y="67" width="34" height="63" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
    <rect x="33" y="95" width="34" height="3" rx="1" fill="${adjustColor(d.bodyColor,-15)}" opacity="0.6"/>
    <ellipse cx="33" cy="69" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}" ${sh(suffix)}/>
    <ellipse cx="67" cy="69" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}" ${sh(suffix)}/>
    <line x1="33" y1="70" x2="26" y2="88" stroke="${d.bodyColor}" stroke-width="9" stroke-linecap="round"/>
    <line x1="26" y1="88" x2="24" y2="104" stroke="${adjustColor(d.bodyColor,-8)}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="26" cy="88" r="5" fill="${adjustColor(d.bodyColor,5)}"/>
    <ellipse cx="24" cy="104" rx="4.5" ry="3.5" fill="${d.skinColor}"/>
    <line x1="67" y1="70" x2="74" y2="88" stroke="${d.bodyColor}" stroke-width="9" stroke-linecap="round"/>
    <line x1="74" y1="88" x2="76" y2="104" stroke="${adjustColor(d.bodyColor,-8)}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="74" cy="88" r="5" fill="${adjustColor(d.bodyColor,5)}"/>
    <ellipse cx="76" cy="104" rx="4.5" ry="3.5" fill="${d.skinColor}"/>
    ${renderTorso(eq.torso, 50, 67, 50)}
    ${renderNeck(eq.neck, 50, 67)}
  </g>
  <rect x="35" y="130" width="12" height="24" rx="3" fill="${d.pantsColor}" ${sh(suffix)}/>
  <rect x="53" y="130" width="12" height="24" rx="3" fill="${d.pantsColor}" ${sh(suffix)}/>
  ${renderLegs(eq.legs, 41, 59, 130, 24)}
  ${eq.boots ? renderBoots(eq.boots, 41, 59, 154) : `<ellipse cx="41" cy="155" rx="5" ry="3" fill="${d.skinColor}" opacity="0.7"/><ellipse cx="59" cy="155" rx="5" ry="3" fill="${d.skinColor}" opacity="0.6"/>`}
  ${renderRHand(eq.rhand, 76, 104 - breathe)}
  ${renderLHand(eq.lhand, 24, 104 - breathe)}
  ${head(d, 50, 36 - breathe, 0, t, suffix)}
  ${renderHelm(eq.head, 50, 36 - breathe, 0)}`;
}

function poseWalking(d: any, t: number, spd: number, eq: any, suffix: string) {
  const freq = 2.8 * Math.min(spd || 1, 3);
  const legSwing = Math.sin(t * freq) * 18;
  const armSwing = -legSwing * 0.55;
  const bob = Math.abs(Math.sin(t * freq)) * 2.5;
  const bodyShift = Math.sin(t * freq * 2) * 0.8;
  const legBaseY = 128;

  return gradDefs(d, suffix) + `
  <ellipse cx="${50 + bodyShift}" cy="157" rx="16" ry="2.8" fill="rgba(0,0,0,0.28)"/>
  <g transform="rotate(${-legSwing}, 55, ${legBaseY})">
    <rect x="49" y="${legBaseY}" width="12" height="25" rx="3" fill="${adjustColor(d.pantsColor,-12)}" ${sh(suffix)}/>
    <ellipse cx="55" cy="${legBaseY+28}" rx="7" ry="3.5" fill="${adjustColor(d.shoesColor,-14)}"/>
  </g>
  <g transform="translate(${bodyShift},${-bob})">
    <rect x="33" y="67" width="34" height="63" rx="4" ${bG(suffix)} ${sh(suffix)}/>
    <rect x="33" y="94" width="34" height="4" rx="1" fill="${d.trimColor}" opacity="0.8"/>
    <ellipse cx="33" cy="69" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}"/>
    <ellipse cx="67" cy="69" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}"/>
    <g transform="rotate(${-armSwing}, 67, 70)">
      <rect x="66" y="67" width="10" height="34" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
      <ellipse cx="71" cy="103" rx="4.5" ry="3.5" fill="${d.skinColor}"/>
    </g>
    <g transform="rotate(${armSwing}, 33, 70)">
      <rect x="24" y="67" width="10" height="34" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
      <ellipse cx="29" cy="103" rx="4.5" ry="3.5" fill="${d.skinColor}"/>
    </g>
  </g>
  <g transform="rotate(${legSwing}, 45, ${legBaseY})">
    <rect x="39" y="${legBaseY}" width="12" height="25" rx="3" fill="${d.pantsColor}" ${sh(suffix)}/>
    <ellipse cx="45" cy="${legBaseY+28}" rx="7" ry="3.5" fill="${d.shoesColor}"/>
  </g>
  ${renderCape(eq.cape, 50, 67, -bob)}
  ${head(d, 50 + bodyShift * 0.6, 36 - bob, bodyShift * 0.4, t, suffix)}
  ${renderHelm(eq.head, 50 + bodyShift * 0.6, 36 - bob, bodyShift * 0.4)}`;
}

function posePushups(d: any, t: number, suffix: string) {
  const pushPhase = (Math.sin(t * 2.5) + 1) / 2;
  const strain = pushPhase < 0.22;
  const armLen  = 10 + pushPhase * 18;
  const bodyY   = 90 - pushPhase * 22;
  const elbowAng = (1 - pushPhase) * 50;

  return gradDefs(d, suffix) + `
  <ellipse cx="50" cy="118" rx="32" ry="4" fill="rgba(0,0,0,0.4)"/>
  <ellipse cx="78" cy="115" rx="7" ry="3.5" fill="${d.shoesColor}" ${sh(suffix)}/>
  <ellipse cx="68" cy="115" rx="6" ry="3" fill="${adjustColor(d.shoesColor,-8)}" ${sh(suffix)}/>
  <rect x="34" y="${bodyY+7}" width="42" height="9" rx="4" fill="${d.pantsColor}" ${sh(suffix)}/>
  <rect x="14" y="${bodyY-2}" width="38" height="11" rx="4" ${bG(suffix)} ${sh(suffix)}/>
  <rect x="14" y="${bodyY+2}" width="38" height="3" rx="1" fill="${d.trimColor}" opacity="0.6"/>
  <g transform="rotate(${90 - elbowAng*0.4}, 30, ${bodyY+4})">
    <rect x="26" y="${bodyY+4}" width="8" height="12" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
    <g transform="rotate(${elbowAng}, 30, ${bodyY+16})">
      <rect x="26" y="${bodyY+16}" width="8" height="${armLen}" rx="4" fill="${adjustColor(d.bodyColor,8)}" ${sh(suffix)}/>
      <ellipse cx="30" cy="${bodyY+16+armLen}" rx="5" ry="3" fill="${d.skinColor}"/>
    </g>
  </g>
  <g transform="rotate(${90 - elbowAng*0.4}, 46, ${bodyY+4})">
    <rect x="42" y="${bodyY+4}" width="8" height="12" rx="4" fill="${adjustColor(d.bodyColor,-8)}" ${sh(suffix)}/>
    <g transform="rotate(${elbowAng}, 46, ${bodyY+16})">
      <rect x="42" y="${bodyY+16}" width="8" height="${armLen}" rx="4" fill="${adjustColor(d.bodyColor,-12)}" ${sh(suffix)}/>
      <ellipse cx="46" cy="${bodyY+16+armLen}" rx="4" ry="2.5" fill="${adjustColor(d.skinColor,-5)}"/>
    </g>
  </g>
  <ellipse cx="10" cy="${bodyY-1}" rx="11" ry="10" ${fG(suffix)} ${sh(suffix)}/>
  <ellipse cx="10" cy="${bodyY-9}" rx="12" ry="6" fill="${d.hairColor}"/>
  <ellipse cx="4" cy="${bodyY-2}" rx="2.5" ry="5" fill="${d.hairColor}"/>
  <ellipse cx="18" cy="${bodyY+1}" rx="2" ry="2.5" fill="#1a0f08"/>
  <ellipse cx="18.6" cy="${bodyY}" rx="0.7" ry="0.7" fill="rgba(255,255,255,0.75)"/>
  ${strain
    ? `<path d="M6 ${bodyY+7} L16 ${bodyY+7}" stroke="#8a5a40" stroke-width="1.8" fill="none"/>
       <ellipse cx="3" cy="${bodyY-7}" rx="1.8" ry="2.5" fill="rgba(150,200,255,0.5)" transform="rotate(20,3,${bodyY-7})"/>`
    : `<path d="M6 ${bodyY+7} Q11 ${bodyY+9} 16 ${bodyY+7}" stroke="#8a5a40" stroke-width="1" fill="none"/>`}`;
}

function poseRunning(d: any, t: number, suffix: string) {
  const freq = 3.8;
  const ph = t * freq;
  const frontThigh = -30 + Math.sin(ph) * 28;
  const frontShin  = Math.max(0, -frontThigh * 0.7);
  const backThigh  = 25 + Math.sin(ph) * 28;
  const backShin   = Math.max(0, backThigh * 0.5);
  const armF = Math.sin(ph + Math.PI) * 35;
  const armB = Math.sin(ph) * 35;
  const bob  = Math.abs(Math.sin(ph * 2)) * 2.5;
  const lean = 8;
  const cx = 50, torsoTop = 68;

  return gradDefs(d, suffix) + `
  <ellipse cx="${cx}" cy="158" rx="14" ry="2.5" fill="rgba(0,0,0,0.28)"/>
  <g transform="rotate(${armB * 0.7}, ${cx+16}, ${torsoTop+2-bob})">
    <rect x="${cx+12}" y="${torsoTop+2-bob}" width="9" height="18" rx="4" fill="${adjustColor(d.bodyColor,-5)}" ${sh(suffix)}/>
    <g transform="rotate(${-armB * 0.8}, ${cx+16}, ${torsoTop+20-bob})">
      <rect x="${cx+12}" y="${torsoTop+20-bob}" width="9" height="14" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
      <ellipse cx="${cx+16}" cy="${torsoTop+34-bob}" rx="4" ry="3.5" fill="${d.skinColor}"/>
    </g>
  </g>
  <g transform="rotate(${backThigh}, ${cx}, 130)">
    <rect x="${cx-6}" y="130" width="12" height="22" rx="4" fill="${adjustColor(d.pantsColor,-12)}" ${sh(suffix)}/>
    <g transform="rotate(${backShin}, ${cx}, 152)">
      <rect x="${cx-6}" y="152" width="12" height="20" rx="4" fill="${adjustColor(d.pantsColor,-16)}" ${sh(suffix)}/>
      <g transform="rotate(-${backThigh*0.3}, ${cx}, 172)">
        <ellipse cx="${cx}" cy="174" rx="8" ry="4" fill="${adjustColor(d.shoesColor,-14)}"/>
      </g>
    </g>
  </g>
  <g transform="rotate(${lean}, ${cx}, 100)">
    <rect x="${cx-17}" y="${torsoTop}" width="34" height="60" rx="5" ${bG(suffix)} ${sh(suffix)} transform="translate(0,${-bob})"/>
    <rect x="${cx-17}" y="${torsoTop+25}" width="34" height="4" rx="1" fill="${d.trimColor}" opacity="0.8" transform="translate(0,${-bob})"/>
    <ellipse cx="${cx-17}" cy="${torsoTop+2-bob}" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}"/>
    <ellipse cx="${cx+17}" cy="${torsoTop+2-bob}" rx="6" ry="4.5" fill="${adjustColor(d.bodyColor,10)}"/>
    <g transform="rotate(${armF * 0.7}, ${cx-16}, ${torsoTop+2-bob})">
      <rect x="${cx-20}" y="${torsoTop+2-bob}" width="9" height="18" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
      <g transform="rotate(${armF * 0.8}, ${cx-16}, ${torsoTop+20-bob})">
        <rect x="${cx-20}" y="${torsoTop+20-bob}" width="9" height="14" rx="4" fill="${d.bodyColor}" ${sh(suffix)}/>
        <ellipse cx="${cx-16}" cy="${torsoTop+34-bob}" rx="4" ry="3.5" fill="${d.skinColor}"/>
      </g>
    </g>
  </g>
  <g transform="rotate(${frontThigh}, ${cx}, 130)">
    <rect x="${cx-6}" y="130" width="12" height="22" rx="4" fill="${d.pantsColor}" ${sh(suffix)}/>
    <g transform="rotate(${frontShin}, ${cx}, 152)">
      <rect x="${cx-6}" y="152" width="12" height="20" rx="4" fill="${adjustColor(d.pantsColor,5)}" ${sh(suffix)}/>
      <g transform="rotate(${frontThigh * 0.4}, ${cx}, 172)">
        <ellipse cx="${cx+4}" cy="174" rx="8" ry="4" fill="${d.shoesColor}"/>
      </g>
    </g>
  </g>
  ${head(d, cx + lean * 0.3, 38 - bob, lean * 0.5, t, suffix)}`;
}

export function getPoseSvg(pose: string, t: number, spd: number, outfitId: string, equipment: any, suffix: string) {
  const d = OUTFITS[outfitId]?.svgDefs || OUTFITS['beggar'].svgDefs;
  switch(pose) {
    case 'idle': return poseIdle(d, t, equipment, suffix);
    case 'walking': return poseWalking(d, t, spd, equipment, suffix);
    case 'pushups': return posePushups(d, t, suffix);
    case 'running': return poseRunning(d, t, suffix);
    // Fallback to idle for others to save space, or implement them if needed
    default: return poseIdle(d, t, equipment, suffix);
  }
}
