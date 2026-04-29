// ============================================================
// api/webhook.js — Vercel Serverless Function
// ============================================================

import {
  getSession, setSession, deleteSession,
  getCurrentQuestion, checkAnswer, advance
} from '../lib/game.js';

import {
  fmtQuestion, fmtCorrect, fmtWrong,
  fmtNextLafadz, fmtNextKalimat, fmtLoop,
  fmtScore, fmtHelp, fmtStart
} from '../lib/format.js';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API   = `https://api.telegram.org/bot${TOKEN}`;

async function send(chatId, text) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

async function sendQuestion(chatId, state) {
  const q = getCurrentQuestion(state);
  if (!q) return;
  state.options = q.options;
  state.waitingAnswer = true;
  state.phase = 'question';
  setSession(chatId, state);
  await send(chatId, fmtQuestion(q, q.options));
}

async function nextStep(chatId, state) {
  const result = advance(state);
  setSession(chatId, state);

  if (result === 'next_step') {
    await sendQuestion(chatId, state);
  } else if (result === 'next_lafadz') {
    const sent = state.queue[state.kIdx % state.queue.length];
    const laf  = sent.analysis[state.lIdx];
    await send(chatId, fmtNextLafadz(laf.word));
    await delay(1200);
    await sendQuestion(chatId, state);
  } else if (result === 'next_kalimat') {
    const sent = state.queue[state.kIdx % state.queue.length];
    await send(chatId, fmtNextKalimat(sent.teks_kalimat));
    await delay(1500);
    await sendQuestion(chatId, state);
  } else if (result === 'loop') {
    await send(chatId, fmtLoop());
    await send(chatId, fmtScore(state.score));
    await delay(2000);
    await sendQuestion(chatId, state);
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

export default async function handler(req, res) {
  res.status(200).json({ ok: true });
  if (req.method !== 'POST' || !req.body?.message) return;

  const msg    = req.body.message;
  const chatId = msg.chat.id;
  const text   = (msg.text || '').trim();
  const state  = getSession(chatId);

  // COMMANDS
  if (text.startsWith('/start')) {
    await send(chatId, fmtStart()); return;
  }
  if (text === '/help') {
    await send(chatId, fmtHelp()); return;
  }
  if (text === '/skor') {
    await send(chatId, fmtScore(state.score)); return;
  }
  if (text === '/reset') {
    deleteSession(chatId);
    await send(chatId, '♻️ *Sesi direset!* Ketik /mulai untuk mulai lagi.'); return;
  }
  if (text === '/mulai') {
    state.phase = 'question';
    setSession(chatId, state);
    await sendQuestion(chatId, state); return;
  }
  if (text === '/lanjut') {
    if (state.phase === 'answered') await nextStep(chatId, state);
    else await sendQuestion(chatId, state);
    return;
  }

  // JAWABAN ANGKA
  if (state.phase === 'question' && /^[1-4]$/.test(text)) {
    const ansIdx = parseInt(text) - 1;
    if (ansIdx >= (state.options?.length || 4)) {
      await send(chatId, `⚠️ Pilihan tidak valid. Balas 1-${state.options.length}`);
      return;
    }
    state.phase = 'answered';
    const result = checkAnswer(state, ansIdx);
    setSession(chatId, state);

    const q = getCurrentQuestion(state);
    await send(chatId, result.correct ? fmtCorrect(result, q) : fmtWrong(result, q));
    await delay(3000);
    await nextStep(chatId, state);
    return;
  }

  // FALLBACK
  if (state.phase === 'question') {
    await send(chatId, `⚠️ Balas dengan angka 1-${state.options?.length || 4} untuk menjawab.`);
  } else {
    await send(chatId, `Ketik /mulai untuk mulai, atau /help untuk bantuan.`);
  }
}
