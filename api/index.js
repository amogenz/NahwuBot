const { Telegraf } = require('telegraf');

// ============================================================
// DATABASE NAHWU
// Ganti/tambah dengan database amogenzdb kamu
// ============================================================
const DB = [
  {
    teks_kalimat: "ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ",
    analysis: [
      {
        word: "الطَّالِبُ",
        steps: {
          1: { question: "Apa kedudukan الطَّالِبُ dalam kalimat?", options: ["Fa'il (فاعل)", "Maf'ul Bih", "Mubtada", "Khabar"], correct: "Fa'il (فاعل)", explanation: "الطَّالِبُ adalah Fa'il karena ia pelaku dari fi'il ذَهَبَ, dibaca rafa' dengan dhammah." },
          2: { question: "Tanda i'rab الطَّالِبُ adalah?", options: ["Dhammah (ضمة)", "Fathah (فتحة)", "Kasrah (كسرة)", "Sukun (سكون)"], correct: "Dhammah (ضمة)", explanation: "Fa'il dibaca rafa' dengan tanda dhammah karena isim mufrad." },
          3: { question: "الطَّالِبُ termasuk isim jenis apa?", options: ["Isim Ma'rifah", "Isim Nakirah", "Isim Dhamir", "Isim Isyarah"], correct: "Isim Ma'rifah", explanation: "الطَّالِبُ adalah isim ma'rifah karena ada ال di awalnya." }
        }
      },
      {
        word: "الْمَدْرَسَةِ",
        steps: {
          1: { question: "Kedudukan الْمَدْرَسَةِ dalam kalimat?", options: ["Majrur (مجرور)", "Marfu'", "Manshub", "Mudhaf Ilaih"], correct: "Majrur (مجرور)", explanation: "الْمَدْرَسَةِ adalah majrur karena didahului huruf jar إِلَى." },
          2: { question: "Huruf jar yang masuk adalah?", options: ["إِلَى", "مِنْ", "عَلَى", "فِي"], correct: "إِلَى", explanation: "إِلَى bermakna 'menuju/ke', menjarkan isim setelahnya." }
        }
      }
    ]
  },
  {
    teks_kalimat: "الْكِتَابُ عَلَى الْمَكْتَبِ",
    analysis: [
      {
        word: "الْكِتَابُ",
        steps: {
          1: { question: "Kedudukan الْكِتَابُ dalam jumlah ismiyyah?", options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul"], correct: "Mubtada (مبتدأ)", explanation: "الْكِتَابُ adalah Mubtada, dibaca rafa' dengan dhammah." },
          2: { question: "I'rab الْكِتَابُ adalah?", options: ["Rafa' - Mubtada", "Nashab - Maf'ul", "Jar - Majrur", "Jazm"], correct: "Rafa' - Mubtada", explanation: "Mubtada wajib dibaca rafa', tandanya dhammah pada akhirnya." }
        }
      },
      {
        word: "الْمَكْتَبِ",
        steps: {
          1: { question: "Jar majrur عَلَى الْمَكْتَبِ berkedudukan sebagai?", options: ["Khabar (خبر)", "Mubtada", "Fa'il", "Na'at"], correct: "Khabar (خبر)", explanation: "Jar majrur عَلَى الْمَكْتَبِ menjadi Khabar dari mubtada الْكِتَابُ." },
          2: { question: "Makna huruf jar عَلَى adalah?", options: ["Di atas", "Di bawah", "Di dalam", "Di samping"], correct: "Di atas", explanation: "عَلَى bermakna 'di atas'." },
          3: { question: "Tanda jar الْمَكْتَبِ adalah?", options: ["Kasrah (كسرة)", "Dhammah", "Fathah", "Tanwin"], correct: "Kasrah (كسرة)", explanation: "Isim mufrad yang dijarkan tanda jar-nya adalah kasrah." }
        }
      }
    ]
  },
  {
    teks_kalimat: "يَكْتُبُ مُحَمَّدٌ الدَّرْسَ",
    analysis: [
      {
        word: "يَكْتُبُ",
        steps: {
          1: { question: "يَكْتُبُ termasuk fi'il jenis apa?", options: ["Fi'il Mudhari'", "Fi'il Madhi", "Fi'il Amr", "Isim Fi'il"], correct: "Fi'il Mudhari'", explanation: "يَكْتُبُ adalah fi'il mudhari' karena diawali huruf mudhara'ah ي." },
          2: { question: "Tanda i'rab fi'il mudhari يَكْتُبُ?", options: ["Rafa' - Dhammah", "Nashab - Fathah", "Jazm - Sukun", "Mabniy"], correct: "Rafa' - Dhammah", explanation: "Fi'il mudhari asalnya dirafa' dengan dhammah jika tidak ada nawashib atau jawazim." }
        }
      },
      {
        word: "الدَّرْسَ",
        steps: {
          1: { question: "Kedudukan الدَّرْسَ dalam kalimat?", options: ["Maf'ul Bih (مفعول به)", "Fa'il", "Mubtada", "Khabar"], correct: "Maf'ul Bih (مفعول به)", explanation: "الدَّرْسَ adalah Maf'ul Bih, yaitu yang dikenai perbuatan menulis." },
          2: { question: "Tanda nashab الدَّرْسَ adalah?", options: ["Fathah (فتحة)", "Kasrah", "Dhammah", "Alif"], correct: "Fathah (فتحة)", explanation: "Maf'ul bih dibaca nashab, tanda nashab isim mufrad adalah fathah." }
        }
      }
    ]
  },
  {
    teks_kalimat: "جَاءَ الْمُعَلِّمُ مِنَ الْمَسْجِدِ",
    analysis: [
      {
        word: "الْمُعَلِّمُ",
        steps: {
          1: { question: "Kedudukan الْمُعَلِّمُ dalam kalimat?", options: ["Fa'il (فاعل)", "Mubtada", "Maf'ul Bih", "Khabar"], correct: "Fa'il (فاعل)", explanation: "الْمُعَلِّمُ adalah Fa'il dari fi'il جَاءَ, dibaca rafa' dengan dhammah." },
          2: { question: "الْمُعَلِّمُ berasal dari wazan?", options: ["مُفَعِّل", "فَاعِل", "مَفْعُول", "فَعِيل"], correct: "مُفَعِّل", explanation: "الْمُعَلِّمُ dari wazan مُفَعِّل, isim fa'il dari fi'il bab II." }
        }
      },
      {
        word: "الْمَسْجِدِ",
        steps: {
          1: { question: "الْمَسْجِدِ berkedudukan sebagai?", options: ["Majrur (مجرور)", "Maf'ul Bih", "Mubtada", "Fa'il"], correct: "Majrur (مجرور)", explanation: "الْمَسْجِدِ adalah majrur karena didahului huruf jar مِنَ." },
          2: { question: "Huruf jar مِنَ bermakna?", options: ["Dari", "Ke", "Di", "Dengan"], correct: "Dari", explanation: "مِنَ bermakna 'dari', menunjukkan asal perjalanan." }
        }
      }
    ]
  },
  {
    teks_kalimat: "هَذَا كِتَابٌ جَدِيدٌ",
    analysis: [
      {
        word: "هَذَا",
        steps: {
          1: { question: "هَذَا termasuk jenis kata apa?", options: ["Isim Isyarah", "Isim Dhamir", "Isim Maushul", "Isim Ma'rifah biasa"], correct: "Isim Isyarah", explanation: "هَذَا adalah isim isyarah (kata tunjuk) untuk benda tunggal dekat, artinya 'ini'." },
          2: { question: "هَذَا berkedudukan sebagai?", options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul"], correct: "Mubtada (مبتدأ)", explanation: "هَذَا adalah Mubtada dari jumlah ismiyyah ini." }
        }
      },
      {
        word: "كِتَابٌ جَدِيدٌ",
        steps: {
          1: { question: "كِتَابٌ berkedudukan sebagai?", options: ["Khabar (خبر)", "Mubtada", "Na'at", "Maf'ul"], correct: "Khabar (خبر)", explanation: "كِتَابٌ adalah Khabar dari Mubtada هَذَا." },
          2: { question: "جَدِيدٌ berkedudukan sebagai?", options: ["Na'at (نعت)", "Khabar", "Hal", "Mubtada"], correct: "Na'at (نعت)", explanation: "جَدِيدٌ adalah Na'at (sifat) yang menerangkan كِتَابٌ." }
        }
      }
    ]
  }
];

// ============================================================
// SESSION — simpan state per user
// ============================================================
const sessions = new Map();

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function getSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {
      queue: shuffle([...DB]),
      kIdx: 0, lIdx: 0, sIdx: 1,
      score: { correct: 0, wrong: 0 },
      options: [], phase: 'idle'
    });
  }
  return sessions.get(id);
}

