import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Importar api directo para el paso 2

export default function Login() {
    const [step, setStep] = useState(1); // 1: Credenciales, 2: Código 2FA
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useAuth(); // Este es el login normal del context
    const navigate = useNavigate();

    // Manejar Login Paso 1
    const handleSubmitCreds = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Intentamos loguear usando el contexto
            // OJO: Tendremos que modificar el context.login para que maneje la respuesta especial
            // O hacemos la llamada manual aquí:
            
            const response = await api.post('/Auth/login', { email, password: pass });
            
            if (response.data.token === "2FA_REQUIRED") {
                setStep(2); // Pedir código
            } else {
                // Login directo exitoso (guardar token manual o actualizar context)
                localStorage.setItem('token', response.data.token);
                window.location.href = "/dashboard"; // Recarga fuerte para que el context lea el token
            }
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setError('Error de conexión con el servidor (API no responde).');
            } else if (err.response.status === 401) {
                setError('Credenciales inválidas. Verifica tu correo y contraseña.');
            } else if (err.response.status === 500) {
                setError('Error interno del servidor. Por favor intenta más tarde.');
            } else {
                setError('Ocurrió un error inesperado.');
            }
        }
    };

    // Manejar Login Paso 2 (2FA)
    const handleSubmit2FA = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/Auth/login-2fa', { email, code });
            localStorage.setItem('token', response.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError('Código incorrecto');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    {step === 1 ? 'SSO Login' : 'Verificación 2FA'}
                </h2>
                
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">{error}</div>}
                
                {step === 1 ? (
                    <form onSubmit={handleSubmitCreds}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input type="email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input type="password" className="w-full p-2 border rounded" value={pass} onChange={e => setPass(e.target.value)} required />
                        </div>
                        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Ingresar</button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit2FA}>
                        <div className="mb-6 text-center">
                            <p className="text-sm text-gray-600 mb-4">Ingresa el código de Google Authenticator</p>
                            <input 
                                type="text" 
                                maxLength="6"
                                className="w-full p-2 border rounded text-center text-2xl tracking-widest" 
                                value={code} 
                                onChange={e => setCode(e.target.value)} 
                                autoFocus
                                required 
                            />
                        </div>
                        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Verificar</button>
                    </form>
                )}
            </div>
        </div>
    );
}

