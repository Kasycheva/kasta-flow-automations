export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.TELEGRAM_NOTIFY_SECRET;
  if (secret && req.headers['x-notify-secret'] !== secret) {
    return res.status(403).end();
  }

  const { name, email, company, services, description, channel } = req.body ?? {};

  const truncate = (s: unknown, max = 200) =>
    typeof s === 'string' ? s.slice(0, max) : '—';

  const text = [
    '📋 New audit request!',
    '',
    `👤 Name: ${truncate(name)}`,
    `📧 Email: ${truncate(email)}`,
    `🏢 Company: ${truncate(company)}`,
    `🛠 Services: ${truncate(services)}`,
    `💬 Message: ${truncate(description, 500)}`,
    `📱 Channel: ${truncate(channel)}`,
  ].join('\n');

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
        }),
      },
    );
    if (!tgRes.ok) {
      console.error('Telegram API error', await tgRes.text());
    }
  } catch (err) {
    console.error('Telegram fetch failed', err);
  }

  res.status(200).json({ ok: true });
}
