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

## GitHub build status

This repository now includes a GitHub Actions workflow at `.github/workflows/ci.yml` that installs dependencies for the root, client, and server, builds the frontend, and runs the server smoke test on every push or pull request to `main`.

## Suggested deployment

- Frontend + backend together: Render, Railway, Fly.io, or a VPS
- Frontend only: Vercel or Netlify with `VITE_API_BASE` pointing to the API server
- Backend: Node 20 runtime, environment variables configured securely

## Deploying to Render

This project is now ready for Render deployment using the included `render.yaml` and Docker support.

1. Create a Render account and connect your GitHub repository.
2. Render will use the `main` branch and the `render.yaml` settings.
3. Set the following environment variables in Render:
   - `OPENAI_API_KEY` (optional for AI mode)
   - `CLIENT_ORIGIN` (optional if you need custom CORS origins)
4. Deploy the service and use the URL Render provides.

If you want the app to be publicly accessible, use the Render service URL. It will serve the frontend and backend together from one host.

## Local Docker deployment

If you prefer to run the full app locally with Docker:

```bash
docker build -t examprep-ai .
docker run -p 5050:5050 examprep-ai
```

Then open:

```text
http://localhost:5050
```

## Academic integrity note

ExamPrep AI is designed as a study assistant. Students should compare generated answers with the original material and use the questions for practice, not for cheating.
