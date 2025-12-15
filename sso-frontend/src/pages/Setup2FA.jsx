import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Setup2FA() {
    const [setupData, setSetupData] = useState(null);
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Pedir clave y URI al backend
        api.get('/Auth/2fa-setup')
            .then(res => setSetupData(res.data))
            .catch(err => alert("Error iniciando setup 2FA"));
    }, []);

    const handleEnable = async () => {
        try {
            await api.post('/Auth/2fa-enable', JSON.stringify(code), {
                headers: { 'Content-Type': 'application/json' }
            });
            alert("¡Seguridad activada! La próxima vez te pediremos este código.");
            navigate('/dashboard');
        } catch (error) {
            alert("Código incorrecto. Intenta de nuevo.");
        }
    };

    const handleDisable = async () => {
        if(!confirm("¿Seguro que quieres desactivar la protección 2FA? Tu cuenta será menos segura.")) return;
        try {
            await api.post('/Auth/2fa-disable');
            alert("2FA Desactivado.");
            navigate('/dashboard');
        } catch (error) {
            alert("Error al desactivar.");
        }
    };

    if (!setupData) return <div className="p-8">Cargando código QR...</div>;

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded shadow mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">Configurar Google Authenticator</h1>
            
            {setupData.isEnabled ? (
                <div className="mb-6 bg-green-100 text-green-800 p-3 rounded">
                    ✅ Tu 2FA está actualmente <strong>ACTIVADO</strong>.
                </div>
            ) : (
                <p className="mb-6 text-gray-600">
                    1. Descarga Google Authenticator en tu celular.<br/>
                    2. Escanea este código QR.<br/>
                    3. Ingresa el código de 6 dígitos abajo.
                </p>
            )}

            <div className="flex justify-center mb-6 border p-4 inline-block rounded">
                <QRCodeSVG value={setupData.qrCodeUri} size={200} />
            </div>

            <p className="text-xs text-gray-500 mb-4">Clave manual: {setupData.key}</p>

            <input 
                type="text" 
                maxLength="6"
                placeholder="123456"
                className="border p-2 rounded w-full text-center text-xl tracking-widest mb-4"
                value={code}
                onChange={e => setCode(e.target.value)}
            />

            <button 
                onClick={handleEnable}
                className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 mb-4"
            >
                {setupData.isEnabled ? "Actualizar/Reconfigurar 2FA" : "Verificar y Activar"}
            </button>

            {setupData.isEnabled && (
                <button 
                    onClick={handleDisable}
                    className="w-full bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
                >
                    Desactivar 2FA
                </button>
            )}
        </div>
    );
}
