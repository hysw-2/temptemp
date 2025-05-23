import axios from 'axios'
import { apiServer } from '../config/api';

console.log('API 서버 URL:', apiServer);

const apiClient = axios.create({
    baseURL: apiServer,
})

apiClient.interceptors.request.use(config => {
    console.log('요청 URL:', config.baseURL + config.url);
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;