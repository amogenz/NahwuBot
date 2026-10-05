const { Telegraf } = require('telegraf');

// ============================================================
// NahwuBot v2 — Kuis Nahwu/Shorof/Tajwid interaktif
// Soal 100% verbatim dari Database My Nahwu (repo amogenz/Amogenz/db)
// UI: parse_mode HTML + inline keyboard + tema warna per kategori
// Dok. acuan: https://core.telegram.org/bots/api#formatting-options
//   (HTML didukung: b/i/u/s/code/pre/a/blockquote(+expandable)/
//    tg-spoiler/tg-emoji — TIDAK ada warna teks native, jadi warna
//    dihadirkan lewat emoji berwarna 🟢🔴🟡🔵🟠🟣🟤⚪ + 🇦🇧🇨🇩)
// ============================================================

// ---------- DATABASE ----------
// File db/*.js adalah salinan Database My Nahwu (repo amogenz/Amogenz/db).
// File besar dipecah (suffix -p1/-p2/...) agar tiap file < 100KB.
const DB_FILES = {
  j1: require('../db/amogenzdb-lv1.js'),
  j2: [].concat(
    require('../db/amogenzdb-lv2-p1.js'),
    require('../db/amogenzdb-lv2-p2.js'),
    require('../db/amogenzdb-lv2-p3.js')
  ),
  ai: [].concat(
    require('../db/amogenzdb-alfiyah-isim-p1.js'),
    require('../db/amogenzdb-alfiyah-isim-p2.js')
  ),
  af: [].concat(
    require('../db/amogenzdb-alfiyah-fiil-p1.js'),
    require('../db/amogenzdb-alfiyah-fiil-p2.js'),
    require('../db/amogenzdb-alfiyah-fiil-p3.js')
  ),
  sh: require('../db/amogenzdb-shorof.js'),
  bn: [].concat(
    require('../db/amogenzdb-bina-p1.js'),
    require('../db/amogenzdb-bina-p2.js')
  ),
  ts: [].concat(
    require('../db/amogenzdb-tasrif-p1.js'),
    require('../db/amogenzdb-tasrif-p2.js')
  ),
  tj: require('../db/amogenzdb-tajwid.js'),
};

const CATS = [
  { key: 'j1', nama: 'Jurumiyah 1',  warna: '🟢', file: 'j1', satuan: 'Kalimat'  },
  { key: 'j2', nama: 'Jurumiyah 2',  warna: '🔵', file: 'j2', satuan: 'Kalimat'  },
  { key: 'ai', nama: 'Alfiyah Isim', warna: '🟣', file: 'ai', satuan: 'Kalimat'  },
  { key: 'af', nama: "Alfiyah Fi'il", warna: '🟠', file: 'af', satuan: 'Kalimat' },
  { key: 'sh', nama: 'Shorof',       warna: '🟡', file: 'sh', satuan: 'Kalimat'  },
  { key: 'bn', nama: "Bina'",        warna: '🔴', file: 'bn', satuan: 'Kalimat'  },
  { key: 'ts', nama: 'Tasrif',       warna: '🟤', file: 'ts', satuan: 'Kalimat'  },
  { key: 'tj', nama: 'Tajwid',       warna: '⚪', file: 'tj', satuan: 'Potongan' },
];

// Ambil soal valid saja: wajib ada question, >=2 opsi,
// jawaban benar HARUS ada di opsi, dan ada penjelasan.
// (Soal DB yang cacat dilewati — konten tidak pernah dikarang.)
function buildPool(db) {
  const pool = [];
  for (const k of db) {
    const teks = k.teks_kalimat || k.teks_potongan;
    if (!teks || !Array.isArray(k.analysis)) continue;
    for (const a of k.analysis) {
      const steps = a.steps || {};
      for (const sk of Object.keys(steps)) {
        const st = steps[sk];
        if (
          st && st.question &&
          Array.isArray(st.options) && st.options.length >= 2 &&
          st.options.includes(st.correct) &&
          st.explanation
        ) {
          pool.push({
            teks,
            word: a.word || '',
            q: st.question,
            options: [...st.options],
            correct: st.correct,
            exp: st.explanation,
          });
        }
      }
    }
  }
  return pool;
}

