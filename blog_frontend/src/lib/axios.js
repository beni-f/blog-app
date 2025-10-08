import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://blog-app-mryd.onrender.com/api',
    withCredentials: true,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error))

export default axiosInstance;