import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classrooms from "./pages/Classrooms";
import Teachers from "./pages/Teachers";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/classrooms" element={<Classrooms />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}