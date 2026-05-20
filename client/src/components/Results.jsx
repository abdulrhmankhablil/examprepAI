import { BookOpenCheck, Brain, CheckCircle2, FileQuestion, GraduationCap, Sparkles } from 'lucide-react';

function Section({ title, icon: Icon, children }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-300/10 p-2 text-cyan-200"><Icon className="h-5 w-5" /></div>
        <h3 className="text-xl font-black text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function Results({ result }) {
  if (!result) return null;

  return (
    <div className="mt-10 space-y-6 result-scroll">
      <div className="glass rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">Generated study pack</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">{result.headline}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{result.confidenceNote}</p>
          </div>
          <div className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
            Mode: {result.mode === 'ai' ? 'AI' : 'Demo'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Summary" icon={BookOpenCheck}>
          <div className="space-y-5">
            {result.summary?.map((block, index) => (
              <div key={`${block.title}-${index}`}>
                <h4 className="font-bold text-cyan-100">{block.title}</h4>
                <ul className="mt-2 space-y-2 text-slate-300">
                  {block.points?.map((point, pointIndex) => <li key={pointIndex}>• {point}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Key terms" icon={Brain}>
          <div className="grid gap-3">
            {result.keyTerms?.slice(0, 8).map((item, index) => (
              <div key={`${item.term}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-bold text-white">{item.term}</p>
                <p className="mt-1 text-sm text-slate-300">{item.definition}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Multiple choice questions" icon={FileQuestion}>
        <div className="grid gap-4 md:grid-cols-2">
          {result.mcqQuestions?.map((question, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="font-semibold text-white">{index + 1}. {question.question}</p>
              <div className="mt-3 grid gap-2">
                {question.options?.map(option => (
                  <div key={option} className={`rounded-xl px-3 py-2 text-sm ${option === question.answer ? 'bg-cyan-300/15 text-cyan-100' : 'bg-white/5 text-slate-300'}`}>
                    {option}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-400"><strong className="text-cyan-100">Answer:</strong> {question.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Short questions" icon={CheckCircle2}>
          <div className="space-y-4">
            {result.shortQuestions?.map((question, index) => (
              <div key={index} className="rounded-2xl bg-white/5 p-4">
                <p className="font-semibold text-white">{question.question}</p>
                <p className="mt-2 text-sm text-slate-300">{question.answerGuide}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Long questions" icon={GraduationCap}>
          <div className="space-y-4">
            {result.longQuestions?.map((question, index) => (
              <div key={index} className="rounded-2xl bg-white/5 p-4">
                <p className="font-semibold text-white">{question.question}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {question.answerGuide?.map((point, pointIndex) => <li key={pointIndex}>• {point}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Study plan and critical thinking" icon={Sparkles}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-bold text-cyan-100">Study plan</h4>
            <ol className="mt-2 space-y-2 text-slate-300">
              {result.studyPlan?.map((point, index) => <li key={index}>{index + 1}. {point}</li>)}
            </ol>
          </div>
          <div>
            <h4 className="font-bold text-violet-100">Critical thinking prompts</h4>
            <ul className="mt-2 space-y-2 text-slate-300">
              {result.criticalThinking?.map((point, index) => <li key={index}>• {point}</li>)}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