// ============================================================
// GAME LOGIC
// ============================================================
function getCurrentQ(state) {
  const sent = state.queue[state.kIdx % state.queue.length];
  const laf  = sent?.analysis[state.lIdx];
  if (!laf) return null;
  const step = laf.steps[state.sIdx];
  if (!step) return null;
  return { sent, laf, step, totalSteps: Object.keys(laf.steps).length };
}

function advance(state) {
  const sent  = state.queue[state.kIdx % state.queue.length];
  const laf   = sent.analysis[state.lIdx];
  const total = Object.keys(laf.steps).length;

  if (state.sIdx < total) { state.sIdx++; return 'next_step'; }

  state.lIdx++; state.sIdx = 1;
  if (state.lIdx < sent.analysis.length) return 'next_lafadz';

  state.lIdx = 0; state.kIdx++;
  if (state.kIdx >= state.queue.length) {
    state.kIdx = 0;
    state.queue = shuffle([...DB]);
    return 'loop';
  }
  return 'next_kalimat';
}

// ============================================================
// FORMAT PESAN
// ============================================================
const NUMS = ['1️⃣','2️⃣','3️⃣','4️⃣'];

function fmtQ(state) {
  const q = getCurrentQ(state);
  if (!q) return null;
  const opts = shuffle([...q.step.options]);
  state.options = opts;
  const bar = Array.from({length: q.totalSteps}, (_,i) => i < state.sIdx ? '🟩' : '⬜').join('');
  const sent = state.queue[state.kIdx % state.queue.length];
  return [
    `📖 *Kalimat ${(state.kIdx % state.queue.length)+1}/${state.queue.length}*`,
    `\`${sent.teks_kalimat}\``,
    ``,
    `🔍 *Kata:* \`${q.laf.word}\``,
    ``,
    `❓ *Pertanyaan ${state.sIdx}/${q.totalSteps}:*`,
    q.step.question,
    ``,
    opts.map((o,i) => `${NUMS[i]} ${o}`).join('\n'),
    ``,
    `${bar} (${state.sIdx}/${q.totalSteps})`,
    ``,
    `_Balas angka 1-${opts.length}_`
  ].join('\n');
}

