import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

import { useSearch } from "../context/SearchContext";

export default function Navbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const { searchTerm, setSearchTerm } = useSearch();

  // Open Profile Page
  const handleProfile = () => {
    navigate("/profile");
    setProfileOpen(false);
  };

  // Open Settings Page
  const handleSettings = () => {
    navigate("/settings");
    setProfileOpen(false);
  };

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to sign out?"
    );

    if (confirmLogout) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }

    setProfileOpen(false);
  };

  // Notifications
  const handleNotification = () => {
    alert("No new notifications.");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/80 px-4 py-3.5 backdrop-blur-sm lg:px-6">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="hidden text-lg font-bold text-slate-800 sm:block">
          School Management System
        </h1>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-3">

        {/* Search */}
        <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 md:flex">
          <Search size={16} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Mobile Search */}
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotification}
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              A
            </div>

            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              Admin
            </span>

            <ChevronDown
              size={15}
              className={`hidden transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-200">

                <button
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={handleSettings}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <SettingsIcon size={16} />
                  Settings
                </button>

                <div className="my-2 border-t border-slate-200"></div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>

              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}