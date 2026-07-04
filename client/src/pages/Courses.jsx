import { useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "../components/StateViews";
import useApiData from "../hooks/useApiData";
import { getCourses } from "../services/api";

export default function Courses() {
  const {
    data: courses,
    loading,
    error,
    refetch,
  } = useApiData(getCourses);

  const { searchTerm, setSearchTerm } = useSearch();

  const list = courses || [];

  // Get all columns dynamically
  const columns = useMemo(() => {
    if (list.length === 0) return [];

    const keys = new Set();

    list.forEach((row) => {
      Object.keys(row).forEach((key) => keys.add(key));
    });

    return Array.from(keys);
  }, [list]);

  // Search every column
  const filtered = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();

    if (!q) return list;

    return list.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [list, searchTerm]);

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle={`${filtered.length} course${
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading courses..." />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={refetch}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No courses found"
            message="No matching courses were found."
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
                {filtered.map((row, index) => (
                  <tr
                    key={row.course_id ?? index}
                    className="text-slate-600 hover:bg-brand-50/40"
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="whitespace-nowrap px-5 py-3"
                      >
                        {row[column] ?? "—"}
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