const POOLS = {};
for (const c of CATS) POOLS[c.key] = buildPool(DB_FILES[c.file]);
const TOTAL_SOAL = CATS.reduce((n, c) => n + POOLS[c.key].length, 0);

// ---------- UTIL ----------
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const LETTERS = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];
const GARIS = '━━━━━━━━━━━━━━';

// ---------- SESSION ----------
const sessions = new Map();
function getSession(id) {
  let s = sessions.get(id);
  if (!s) {
    s = {
      cat: null, pool: [], pos: 0,
      q: null,            // {opts:[...], correct, ...soal}
      phase: 'idle',      // idle | q | a
      score: { b: 0, s: 0 },
      streak: 0, best: 0,
    };
    sessions.set(id, s);
  }
  return s;
}

// ---------- FORMAT PESAN ----------
function fmtMenu() {
  const rows = CATS.map((c, i) => {
    const n = POOLS[c.key].length;
    return `${c.warna} <b>${esc(c.nama)}</b> — <i>${n} soal</i>`;
  });
  return [
    `🕌 <b>NahwuBot</b>`,
    `Belajar Nahwu • Shorof • Tajwid interaktif`,
    ``,
    `📚 <b>Pilih kategori materi:</b>`,
    ``,
    ...rows,
    ``,
    `🗂 Total <b>${TOTAL_SOAL}</b> soal dari Database My Nahwu`,
    `<i>Ketuk salah satu tombol kategori 👇</i>`,
  ].join('\n');
}

function kbMenu() {
  const kb = [];
  for (let i = 0; i < CATS.length; i += 2) {
    const row = [{ text: `${CATS[i].warna} ${CATS[i].nama}`, callback_data: `c:${i}` }];
    if (CATS[i + 1]) row.push({ text: `${CATS[i + 1].warna} ${CATS[i + 1].nama}`, callback_data: `c:${i + 1}` });
    kb.push(row);
  }
  kb.push([{ text: '📊 Skor Saya', callback_data: 'skor' }]);
  return { inline_keyboard: kb };
}

function barProgres(no, total) {
  const p = Math.round((no / Math.max(total, 1)) * 10);
  return '🟩'.repeat(p) + '⬜'.repeat(10 - p);
}

function fmtSoal(cat, s) {
  const q = s.q;
  const no = s.pos + 1, total = s.pool.length;
  const opsi = q.opts.map((o, i) => `${LETTERS[i]}  ${esc(o)}`).join('\n');
  return [
    `${cat.warna} <b>${esc(cat.nama).toUpperCase()}</b>`,
    `${cat.warna} ${GARIS}`,
    ``,
    `<blockquote>${esc(q.teks)}</blockquote>`,
    ``,
    `🎯 Kata: <code>${esc(q.word)}</code>`,
    ``,
    `❓ <b>${esc(q.q)}</b>`,
    ``,
    opsi,
    ``,
    `📝 Soal ${no}/${total}`,
    barProgres(no, total),
    ``,
    `<i>Ketuk jawabanmu 👇</i>`,
  ].join('\n');
}

function kbSoal(nOpts) {
  const row = [];
  for (let i = 0; i < nOpts; i++) row.push({ text: LETTERS[i], callback_data: `a:${i}` });
  return { inline_keyboard: [row, [{ text: '🏠 Menu', callback_data: 'm' }]] };
}

