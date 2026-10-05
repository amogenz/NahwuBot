# 🕌 NahwuBot v2 — Panduan Deploy ke Vercel

Bot Telegram kuis Ilmu Nahwu, Shorof & Tajwid interaktif.
UI: parse_mode HTML + tombol inline + tema warna per kategori.
Soal 100% dari Database My Nahwu (repo `amogenz/Amogenz/db`).

---

## 📁 Struktur File

```
NahwuBot/
├── api/
│   └── index.js          ← Handler utama (webhook Vercel) + UI + logika kuis
├── db/
│   ├── amogenzdb-lv1.js          ← Jurumiyah 1 (329 soal)
│   ├── amogenzdb-lv2.js          ← Jurumiyah 2 (1007 soal)
│   ├── amogenzdb-alfiyah-isim.js ← Alfiyah Isim (300 soal)
│   ├── amogenzdb-alfiyah-fiil.js ← Alfiyah Fi'il (451 soal)
│   ├── amogenzdb-shorof.js       ← Shorof (216 soal)
│   ├── amogenzdb-bina.js         ← Bina' (172 soal)
│   ├── amogenzdb-tasrif.js       ← Tasrif (184 soal)
│   └── amogenzdb-tajwid.js       ← Tajwid (155 soal)
├── package.json
├── vercel.json
└── README.md
```

> File `db/*.js` adalah salinan dari `amogenz/Amogenz/db`
> (format `export const` diubah menjadi `module.exports` agar bisa di-`require`).
> Total ±2.814 soal valid per 5 Okt 2026.

## 🎨 UI & Warna

Telegram Bot API **tidak mendukung warna teks** (cek: https://core.telegram.org/bots/api#formatting-options),
jadi warna dihadirkan lewat:

- 🎨 **Tema warna per kategori** — 🟢 Jurumiyah 1, 🔵 Jurumiyah 2, 🟣 Alfiyah Isim,
  🟠 Alfiyah Fi'il, 🟡 Shorof, 🔴 Bina', 🟤 Tasrif, ⚪ Tajwid
- 🇦 🇧 🇨 🇩 tombol jawaban inline (ketuk, tanpa ketik angka)
- 🟢 benar / 🔴 salah + penjelasan di *expandable blockquote* (ketuk untuk buka)
- 🟩⬜ progress bar, 🔥 streak, ⭐ rating akurasi

## 🔄 Cara Sinkron Ulang Database

1. Download 8 file dari `https://github.com/amogenz/Amogenz/tree/main/db`
2. Ubah baris `export const NAMA = ` menjadi `module.exports = `
3. Timpa file di `db/` lalu push — Vercel redeploy otomatis

---

## 🚀 LANGKAH DEPLOY (dari HP)

### STEP 1 — Buat Bot Telegram

1. Buka Telegram → cari **@BotFather**
2. Kirim `/newbot`
3. Beri nama bot, contoh: `Nahwu Master Bot`
4. Beri username, contoh: `nahwumaster_bot`
5. **Simpan TOKEN** yang diberikan BotFather (format: `123456:ABC-DEF...`)

---

### STEP 2 — Upload ke GitHub

1. Buka **github.com** di HP
2. Buat repository baru → nama: `nahwu-bot` → **Public**
3. Klik **"uploading an existing file"**
4. Upload semua file ini (struktur folder harus sama):
   - `api/webhook.js`
   - `lib/database.js`
   - `lib/game.js`
   - `lib/format.js`
   - `package.json`
   - `vercel.json`
5. Commit changes

> 💡 Atau pakai GitHub Desktop di HP Android (aplikasinya ada)

---

### STEP 3 — Deploy ke Vercel

1. Buka **vercel.com** → Sign up with GitHub
2. Klik **"Add New Project"**
3. Pilih repo `nahwu-bot`
4. Sebelum deploy, tambahkan **Environment Variable**:
   - Klik **"Environment Variables"**
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: token dari BotFather tadi
   - Klik **Add**
5. Klik **Deploy**
6. Tunggu selesai → catat URL deployment kamu (contoh: `https://nahwu-bot-xxx.vercel.app`)

---

### STEP 4 — Daftarkan Webhook

Setelah deploy, buka browser di HP dan akses URL ini (ganti bagian yang perlu):

```
https://api.telegram.org/botTOKEN_KAMU/setWebhook?url=https://URL_VERCEL_KAMU/api/webhook
```

Contoh lengkap:
```
https://api.telegram.org/bot123456:ABC-DEF/setWebhook?url=https://nahwu-bot-xxx.vercel.app/api/webhook
```

Kalau berhasil, Telegram akan balas:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

---

### STEP 5 — Test Bot

1. Buka Telegram → cari username bot kamu
2. Kirim `/start`
3. Kirim `/mulai`
4. Jawab dengan angka 1-4

---

## 🔧 Format Database Soal

File `db/*.js` memakai format Database My Nahwu — **jangan dikarang**, salin verbatim:

```js
{
  teks_kalimat: "النص العربي",   // atau teks_potongan untuk Tajwid
  analysis: [
    {
      word: "الكلمة",
      steps: {
        1: {
          question: "Pertanyaannya?",
          options: ["Pilihan A", "Pilihan B", "Pilihan C"],
          correct: "Pilihan A",          // HARUS sama persis dengan salah satu options
          explanation: "Penjelasan..."
        },
        2: { ... }
      }
    }
  ]
}
```

Bot otomatis melewati soal yang cacat (`correct` tidak ada di `options`, dsb.).

---

## 📱 Perintah Bot

| Perintah | Fungsi |
|----------|--------|
| `/start` | Salam pembuka + tombol mulai |
| `/mulai` / `/menu` | Pilih kategori materi (8 kategori berwarna) |
| `/skor` | Lihat statistik: benar/salah/akurasi/streak |
| `/reset` | Reset sesi |
| `/help` | Bantuan |

Jawaban: ketuk tombol 🇦 🇧 🇨 🇩 (atau ketik A–D / 1–4).

---

## ⚠️ Catatan Penting

- **Session tersimpan di memory** Vercel — akan reset kalau fungsi cold start. Ini normal untuk skala kecil. Kalau mau persistent, upgrade ke **Upstash Redis** (ada free tier).
- Vercel free tier cukup untuk ratusan user sekaligus.
- Jangan share TOKEN bot ke siapapun.

---

## 🆘 Masalah Umum

**Bot tidak merespon?**
→ Cek webhook sudah terdaftar: `https://api.telegram.org/botTOKEN/getWebhookInfo`

**Error 500?**
→ Cek Environment Variable `TELEGRAM_BOT_TOKEN` sudah di-set di Vercel

**Webhook gagal didaftarkan?**
→ Pastikan URL Vercel benar dan sudah `/api/webhook` di akhirnya

---

بَارَكَ اللَّهُ فِيكَ 🌙
