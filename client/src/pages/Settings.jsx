import { Database, Server, Bell, Shield } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const SECTIONS = [
  {
    icon: Database,
    title: 'Database Connection',
    description: 'Connected to the "school" MySQL database via server/.env configuration.'
  },
  {
    icon: Server,
    title: 'API Server',
    description: 'Backend running at http://localhost:8000/api'
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Notification preferences will be configurable here in a future update.'
  },
  {
    icon: Shield,
    title: 'Access & Roles',
    description: 'Admin role management will be configurable here in a future update.'
  }
];

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={20} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
