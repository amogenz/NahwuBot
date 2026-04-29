// ═══════════════════════════════════════════════════
// GAME ENGINE — logika permainan Nahwu
// ═══════════════════════════════════════════════════

const DB = require('../data/db');

// Shuffle array
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// State per user disimpan di memori (key = chatId)
// Format: { kIdx, lIdx, sIdx, options, shuffledDB, score, total }
const sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) {
    sessions[chatId] = {
      shuffledDB: shuffle(DB),
      kIdx: 0,
      lIdx: 0,
      sIdx: 1,
      options: [],
      score: 0,
      total: 0,
      waiting: false, // sedang nunggu jawaban?
    };
  }
  return sessions[chatId];
}

function resetSession(chatId) {
  delete sessions[chatId];
  return getSession(chatId);
}

// Ambil soal saat ini
function getCurrentStep(session) {
  const sent = session.shuffledDB[session.kIdx % session.shuffledDB.length];
  const laf  = sent?.analysis[session.lIdx];
  const step = laf?.steps[session.sIdx];
  return { sent, laf, step };
}

// Buat teks soal untuk dikirim ke user
function buildQuestion(session) {
  const { sent, laf, step } = getCurrentStep(session);
  if (!sent || !laf || !step) return null;

  // Shuffle options dan simpan
  session.options = shuffle([...step.options]);
  session.waiting = true;

  const opts = session.options
    .map((o, i) => `${['1️⃣','2️⃣','3️⃣','4️⃣'][i]} ${o}`)
    .join('\n');

  const totalLafadz = sent.analysis.length;
  const totalSteps  = Object.keys(laf.steps).length;
  const kNo         = (session.kIdx % session.shuffledDB.length) + 1;
  const kTotal      = session.shuffledDB.length;

  return (
    `📖 *Kalimat ${kNo}/${kTotal}*\n` +
    `┌─────────────────────\n` +
    `│ ${sent.teks_kalimat}\n` +
    `└─────────────────────\n\n` +
    `🔍 *Kata yang dianalisis:*\n` +
    `➤ ${laf.word}  (lafadz ${session.lIdx+1}/${totalLafadz})\n\n` +
    `❓ *Pertanyaan ${session.sIdx}/${totalSteps}:*\n` +
    `${step.question}\n\n` +
    `${opts}\n\n` +
    `_Balas dengan angka 1-${session.options.length}_`
  );
}

// Proses jawaban user, return objek hasil
function processAnswer(chatId, input) {
  const session = getSession(chatId);
  if (!session.waiting) return { type: 'not_waiting' };

  const num = parseInt(input.trim());
  if (isNaN(num) || num < 1 || num > session.options.length) {
    return { type: 'invalid', max: session.options.length };
  }

  const chosen = session.options[num - 1];
  const { sent, laf, step } = getCurrentStep(session);
  const correct = chosen === step.correct;

  session.total++;
  if (correct) session.score++;
  session.waiting = false;

  const result = {
    type: 'answer',
    correct,
    chosen,
    correctAnswer: step.correct,
    explanation: step.explanation,
    score: session.score,
    total: session.total,
  };

  // Advance state
  const totalSteps = Object.keys(laf.steps).length;
  if (session.sIdx < totalSteps) {
    session.sIdx++;
  } else {
    // Ganti lafadz
    session.sIdx = 1;
    session.lIdx++;
    const totalLafadz = sent.analysis.length;
    if (session.lIdx >= totalLafadz) {
      // Kalimat selesai
      session.lIdx = 0;
      session.kIdx++;
      result.sentenceDone = true;
      result.nextSentence = session.shuffledDB[session.kIdx % session.shuffledDB.length]?.teks_kalimat;
      if (session.kIdx >= session.shuffledDB.length) {
        session.kIdx = 0;
        session.shuffledDB = shuffle(DB);
        result.roundDone = true;
      }
    }
  }

  return result;
}

// Format pesan hasil jawaban
function buildResult(result) {
  if (result.type === 'not_waiting') {
    return '⚠️ Tidak ada soal aktif. Ketik /mulai untuk mulai bermain.';
  }
  if (result.type === 'invalid') {
    return `⚠️ Balas dengan angka 1 sampai ${result.max} ya!`;
  }

  let msg = result.correct
    ? `✅ *MUMTAZ! Benar!* 🎉\n\n`
    : `❌ *SYIDDAH! Salah!*\n\n`;

  if (!result.correct) {
    msg += `Jawabanmu: _${result.chosen}_\n`;
    msg += `Jawaban benar: *${result.correctAnswer}*\n\n`;
  }

  msg += `📝 *Penjelasan:*\n${result.explanation}\n\n`;
  msg += `📊 Skor: *${result.score}/${result.total}*`;

  if (result.sentenceDone) {
    msg += `\n\n🎴 *Kalimat selesai!*`;
    if (result.roundDone) {
      msg += `\n🏆 Semua kalimat sudah selesai! Mengulang dari awal...`;
    }
    if (result.nextSentence) {
      msg += `\n➡️ Kalimat berikutnya:\n_${result.nextSentence}_`;
    }
  }

  return msg;
}

// Statistik user
function getStats(chatId) {
  const s = getSession(chatId);
  const pct = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
  const kNo = (s.kIdx % s.shuffledDB.length) + 1;

  return (
    `📊 *Statistik kamu:*\n\n` +
    `✅ Benar  : ${s.score}\n` +
    `❌ Total  : ${s.total}\n` +
    `🎯 Akurasi: ${pct}%\n` +
    `📖 Kalimat: ${kNo}/${s.shuffledDB.length}\n\n` +
    `Ketik /lanjut untuk soal berikutnya\n` +
    `Ketik /reset untuk mulai dari awal`
  );
}

module.exports = { getSession, resetSession, buildQuestion, processAnswer, buildResult, getStats };
