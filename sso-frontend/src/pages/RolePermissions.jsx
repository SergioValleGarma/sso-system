import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function RolePermissions() {
    const { roleId } = useParams();
    const navigate = useNavigate();
    
    // Ahora guardamos objetos completos, no solo strings
    const [systemPermissions, setSystemPermissions] = useState([]); 
    const [rolePermissions, setRolePermissions] = useState([]); // Estos siguen ser strings (Claims)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Obtener catálogo desde BD
                const sysRes = await api.get('/Permissions'); 
                // 2. Obtener asignados
                const roleRes = await api.get(`/Roles/${roleId}/permissions`);
                
                setSystemPermissions(sysRes.data);
                setRolePermissions(roleRes.data);
            } catch (error) {
                console.error(error);
                alert("Error cargando datos");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roleId]);

    const handleToggle = (permName) => {
        if (rolePermissions.includes(permName)) {
            setRolePermissions(rolePermissions.filter(p => p !== permName));
        } else {
            setRolePermissions([...rolePermissions, permName]);
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/Roles/${roleId}/permissions`, rolePermissions);
            alert("Guardado correctamente");
            navigate('/admin/roles');
        } catch(e) { alert("Error guardando"); }
    };

    // Agrupar permisos por Módulo para la vista
    const groupedPermissions = systemPermissions.reduce((acc, perm) => {
        (acc[perm.module] = acc[perm.module] || []).push(perm);
        return acc;
    }, {});

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Configurar Permisos</h1>
            
            <div className="bg-white p-6 rounded shadow space-y-8">
                {Object.keys(groupedPermissions).map(module => (
                    <div key={module}>
                        <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4 uppercase tracking-wide">
                            Módulo: {module}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedPermissions[module].map(perm => (
                                <label key={perm.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer transition">
                                    <input 
                                        type="checkbox"
                                        checked={rolePermissions.includes(perm.name)}
                                        onChange={() => handleToggle(perm.name)}
                                        className="h-5 w-5 mt-1 text-blue-600 rounded"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{perm.name}</div>
                                        <div className="text-xs text-gray-500">{perm.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="mt-8 flex gap-4 pt-4 border-t">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
                        Guardar Cambios
                    </button>
                    <button onClick={() => navigate('/admin/roles')} className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
