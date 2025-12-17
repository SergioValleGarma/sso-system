import axios from 'axios';
const API_URL = window.env?.API_URL || 'https://localhost:7148/api';
// Asegúrate de que este puerto coincida con tu API .NET (revisa launchSettings.json)
//const API_URL = 'https://localhost:7148/api'; 
// O si vas a ejecutar el Backend TAMBIÉN en Docker
//const API_URL = 'http://localhost:5000/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Inyectar el Token automáticamente en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;