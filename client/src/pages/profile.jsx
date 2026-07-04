import { User, Mail, Phone, Shield, Calendar } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function Profile() {
  // Later you can replace this with logged-in user data
  const user = {
    name: "Admin",
    email: "admin@school.edu",
    phone: "9876543210",
    role: "Administrator",
    joined: "01 Jan 2024",
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information"
      />

      <div className="rounded-2xl bg-white shadow-card ring-1 ring-slate-100 p-8">

        <div className="flex items-center gap-6">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-600 text-4xl font-bold text-white">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {user.name}
            </h2>

            <p className="text-slate-500">
              {user.role}
            </p>
          </div>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <Mail className="text-brand-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <Phone className="text-brand-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <Shield className="text-brand-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <Calendar className="text-brand-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Joined</p>
                <p className="font-medium">{user.joined}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <button className="rounded-xl bg-brand-600 px-5 py-2 text-white hover:bg-brand-700">
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
}