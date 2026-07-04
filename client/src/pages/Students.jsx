    import { useMemo, useState } from 'react';
    import { useSearch } from '../context/SearchContext';
    import { Search, Plus, Eye, Pencil, Trash2, X as XIcon } from 'lucide-react';
    import PageHeader from '../components/PageHeader';
    import Badge from '../components/Badge';
    import Modal from '../components/Modal';
    import Pagination from '../components/Pagination';
    import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
    import useApiData from '../hooks/useApiData';
    import { getStudents } from '../services/api';

    const PAGE_SIZE = 10;

    export default function Students() {
      const { data: students, loading, error, refetch } = useApiData(getStudents);
      const { searchTerm, setSearchTerm } = useSearch();
      const [gradeFilter, setGradeFilter] = useState('all');
      const [sectionFilter, setSectionFilter] = useState('all');
      const [page, setPage] = useState(1);
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [deleteTarget, setDeleteTarget] = useState(null);

      const list = students || [];

      const grades = useMemo(
        () => Array.from(new Set(list.map((s) => s.grade_id).filter((v) => v !== null && v !== undefined))).sort(),
        [list]
      );
      const sections = useMemo(
        () => Array.from(new Set(list.map((s) => s.section).filter((v) => v !== null && v !== undefined))).sort(),
        [list]
      );

const filtered = useMemo(() => {
  const q = searchTerm.trim().toLowerCase();

  return list.filter((s) => {
    const words = [
      String(s.student_id ?? ""),
      String(s.classroom_id ?? ""),
      String(s.grade_id ?? ""),
      String(s.section ?? ""),
      String(s.year ?? ""),
      String(s.fname ?? ""),
      String(s.lname ?? ""),
      String(s.full_name ?? ""),
    ];

    const matchesQuery =
      q === "" ||
      words.some((word) => word.toLowerCase().startsWith(q));

    const matchesGrade =
      gradeFilter === "all" ||
      String(s.grade_id) === String(gradeFilter);

    const matchesSection =
      sectionFilter === "all" ||
      String(s.section) === String(sectionFilter);

    return matchesQuery && matchesGrade && matchesSection;
  });
}, [list, searchTerm, gradeFilter, sectionFilter]);

      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

      function resetPageAnd(setter) {
        return (val) => {
          setter(val);
          setPage(1);
        };
      }

      return (
        <div>
          <PageHeader
            title="Students"
            subtitle={`${filtered.length} student${filtered.length === 1 ? '' : 's'} found`}
            actions={
              <button
                onClick={() => alert('Add Student form is not wired to the backend yet.')}
                className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
              >
                <Plus size={16} /> Add Student
              </button>
            }
          />

          <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100 sm:max-w-xs">
                <Search size={16} className="text-slate-400" />
              <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search students..."
    className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
  />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={gradeFilter}
                  onChange={(e) => resetPageAnd(setGradeFilter)(e.target.value)}
                  className="rounded-xl border-0 bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-100 focus:outline-none focus:ring-brand-300"
                >
                  <option value="all">All Grades</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>

                <select
                  value={sectionFilter}
                  onChange={(e) => resetPageAnd(setSectionFilter)(e.target.value)}
                  className="rounded-xl border-0 bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-100 focus:outline-none focus:ring-brand-300"
                >
                  <option value="all">All Sections</option>
                  {sections.map((s) => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading && <LoadingState label="Loading students…" />}
            {!loading && error && <ErrorState message={error} onRetry={refetch} />}
            {!loading && !error && filtered.length === 0 && (
              <EmptyState title="No students found" message="Try adjusting your search or filters." />
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-3">Student ID</th>
                      <th className="px-5 py-3">First Name</th>
                      <th className="px-5 py-3">Last Name</th>
                      <th className="px-5 py-3">Full Name</th>
                      <th className="px-5 py-3">Classroom ID</th>
                      <th className="px-5 py-3">Grade</th>
                      <th className="px-5 py-3">Section</th>
                      <th className="px-5 py-3">Year</th>
                      <th className="px-5 py-3">Classroom Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pageItems.map((s) => (
                      <tr key={s.student_id} className="text-slate-600 hover:bg-brand-50/40">
                        <td className="px-5 py-3 font-medium text-slate-700">#{s.student_id}</td>
                        <td className="px-5 py-3">{s.fname}</td>
                        <td className="px-5 py-3">{s.lname}</td>
                        <td className="px-5 py-3">{s.full_name}</td>
                        <td className="px-5 py-3">{s.classroom_id ?? '—'}</td>
                        <td className="px-5 py-3">{s.grade_id ?? 'Not Assigned'}</td>
                        <td className="px-5 py-3">{s.section ?? 'Not Assigned'}</td>
                        <td className="px-5 py-3">{s.year ?? '—'}</td>
                        <td className="px-5 py-3">
                          <Badge status={s.classroom_status ?? 'Unknown'} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                              aria-label="View student"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => alert('Edit Student form is not wired to the backend yet.')}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                              aria-label="Edit student"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(s)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete student"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>

        {/* View student modal */}
        <Modal
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Details"
        >
          {selectedStudent && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <DetailRow label="Student ID" value={`#${selectedStudent.student_id}`} />
              <DetailRow label="Full Name" value={selectedStudent.full_name} />
              <DetailRow label="First Name" value={selectedStudent.fname} />
              <DetailRow label="Last Name" value={selectedStudent.lname} />
              <DetailRow label="Classroom ID" value={selectedStudent.classroom_id ?? '—'} />
              <DetailRow label="Year" value={selectedStudent.year ?? '—'} />
              <DetailRow label="Grade" value={selectedStudent.grade_id ?? 'Not Assigned'} />
              <DetailRow label="Section" value={selectedStudent.section ?? 'Not Assigned'} />
              <DetailRow label="Teacher ID" value={selectedStudent.teacher_id ?? '—'} />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Classroom Status</dt>
                <dd className="mt-1"><Badge status={selectedStudent.classroom_status ?? 'Unknown'} /></dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Remarks</dt>
                <dd className="mt-1 text-slate-700">{selectedStudent.remarks || '—'}</dd>
              </div>
            </dl>
          )}
        </Modal>

        {/* Delete confirmation modal */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Student"
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Delete endpoint is not implemented on the backend yet.');
                  setDeleteTarget(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          }
        >
          {deleteTarget && (
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{deleteTarget.full_name}</span> (#{deleteTarget.student_id})? This action cannot be undone.
            </p>
          )}
        </Modal>
      </div>
    );
  }

  function DetailRow({ label, value }) {
    return (
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="mt-1 text-slate-700">{value ?? '—'}</dd>
      </div>
    );
  }
