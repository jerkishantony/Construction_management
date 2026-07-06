import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import SettingsPage from "../pages/settings/SettingsPage";
import UsersPage from "../pages/users/UsersPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRouter() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* User Management */}
          <Route path="/users" element={<UsersPage />} />

          {/* Role Management */}
          <Route path="/roles" element={<h2>Roles Management</h2>} />

          {/* Permission Management */}
          <Route
            path="/permissions"
            element={<h2>Permissions Management</h2>}
          />

          {/* Menu Management */}
          <Route
            path="/menus"
            element={<h2>Menu Management</h2>}
          />

          {/* Settings */}
       <Route path="/settings" element={<SettingsPage />} />

          {/* Construction Modules */}
        <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/attendance"
            element={<h2>Attendance</h2>}
          />

          <Route
            path="/materials"
            element={<h2>Materials</h2>}
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRouter;