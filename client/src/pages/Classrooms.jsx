import { useMemo, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { Eye, Users2, Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "../components/StateViews";

import useApiData from "../hooks/useApiData";
import { getClassrooms } from "../services/api";

export default function Classrooms() {
  const {
    data: classrooms,
    loading,
    error,
    refetch,
  } = useApiData(getClassrooms);

  const { searchTerm, setSearchTerm } = useSearch();

  const [selected, setSelected] = useState(null);

  const list = classrooms || [];

  const filtered = useMemo(() => {
  const q = (searchTerm || "").trim().toLowerCase();

  // Show all classrooms if search is empty
  if (!q) return list;

  return list.filter((classroom) => {
    return Object.values(classroom).some((value) => {
      if (value === null || value === undefined) return false;

      return String(value).toLowerCase().includes(q);
    });
  });
}, [list, searchTerm]);

  return (
    <div>
      <PageHeader
        title="Classrooms"
        subtitle={`${filtered.length} classroom${
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
              placeholder="Search classrooms..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading classrooms..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No classrooms found"
            message="Try another search."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Classroom ID</th>
                  <th className="px-5 py-3">Academic Year</th>
                  <th className="px-5 py-3">Grade ID</th>
                  <th className="px-5 py-3">Section</th>
                  <th className="px-5 py-3">Teacher ID</th>
                  <th className="px-5 py-3">Students</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Remarks</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => (
                  <tr
                    key={c.classroom_id}
                    className="text-slate-600 hover:bg-brand-50/40"
                  >
                    <td className="px-5 py-3 font-medium text-slate-700">
                      #{c.classroom_id}
                    </td>

                    <td className="px-5 py-3">{c.year ?? "—"}</td>

                    <td className="px-5 py-3">
                      {c.grade_id ?? "Not Assigned"}
                    </td>

                    <td className="px-5 py-3">
                      {c.section ?? "Not Assigned"}
                    </td>

                    <td className="px-5 py-3">
                      {c.teacher_id ?? "—"}
                    </td>

                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Users2 size={14} />
                        {c.total_students}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <Badge status={c.status ?? "Unknown"} />
                    </td>

                    <td className="max-w-[180px] truncate px-5 py-3">
                      {c.remarks || "—"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelected(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Classroom Details"
      >
        {selected && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <DetailRow
              label="Classroom ID"
              value={`#${selected.classroom_id}`}
            />

            <DetailRow
              label="Academic Year"
              value={selected.year}
            />

            <DetailRow
              label="Grade ID"
              value={selected.grade_id ?? "Not Assigned"}
            />

            <DetailRow
              label="Section"
              value={selected.section ?? "Not Assigned"}
            />

            <DetailRow
              label="Teacher ID"
              value={selected.teacher_id ?? "—"}
            />

            <DetailRow
              label="Total Students"
              value={selected.total_students}
            />

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </dt>

              <dd className="mt-1">
                <Badge status={selected.status ?? "Unknown"} />
              </dd>
            </div>

            <div className="col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Remarks
              </dt>

              <dd className="mt-1 text-slate-700">
                {selected.remarks || "—"}
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 text-slate-700">
        {value ?? "—"}
      </dd>
    </div>
  );
}