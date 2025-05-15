import axios from 'axios'
import { apiServer } from '../config/api';

const apiClient = axios.create({
    baseURL: apiServer,
})

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;