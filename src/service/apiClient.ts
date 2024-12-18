import axios from 'axios';
import { refreshTokenApi2 } from './authService';
import { NavigateFunction } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_TEST_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

let navigate: NavigateFunction;

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // let refreshToken = localStorage.getItem('refreshToken');
        if (error.response.status === 401 && !originalRequest._retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;
                try {
                    // throw new Error('Token refresh failed');
                    const data = await refreshTokenApi2();
                    localStorage.setItem('token', data.accessToken);
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                    isRefreshing = false;
                    onRefreshed(data.accessToken);
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('refreshToken');
                    console.error('Refresh token has expired. Please log in again.');
                    // window.location.href = '/auth/sign-in';
                    return Promise.reject(refreshError);
                }
            } else {
                console.log('Waiting for refresh token');
                toast({
                    variant: "destructive",
                    duration: 3000,
                    title: "Your login session has expired.",
                    description: "Please log in again.",
                    className: 'bg-red-500 text-white',
                  });
                navigate('/auth/sign-in');
                return new Promise((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;