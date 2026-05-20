export default function StatCard({ label, value, detail }) {
  return (
    <div className="glass rounded-3xl p-5 shadow-glow">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
  );
}