function fmtHasil(cat, s, benar, dipilih) {
  const q = s.q;
  const kepala = benar
    ? `✅ <b>MUMTAZ! Jawaban benar!</b> 🎉`
    : `❌ <b>Kurang tepat!</b>`;
  const opsi = q.opts.map((o, i) => {
    if (o === q.correct) return `${LETTERS[i]}  ✅ <b>${esc(o)}</b>`;
    if (o === dipilih)   return `${LETTERS[i]}  ❌ <s>${esc(o)}</s>`;
    return `${LETTERS[i]}  ${esc(o)}`;
  }).join('\n');
  const { b, s: sl } = s.score;
  const tot = b + sl;
  const ak = tot ? Math.round((b / tot) * 100) : 0;
  return [
    kepala,
    ``,
    `<blockquote>${esc(q.teks)}</blockquote>`,
    `🎯 Kata: <code>${esc(q.word)}</code>`,
    `❓ <b>${esc(q.q)}</b>`,
    ``,
    opsi,
    ``,
    `💡 <b>Penjelasan:</b>`,
    `<blockquote expandable>${esc(q.exp)}</blockquote>`,
    ``,
    `${cat.warna} ${GARIS}`,
    `🟢 ${b}  •  🔴 ${sl}  •  🎯 ${ak}%${s.streak >= 2 ? `  •  🔥${s.streak}` : ''}`,
  ].join('\n');
}

function kbHasil() {
  return {
    inline_keyboard: [
      [{ text: '➡️ Soal Berikutnya', callback_data: 'n' }],
      [{ text: '📊 Skor', callback_data: 'skor' }, { text: '🏠 Menu', callback_data: 'm' }],
    ],
  };
}

function bintang(ak) {
  if (ak >= 90) return '⭐⭐⭐';
  if (ak >= 70) return '⭐⭐';
  if (ak >= 50) return '⭐';
  return '🌱';
}

function fmtSkor(s) {
  const { b, s: sl } = s.score;
  const tot = b + sl;
  const ak = tot ? Math.round((b / tot) * 100) : 0;
  const catLine = s.cat ? `${s.cat.warna} <b>${esc(s.cat.nama)}</b>\n` : '';
  return [
    `📊 <b>Statistik Belajarmu</b>`,
    ``,
    catLine,
    `🟢 Benar   : <b>${b}</b>`,
    `🔴 Salah   : <b>${sl}</b>`,
    `📝 Total   : <b>${tot}</b> soal`,
    `🎯 Akurasi : <b>${ak}%</b> ${bintang(ak)}`,
    `🔥 Streak terbaik: <b>${s.best}</b>`,
    ``,
    tot === 0 ? `<i>Belum ada jawaban — ketuk /mulai untuk mulai kuis! 📚</i>` : `<i>Terus semangat! 💪</i>`,
  ].join('\n');
}

function kbSkor() {
  return { inline_keyboard: [[{ text: '➡️ Lanjut Kuis', callback_data: 'n' }, { text: '🏠 Menu', callback_data: 'm' }]] };
}

// ---------- ALUR ----------
async function mulaiKategori(ctx, s, cat, edit) {
  s.cat = cat;
  s.pool = shuffle(POOLS[cat.key]);
  s.pos = 0;
  s.score = { b: 0, s: 0 };
  s.streak = 0;
  await kirimSoal(ctx, s, edit);
}

async function kirimSoal(ctx, s, edit) {
  if (!s.cat || !s.pool.length) { await tampilMenu(ctx, s, edit); return; }
  if (s.pos >= s.pool.length) {
    // Satu putaran selesai — acak ulang, mulai lagi
    s.pool = shuffle(POOLS[s.cat.key]);
    s.pos = 0;
    const info = `🏆 <b>Putaran selesai!</b> ${s.cat.warna}\n\nMengacak ulang ${POOLS[s.cat.key].length} soal… 🔀`;
    if (edit) await ctx.editMessageText(info, { parse_mode: 'HTML' });
    else await ctx.reply(info, { parse_mode: 'HTML' });
  }
  const soal = s.pool[s.pos];
  s.q = { ...soal, opts: shuffle(soal.options) };
  s.phase = 'q';
  const txt = fmtSoal(s.cat, s);
  const opt = { parse_mode: 'HTML', reply_markup: kbSoal(s.q.opts.length) };
  if (edit) await ctx.editMessageText(txt, opt);
  else await ctx.reply(txt, opt);
}

