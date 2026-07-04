export default function SummaryCard({ title, value, icon: Icon, accent = 'brand', loading }) {
  const accentStyles = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 transition-shadow hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {loading ? (
            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-800">{value?.toLocaleString?.() ?? value}</p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentStyles[accent]}`}>
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
}
