# 🕌 Nahwu Bot — Panduan Deploy ke Vercel

Bot Telegram belajar Ilmu Nahwu interaktif. Gratis, tanpa server, cukup HP.

---

## 📁 Struktur File

```
nahwu-bot/
├── api/
│   └── webhook.js       ← Handler utama (Vercel function)
├── lib/
│   ├── database.js      ← Database soal Nahwu
│   ├── game.js          ← Engine game (state, logika soal)
│   └── format.js        ← Template pesan Telegram
├── package.json
├── vercel.json
├── setup-webhook.js     ← Script daftar webhook (jalankan sekali)
└── README.md
```

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

## 🔧 Cara Ganti Database Soal

Edit file `lib/database.js` — ganti array `DB` dengan database nahwu kamu.

Format setiap soal:
```js
{
  teks_kalimat: "النص العربي",
  analysis: [
    {
      word: "الكلمة",
      steps: {
        1: {
          question: "Pertanyaannya?",
          options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
          correct: "Pilihan A",
          explanation: "Penjelasan kenapa A benar..."
        },
        2: { ... }
      }
    }
  ]
}
```

---

## 📱 Perintah Bot

| Perintah | Fungsi |
|----------|--------|
| `/start` | Salam pembuka |
| `/mulai` | Mulai belajar |
| `/lanjut` | Lanjut soal berikutnya |
| `/skor` | Lihat skor |
| `/reset` | Reset sesi |
| `/help` | Bantuan |

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
