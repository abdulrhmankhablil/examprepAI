import OpenAI from 'openai';
import { bestSentences, chunkWords, cleanText, extractKeywords } from '../utils/text.js';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function analyzeStudyText(rawText, metadata = {}) {
  const text = cleanText(rawText);
  if (client) {
    try {
      return await analyzeWithOpenAI(text, metadata);
    } catch (error) {
      console.warn('OpenAI analysis failed, falling back to deterministic demo mode:', error.message);
    }
  }
  return demoAnalysis(text, metadata);
}

async function analyzeWithOpenAI(text, metadata) {
  const chunks = chunkWords(text, 1500).slice(0, 12);
  const compactInput = chunks.join('\n\n--- CHUNK BREAK ---\n\n');
  const prompt = `You are an academic tutor. Convert the uploaded study material into exam-ready learning output. Return strict JSON with this exact shape:\n{
  "mode": "ai",
  "headline": string,
  "summary": [{"title": string, "points": string[]}],
  "keyTerms": [{"term": string, "definition": string}],
  "mcqQuestions": [{"question": string, "options": string[], "answer": string, "explanation": string}],
  "shortQuestions": [{"question": string, "answerGuide": string}],
  "longQuestions": [{"question": string, "answerGuide": string[]}],
  "studyPlan": string[],
  "criticalThinking": string[],
  "confidenceNote": string
}\nRules: make exactly 5 MCQs with 4 options each, exactly 3 short questions, and exactly 2 long questions. Do not invent facts beyond the source material. If the source is incomplete, say so in confidenceNote.\n\nMetadata: ${JSON.stringify(metadata)}\n\nStudy material:\n${compactInput}`;

  const schema = {
    type: 'object',
    properties: {
      mode: { type: 'string' },
      headline: { type: 'string' },
      summary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            points: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['title', 'points']
        }
      },
      keyTerms: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            term: { type: 'string' },
            definition: { type: 'string' }
          },
          required: ['term', 'definition']
        }
      },
      mcqQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: {
              type: 'array',
              items: { type: 'string' }
            },
            answer: { type: 'string' },
            explanation: { type: 'string' }
          },
          required: ['question', 'options', 'answer', 'explanation']
        }
      },
      shortQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            answerGuide: { type: 'string' }
          },
          required: ['question', 'answerGuide']
        }
      },
      longQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            answerGuide: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['question', 'answerGuide']
        }
      },
      studyPlan: {
        type: 'array',
        items: { type: 'string' }
      },
      criticalThinking: {
        type: 'array',
        items: { type: 'string' }
      },
      confidenceNote: { type: 'string' }
    },
    required: [
      'mode',
      'headline',
      'summary',
      'keyTerms',
      'mcqQuestions',
      'shortQuestions',
      'longQuestions',
      'studyPlan',
      'criticalThinking',
      'confidenceNote'
    ]
  };

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.25,
    response_format: { type: 'json_schema', json_schema: schema },
    messages: [
      { role: 'system', content: 'You produce reliable academic study aids in valid JSON only.' },
      { role: 'user', content: prompt }
    ]
  });

  const parsed = response.output_parsed ?? JSON.parse(response.choices?.[0]?.message?.content || '{}');
  return normalizeResult({ ...parsed, mode: 'ai' });
}

function demoAnalysis(text, metadata) {
  const keywords = extractKeywords(text, 10);
  const sentences = bestSentences(text, 7);
  const topic = titleCase(keywords[0] || metadata.filename?.replace(/\.[^.]+$/, '') || 'Uploaded Material');
  const supporting = keywords.slice(1, 6).map(titleCase);

  return normalizeResult({
    mode: 'demo',
    headline: `Exam-ready review for ${topic}`,
    summary: [
      {
        title: 'Core ideas',
        points: sentences.slice(0, 4).map(trimPoint)
      },
      {
        title: 'Exam focus',
        points: [
          `Understand how ${topic.toLowerCase()} connects to ${supporting.slice(0, 3).join(', ') || 'the main concepts'}.`,
          'Practice explaining definitions in your own words before memorizing examples.',
          'Look for contrasts, limitations, formulas, and process steps because they often become exam questions.'
        ]
      }
    ],
    keyTerms: keywords.slice(0, 8).map(term => ({
      term: titleCase(term),
      definition: `Important concept detected in the uploaded material. Review every sentence where "${term}" appears and write a precise course-specific definition.`
    })),
    mcqQuestions: makeMcq(topic, supporting),
    shortQuestions: [
      { question: `Define ${topic} using the uploaded material.`, answerGuide: 'Give a precise definition, then add one example or property from the notes.' },
      { question: `List two important points connected to ${supporting[0] || topic}.`, answerGuide: 'Use the summary and explain why each point matters for the exam.' },
      { question: 'What part of this topic is most likely to confuse students?', answerGuide: 'Identify a difficult term, formula, or process and explain it in simple language.' }
    ],
    longQuestions: [
      { question: `Explain the main concept of ${topic} and connect it to the supporting ideas in the file.`, answerGuide: ['Start with a definition.', 'Discuss at least three supporting concepts.', 'End with an example or exam-style application.'] },
      { question: `Critically compare two ideas from the uploaded material.`, answerGuide: ['Choose two related terms.', 'Explain similarities and differences.', 'State when each idea is used and what mistakes to avoid.'] }
    ],
    studyPlan: [
      'Read the AI summary once for orientation.',
      'Answer the MCQs without looking at the answers.',
      'Write the short answers by hand to activate recall.',
      'Use the long questions as a final exam rehearsal.'
    ],
    criticalThinking: [
      'Turn every definition into an example and a counterexample.',
      'Ask why each step is necessary, not only what the step is.',
      'Check AI output against the original file before final studying.'
    ],
    confidenceNote: 'Demo mode is active because no OpenAI API key is configured. Add OPENAI_API_KEY to enable full AI analysis.'
  });
}

function makeMcq(topic, supporting) {
  const terms = [topic, ...supporting, 'Active recall', 'Exam focus'].filter(Boolean);
  return Array.from({ length: 5 }, (_, index) => {
    const correct = terms[index % terms.length];
    const options = uniqueOptions([
      correct,
      terms[(index + 1) % terms.length] || 'Only memorization',
      terms[(index + 2) % terms.length] || 'Random guessing',
      terms[(index + 3) % terms.length] || 'Unrelated detail'
    ]);
    return {
      question: `Which option is most central to understanding ${topic}?`,
      options,
      answer: correct,
      explanation: `${correct} appears as a key concept in the uploaded material and should be reviewed carefully.`
    };
  });
}

function normalizeResult(result) {
  return {
    mode: result.mode || 'demo',
    headline: result.headline || 'Exam-ready study output',
    summary: Array.isArray(result.summary) ? result.summary : [],
    keyTerms: Array.isArray(result.keyTerms) ? result.keyTerms : [],
    mcqQuestions: Array.isArray(result.mcqQuestions) ? result.mcqQuestions.slice(0, 5) : [],
    shortQuestions: Array.isArray(result.shortQuestions) ? result.shortQuestions.slice(0, 3) : [],
    longQuestions: Array.isArray(result.longQuestions) ? result.longQuestions.slice(0, 2) : [],
    studyPlan: Array.isArray(result.studyPlan) ? result.studyPlan : [],
    criticalThinking: Array.isArray(result.criticalThinking) ? result.criticalThinking : [],
    confidenceNote: result.confidenceNote || 'Review the generated output against your original source material.'
  };
}

function trimPoint(sentence) {
  return sentence.length > 220 ? `${sentence.slice(0, 217)}...` : sentence;
}

function titleCase(text) {
  return String(text)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function uniqueOptions(options) {
  const seen = new Set();
  const cleaned = [];
  for (const option of options) {
    if (!option || seen.has(option)) continue;
    cleaned.push(option);
    seen.add(option);
  }
  while (cleaned.length < 4) cleaned.push(`Related concept ${cleaned.length + 1}`);
  return cleaned.slice(0, 4);
}
