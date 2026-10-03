// 1. Initialize Telegram WebApp SDK
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// 2. Full Player Database (Ethiopian Premier League Clubs)
const playerMarket = [
  { id: 1, name: "B. Asefa", club: "Ethio Elec", pos: "GKP", price: 4.5, fixture: "ADA (H)" },
  { id: 2, name: "S. Solomon", club: "St George", pos: "DEF", price: 5.5, fixture: "NEG (H)" },
  { id: 3, name: "A. Tesfaye", club: "Eth Coffee", pos: "DEF", price: 5.0, fixture: "SHE (H)" },
  { id: 4, name: "M. Mohammed", club: "Sidama B.", pos: "DEF", price: 4.5, fixture: "CBE (H)" },
  { id: 5, name: "Y. Endale", club: "Fasil K.", pos: "DEF", price: 5.0, fixture: "WOL (A)" },
  { id: 6, name: "D. Worku", club: "St George", pos: "MID", price: 8.5, fixture: "NEG (H)" },
  { id: 7, name: "E. Tadesse", club: "Eth Coffee", pos: "MID", price: 7.5, fixture: "SHE (H)" },
  { id: 8, name: "F. Kebede", club: "Bahir Dar", pos: "MID", price: 6.5, fixture: "HAD (A)" },
  { id: 9, name: "K. Markos", club: "Adama C.", pos: "MID", price: 6.0, fixture: "EEL (A)" },
  { id: 10, name: "A. Okutu", club: "St George", pos: "FWD", price: 9.0, fixture: "NEG (H)" },
  { id: 11, name: "B. Gugsa", club: "Fasil K.", pos: "FWD", price: 8.0, fixture: "WOL (A)" },
  { id: 12, name: "G. Hetesa", club: "Hawassa C.", pos: "GKP", price: 4.0, fixture: "DEF (H)" },
  { id: 13, name: "H. Hosaena", club: "Hadiya H.", pos: "DEF", price: 4.0, fixture: "BAH (H)" },
  { id: 14, name: "T. Wolde", club: "Defense F.", pos: "MID", price: 5.5, fixture: "HAW (A)" },
  { id: 15, name: "S. Desta", club: "Welwalo", pos: "FWD", price: 5.5, fixture: "HAL (A)" },
  { id: 16, name: "M. Kebede", club: "CBE SA", pos: "FWD", price: 7.0, fixture: "SID (A)" },
  { id: 17, name: "L. Birhanu", club: "Adama C.", pos: "DEF", price: 4.5, fixture: "EEL (A)" }
];

// Initial Squad Setup
let mySquad = playerMarket.slice(0, 15).map((p, idx) => ({
  ...p,
  isStarter: idx < 11,
  isCaptain: idx === 5
}));

let bankBalance = 100.0 - mySquad.reduce((sum, p) => sum + p.price, 0);

// 3. Tab Switching Function
function switchTab(tabName) {
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();

  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');

  ['pitch', 'transfers', 'leagues'].forEach(t => {
    const btn = document.getElementById(`nav-${t}`);
    if (t === tabName) {
      btn.classList.add('text-blue-400');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('text-blue-400');
      btn.classList.add('text-gray-400');
    }
  });

  if (tabName === 'pitch') renderPitch();
  if (tabName === 'transfers') renderTransfers();
}

// 4. Render Pitch View
function renderPitch() {
  document.getElementById('row-gkp').innerHTML = '';
  document.getElementById('row-def').innerHTML = '';
  document.getElementById('row-mid').innerHTML = '';
  document.getElementById('row-fwd').innerHTML = '';
  document.getElementById('row-bench').innerHTML = '';

  mySquad.forEach(player => {
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

// 5. Render Transfer Market
function renderTransfers() {
  const container = document.getElementById('transfer-market-list');
  const posFilter = document.getElementById('pos-filter').value;
  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  document.getElementById('bank-balance').innerText = `${bankBalance.toFixed(1)}M ETB`;
  document.getElementById('squad-count').innerText = `${mySquad.length} / 15`;

  container.innerHTML = '';

  const filtered = playerMarket.filter(p => {
    const matchesPos = posFilter === 'ALL' || p.pos === posFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.club.toLowerCase().includes(searchQuery);
    return matchesPos && matchesSearch;
  });

  filtered.forEach(player => {
    const inSquad = mySquad.some(p => p.id === player.id);
    container.innerHTML += `
      <div class="bg-[#242f3d] p-2.5 rounded-lg border border-gray-700 flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-white">${player.name}</span>
            <span class="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded font-semibold text-gray-300">${player.pos}</span>
          </div>
          <p class="text-[10px] text-gray-400">${player.club} • ${player.fixture}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-green-400">${player.price}M ETB</span>
          ${inSquad 
            ? `<button onclick="removePlayer(${player.id})" class="bg-red-600 hover:bg-red-500 text-[10px] px-2.5 py-1 rounded font-bold">Sell</button>`
            : `<button onclick="addPlayer(${player.id})" class="bg-blue-600 hover:bg-blue-500 text-[10px] px-2.5 py-1 rounded font-bold">Buy</button>`
          }
        </div>
      </div>
    `;
  });
}

// 6. Buy / Sell Player Logic
function addPlayer(id) {
  if (mySquad.length >= 15) return tg ? tg.showAlert('Squad full! Sell a player first.') : alert('Squad full!');
  const player = playerMarket.find(p => p.id === id);
  if (bankBalance < player.price) return tg ? tg.showAlert('Insufficient funds in bank!') : alert('Insufficient funds!');

  mySquad.push({ ...player, isStarter: false, isCaptain: false });
  bankBalance -= player.price;
  renderTransfers();
  showSaveButton();
}

function removePlayer(id) {
  const player = mySquad.find(p => p.id === id);
  mySquad = mySquad.filter(p => p.id !== id);
  bankBalance += player.price;
  renderTransfers();
  showSaveButton();
}

// 7. Handle Captain & Action Popups
function handlePlayerClick(playerId) {
  const player = mySquad.find(p => p.id === playerId);
  if (tg && tg.showPopup) {
    tg.showPopup({
      title: player.name,
      message: `${player.club} • ${player.pos}`,
      buttons: [
        { id: 'captain', type: 'default', text: 'Make Captain (C)' },
        { id: 'cancel', type: 'destructive', text: 'Cancel' }
      ]
    }, (buttonId) => {
      if (buttonId === 'captain') {
        mySquad.forEach(p => p.isCaptain = false);
        player.isCaptain = true;
        renderPitch();
        showSaveButton();
      }
    });
  }
}

// 8. Save Team Changes
function showSaveButton() {
  if (tg && tg.MainButton) {
    tg.MainButton.setText("SAVE SQUAD CHANGES");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
      tg.showAlert("Squad changes saved successfully!");
      tg.MainButton.hide();
    });
  }
}

// Initial Load
renderPitch();
    