// setup-webhook.js
// Jalankan sekali setelah deploy untuk mendaftarkan webhook ke Telegram
// Cara: node setup-webhook.js

const TOKEN       = 'ISI_TOKEN_KAMU_DISINI';
const VERCEL_URL  = 'https://nahwu-bot.vercel.app'; // ganti dengan URL Vercel kamu

async function setup() {
  const url = `https://api.telegram.org/bot${TOKEN}/setWebhook`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `${VERCEL_URL}/api/webhook`,
      allowed_updates: ['message']
    })
  });
  const data = await res.json();
  console.log('Hasil:', data);
}

setup();
