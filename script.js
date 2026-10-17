const emojis = ['🍎', '🍏', '🍇', '👮', '🍒', '🍆', '🍌', '🍉'];

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const winEl = document.getElementById('win');
const soundModeEl = document.getElementById('sound-mode');
const bananaSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/banana.mp3');
const bananaNextSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/banana-next.mp3');
const bananaPairSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/banana-pair.mp3');
const watermelonSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/watermelon.mp3');
const watermelonPairSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/watermelon-pair.mp3');
const grapePairSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/grape-pair.mp3');
const eggplantSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/eggplant.mp3');
const greenAppleSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/green-apple.mp3');
const greenApplePairSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/green-apple-pair.mp3');
const redAppleSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/red-apple.mp3');
const policeSound = new Audio('https://raw.githubusercontent.com/ValikSt64/SFP/main/police.mp3');

let first = null;
let lock = false;
let moves = 0;
let pairs = 0;
let normalAudioContext;

function playNormalSound(type) {
  normalAudioContext ??= new AudioContext();
  const now = normalAudioContext.currentTime;
  const frequencies = type === 'pair' ? [523, 659, 784] : [440];

  frequencies.forEach((frequency, index) => {
    const oscillator = normalAudioContext.createOscillator();
    const gain = normalAudioContext.createGain();
    oscillator.type = type === 'pair' ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(type === 'pair' ? 0.18 : 0.12, now + index * 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + index * 0.03);
    oscillator.connect(gain).connect(normalAudioContext.destination);
    oscillator.start(now + index * 0.03);
    oscillator.stop(now + 0.2 + index * 0.03);
  });
}

function startGame() {
  first = null;
  lock = false;
  moves = 0;
  pairs = 0;
  movesEl.textContent = 0;
  pairsEl.textContent = 0;
  winEl.textContent = '';
  board.innerHTML = '';

  const cards = [...emojis, ...emojis];
  cards.sort(() => Math.random() - 0.5);

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.innerHTML = `<div class="back">?</div><div class="front">${emoji}</div>`;
    card.addEventListener('click', () => flip(card));
    board.appendChild(card);
  });
}

function flip(card) {
  if (lock || card === first) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');

  const completesPair = first?.dataset.emoji === card.dataset.emoji;
  const completesBananaPair = first?.dataset.emoji === '🍌' && card.dataset.emoji === '🍌';
  const completesWatermelonPair = first?.dataset.emoji === '🍉' && card.dataset.emoji === '🍉';
  const completesGrapePair = first?.dataset.emoji === '🍇' && card.dataset.emoji === '🍇';
  const completesGreenApplePair = first?.dataset.emoji === '🍏' && card.dataset.emoji === '🍏';
  const completesRedApplePair = first?.dataset.emoji === '🍎' && card.dataset.emoji === '🍎';
  const completesPolicePair = first?.dataset.emoji === '👮' && card.dataset.emoji === '👮';

  if (soundModeEl.value === 'normal' && !completesPair) {
    playNormalSound('open');
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍌' && !completesBananaPair) {
    const sound = card.dataset.bananaOpened ? bananaNextSound : bananaSound;
    card.dataset.bananaOpened = 'true';
    sound.currentTime = 0;
    sound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍉' && !completesWatermelonPair) {
    watermelonSound.currentTime = 0;
    watermelonSound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍇' && !completesGrapePair) {
    grapePairSound.currentTime = 0;
    grapePairSound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍆') {
    eggplantSound.currentTime = 0;
    eggplantSound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍏' && !completesGreenApplePair) {
    greenAppleSound.currentTime = 0;
    greenAppleSound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '🍎' && !completesRedApplePair) {
    redAppleSound.currentTime = 0;
    redAppleSound.play().catch(() => { });
  }

  if (soundModeEl.value === 'mellstroy' && card.dataset.emoji === '👮' && !completesPolicePair) {
    policeSound.currentTime = 0;
    policeSound.play().catch(() => { });
  }

  if (first === null) {
    first = card;
    return;
  }

  const prev = first;
  first = null;
  moves++;
  movesEl.textContent = moves;

  if (prev.dataset.emoji === card.dataset.emoji) {
    prev.classList.add('matched');
    card.classList.add('matched');
    if (soundModeEl.value === 'normal') {
      playNormalSound('pair');
    } else if (card.dataset.emoji === '🍌') {
      bananaPairSound.currentTime = 0;
      bananaPairSound.play().catch(() => { });
    } else if (card.dataset.emoji === '🍉') {
      watermelonPairSound.currentTime = 0;
      watermelonPairSound.play().catch(() => { });
    } else if (card.dataset.emoji === '🍇') {
      grapePairSound.currentTime = 0;
      grapePairSound.play().catch(() => { });
    } else if (card.dataset.emoji === '🍏') {
      greenApplePairSound.currentTime = 0;
      greenApplePairSound.play().catch(() => { });
    } else if (card.dataset.emoji === '🍎') {
      redAppleSound.currentTime = 0;
      redAppleSound.play().catch(() => { });
    } else if (card.dataset.emoji === '👮') {
      policeSound.currentTime = 0;
      policeSound.play().catch(() => { });
    }
    pairs++;
    pairsEl.textContent = pairs;
    if (pairs === emojis.length) {
      winEl.textContent = `Перемога! Ходів: ${moves}`;
    }
  } else {
    lock = true;
    setTimeout(() => {
      prev.classList.remove('flipped');
      card.classList.remove('flipped');
      lock = false;
    }, 800);
  }
}

document.getElementById('restart').addEventListener('click', startGame);
startGame();
