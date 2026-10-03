// 1. Initialize Telegram WebApp SDK
const tg = window.Telegram.WebApp;
if (tg) {
  tg.expand(); // Maximizes view inside Telegram
}

// 2. Mock Squad Dataset (EPL Gameweek 1 Starters & Bench)
const squad = [
  { id: 1, name: "B. Asefa", club: "Ethio Elec", pos: "GKP", isStarter: true, isCaptain: false, fixture: "ADA (H)" },
  { id: 2, name: "S. Solomon", club: "St George", pos: "DEF", isStarter: true, isCaptain: false, fixture: "NEG (H)" },
  { id: 3, name: "A. Tesfaye", club: "Eth Coffee", pos: "DEF", isStarter: true, isCaptain: false, fixture: "SHE (H)" },
  { id: 4, name: "M. Mohammed", club: "Sidama B.", pos: "DEF", isStarter: true, isCaptain: false, fixture: "CBE (H)" },
  { id: 5, name: "Y. Endale", club: "Fasil K.", pos: "DEF", isStarter: true, isCaptain: false, fixture: "WOL (A)" },
  { id: 6, name: "D. Worku", club: "St George", pos: "MID", isStarter: true, isCaptain: true, fixture: "NEG (H)" },
  { id: 7, name: "E. Tadesse", club: "Eth Coffee", pos: "MID", isStarter: true, isCaptain: false, fixture: "SHE (H)" },
  { id: 8, name: "F. Kebede", club: "Bahir Dar", pos: "MID", isStarter: true, isCaptain: false, fixture: "HAD (A)" },
  { id: 9, name: "K. Markos", club: "Adama C.", pos: "MID", isStarter: true, isCaptain: false, fixture: "EEL (A)" },
  { id: 10, name: "A. Okutu", club: "St George", pos: "FWD", isStarter: true, isCaptain: false, fixture: "NEG (H)" },
  { id: 11, name: "B. Gugsa", club: "Fasil K.", pos: "FWD", isStarter: true, isCaptain: false, fixture: "WOL (A)" },
  // BENCH PLAYERS
  { id: 12, name: "G. Hetesa", club: "Hawassa C.", pos: "GKP", isStarter: false, isCaptain: false, fixture: "DEF (H)" },
  { id: 13, name: "H. Hosaena", club: "Hadiya H.", pos: "DEF", isStarter: false, isCaptain: false, fixture: "BAH (H)" },
  { id: 14, name: "T. Wolde", club: "Defense F.", pos: "MID", isStarter: false, isCaptain: false, fixture: "HAW (A)" },
  { id: 15, name: "S. Desta", club: "Welwalo", pos: "FWD", isStarter: false, isCaptain: false, fixture: "HAL (A)" },
];

// 3. Render Pitch Grid Dynamic Content
function renderPitch() {
  document.getElementById('row-gkp').innerHTML = '';
  document.getElementById('row-def').innerHTML = '';
  document.getElementById('row-mid').innerHTML = '';
  document.getElementById('row-fwd').innerHTML = '';
  document.getElementById('row-bench').innerHTML = '';

  squad.forEach(player => {
    const cardHtml = `
      <div onclick="handlePlayerClick(${player.id})" class="flex flex-col items-center cursor-pointer transform active:scale-95 transition-transform">
        <div class="relative w-11 h-11 bg-gray-800 border-2 ${player.isStarter ? 'border-green-400' : 'border-gray-500'} rounded-full flex items-center justify-center shadow-lg">
          <span class="text-xs font-bold text-gray-300">${player.pos}</span>
          ${player.isCaptain ? '<span class="absolute -top-1 -right-1 bg-yellow-400 text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">C</span>' : ''}
        </div>
        <div class="bg-black/70 rounded px-1.5 py-0.5 mt-1 text-center w-16 shadow">
          <p class="text-[10px] font-bold truncate text-white">${player.name}</p>
          <p class="text-[8px] text-gray-300 truncate">${player.fixture}</p>
        </div>
      </div>
    `;

    if (!player.isStarter) {
      document.getElementById('row-bench').innerHTML += cardHtml;
    } else {
      if (player.pos === 'GKP') document.getElementById('row-gkp').innerHTML += cardHtml;
      if (player.pos === 'DEF') document.getElementById('row-def').innerHTML += cardHtml;
      if (player.pos === 'MID') document.getElementById('row-mid').innerHTML += cardHtml;
      if (player.pos === 'FWD') document.getElementById('row-fwd').innerHTML += cardHtml;
    }
  });
}

// 4. Handle Player Click & Telegram Action Sheet
function handlePlayerClick(playerId) {
  const player = squad.find(p => p.id === playerId);
  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('medium');
  }

  if (tg && tg.showPopup) {
    tg.showPopup({
      title: player.name,
      message: `${player.club} • ${player.pos}`,
      buttons: [
        { id: 'captain', type: 'default', text: 'Make Captain (C)' },
        { id: 'swap', type: 'default', text: 'Swap Player' },
        { id: 'cancel', type: 'destructive', text: 'Cancel' }
      ]
    }, (buttonId) => {
      if (buttonId === 'captain') {
        squad.forEach(p => p.isCaptain = false);
        player.isCaptain = true;
        renderPitch();
        showSaveButton();
      }
    });
  } else {
    alert(`Selected: ${player.name} (${player.club})`);
  }
}

// 5. Native Telegram Action Button
function showSaveButton() {
  if (tg && tg.MainButton) {
    tg.MainButton.setText("SAVE TEAM CHANGES");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
      tg.showAlert("Team saved successfully!");
      tg.MainButton.hide();
    });
  }
}

// Initial Call
renderPitch();