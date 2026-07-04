import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  DoorOpen,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  Award,
  Settings,
  X,
  School
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/classrooms', label: 'Classrooms', icon: DoorOpen },
  { to: '/teachers', label: 'Teachers', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/exams', label: 'Exams', icon: FileText },
  { to: '/results', label: 'Results', icon: Award },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white ring-1 ring-slate-100 transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <School size={19} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-800">School Manager</p>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-brand-50 hover:text-brand-700'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-brand-50 p-3.5">
            <p className="text-xs font-semibold text-brand-700">Connected to MySQL</p>
            <p className="mt-0.5 text-xs text-brand-500">Live data from the `school` database</p>
          </div>
        </div>
      </aside>
    </>
  );
}
