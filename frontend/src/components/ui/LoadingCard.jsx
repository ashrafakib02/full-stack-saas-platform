export default function LoadingCard({ text = "Loading..." }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}