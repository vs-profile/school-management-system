import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row">
      <p className="text-sm text-slate-400">
        Showing <span className="font-medium text-slate-600">{start}-{end}</span> of{' '}
        <span className="font-medium text-slate-600">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="px-2 text-sm font-medium text-slate-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
