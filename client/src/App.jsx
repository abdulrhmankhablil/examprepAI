import { useEffect, useState } from 'react';
import { BookOpen, Bot, Cpu, ShieldCheck, TimerReset, WandSparkles } from 'lucide-react';
import Dropzone from './components/Dropzone.jsx';
import Results from './components/Results.jsx';
import StatCard from './components/StatCard.jsx';
import { analyzeFile, healthCheck } from './lib/api.js';

const sampleResult = {
  mode: 'demo',
  headline: 'Try the app by uploading a file',
  summary: [{ title: 'What it creates', points: ['Professional exam summary', 'Key definitions and concepts', 'MCQs, short questions, and long questions'] }],
  keyTerms: [
    { term: 'Active Recall', definition: 'A study method that forces the brain to retrieve answers instead of passively reading.' },
    { term: 'OCR', definition: 'Technology that reads text from scanned images or photos.' },
    { term: 'Chunking', definition: 'Breaking large material into smaller parts before AI processing.' }
  ],
  mcqQuestions: [],
  shortQuestions: [],
  longQuestions: [],
  studyPlan: ['Upload your notes.', 'Generate questions.', 'Study with active recall.'],
  criticalThinking: ['Compare the AI output with the original file.'],
  confidenceNote: 'This preview is shown before upload.'
};

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiMode, setApiMode] = useState('checking');

  useEffect(() => {
    healthCheck()
      .then(data => setApiMode(data.mode || 'demo'))
      .catch(() => setApiMode('offline'));
  }, []);

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const payload = await analyzeFile(file);
      setResult(payload);
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6 md:px-10 lg:px-16">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15rem] left-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-glow">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xl font-black text-white">ExamPrep AI</p>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Study smart, not hard</p>
          </div>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
          API status: <span className="font-bold text-cyan-100">{apiMode}</span>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <WandSparkles className="h-4 w-4" /> AI-powered exam preparation platform
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] text-white md:text-7xl">
            Turn study files into exam-ready knowledge.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Upload PDFs, scanned pages, notes, or DOCX files. The app extracts the text, analyzes key ideas, and generates summaries plus practice questions for active recall.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#upload" className="rounded-full bg-cyan-300 px-7 py-3 font-black text-slate-950 shadow-glow transition hover:scale-[1.03]">Start studying</a>
            <a href="#features" className="rounded-full border border-white/15 bg-white/5 px-7 py-3 font-bold text-white transition hover:bg-white/10">View features</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl perspective-1000">
          <div className="glass video-frame relative overflow-hidden rounded-[2rem] p-5 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-violet-400/10" />
            <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                </div>
                <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">Live analysis</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                <div className="absolute left-0 right-0 top-0 h-14 bg-cyan-200/10 blur-xl animate-scan" />
                <div className="grid gap-4">
                  {['Upload PDF', 'OCR extraction', 'AI summary', 'Exam questions'].map((item, index) => (
                    <div key={item} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-100">{index + 1}</div>
                      <div className="flex-1">
                        <p className="font-bold text-white">{item}</p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${55 + index * 13}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto grid max-w-7xl gap-5 py-6 md:grid-cols-4">
        <StatCard label="Input" value="PDF + OCR" detail="Reads digital files and scanned images." />
        <StatCard label="Output" value="4 packs" detail="Summary, MCQ, short, and long questions." />
        <StatCard label="Method" value="Recall" detail="Built for practice, not passive reading." />
        <StatCard label="Safety" value="Review" detail="Students verify AI output with source notes." />
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 py-10 lg:grid-cols-2">
        {[
          { title: 'AI workflow video', src: '/videos/ai_pipeline.mp4', poster: '/videos/ai_pipeline_cover.jpg', text: 'Animated pipeline: upload, extraction, analysis, and generated study pack.' },
          { title: 'Website demo video', src: '/videos/website_demo.mp4', poster: '/videos/website_demo_cover.jpg', text: 'Professional 3D-style interface preview for the working prototype.' }
        ].map(video => (
          <div key={video.title} className="glass overflow-hidden rounded-[2rem] p-4">
            <video className="aspect-video w-full rounded-[1.4rem] border border-white/10 object-cover" src={video.src} poster={video.poster} autoPlay loop muted playsInline />
            <div className="p-3">
              <h3 className="text-xl font-black text-white">{video.title}</h3>
              <p className="mt-2 text-slate-300">{video.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="upload" className="relative z-10 mx-auto max-w-7xl py-12">
        <Dropzone file={file} setFile={setFile} onAnalyze={handleAnalyze} loading={loading} />
        {error && <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 p-4 text-rose-100">{error}</p>}
        <div id="results">
          <Results result={result || sampleResult} />
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 pb-20 lg:grid-cols-3">
        {[
          { icon: Cpu, title: 'Smart chunking', text: 'Large material is cleaned and split into manageable pieces before analysis.' },
          { icon: TimerReset, title: 'Faster revision', text: 'Students spend less time formatting notes and more time actually practicing.' },
          { icon: ShieldCheck, title: 'Academic integrity', text: 'The app is positioned as a learning assistant, not a cheating tool.' }
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass rounded-3xl p-6">
            <Icon className="h-9 w-9 text-cyan-200" />
            <h3 className="mt-4 text-xl font-black text-white">{title}</h3>
            <p className="mt-2 text-slate-300">{text}</p>
          </div>
        ))}
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/10 py-8 text-sm text-slate-400">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>ExamPrep AI - Intelligent Study Tool for Success</p>
          <p className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Built for students and academic revision</p>
        </div>
      </footer>
    </main>
  );
}
