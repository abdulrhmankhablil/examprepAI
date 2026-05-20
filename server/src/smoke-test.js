import { analyzeStudyText } from './services/analyze.js';

const sample = `Finite automata are mathematical models of computation used to recognize regular languages. A deterministic finite automaton has a finite set of states, an input alphabet, a transition function, a start state, and accepting states. Regular expressions describe the same class of languages as finite automata. The pumping lemma is commonly used to prove that a language is not regular.`;

const result = await analyzeStudyText(sample, { filename: 'smoke-test.txt', mimeType: 'text/plain', extractionMethod: 'plain-text' });
if (!result.summary || !Array.isArray(result.mcqQuestions) || result.mcqQuestions.length === 0) {
  throw new Error('Smoke test failed: analysis result shape is invalid.');
}
console.log('Smoke test passed.');
