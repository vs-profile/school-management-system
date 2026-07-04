import { useMemo } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import PageHeader from "../components/PageHeader";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "../components/StateViews";
import useApiData from "../hooks/useApiData";
import { getTeachers } from "../services/api";

export default function Teachers() {
  const {
    data: teachers,
    loading,
    error,
    refetch,
  } = useApiData(getTeachers);

  const { searchTerm, setSearchTerm } = useSearch();

  const list = teachers || [];

  // Get all table columns dynamically
  const columns = useMemo(() => {
    if (!list.length) return [];

    const keys = new Set();

    list.forEach((teacher) => {
      Object.keys(teacher).forEach((key) => keys.add(key));
    });

    return Array.from(keys);
  }, [list]);

  // Search across EVERY column
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return list;

    return list.filter((teacher) =>
      columns.some((column) =>
        String(teacher[column] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [list, columns, searchTerm]);

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle={`${filtered.length} teacher${
          filtered.length === 1 ? "" : "s"
        } found`}
      />

      <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100">

        {/* Search Bar */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100 sm:max-w-xs">
            <Search size={16} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading teachers..." />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={refetch}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No teachers found"
            message="Try another search."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-5 py-3"
                    >
                      {column.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((teacher, index) => (
                  <tr
                    key={teacher.teacher_id ?? index}
                    className="text-slate-600 hover:bg-brand-50/40"
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="whitespace-nowrap px-5 py-3"
                      >
                        {teacher[column] ?? "—"}
                      </td>
                    ))}
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