import { Loader2, Inbox, AlertTriangle } from 'lucide-react';

export function LoadingState({ label = 'Loading data…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 className="animate-spin text-brand-500" size={28} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = 'No records were found.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Inbox size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong while loading data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Couldn't load this data</p>
        <p className="max-w-sm text-sm text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
