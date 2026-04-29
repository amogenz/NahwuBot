// ============================================================
// FORMATTER — Template pesan Telegram
// ============================================================

export function fmtQuestion(q, options) {
  const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
  const optLines = options.map((o, i) => `${nums[i]} ${o}`).join('\n');

  const stepBar = buildStepBar(q.stepNow, q.totalSteps);

  return [
    `📖 *Kalimat ${q.kalimatNow}/${q.totalKalimat}*`,
    `\`${q.kalimat}\``,
    ``,
    `🔍 *Kata yang dianalisis:*`,
    `\`${q.kata}\``,
    ``,
    `❓ *Pertanyaan ${q.stepNow}/${q.totalSteps}:*`,
    `${q.question}`,
    ``,
    optLines,
    ``,
    `${stepBar}`,
    ``,
    `_Balas dengan angka 1-${options.length}_`
  ].join('\n');
}

export function fmtCorrect(result, q) {
  return [
    `✅ *MUMTAZ! Benar!*`,
    ``,
    `💡 *Penjelasan:*`,
    `${result.explanation}`,
    ``,
    `_Ketik /lanjut atau tunggu 3 detik..._`
  ].join('\n');
}

export function fmtWrong(result, q) {
  return [
    `❌ *SYIDDAH! Salah!*`,
    ``,
    `Jawabanmu: _${result.chosen}_`,
    `Jawaban benar: *${result.rightAnswer}*`,
    ``,
    `💡 *Penjelasan:*`,
    `${result.explanation}`,
    ``,
    `_Ketik /lanjut atau tunggu 3 detik..._`
  ].join('\n');
}

export function fmtNextLafadz(word) {
  return [
    `━━━━━━━━━━━━━━━━━━━`,
    `📚 *Lafadz berikutnya:*`,
    `\`${word}\``,
    `━━━━━━━━━━━━━━━━━━━`
  ].join('\n');
}

export function fmtNextKalimat(sent) {
  return [
    `🎉 *Kalimat selesai! Masya Allah!*`,
    ``,
    `➡️ Lanjut ke kalimat berikutnya...`,
    `\`${sent}\``
  ].join('\n');
}

export function fmtLoop() {
  return [
    `🏆 *SELAMAT! Kamu sudah menyelesaikan semua kalimat!*`,
    ``,
    `Memulai ulang dari awal dengan urutan baru...`,
    `بِسْمِ اللَّهِ`
  ].join('\n');
}

export function fmtScore(score) {
  const total = score.correct + score.wrong;
  const pct   = total > 0 ? Math.round((score.correct / total) * 100) : 0;
  const stars = pct >= 80 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐';

  return [
    `📊 *Skor kamu:*`,
    ``,
    `✅ Benar : ${score.correct}`,
    `❌ Salah : ${score.wrong}`,
    `📈 Total : ${total} soal`,
    `🎯 Akurasi: ${pct}% ${stars}`
  ].join('\n');
}

export function fmtHelp() {
  return [
    `🕌 *Nahwu Bot — Belajar Nahwu Interaktif*`,
    ``,
    `*Perintah:*`,
    `/mulai — Mulai belajar`,
    `/lanjut — Lanjut ke soal berikutnya`,
    `/skor — Lihat skor kamu`,
    `/reset — Mulai ulang dari awal`,
    `/help — Tampilkan menu ini`,
    ``,
    `*Cara main:*`,
    `Bot kirim soal → kamu balas dengan angka 1-4 → dapat penjelasan → lanjut!`,
    ``,
    `_بَارَكَ اللَّهُ فِيكَ_`
  ].join('\n');
}

export function fmtStart() {
  return [
    `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ 🌙`,
    ``,
    `*Selamat datang di Nahwu Bot!*`,
    `Bot belajar Ilmu Nahwu interaktif berbasis kalimat Al-Quran & teks Arab.`,
    ``,
    `Ketik /mulai untuk memulai belajar`,
    `Ketik /help untuk bantuan`,
    ``,
    `_بِسْمِ اللَّهِ نَبْدَأُ_`
  ].join('\n');
}

// Helper: progress bar step
function buildStepBar(now, total) {
  const filled = '🟩';
  const empty  = '⬜';
  const bar = Array.from({ length: total }, (_, i) => i < now ? filled : empty).join('');
  return `Langkah ${now}/${total}: ${bar}`;
}
