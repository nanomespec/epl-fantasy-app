// 1. Initialize Telegram WebApp SDK
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

let playerMarket = [];
let mySquad = [];
let bankBalance = 100.0;

// Load full squads dynamically from players.json
async function fetchPlayers() {
  try {
    const response = await fetch('players.json');
    playerMarket = await response.json();

    // Default squad assignment (first 15 players)
    if (mySquad.length === 0) {
      mySquad = playerMarket.slice(0, 15).map((p, idx) => ({
        ...p,
        isStarter: idx < 11,
        isCaptain: idx === 14 // Default Captain: A. Okutu
      }));
      bankBalance = 100.0 - mySquad.reduce((sum, p) => sum + p.price, 0);
    }

    renderPitch();
  } catch (err) {
    console.error("Error loading players.json:", err);
  }
}

// Call on boot
fetchPlayers();