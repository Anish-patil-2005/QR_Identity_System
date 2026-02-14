import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import FacultyDashboard from './pages/FacultyDashboard';
import PublicFacultyProfile from './pages/PublicFacultyProfile'; // The new public page


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Admin Portal (Hidden from main nav) */}
          <Route path="/admin/portal" element={<AdminLogin />} />
          
          {/* Standard Login for Faculty */}
          <Route path="/login" element={<Login />} />

<Route path="/profile/:slug" element={<PublicFacultyProfile />} />
          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/faculty/profile" element={<FacultyDashboard />} />

          {/* Public Identity Resolver (The QR Scan Target) */}
          <Route path="/u/:slug" element={<div className="p-10 text-center text-lg">Resolving Profile...</div>} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;