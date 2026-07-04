import { useMemo } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "../components/StateViews";
import useApiData from "../hooks/useApiData";
import { getAttendance } from "../services/api";

export default function Attendance() {
  const {
    data: attendance,
    loading,
    error,
    refetch,
  } = useApiData(getAttendance);

  const { searchTerm, setSearchTerm } = useSearch();

  const list = attendance || [];

  // Search all columns
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

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
        title="Attendance"
        subtitle={`${filtered.length} record${
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
              placeholder="Search attendance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading attendance..." />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={refetch}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No attendance records found"
            message="No matching attendance records were found."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Attendance ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Remarks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => (
                  <tr
                    key={row.attendance_id}
                    className="text-slate-600 hover:bg-brand-50/40"
                  >
                    <td className="px-5 py-3 font-medium text-slate-700">
                      #{row.attendance_id}
                    </td>

                    <td className="px-5 py-3">
                      {row.date ?? "—"}
                    </td>

                    <td className="px-5 py-3">
                      {row.student_name ?? "Unknown Student"}
                    </td>

                    <td className="px-5 py-3">
                      {row.course_name ?? "—"}
                    </td>

                    <td className="px-5 py-3">
                      <Badge status={row.status ?? "Unknown"} />
                    </td>

                    <td className="max-w-[220px] truncate px-5 py-3">
                      {row.remarks || "—"}
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