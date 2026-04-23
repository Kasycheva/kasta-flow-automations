export const maxDuration = 15;

import { GoogleGenerativeAI } from '@google/generative-ai';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' }, ...init });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return jsonResponse({ error: 'API key not configured' }, { status: 500 });

  let body: { text?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) return jsonResponse({ result: '' });

  const langName = body.lang === 'nb-NO' ? 'Norwegian Bokmål' : 'English';

  const prompt = `Add appropriate punctuation and capitalization to this voice-dictated ${langName} text.

Rules:
- Keep ALL original words exactly as they are — do not add, remove, or rephrase anything
- Only insert punctuation marks (periods, commas, question marks, exclamation points) and fix capitalization
- Return only the corrected text, nothing else

Text: ${text}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { maxOutputTokens: 500, temperature: 0.1 },
    });
    const result = await model.generateContent(prompt);
    const corrected = result.response.text().trim();
    return jsonResponse({ result: corrected || text });
  } catch (err) {
    console.error('[api/punctuate] error', err);
    return jsonResponse({ result: text }); // fallback: return original unchanged
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS', 'Cache-Control': 'no-store' },
  });
}
