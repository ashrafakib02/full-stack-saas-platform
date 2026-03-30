export default function BreakdownCard({ title, items, valueKey, formatLabel }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <div className="mt-4 space-y-3">
        {items?.length ? (
          items.map((item) => (
            <div
              key={item[valueKey]}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-700">
                {formatLabel ? formatLabel(item[valueKey]) : item[valueKey]}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {item._count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No data available</p>
        )}
      </div>
    </div>
  );
}