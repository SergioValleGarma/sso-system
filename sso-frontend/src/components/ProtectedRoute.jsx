import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;
    
    // 1. Verificar si está logueado
    if (!user) {
        return <Navigate to="/" />;
    }

    // 2. Verificar Rol (si se requiere)
    if (requiredRole && user.role !== requiredRole) {
        return <div className="p-8 text-center text-red-600 font-bold text-xl">
            ⛔ Acceso Denegado: Se requiere el rol {requiredRole}
        </div>;
    }

    // 3. Verificar Permiso (NUEVO)
    if (requiredPermission && !user.permissions.includes(requiredPermission)) {
        return <div className="p-8 text-center text-red-600 font-bold text-xl">
            ⛔ Acceso Denegado: No tienes el permiso requerido ({requiredPermission})
        </div>;
    }

    return children;
};