function fmtBenar(exp) {
  return `✅ *MUMTAZ! Benar!*\n\n💡 *Penjelasan:*\n${exp}`;
}

function fmtSalah(chosen, correct, exp) {
  return `❌ *SYIDDAH! Salah!*\n\nJawabanmu: _${chosen}_\nJawaban benar: *${correct}*\n\n💡 *Penjelasan:*\n${exp}`;
}

function fmtSkor(score) {
  const total = score.correct + score.wrong;
  const pct   = total > 0 ? Math.round(score.correct/total*100) : 0;
  const star  = pct >= 80 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐';
  return `📊 *Skor kamu:*\n\n✅ Benar : ${score.correct}\n❌ Salah : ${score.wrong}\n📈 Total : ${total} soal\n🎯 Akurasi: ${pct}% ${star}`;
}

// ============================================================
// BOT SETUP
// ============================================================
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function kirimSoal(ctx, state) {
  const txt = fmtQ(state);
  if (!txt) return;
  state.phase = 'question';
  await ctx.replyWithMarkdown(txt);
}

async function lanjutkan(ctx, state) {
  const hasil = advance(state);

  if (hasil === 'next_step') {
    await kirimSoal(ctx, state);

  } else if (hasil === 'next_lafadz') {
    const sent = state.queue[state.kIdx % state.queue.length];
    const laf  = sent.analysis[state.lIdx];
    await ctx.replyWithMarkdown(`━━━━━━━━━━━━━━━\n📚 *Lafadz berikutnya:*\n\`${laf.word}\`\n━━━━━━━━━━━━━━━`);
    await delay(1000);
    await kirimSoal(ctx, state);

  } else if (hasil === 'next_kalimat') {
    const sent = state.queue[state.kIdx % state.queue.length];
    await ctx.replyWithMarkdown(`🎉 *Kalimat selesai!*\n\nLanjut ke:\n\`${sent.teks_kalimat}\``);
    await delay(1200);
    await kirimSoal(ctx, state);

  } else if (hasil === 'loop') {
    await ctx.replyWithMarkdown(`🏆 *SELAMAT! Semua kalimat selesai!*\n\nMemulai ulang...\nبِسْمِ اللَّهِ`);
    await ctx.replyWithMarkdown(fmtSkor(state.score));
    await delay(1500);
    await kirimSoal(ctx, state);
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// Commands
bot.start(ctx => ctx.replyWithMarkdown(
  `السَّلَامُ عَلَيْكُمْ 🌙\n\n*Selamat datang di Nahwu Bot!*\nBelajar Ilmu Nahwu interaktif.\n\nKetik /mulai untuk mulai belajar\nKetik /help untuk bantuan`
));

bot.help(ctx => ctx.replyWithMarkdown(
  `🕌 *Nahwu Bot*\n\n/mulai — Mulai belajar\n/lanjut — Lanjut soal\n/skor — Lihat skor\n/reset — Reset sesi\n\n*Cara main:*\nBot kirim soal → balas angka 1-4 → dapat penjelasan → lanjut!\n\n_بَارَكَ اللَّهُ فِيكَ_`
));

bot.command('mulai', async ctx => {
  const state = getSession(ctx.from.id);
  await kirimSoal(ctx, state);
});

bot.command('lanjut', async ctx => {
  const state = getSession(ctx.from.id);
  if (state.phase === 'answered') await lanjutkan(ctx, state);
  else await kirimSoal(ctx, state);
});

bot.command('skor', async ctx => {
  const state = getSession(ctx.from.id);
  await ctx.replyWithMarkdown(fmtSkor(state.score));
});

bot.command('reset', async ctx => {
  sessions.delete(ctx.from.id);
  await ctx.reply('♻️ Sesi direset! Ketik /mulai untuk mulai lagi.');
});

// Jawaban angka
bot.hears(/^[1-4]$/, async ctx => {
  const state = getSession(ctx.from.id);

  if (state.phase !== 'question') {
    await ctx.reply('Ketik /mulai untuk mulai belajar dulu ya.');
    return;
  }

  const ansIdx = parseInt(ctx.message.text) - 1;
  if (ansIdx >= state.options.length) {
    await ctx.reply(`Pilih angka 1-${state.options.length} ya.`);
    return;
  }

  const q       = getCurrentQ(state);
  const chosen  = state.options[ansIdx];
  const correct = chosen === q.step.correct;

  if (correct) state.score.correct++;
  else         state.score.wrong++;

  state.phase = 'answered';

  if (correct) {
    await ctx.replyWithMarkdown(fmtBenar(q.step.explanation));
  } else {
    await ctx.replyWithMarkdown(fmtSalah(chosen, q.step.correct, q.step.explanation));
  }

  await delay(2500);
  await lanjutkan(ctx, state);
});

// Pesan lain
bot.on('text', async ctx => {
  const state = getSession(ctx.from.id);
  if (state.phase === 'question') {
    await ctx.reply(`Balas dengan angka 1-${state.options.length} untuk menjawab.`);
  } else {
    await ctx.reply('Ketik /mulai untuk mulai belajar.');
  }
});

// ============================================================
// VERCEL EXPORT — webhook mode
// ============================================================
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
  } catch(e) {
    console.error(e);
  }
  res.status(200).json({ ok: true });
};
