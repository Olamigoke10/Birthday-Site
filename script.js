/* ============================================================
   BIRTHDAY MEMORY SITE — script.js
   ============================================================ */

'use strict';

/* ── CONFIG ─────────────────────────────────────────────── */
// Vercel injects VITE_ / NEXT_PUBLIC_ prefixed env vars into the
// client bundle. For a plain HTML + Vercel deployment we rely on
// a serverless function proxy (see /api/polish.js).
// During local dev, you can paste the key directly here or use
// a bundler. For production the key NEVER ships to the browser.
const API_BASE = '/api/polish';   // serverless proxy endpoint

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ── NAV ─────────────────────────────────────────────────── */
const nav       = $('#nav');
const navBurger = $('#navBurger');
const navLinks  = $('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navBurger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  navBurger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── FALLING PETALS ──────────────────────────────────────── */
(function spawnPetals() {
  const container = $('#petals');
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random() * 10;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size * 1.3}px;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(p);
  }
})();

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
(function setupReveal() {
  const targets = $$('.section__tag, .section__title, .section__desc, .letter-card, .photo-card, .gb-entry');
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();

/* ── LETTER CARDS OPEN ───────────────────────────────────── */
$$('.letter-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('letter-card--open');
  });
});

/* ── PHOTO FILTER ────────────────────────────────────────── */
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.photo-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hide', !match);
    });
  });
});

/* ── LIGHTBOX ────────────────────────────────────────────── */
const lightbox  = $('#lightbox');
const lbImg     = $('#lbImg');
const lbCaption = $('#lbCaption');
const lbClose   = $('#lbClose');

$$('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    const src     = card.querySelector('img')?.src || '';
    const caption = card.querySelector('h4')?.textContent + ' · ' +
                    card.querySelector('p')?.textContent || '';
    lbImg.src = src;
    lbCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── MUSIC PLAYER ────────────────────────────────────────── */
const TRACKS = [
  { title: 'Perfect',                  artist: 'Ed Sheeran',       duration: 225 },
  { title: 'All of Me',               artist: 'John Legend',       duration: 269 },
  { title: 'Lover',                    artist: 'Taylor Swift',      duration: 221 },
  { title: 'A Thousand Years',         artist: 'Christina Perri',   duration: 285 },
  { title: "Can't Help Falling in Love", artist: 'Elvis Presley',  duration: 181 },
];

let currentTrack = 0;
let isPlaying    = false;
let progress     = 0;       // seconds elapsed (simulated)
let progressTimer = null;
let shuffle      = false;
let repeat       = false;

const playerSong    = $('#playerSong');
const playerArtist  = $('#playerArtist');
const playerArtwork = $('#playerArtwork');
const playerBar     = $('#playerBar');
const playerThumb   = $('#playerThumb');
const playerCurrent = $('#playerCurrent');
const playerDuration = $('#playerDuration');
const btnPlay       = $('#btnPlay');
const playIcon      = $('#playIcon');
const btnPrev       = $('#btnPrev');
const btnNext       = $('#btnNext');
const btnShuffle    = $('#btnShuffle');
const btnRepeat     = $('#btnRepeat');
const volSlider     = $('#volSlider');
const playlistItems = $$('.playlist__item');

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function loadTrack(idx) {
  const t = TRACKS[idx];
  playerSong.textContent   = t.title;
  playerArtist.textContent = t.artist;
  playerDuration.textContent = fmt(t.duration);
  progress = 0;
  updateProgress();
  playlistItems.forEach(li => li.classList.toggle('active', +li.dataset.index === idx));
  currentTrack = idx;
}

function updateProgress() {
  const t = TRACKS[currentTrack];
  const pct = (progress / t.duration) * 100;
  playerBar.style.width    = pct + '%';
  playerThumb.style.left   = pct + '%';
  playerCurrent.textContent = fmt(progress);
}

function startTimer() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    const t = TRACKS[currentTrack];
    progress += 0.5;
    if (progress >= t.duration) {
      progress = 0;
      if (repeat) {
        /* restart same */
      } else {
        nextTrack();
        return;
      }
    }
    updateProgress();
  }, 500);
}

function stopTimer() {
  clearInterval(progressTimer);
}

function play() {
  isPlaying = true;
  playIcon.textContent = '⏸';
  playerArtwork.classList.add('playing');
  startTimer();
}

function pause() {
  isPlaying = false;
  playIcon.textContent = '▶';
  playerArtwork.classList.remove('playing');
  stopTimer();
}

function nextTrack() {
  let idx;
  if (shuffle) {
    idx = Math.floor(Math.random() * TRACKS.length);
  } else {
    idx = (currentTrack + 1) % TRACKS.length;
  }
  loadTrack(idx);
  if (isPlaying) play();
}

