import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import useApiData from '../hooks/useApiData';
import { getExams } from '../services/api';
import { useSearch } from '../context/SearchContext';

export default function Exams() {
  const { data: exams, loading, error, refetch } = useApiData(getExams);

  const { searchQuery } = useSearch(); // ✅ FIXED (global search support)
  const [query, setQuery] = useState('');

  const list = Array.isArray(exams)
  ? exams
  : exams?.data || [];

  const filtered = useMemo(() => {
  const q = (query || '').trim().toLowerCase();

  if (!q) return list;

  return list.filter((e) => {
    return (
      (e.exam_name || '').toLowerCase().includes(q) ||
      (e.exam_type_name || '').toLowerCase().includes(q) ||
      String(e.exam_id || '').includes(q)
    );
  });
}, [list, query]);
  return (
    <div>
      <PageHeader
        title="Exams"
        subtitle={`${filtered.length} exam${filtered.length === 1 ? '' : 's'} found`}
      />

      <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100">

        {/* Search */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex w-full max-w-xs items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* States */}
        {loading && <LoadingState label="Loading exams…" />}

        {!loading && error && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No exams found"
            message="Exams will appear here once added to the database."
          />
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Exam ID</th>
                  <th className="px-5 py-3">Exam Name</th>
                  <th className="px-5 py-3">Exam Type</th>
                  <th className="px-5 py-3">Start Date</th>
                  <th className="px-5 py-3">End Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((e) => (
                  <tr key={e.exam_id} className="text-slate-600 hover:bg-brand-50/40">
                    <td className="px-5 py-3 font-medium text-slate-700">#{e.exam_id}</td>
                    <td className="px-5 py-3">{e.exam_name ?? '—'}</td>
                    <td className="px-5 py-3">{e.exam_type_name ?? '—'}</td>
                    <td className="px-5 py-3">{e.start_date ?? '—'}</td>
                    <td className="px-5 py-3">{e.end_date ?? '—'}</td>
                    <td className="px-5 py-3">
                      <Badge status={e.status ?? 'Unknown'} />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}