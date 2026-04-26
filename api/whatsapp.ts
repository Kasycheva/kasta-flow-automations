import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const number = process.env.WHATSAPP_NUMBER;
  if (!number) {
    res.status(503).send("Not configured");
    return;
  }
  res.redirect(302, `https://wa.me/${number}`);
}
