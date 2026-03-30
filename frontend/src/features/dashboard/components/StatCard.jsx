export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
      {subtitle ? (
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}