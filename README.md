# Kasta Flow Studio

Marketing site and lead capture experience for Kasta Flow Studio, focused on automation services for Norwegian businesses.

## Purpose

This project powers the public-facing Kasta Flow Studio website, including:

- service positioning and case studies
- ROI calculator and support plans
- multilingual content (`en` and `no`)
- lead capture via form, voice input, and chat assistant

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- i18next / react-i18next
- Vercel serverless functions for chat and text punctuation helpers

## Local Development

Requirements:

- Node.js 18+
- npm

Commands:

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run build
npm run preview
npm run test
```

## Deployment

The project is configured for Vercel deployment.

- Frontend is built with `vite build`
- API endpoints live in `api/`
- Static brand assets live in `public/`

Before deploying, confirm that required environment variables are available in the target environment.

## Project Structure

```text
api/                    Serverless endpoints
public/                 Favicons, robots, social assets, static files
src/components/         Sections, widgets, shared UI, SEO
src/lib/                i18n and utilities
src/locales/            English and Norwegian copy
src/pages/              Route-level pages
```

## Branding Notes

- All public metadata, favicons, and social preview assets should reflect Kasta Flow Studio only.
- Avoid reintroducing Lovable boilerplate, placeholder copy, or generic Vite starter assets.
- Keep the visual language aligned with the existing monochrome Kasta Flow Studio brand system unless a redesign is intentional.

## Verification

For production-safe changes, validate with:

```bash
npm run build
```