async function jawab(ctx, s, idx) {
  if (s.phase !== 'q' || !s.q) {
    await ctx.answerCbQuery('Sesi soal sudah lewat — ketuk /mulai untuk soal baru 🙂', { show_alert: true });
    return;
  }
  if (idx < 0 || idx >= s.q.opts.length) return;
  const dipilih = s.q.opts[idx];
  const benar = dipilih === s.q.correct;
  if (benar) { s.score.b++; s.streak++; s.best = Math.max(s.best, s.streak); }
  else { s.score.s++; s.streak = 0; }
  s.phase = 'a';
  await ctx.answerCbQuery(benar ? '✅ Mumtaz! Benar!' : '❌ Kurang tepat, baca penjelasannya ya!');
  await ctx.editMessageText(fmtHasil(s.cat, s, benar, dipilih), { parse_mode: 'HTML', reply_markup: kbHasil() });
}

async function tampilMenu(ctx, s, edit) {
  s.phase = 'idle';
  const opt = { parse_mode: 'HTML', reply_markup: kbMenu() };
  if (edit) { try { await ctx.editMessageText(fmtMenu(), opt); } catch { await ctx.reply(fmtMenu(), opt); } }
  else await ctx.reply(fmtMenu(), opt);
}

async function sesiMati(ctx) {
  await ctx.answerCbQuery('Sesi kedaluwarsa — mulai lagi ya 🙂', { show_alert: true });
}

// ============================================================
// BOT
// ============================================================
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply(
  [
    `السَّلَامُ عَلَيْكُمْ 🌙`,
    ``,
    `🕌 <b>Selamat datang di NahwuBot!</b>`,
    `Kuis interaktif Ilmu Nahwu, Shorof & Tajwid.`,
    ``,
    `🎨 <b>8 kategori berwarna</b> • 🗂 <b>${TOTAL_SOAL} soal</b> dari Database My Nahwu`,
    `🏆 Skor & streak real-time`,
    ``,
    `Ketuk /mulai untuk memilih materi 👇`,
  ].join('\n'),
  { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: '▶️ Mulai Belajar', callback_data: 'm' }]] } }
));

bot.help((ctx) => ctx.reply(
  [
    `🕌 <b>Bantuan NahwuBot</b>`,
    ``,
    `<b>Perintah:</b>`,
    `/mulai — pilih kategori & mulai kuis`,
    `/skor — lihat statistik belajarmu`,
    `/reset — ulangi sesi dari awal`,
    `/help — pesan ini`,
    ``,
    `<b>Cara main:</b>`,
    `1️⃣ Pilih kategori materi berwarna`,
    `2️⃣ Ketuk jawaban 🇦 🇧 🇨 🇩`,
    `3️⃣ Baca penjelasan, ketuk ➡️ untuk lanjut`,
    ``,
    `<i>Seluruh soal diambil verbatim dari Database My Nahwu — tidak dikarang.</i>`,
    `بَارَكَ اللَّهُ فِيكَ 🤲`,
  ].join('\n'),
  { parse_mode: 'HTML' }
));

bot.command('mulai', async (ctx) => tampilMenu(ctx, getSession(ctx.from.id), false));
bot.command('menu', async (ctx) => tampilMenu(ctx, getSession(ctx.from.id), false));

bot.command('skor', async (ctx) => {
  const s = getSession(ctx.from.id);
  await ctx.reply(fmtSkor(s), { parse_mode: 'HTML', reply_markup: kbSkor() });
});

bot.command('reset', async (ctx) => {
  sessions.delete(ctx.from.id);
  await ctx.reply('♻️ <b>Sesi direset!</b>\n\nKetuk /mulai untuk mulai lagi dari awal 🙂', { parse_mode: 'HTML' });
});

