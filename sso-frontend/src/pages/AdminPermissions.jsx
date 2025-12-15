import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function AdminPermissions() {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para el formulario de creación
    const [formData, setFormData] = useState({
        name: '',
        module: '',
        description: ''
    });

    const navigate = useNavigate();

    // Cargar permisos al inicio
    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const res = await api.get('/Permissions');
            setPermissions(res.data);
        } catch (error) {
            console.error("Error cargando permisos", error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.module) return alert("Nombre y Módulo son obligatorios");

        try {
            // Enviamos los datos como query params para coincidir con el controlador simple
            // Nota: Si tu controlador espera [FromBody], cambia esto a un objeto JSON.
            // Para el ejemplo actual del controlador:
            await api.post(`/Permissions?name=${formData.name}&module=${formData.module}&description=${formData.description}`);
            
            alert("Permiso creado con éxito");
            setFormData({ name: '', module: '', description: '' }); // Limpiar form
            loadPermissions(); // Recargar tabla
        } catch (error) {
            console.error(error);
            alert("Error al crear permiso. Revisa si ya existe.");
        }
    };

    // Eliminar permiso
    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este permiso? Esto podría afectar a los roles que lo usan.")) return;
        
        try {
            await api.delete(`/Permissions/${id}`);
            loadPermissions();
        } catch (error) {
            alert("Error al eliminar permiso");
        }
    };

    if (loading) return <div className="p-8">Cargando catálogo...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Catálogo de Permisos</h1>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    ⬅ Volver
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4 text-blue-600">Nuevo Permiso</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre Técnico (Claim)</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Permissions.Reportes.Ver"
                                    className="mt-1 block w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Debe ser único.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Módulo</label>
                                <input 
                                    name="module"
                                    value={formData.module}
                                    onChange={handleChange}
                                    placeholder="Ej: Reportes"
                                    className="mt-1 block w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <input 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Ej: Permite ver los reportes mensuales"
                                    className="mt-1 block w-full border rounded p-2"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                                Guardar Permiso
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Lista de Permisos */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permiso</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Módulo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-3 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {permissions.map((perm) => (
                                    <tr key={perm.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {perm.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {perm.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {perm.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleDelete(perm.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}