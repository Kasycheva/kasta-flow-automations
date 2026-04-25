export const maxDuration = 30;

import { GoogleGenerativeAI } from '@google/generative-ai';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' }, ...init });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return jsonResponse({ error: 'API key not configured' }, { status: 500 });

  let body: { audio?: string; mimeType?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.audio) return jsonResponse({ text: '' });

  const langName = body.lang === 'nb-NO' ? 'Norwegian Bokmal' : 'English';
  const mimeType = body.mimeType || 'audio/webm';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { maxOutputTokens: 800, temperature: 0 },
    });

    const result = await model.generateContent([
      `Transcribe this voice message in ${langName}. Return only the spoken text. Do not translate.`,
      { inlineData: { data: body.audio, mimeType } },
    ]);

    return jsonResponse({ text: result.response.text().trim() });
  } catch (err) {
    console.error('[api/transcribe] error', err);
    return jsonResponse({ text: '' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS', 'Cache-Control': 'no-store' },
  });
}
