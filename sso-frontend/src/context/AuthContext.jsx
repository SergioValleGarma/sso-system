import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función auxiliar para decodificar y estructurar el usuario
    const decodeUser = (token) => {
        const decoded = jwtDecode(token);
        
        // El claim "Permission" puede venir como string (uno solo) o array (varios)
        let permissions = decoded["Permission"] || [];
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }

        return {
            id: decoded.uid,
            email: decoded.email,
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            permissions: permissions // <--- ¡AQUÍ GUARDAMOS LOS PERMISOS!
        };
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = decodeUser(token);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/Auth/login', { email, password });
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            setUser(decodeUser(token)); // Usamos la misma lógica
            return true;
        } catch (error) {
            console.error("Login fallido", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Helper para verificar permisos fácilmente en los componentes
    const hasPermission = (permissionName) => {
        if (!user) return false;
        // El Admin suele tener acceso a todo, pero es mejor ser explícito con permisos.
        // Si quieres que el Admin siempre pase: if (user.role === 'Admin') return true;
        return user.permissions.includes(permissionName);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);