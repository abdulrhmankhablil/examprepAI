import { UploadCloud, FileText, Loader2 } from 'lucide-react';

export default function Dropzone({ file, setFile, onAnalyze, loading }) {
  const onDrop = event => {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <section className="glass relative overflow-hidden rounded-[2rem] p-6 md:p-8 shadow-violetGlow">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      <div
        onDrop={onDrop}
        onDragOver={event => event.preventDefault()}
        className="group rounded-[1.5rem] border border-dashed border-cyan-200/40 bg-slate-950/50 p-8 text-center transition hover:border-cyan-200/80 hover:bg-slate-900/70"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 shadow-glow">
          {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
        </div>
        <h2 className="mt-5 text-2xl font-black text-white">Upload study material</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Drop a PDF, scanned page, image, DOCX, or text file. ExamPrep AI extracts the text and produces a summary, definitions, MCQs, short questions, and long questions.
        </p>
        <label className="mt-6 inline-flex cursor-pointer items-center rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-glow transition hover:scale-[1.02]">
          Choose file
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx"
            onChange={event => setFile(event.target.files?.[0] || null)}
          />
        </label>
      </div>

      {file && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-cyan-200" />
            <div>
              <p className="font-semibold text-white">{file.name}</p>
              <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="rounded-full bg-violet-400 px-6 py-3 font-bold text-slate-950 shadow-violetGlow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Analyzing...' : 'Generate study pack'}
          </button>
        </div>
      )}
    </section>
  );
}
