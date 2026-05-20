import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractTextFromFile } from './services/extractText.js';
import { analyzeStudyText } from './services/analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 5050);
const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 25);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '2mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set([
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);
    if (allowed.has(file.mimetype)) return cb(null, true);
    cb(new Error('Unsupported file type. Upload PDF, PNG, JPG, WEBP, TXT, or DOCX.'));
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ExamPrep AI API', mode: process.env.OPENAI_API_KEY ? 'ai' : 'demo' });
});

app.post('/api/analyze', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const extracted = await extractTextFromFile(req.file);
    if (!extracted.text || extracted.text.trim().length < 80) {
      res.status(422).json({
        error: 'The uploaded file did not contain enough readable text. Try a clearer scan or a digital PDF.'
      });
      return;
    }

    const result = await analyzeStudyText(extracted.text, {
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      extractionMethod: extracted.method
    });

    res.json({
      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        extractionMethod: extracted.method,
        characterCount: extracted.text.length
      },
      ...result
    });
  } catch (error) {
    next(error);
  }
});

// Serve the production React build when it exists.
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res, next) => {
  res.sendFile(path.join(clientDist, 'index.html'), err => {
    if (err) next();
  });
});

app.use((err, _req, res, _next) => {
  const status = err.message?.includes('Unsupported file type') ? 415 : 500;
  console.error(err);
  res.status(status).json({ error: err.message || 'Unexpected server error.' });
});

app.listen(port, () => {
  console.log(`ExamPrep AI API running on http://localhost:${port}`);
});
