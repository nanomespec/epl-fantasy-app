// 1. Telegram SDK setup
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// 2. Full Player Market Data
const playerMarket = [
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, fixture: "NEG (H)" },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, fixture: "SHE (H)" },
  { id: 3, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, fixture: "NEG (H)" },
  { id: 4, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, fixture: "NEG (H)" },
  { id: 5, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, fixture: "SHE (H)" },
  { id: 6, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, fixture: "SID (A)" },
  { id: 7, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, fixture: "WOL (A)" },
  { id: 8, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, fixture: "NEG (H)" },
  { id: 9, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, fixture: "SHE (H)" },
  { id: 10, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, fixture: "SID (A)" },
  { id: 11, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, fixture: "HAW (A)" },
  { id: 12, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, fixture: "NEG (H)" },
  { id: 13, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, fixture: "SHE (H)" },
  { id: 14, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, fixture: "SID (A)" },
  { id: 15, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, fixture: "WOL (A)" }
];

// 3. User Squad State
let mySquad = playerMarket.map((p, idx) => ({
  ...p,
  isStarter: idx < 11,
  isCaptain: idx === 11
}));

// 4. Render Pitch UI
function renderPitch() {
  const pitch = document.getElementById('pitch');
  if (!pitch) return;

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  const gkps = starters.filter(p => p.pos === 'GKP');
  const defs = starters.filter(p => p.pos === 'DEF');
  const mids = starters.filter(p => p.pos === 'MID');
  const fwds = starters.filter(p => p.pos === 'FWD');

  pitch.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: space-around; height: 100%; padding: 10px 0;">
      <div style="display: flex; justify-content: center; gap: 12px;">${gkps.map(createCard).join('')}</div>
      <div style="display: flex; justify-content: center; gap: 8px;">${defs.map(createCard).join('')}</div>
      <div style="display: flex; justify-content: center; gap: 8px;">${mids.map(createCard).join('')}</div>
      <div style="display: flex; justify-content: center; gap: 12px;">${fwds.map(createCard).join('')}</div>
    </div>
    <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.4); border-top: 1px solid #333; text-align: center;">
      <span style="font-size: 11px; font-weight: bold; color: #888; text-transform: uppercase;">Substitutes</span>
      <div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">${bench.map(createCard).join('')}</div>
    </div>
  `;
}

function createCard(p) {
  return `
    <div style="background: #1c2733; border: 1px solid #2b394a; border-radius: 6px; padding: 4px 8px; text-align: center; min-width: 65px;">
      <div style="font-size: 9px; color: #3b82f6; font-weight: bold;">${p.pos} ${p.isCaptain ? '⭐' : ''}</div>
      <div style="font-size: 11px; font-weight: bold; color: #fff;">${p.name}</div>
      <div style="font-size: 9px; color: #9ca3af;">${p.fixture}</div>
    </div>
  `;
}

// 5. Initialize on page load
document.addEventListener('DOMContentLoaded', renderPitch);
renderPitch();

