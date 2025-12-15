import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para el formulario de nuevo usuario
    const [newUser, setNewUser] = useState({
        nombre: '', apellido: '', email: '', password: '', role: 'User'
    });

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                api.get('/Users'),
                api.get('/Users/roles')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error("Error cargando datos", error);
            // Si falla por 403 Forbidden, redirigir o avisar
            if (error.response && error.response.status === 403) {
                alert("No tienes permisos para ver esta lista.");
                navigate('/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Manejar inputs del formulario
    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // CREAR USUARIO
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/Users/create', newUser);
            alert("Usuario creado con éxito");
            setNewUser({ nombre: '', apellido: '', email: '', password: '', role: 'User' }); // Limpiar
            fetchData(); // Recargar lista
        } catch (error) {
            if (error.response?.status === 403) alert("No tienes permiso para CREAR usuarios.");
            else alert("Error al crear usuario: " + (error.response?.data || "Error desconocido"));
        }
    };

    // ELIMINAR USUARIO
    const handleDeleteUser = async (userId) => {
        if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;
        try {
            await api.delete(`/Users/${userId}`);
            fetchData();
        } catch (error) {
            if (error.response?.status === 403) alert("No tienes permiso para ELIMINAR usuarios.");
            else alert("Error al eliminar usuario");
        }
    };

    // ACTUALIZAR ROL (Ya existente)
    const handleRoleChange = async (userId, newRole) => {
        const originalUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, roles: [newRole] } : u));
        try {
            await api.post('/Users/update-role', { userId, roleName: newRole });
        } catch (error) {
            if (error.response?.status === 403) alert("No tienes permiso para EDITAR roles.");
            else alert("Error al actualizar el rol");
            setUsers(originalUsers);
        }
    };

    if (loading) return <div className="p-8">Cargando panel...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button onClick={() => navigate('/dashboard')} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    ⬅ Volver al Dashboard
                </button>
            </div>

            {/* FORMULARIO DE CREACIÓN */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold mb-4 text-blue-600">Registrar Nuevo Usuario</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <input name="nombre" placeholder="Nombre" value={newUser.nombre} onChange={handleInputChange} className="border p-2 rounded" required />
                    <input name="apellido" placeholder="Apellido" value={newUser.apellido} onChange={handleInputChange} className="border p-2 rounded" required />
                    <input name="email" type="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} className="border p-2 rounded" required />
                    <input name="password" type="password" placeholder="Contraseña" value={newUser.password} onChange={handleInputChange} className="border p-2 rounded" required />
                    <select name="role" value={newUser.role} onChange={handleInputChange} className="border p-2 rounded">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button type="submit" className="md:col-span-5 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
                        + Crear Usuario
                    </button>
                </form>
            </div>
            
            {/* TABLA DE USUARIOS */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Rol Actual</th>
                            <th className="py-3 px-4 text-left">Cambiar Rol</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">{u.email}</td>
                                <td className="py-3 px-4">{u.nombre} {u.apellido}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded text-xs text-white bg-blue-500">
                                        {u.roles[0] || 'Sin Rol'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <select 
                                        className="border rounded p-1 text-sm bg-white"
                                        value={u.roles[0] || ''}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                        title="Eliminar usuario"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
