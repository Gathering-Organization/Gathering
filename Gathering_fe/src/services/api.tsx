import axios from 'axios';
import { Cookies } from 'react-cookie';

export const cookies = new Cookies();
const pendingRequests = new Map();

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // logout에서 refresh token 전달
    if (config.url && config.url.includes('/auth/logout') && refreshToken) {
      config.headers['Authorization'] = `${refreshToken}`;
    }

    // test에서 refresh token 전달
    if (config.url && config.url.includes('/auth/refresh') && refreshToken) {
      config.headers['Authorization'] = `${refreshToken}`;
    }

    const requestKey = `${config.url}&${config.method}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`;

    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller.abort();
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.data.code === 'AU006' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookies.get('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token이 없습니다.');
        }

        const refreshResponse = await api.post('/auth/refresh', null, {
          headers: { Authorization: `${refreshToken}` }
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'strict' });
        cookies.set('refreshToken', newRefreshToken, {
          path: '/',
          secure: true,
          sameSite: 'strict'
        });

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return await api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token을 이용한 토큰 재발급 실패:', refreshError);
        cookies.remove('accessToken', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
