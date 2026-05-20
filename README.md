# ExamPrep AI

A production-ready full-stack website that turns PDFs, scanned images, DOCX files, and notes into exam summaries and practice questions.

## What is included

- React + Vite frontend with professional responsive UI
- Tailwind CSS design system with 3D/glass AI styling
- Node.js + Express backend API
- File upload with Multer
- PDF text extraction with `pdf-parse`
- Image OCR with `tesseract.js`
- DOCX extraction with `mammoth`
- Optional OpenAI integration
- Demo fallback mode when no API key is configured
- Production build support

## Requirements

- Node.js 20 or newer
- npm
- Optional OpenAI API key for real AI generation

## Run locally

```bash
npm run install:all
cp .env.example server/.env
npm run dev
```

Then open:

```text
http://localhost:5173
```

The backend API runs on:

```text
http://localhost:5050
```

## Enable real AI analysis

Add your key in `server/.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Without an API key, the app still works in demo mode with deterministic summaries and questions.

## Production build

```bash
npm run install:all
cp .env.example server/.env
npm run build
npm start
```

Then open:

```text
http://localhost:5050
```

## API endpoint

`POST /api/analyze`

Form-data:

- `file`: PDF, PNG, JPG, WEBP, TXT, or DOCX

Response includes:

- summary sections
- key terms
- 5 MCQs
- 3 short questions
- 2 long questions
- study plan
- critical thinking prompts

## Suggested deployment

- Frontend + backend together: Render, Railway, Fly.io, or a VPS
- Frontend only: Vercel or Netlify with `VITE_API_BASE` pointing to the API server
- Backend: Node 20 runtime, environment variables configured securely

## Academic integrity note

ExamPrep AI is designed as a study assistant. Students should compare generated answers with the original material and use the questions for practice, not for cheating.
