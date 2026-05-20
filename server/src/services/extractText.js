import pdf from 'pdf-parse/lib/pdf-parse.js';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { cleanText } from '../utils/text.js';

export async function extractTextFromFile(file) {
  const { mimetype, buffer } = file;

  if (mimetype === 'application/pdf') {
    const data = await pdf(buffer);
    const text = cleanText(data.text || '');
    return { text, method: 'digital-pdf' };
  }

  if (mimetype.startsWith('image/')) {
    const result = await Tesseract.recognize(buffer, 'eng');
    const text = cleanText(result.data.text || '');
    return { text, method: 'ocr-image' };
  }

  if (mimetype === 'text/plain') {
    return { text: cleanText(buffer.toString('utf8')), method: 'plain-text' };
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer });
    return { text: cleanText(value || ''), method: 'docx' };
  }

  throw new Error('Unsupported file type.');
}
