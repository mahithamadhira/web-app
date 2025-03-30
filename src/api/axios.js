import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: 'http://localhost:9001/api',
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
};

export const api = createAxiosInstance();