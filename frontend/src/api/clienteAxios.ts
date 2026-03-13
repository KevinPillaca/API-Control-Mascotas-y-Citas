import axios from 'axios';

const clienteAxios = axios.create({
    // El puerto que definimos en .env
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default clienteAxios;