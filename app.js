// 1. Initialize Telegram WebApp SDK
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

let playerMarket = [];
let mySquad = [];
let bankBalance = 100.0;

// Hardcoded fallback data in case fetching players.json fails
const defaultPlayers = [
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

async function fetchPlayers() {
  try {
    const response = await fetch('players.json');
    if (!response.ok) throw new Error("Network response was not ok");
    playerMarket = await response.json();
  } catch (err) {
    console.warn("Could not fetch players.json, loading default dataset:", err);
    playerMarket = defaultPlayers;
  }

  // Auto-setup squad
  if (mySquad.length === 0) {
    mySquad = playerMarket.slice(0, 15).map((p, idx) => ({
      ...p,
      isStarter: idx < 11,
      isCaptain: idx === 11 // Default Captain: A. Okutu
    }));
    bankBalance = 100.0 - mySquad.reduce((sum, p) => sum + p.price, 0);
  }

  renderPitch();
}

// Boot application
fetchPlayers();