function prevTrack() {
  const idx = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
  loadTrack(idx);
  if (isPlaying) play();
}

btnPlay.addEventListener('click', () => {
  isPlaying ? pause() : play();
});

btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

btnShuffle.addEventListener('click', () => {
  shuffle = !shuffle;
  btnShuffle.classList.toggle('active', shuffle);
});

btnRepeat.addEventListener('click', () => {
  repeat = !repeat;
  btnRepeat.classList.toggle('active', repeat);
});

/* Seek on progress bar click */
$('#playerProgress').addEventListener('click', function(e) {
  const rect = this.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  progress   = pct * TRACKS[currentTrack].duration;
  updateProgress();
});

/* Playlist click */
playlistItems.forEach(li => {
  li.addEventListener('click', () => {
    loadTrack(+li.dataset.index);
    if (!isPlaying) play();
  });
});

/* Volume (visual only — no actual audio in this demo) */
volSlider.addEventListener('input', function() {
  /* real implementation would set audioEl.volume = this.value */
});

loadTrack(0);

/* ── GUEST BOOK ──────────────────────────────────────────── */
const guestForm   = $('#guestForm');
const gbName      = $('#gbName');
const gbRelation  = $('#gbRelation');
const gbMessage   = $('#gbMessage');
const gbSubmit    = $('#gbSubmit');
const gbBtnText   = $('#gbBtnText');
const gbBtnLoader = $('#gbBtnLoader');
const gbPreview   = $('#gbPreview');
const gbPreviewTxt = $('#gbPreviewText');
const gbEdit      = $('#gbEdit');
const gbConfirm   = $('#gbConfirm');
const gbEntries   = $('#gbEntries');

let polishedMessage = '';

guestForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = gbName.value.trim();
  const message = gbMessage.value.trim();
  if (!name || !message) return;

  // Show loading
  gbBtnText.classList.add('hidden');
  gbBtnLoader.classList.remove('hidden');
  gbSubmit.disabled = true;

  try {
    polishedMessage = await polishMessage(name, gbRelation.value, message);
    gbPreviewTxt.textContent = `"${polishedMessage}"`;
    gbPreview.classList.remove('hidden');
    gbPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    // Graceful fallback — post the original message
    polishedMessage = message;
    postEntry(name, gbRelation.value, polishedMessage, false);
    resetForm();
  } finally {
    gbBtnText.classList.remove('hidden');
    gbBtnLoader.classList.add('hidden');
    gbSubmit.disabled = false;
  }
});

gbEdit.addEventListener('click', () => {
  gbPreview.classList.add('hidden');
});

gbConfirm.addEventListener('click', () => {
  postEntry(gbName.value.trim(), gbRelation.value, polishedMessage, true);
  resetForm();
});

function resetForm() {
  guestForm.reset();
  gbPreview.classList.add('hidden');
  polishedMessage = '';
}

function postEntry(name, relation, message, aiPolished) {
  const initial = name.charAt(0).toUpperCase();
  const relLabel = {
    friend: 'Friend', family: 'Family', colleague: 'Colleague',
    partner: 'Partner', other: 'Guest'
  }[relation] || 'Guest';

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const entry = document.createElement('div');
  entry.className = 'gb-entry reveal';
  entry.innerHTML = `
    <div class="gb-entry__header">
      <div class="gb-entry__avatar">${initial}</div>
      <div>
        <strong class="gb-entry__name">${escHtml(name)}</strong>
        <span class="gb-entry__relation">${relLabel}</span>
      </div>
      <time class="gb-entry__date">${date}</time>
    </div>
    <p class="gb-entry__msg">"${escHtml(message)}"</p>
    ${aiPolished ? '<span class="gb-entry__badge">✦ AI Polished</span>' : ''}
  `;

  gbEntries.prepend(entry);

  // Trigger reveal animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => entry.classList.add('visible'));
  });

  entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function polishMessage(name, relation, rawMessage) {
  /* ── PRODUCTION PATH ───────────────────────────────────────
     Calls /api/polish — a Vercel serverless function that
     holds the API key server-side and proxies to Anthropic.
     See /api/polish.js in this repo.
  ─────────────────────────────────────────────────────────── */
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, relation, rawMessage }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.polished || rawMessage;
}

/* ── INIT ─────────────────────────────────────────────────── */
// Seed guest-book entries into the IntersectionObserver
$$('.gb-entry').forEach(el => {
  el.classList.add('reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add('visible'); io.unobserve(target); }
    });
  }, { threshold: 0.1 });
  io.observe(el);
});