// Pilih kategori
bot.action(/^c:(\d+)$/, async (ctx) => {
  const i = parseInt(ctx.match[1], 10);
  const cat = CATS[i];
  if (!cat) return;
  await ctx.answerCbQuery(`Membuka ${cat.nama}… ${cat.warna}`);
  await mulaiKategori(ctx, getSession(ctx.from.id), cat, true);
});

// Jawab soal
bot.action(/^a:(\d+)$/, async (ctx) => {
  const s = sessions.get(ctx.from.id);
  if (!s || !s.cat) { await sesiMati(ctx); return; }
  await jawab(ctx, s, parseInt(ctx.match[1], 10));
});

// Soal berikutnya
bot.action('n', async (ctx) => {
  const s = sessions.get(ctx.from.id);
  if (!s || !s.cat) { await sesiMati(ctx); return; }
  s.pos++;
  await kirimSoal(ctx, s, true);
});

// Menu
bot.action('m', async (ctx) => {
  const s = getSession(ctx.from.id);
  await ctx.answerCbQuery('Kembali ke menu 🏠');
  await tampilMenu(ctx, s, true);
});

// Skor via tombol
bot.action('skor', async (ctx) => {
  const s = getSession(ctx.from.id);
  await ctx.answerCbQuery();
  try {
    await ctx.editMessageText(fmtSkor(s), { parse_mode: 'HTML', reply_markup: kbSkor() });
  } catch {
    await ctx.reply(fmtSkor(s), { parse_mode: 'HTML', reply_markup: kbSkor() });
  }
});

// Fallback: ketik A-D / 1-4 untuk menjawab
bot.hears(/^[a-dA-D1-4]$/, async (ctx) => {
  const s = sessions.get(ctx.from.id);
  if (!s || !s.cat) { await ctx.reply('Ketuk /mulai untuk mulai belajar dulu ya 🙂'); return; }
  if (s.phase !== 'q') { await ctx.reply('Ketuk tombol ➡️ <b>Soal Berikutnya</b> untuk lanjut 🙂', { parse_mode: 'HTML' }); return; }
  const t = ctx.message.text.toUpperCase();
  const idx = 'ABCD'.includes(t) ? 'ABCD'.indexOf(t) : parseInt(t, 10) - 1;
  if (idx >= s.q.opts.length) { await ctx.reply(`Pilih ${LETTERS.slice(0, s.q.opts.length).join(' ')} ya 🙂`); return; }
  // Jawaban via ketikan: kirim hasil sebagai pesan baru (pesan soal tidak bisa diedit tanpa callback)
  const dipilih = s.q.opts[idx];
  const benar = dipilih === s.q.correct;
  if (benar) { s.score.b++; s.streak++; s.best = Math.max(s.best, s.streak); }
  else { s.score.s++; s.streak = 0; }
  s.phase = 'a';
  await ctx.reply(fmtHasil(s.cat, s, benar, dipilih), { parse_mode: 'HTML', reply_markup: kbHasil() });
});

// Pesan lain
bot.on('text', async (ctx) => {
  const s = sessions.get(ctx.from.id);
  if (s && s.phase === 'q') {
    await ctx.reply(`Ketuk salah satu tombol jawaban ${LETTERS.slice(0, s.q.opts.length).join(' ')} 🙂\n<i>atau ketik A–${'ABCD'[s.q.opts.length - 1]}</i>`, { parse_mode: 'HTML' });
  } else {
    await ctx.reply('Ketuk /mulai untuk mulai belajar 🙂');
  }
});

// ============================================================
// VERCEL EXPORT — webhook mode
// ============================================================
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
  } catch (e) {
    console.error(e);
  }
  if (!res.headersSent) res.status(200).json({ ok: true });
};

// Ekspor untuk testing
module.exports._test = { CATS, POOLS, TOTAL_SOAL, buildPool, fmtMenu, fmtSoal, fmtHasil, fmtSkor, kbMenu, kbSoal, kbHasil, getSession, sessions, esc };
