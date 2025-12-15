import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout, hasPermission } = useAuth(); // Importamos hasPermission
    const [secretData, setSecretData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/Secure')
            .then(res => setSecretData(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Bienvenido, {user?.email}</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Cerrar Sesión
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4">Tu Perfil</h2>
                    <p><strong>Rol:</strong> <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">{user?.role}</span></p>
                    <p><strong>ID:</strong> {user?.id}</p>
                    
                    <div className="mt-6 flex flex-wrap gap-4">
                        
                        {/* BOTÓN BASADO EN PERMISO: Cualquiera con 'Permissions.Users.View' lo ve */}
                        {hasPermission('Permissions.Users.View') && (
                            <button 
                                onClick={() => navigate('/admin/users')}
                                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 font-bold flex items-center gap-2"
                            >
                                👥 Gestionar Usuarios
                            </button>
                        )}
                        
                        {/* ROLES Y PERMISOS: Usualmente reservado solo para el Admin global */}
                        {user?.role === 'Admin' && (
                            <>
                                <button 
                                    onClick={() => navigate('/admin/roles')}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 font-bold flex items-center gap-2"
                                >
                                    🛡️ Gestionar Roles
                                </button>

                                <button 
                                    onClick={() => navigate('/admin/permissions')}
                                    className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 font-bold flex items-center gap-2"
                                >
                                    🔑 Catálogo Permisos
                                </button>
                                <button onClick={() => navigate('/setup-2fa')} className="bg-gray-800 text-white px-4 py-2 rounded mt-4">
                                    🔐 Activar 2FA
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h2 className="text-xl font-bold mb-4">Datos del Servidor</h2>
                    {secretData ? (
                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(secretData, null, 2)}
                        </pre>
                    ) : (
                        <p>Cargando datos protegidos...</p>
                    )}
                </div>
            </div>
        </div>
    );
}