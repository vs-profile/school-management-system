import { Users, DoorOpen, GraduationCap, ClipboardCheck, FileText, Award } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SummaryCard from '../components/SummaryCard';
import Badge from '../components/Badge';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import useApiData from '../hooks/useApiData';
import { getDashboardData } from '../services/api';
import { useSearch } from "../context/SearchContext";

export default function Dashboard() {
  const { data, loading, error, refetch } = useApiData(getDashboardData);
  const { searchTerm } = useSearch();
  const totals = data?.totals || {};

const search = (searchTerm || "").toLowerCase();

const recentStudents = (data?.recentStudents || []).filter((student) => {
  if (!search) return true;

  return (
    (student.full_name ?? "").toLowerCase().includes(search) ||
    String(student.student_id ?? "").includes(search) ||
    String(student.grade_id ?? "").includes(search) ||
    (student.section ?? "").toLowerCase().includes(search) ||
    String(student.classroom_id ?? "").includes(search)
  );
});

const classroomOverview = (data?.classroomOverview || []).filter((room) => {
  if (!search) return true;

  return (
    String(room.classroom_id ?? "").includes(search) ||
    String(room.grade_id ?? "").includes(search) ||
    (room.section ?? "").toLowerCase().includes(search) ||
    String(room.year ?? "").includes(search)
  );
});

  const cards = [
    { title: 'Total Students', value: totals.totalStudents, icon: GraduationCap, accent: 'brand' },
    { title: 'Total Classrooms', value: totals.totalClassrooms, icon: DoorOpen, accent: 'sky' },
    { title: 'Total Teachers', value: totals.totalTeachers, icon: Users, accent: 'violet' },
    { title: 'Attendance Records', value: totals.totalAttendanceRecords, icon: ClipboardCheck, accent: 'emerald' },
    { title: 'Total Exams', value: totals.totalExams, icon: FileText, accent: 'amber' },
    { title: 'Total Results', value: totals.totalResults, icon: Award, accent: 'rose' }
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Live overview pulled from the school MySQL database" />

      {error && !loading && (
        <div className="mb-5">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((c) => (
              <SummaryCard key={c.title} {...c} loading={loading} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            {/* Recent students */}
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100 xl:col-span-3">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-slate-700">Recent Students</h3>
              </div>
              {loading ? (
                <LoadingState />
              ) : recentStudents.length === 0 ? (
                <EmptyState title="No students yet" message="Students will appear here once added." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3">Student ID</th>
                        <th className="px-5 py-3">Full Name</th>
                        <th className="px-5 py-3">Grade</th>
                        <th className="px-5 py-3">Section</th>
                        <th className="px-5 py-3">Classroom ID</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentStudents.map((s) => (
                        <tr key={s.student_id} className="text-slate-600 hover:bg-brand-50/40">
                          <td className="px-5 py-3 font-medium text-slate-700">#{s.student_id}</td>
                          <td className="px-5 py-3">{s.full_name}</td>
                          <td className="px-5 py-3">{s.grade_id ?? 'Not Assigned'}</td>
                          <td className="px-5 py-3">{s.section ?? 'Not Assigned'}</td>
                          <td className="px-5 py-3">{s.classroom_id ?? '—'}</td>
                          <td className="px-5 py-3">
                            <Badge status={s.classroom_status ?? 'Unknown'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Classroom overview */}
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100 xl:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-slate-700">Classroom Overview</h3>
              </div>
              {loading ? (
                <LoadingState />
              ) : classroomOverview.length === 0 ? (
                <EmptyState title="No classrooms yet" message="Classrooms will appear here once added." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Year</th>
                        <th className="px-5 py-3">Grade</th>
                        <th className="px-5 py-3">Section</th>
                        <th className="px-5 py-3">Students</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {classroomOverview.map((c) => (
                        <tr key={c.classroom_id} className="text-slate-600 hover:bg-brand-50/40">
                          <td className="px-5 py-3 font-medium text-slate-700">#{c.classroom_id}</td>
                          <td className="px-5 py-3">{c.year ?? '—'}</td>
                          <td className="px-5 py-3">{c.grade_id ?? 'Not Assigned'}</td>
                          <td className="px-5 py-3">{c.section ?? 'Not Assigned'}</td>
                          <td className="px-5 py-3">{c.total_students}</td>
                          <td className="px-5 py-3">
                            <Badge status={c.status ?? 'Unknown'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
