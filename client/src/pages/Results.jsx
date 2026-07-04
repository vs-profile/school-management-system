import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import useApiData from '../hooks/useApiData';
import { getResults } from '../services/api';

export default function Results() {
  const { data: results, loading, error, refetch } = useApiData(getResults);
  const [query, setQuery] = useState('');

  const list = results || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.student_name?.toLowerCase().includes(q) ||
        r.course_name?.toLowerCase().includes(q) ||
        r.exam_name?.toLowerCase().includes(q)
    );
  }, [list, query]);

  return (
    <div>
      <PageHeader title="Results" subtitle={`${filtered.length} result${filtered.length === 1 ? '' : 's'} found`} />

      <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
        <div className="border-b border-slate-100 p-4">
          <div className="flex w-full max-w-xs items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student, course, exam..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading results…" />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="No results found" message="Exam results will appear here once available." />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Exam Name</th>
                  <th className="px-5 py-3">Marks</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r, i) => (
                  <tr key={r.exam_result_id ?? i} className="text-slate-600 hover:bg-brand-50/40">
                    <td className="px-5 py-3">{r.student_name ?? 'Unknown Student'}</td>
                    <td className="px-5 py-3">{r.course_name ?? '—'}</td>
                    <td className="px-5 py-3">{r.exam_name ?? '—'}</td>
                    <td className="px-5 py-3 font-medium text-slate-700">{r.marks ?? '—'}</td>
                    <td className="px-5 py-3">{r.grade ?? '—'}</td>
                    <td className="px-5 py-3"><Badge status={r.result_status ?? r.status ?? 'Unknown'} /></td>
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
