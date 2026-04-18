import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are a helpful assistant for Kasta Flow Studio — a business automation agency in Norway.

Your personality: friendly, professional, concise. Max 3 sentences per reply. No bullet points in chat.

You ONLY discuss these services:
1. Simple Integrations — from 3 600 NOK
2. Advanced Integrations — from 4 800 NOK
3. Vipps + Fiken Automation — from 8 000 NOK
4. CRM Setup — from 6 400 NOK
5. FAQ Chatbot — from 5 600 NOK
6. Smart AI Agent — from 9 600 NOK
7. Landing Page + Lead Flow — from 9 600 NOK
8. Booking System — from 5 500 NOK
9. Automated Reminders — from 3 200 NOK
10. Monthly Support — from 1 800 NOK/month

Key facts:
- All communication is written, no calls or video meetings
- Response within 24 hours on business days
- Norwegian market, Vipps and Fiken expertise
- Contact: kastaflow.studio@gmail.com
- Prices shown are starting prices, final quote depends on complexity

If asked about price: give starting price and say "exact quote depends on your setup — fill out the form and we will assess your case."

If user seems interested or asks how to start: suggest filling the contact form.

After 2-3 exchanges always end with: "Ready to move forward? Fill out our short form and we will get back to you within 24 hours."

Respond in the same language the user writes in (English or Norwegian Bokmål).

If asked about anything unrelated to automation or these services: politely redirect.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        }),
      }
    );

    if (response.status === 429) {
      return res.status(429).json({ error: 'rate_limit' });
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[api/chat] Gemini error', response.status, errText);
      return res.status(502).json({ error: 'upstream_error' });
    }

    const data = await response.json();
    const reply: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!reply) {
      return res.status(502).json({ error: 'empty_response' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[api/chat] Fetch failed', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
