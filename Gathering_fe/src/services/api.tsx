// import axios from 'axios';
// import { Cookies } from 'react-cookie';

// export const cookies = new Cookies();
// const pendingRequests = new Map();

// export const api = axios.create({
//   baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// api.interceptors.request.use(
//   config => {
//     const accessToken = cookies.get('accessToken');
//     const refreshToken = cookies.get('refreshToken');

//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }

//     // logout에서 refresh token 전달
//     if (config.url && config.url.includes('/auth/logout') && refreshToken) {
//       config.headers['Authorization'] = `${refreshToken}`;
//     }

//     // test에서 refresh token 전달
//     if (config.url && config.url.includes('/auth/refresh') && refreshToken) {
//       config.headers['Authorization'] = `${refreshToken}`;
//     }

//     const requestKey = `${config.url}&${config.method}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`;

//     if (pendingRequests.has(requestKey)) {
//       const controller = pendingRequests.get(requestKey);
//       controller.abort();
//     }

//     const controller = new AbortController();
//     config.signal = controller.signal;
//     pendingRequests.set(requestKey, controller);

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response && error.response.data.code === 'AU006' && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = cookies.get('refreshToken');

//         if (!refreshToken) {
//           throw new Error('Refresh token이 없습니다.');
//         }

//         const refreshResponse = await api.post('/auth/refresh', null, {
//           headers: { Authorization: `${refreshToken}` }
//         });

//         const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

//         cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'strict' });
//         cookies.set('refreshToken', newRefreshToken, {
//           path: '/',
//           secure: true,
//           sameSite: 'strict'
//         });

//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         return await api(originalRequest);
//       } catch (refreshError) {
//         console.error('Refresh token을 이용한 토큰 재발급 실패:', refreshError);
//         cookies.remove('accessToken', { path: '/' });
//         cookies.remove('refreshToken', { path: '/' });

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const refreshToken = async (): Promise<string | null> => {
//   try {
//     const currentRefreshToken = cookies.get('refreshToken');
//     if (!currentRefreshToken) throw new Error('Refresh token이 없습니다.');

//     const refreshResponse = await api.post('/auth/refresh', null, {
//       headers: { Authorization: `${currentRefreshToken}` },
//     });

//     const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

//     cookies.set('accessToken', accessToken, { path: '/', /* ...options */ });
//     cookies.set('refreshToken', newRefreshToken, { path: '/', /* ...options */ });

//     return accessToken; // 새 액세스 토큰 반환
//   } catch (error) {
//     console.error('토큰 재발급 실패:', error);
//     cookies.remove('accessToken', { path: '/' });
//     cookies.remove('refreshToken', { path: '/' });
//     // 여기서 로그인 페이지로 리디렉션 등의 처리를 할 수 있다.
//     return null;
//   }
// };

// // 응답 인터셉터는 이 함수를 사용하도록 수정
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
//     if (error.response?.data.code === 'AU006' && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const newAccessToken = await refreshToken(); // 분리한 함수 호출
//       if (newAccessToken) {
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

import axios from 'axios';
import { Cookies } from 'react-cookie';

export const cookies = new Cookies();

let isRefreshing = false;
let failedQueue: ((token: string | Promise<unknown>) => void)[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom(Promise.reject(error));
    } else {
      prom(token as string);
    }
  });
  failedQueue = [];
};

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

    const url = config.url;

    // 1. '/auth/refresh' 요청 시 Refresh Token 사용
    if (url?.includes('/auth/refresh') && refreshToken) {
      config.headers['Authorization'] = refreshToken;
    }
    // 2. '/auth/logout' 요청 시에도 Refresh Token 사용 (서버 요구사항으로 추정)
    else if (url?.includes('/auth/logout') && refreshToken) {
      config.headers['Authorization'] = refreshToken;
    }
    // 3. 그 외 모든 API 요청에는 Access Token 사용
    else if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 실패한 요청이 '로그아웃'이나 '토큰 갱신'이었다면, 갱신 로직을 타지 않고 즉시 에러를 반환합니다.
    if (
      originalRequest.url?.includes('/auth/logout') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.data.code !== 'AU006' || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push(token => {
          if (typeof token === 'string') {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(api(originalRequest));
          } else {
            reject(token);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentRefreshToken = cookies.get('refreshToken');
      if (!currentRefreshToken) throw new Error('Refresh token이 없습니다.');

      const refreshResponse = await api.post('/auth/refresh', null, {
        headers: { Authorization: currentRefreshToken }
      });

      const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
      cookies.set('accessToken', accessToken, { path: '/' });
      cookies.set('refreshToken', newRefreshToken, { path: '/' });
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      cookies.remove('accessToken', { path: '/' });
      cookies.remove('refreshToken', { path: '/' });

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const currentRefreshToken = cookies.get('refreshToken');
    if (!currentRefreshToken) return null;

    const refreshResponse = await api.post('/auth/refresh', null, {
      headers: { Authorization: currentRefreshToken }
    });

    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
    cookies.set('accessToken', accessToken, { path: '/' });
    cookies.set('refreshToken', newRefreshToken, { path: '/' });

    return accessToken;
  } catch (err) {
    console.error('토큰 갱신 실패', err);
    cookies.remove('accessToken', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    window.location.href = '/login';
    return null;
  }
};
