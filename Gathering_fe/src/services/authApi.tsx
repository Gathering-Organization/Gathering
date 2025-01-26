import { LoginRequest, SignupRequest } from '@/types/auth';
import { api, cookies } from '@/services/api';

export const test = async () => {
  try {
    const response = await api.get('/test');

    if (response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('테스트 API 요청 실패:', error);
    throw error;
  }
};

export const signup = async (data: SignupRequest) => {
  try {
    const response = await api.post('/auth/signup', data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('회원가입 API 요청 실패:', error);
    throw error;
  }
};

export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post('/auth/login', data);

    if (response.data.status === 200) {
      const { accessToken, refreshToken } = response.data.data;

      cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'strict' });
      cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'strict' });

      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('로그인 API 요청 실패:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');

    if (response.data.status === 200) {
      cookies.remove('accessToken', { path: '/' });
      cookies.remove('refreshToken', { path: '/' });

      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('로그아웃 API 요청 실패:', error);
    throw error;
  }
};

export const googleLogin = async (accessToken: string) => {
  try {
    const response = await api.get(`/auth/login/google?accessToken=${accessToken}`);

    if (response.data.status === 200) {
      const { accessToken, refreshToken } = response.data.data;

      cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'strict' });
      cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'strict' });

      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('구글 로그인 API 요청 실패:', error);
    throw error;
  }
};
