export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a helpful assistant for Kasta Flow Studio, a business automation agency in Norway.

Your personality: friendly, professional, concise. Maximum 3 sentences per reply. Do not use bullet points in chat.

You only discuss these services:
1. Simple Integrations - from 3 600 NOK
2. Advanced Integrations - from 4 800 NOK
3. Vipps + Fiken Automation - from 8 000 NOK
4. CRM Setup - from 6 400 NOK
5. FAQ Chatbot - from 5 600 NOK
6. Smart AI Agent - from 9 600 NOK
7. Landing Page + Lead Flow - from 9 600 NOK
8. Booking System - from 5 500 NOK
9. Automated Reminders - from 3 200 NOK
10. Monthly Support - from 1 800 NOK/month

Key facts:
- All communication is written, no calls or video meetings
- Response within 24 hours on business days
- Norwegian market, Vipps and Fiken expertise
- Contact: kastaflow.studio@gmail.com
- Prices shown are starting prices, final quote depends on complexity

If asked about price: give the starting price and say "exact quote depends on your setup - fill out the form and we will assess your case."

If the user seems interested or asks how to start: suggest filling the contact form.

After 2-3 exchanges always end with: "Ready to move forward? Fill out our short form and we will get back to you within 24 hours."

Respond in the same language the user writes in (English or Norwegian Bokmal).

If asked about anything unrelated to automation or these services: politely redirect.`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    headers: {
      'Cache-Control': 'no-store',
    },
    ...init,
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured' }, { status: 500 });
  }

  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (message): message is ChatMessage =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0
      )
    : [];

  if (messages.length === 0) {
    return jsonResponse({ error: 'Invalid messages' }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: messages.map((message) => ({
            role: message.role === 'user' ? 'user' : 'model',
            parts: [{ text: message.content }],
          })),
        }),
      }
    );

    if (upstreamResponse.status === 429) {
      return jsonResponse({ error: 'rate_limit' }, { status: 429 });
    }

    if (!upstreamResponse.ok) {
      const upstreamError = await upstreamResponse.text().catch(() => '');
      console.error('[api/chat] Gemini error', upstreamResponse.status, upstreamError);
      return jsonResponse({ error: 'upstream_error' }, { status: 502 });
    }

    const data = await upstreamResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof reply !== 'string' || reply.trim().length === 0) {
      return jsonResponse({ error: 'empty_response' }, { status: 502 });
    }

    return jsonResponse({ reply });
  } catch (error) {
    console.error('[api/chat] Fetch failed', error);
    return jsonResponse({ error: 'internal_error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}
