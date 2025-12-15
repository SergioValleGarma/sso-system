import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function AdminRoles() {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        const res = await api.get('/Roles');
        setRoles(res.data);
    };

    const handleCreate = async () => {
        if(!newRole) return;
        await api.post('/Roles', newRole, { headers: { 'Content-Type': 'application/json' } });
        setNewRole('');
        loadRoles();
    };

    const handleDelete = async (id) => {
        if(!confirm("¿Borrar rol?")) return;
        await api.delete(`/Roles/${id}`);
        loadRoles();
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Roles del Sistema</h1>
            
            {/* BOTÓN VOLVER AL DASHBOARD */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    ⬅ Volver al Dashboard
                </button>
            </div>
            
            <div className="flex gap-2 mb-6">
                <input 
                    className="border p-2 rounded"
                    placeholder="Nuevo Rol (ej: Vendedor)"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                />
                <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {roles.map(role => (
                    <div key={role.id} className="bg-white p-6 rounded shadow border border-gray-200">
                        <h3 className="font-bold text-xl mb-4">{role.name}</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigate(`/admin/roles/${role.id}/permissions`)}
                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Permisos
                            </button>
                            {role.name !== 'Admin' && (
                                <button 
                                    onClick={() => handleDelete(role.id)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
