// ============================================================
// GAME ENGINE — State management per user
// ============================================================
import { DB } from './database.js';

// In-memory store: { chatId: { ...state } }
// Di Vercel serverless ini akan reset tiap cold start,
// tapi cukup untuk belajar. Upgrade ke Upstash Redis kalau mau persistent.
const sessions = new Map();

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Ambil atau buat session baru
export function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, newSession());
  }
  return sessions.get(chatId);
}

export function setSession(chatId, state) {
  sessions.set(chatId, state);
}

export function deleteSession(chatId) {
  sessions.delete(chatId);
}

function newSession() {
  return {
    queue: shuffle([...DB]),  // urutan kalimat diacak
    kIdx: 0,   // indeks kalimat
    lIdx: 0,   // indeks lafadz
    sIdx: 1,   // indeks step (mulai dari 1)
    score: { correct: 0, wrong: 0 },
    waitingAnswer: false,
    options: [],   // pilihan jawaban yang sudah diacak
    phase: 'idle'  // idle | question | done
  };
}

// ── AMBIL SOAL SEKARANG ──────────────────────────────────
export function getCurrentQuestion(state) {
  const sent  = state.queue[state.kIdx % state.queue.length];
  const laf   = sent.analysis[state.lIdx];
  if (!laf) return null;
  const step  = laf.steps[state.sIdx];
  if (!step) return null;

  const options = shuffle([...step.options]);

  return {
    kalimat:     sent.teks_kalimat,
    kata:        laf.word,
    question:    step.question,
    options,
    correct:     step.correct,
    explanation: step.explanation,
    totalSteps:  Object.keys(laf.steps).length,
    stepNow:     state.sIdx,
    totalLafadz: sent.analysis.length,
    lafadzNow:   state.lIdx + 1,
    totalKalimat: state.queue.length,
    kalimatNow:  (state.kIdx % state.queue.length) + 1
  };
}

// ── CEK JAWABAN ──────────────────────────────────────────
export function checkAnswer(state, answerIndex) {
  const sent  = state.queue[state.kIdx % state.queue.length];
  const laf   = sent.analysis[state.lIdx];
  const step  = laf.steps[state.sIdx];

  // options sudah disimpan di state saat soal dikirim
  const chosen  = state.options[answerIndex];
  const correct = chosen === step.correct;

  if (correct) state.score.correct++;
  else         state.score.wrong++;

  return {
    correct,
    chosen,
    rightAnswer: step.correct,
    explanation: step.explanation
  };
}

// ── MAJU KE SOAL BERIKUTNYA ──────────────────────────────
// Returns: 'next_step' | 'next_lafadz' | 'next_kalimat' | 'loop'
export function advance(state) {
  const sent = state.queue[state.kIdx % state.queue.length];
  const laf  = sent.analysis[state.lIdx];
  const total = Object.keys(laf.steps).length;

  // masih ada step di lafadz ini
  if (state.sIdx < total) {
    state.sIdx++;
    return 'next_step';
  }

  // pindah lafadz berikutnya
  state.lIdx++;
  state.sIdx = 1;

  if (state.lIdx < sent.analysis.length) {
    return 'next_lafadz';
  }

  // pindah kalimat berikutnya
  state.lIdx = 0;
  state.kIdx++;

  if (state.kIdx >= state.queue.length) {
    // sudah habis semua, mulai ulang acak
    state.kIdx = 0;
    state.queue = shuffle([...DB]);
    return 'loop';
  }

  return 'next_kalimat';
}
