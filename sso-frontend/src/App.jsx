import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import RolePermissions from './pages/RolePermissions';
import AdminPermissions from './pages/AdminPermissions';

import Setup2FA from './pages/Setup2FA'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          {/* CAMBIO: Ahora pide Permiso en lugar de Rol */}
          <Route path="/admin/users" element={
              <ProtectedRoute requiredPermission="Permissions.Users.View">
                  <AdminUsers />
              </ProtectedRoute>
          } />

          {/* Roles y Permisos siguen siendo solo para Admin */}
          <Route path="/admin/roles" element={
              <ProtectedRoute requiredRole="Admin"><AdminRoles /></ProtectedRoute>
          } />
          
          <Route path="/admin/roles/:roleId/permissions" element={
              <ProtectedRoute requiredRole="Admin"><RolePermissions /></ProtectedRoute>
          } />

          <Route path="/admin/permissions" element={
              <ProtectedRoute requiredRole="Admin"><AdminPermissions /></ProtectedRoute>
          } />
          <Route path="/setup-2fa" element={
            <ProtectedRoute><Setup2FA /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;