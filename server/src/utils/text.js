const STOP_WORDS = new Set([
  'about','after','again','against','also','because','before','being','between','could','each','from','have','into','more','most','only','other','over','same','some','such','than','that','their','there','these','they','this','through','under','using','very','were','what','when','where','which','while','with','would','your','the','and','for','are','was','you','not','can','has','had','will','its','our','but','all','may','one','two','out','use','used','how','why','who'
]);

export function cleanText(input = '') {
  return String(input)
    .replace(/\u0000/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

export function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 30 && /[a-zA-Z]/.test(sentence));
}

export function chunkWords(text, size = 1400) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}

export function extractKeywords(text, limit = 10) {
  const counts = new Map();
  const words = cleanText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOP_WORDS.has(word));

  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function bestSentences(text, count = 6) {
  const keywords = extractKeywords(text, 12);
  const sentences = splitSentences(text);
  return sentences
    .map(sentence => {
      const lower = sentence.toLowerCase();
      const score = keywords.reduce((sum, keyword) => sum + (lower.includes(keyword) ? 1 : 0), 0) + Math.min(sentence.length / 240, 1);
      return { sentence, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.sentence);
}
