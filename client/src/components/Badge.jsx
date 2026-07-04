const STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  present: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  passed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',

  inactive: 'bg-red-50 text-red-700 ring-red-600/20',
  absent: 'bg-red-50 text-red-700 ring-red-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  fail: 'bg-red-50 text-red-700 ring-red-600/20',

  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  late: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  excused: 'bg-amber-50 text-amber-700 ring-amber-600/20',

  unknown: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  default: 'bg-brand-50 text-brand-700 ring-brand-600/20'
};

export default function Badge({ status }) {
  const label = status === null || status === undefined || status === '' ? 'Unknown' : String(status);
  const key = label.toLowerCase();
  const style = STYLES[key] || STYLES.default;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {label}
    </span>
  );
}
