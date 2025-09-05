import { LoginRequest, SignupRequest } from '@/types/auth';
import { api, cookies } from '@/services/api';
import axios from 'axios';

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

export const certEmail = async (email: string) => {
  try {
    const encodedEmail = encodeURIComponent(email);

    const response = await api.post(`/verify/send?email=${encodedEmail}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('인증 메일 요청 실패:', error);
    throw error;
  }
};

export const certCode = async (email: string, code: string) => {
  try {
    const encodedEmail = encodeURIComponent(email);

    const response = await api.post(`/verify/code?email=${encodedEmail}&code=${code}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('인증 번호 확인 실패:', error);
    throw error;
  }
};

export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post('/auth/login', data);
    localStorage.setItem('rererer123e', JSON.stringify([data, response]));

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

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data.data;
      cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'strict' });
      cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'strict' });

      return { success: true, message: response.data.message, code: response.data.code };
    }
  } catch (error) {
    console.error('구글 로그인 API 요청 실패:', error);
    throw error;
  }
};

export const linkGoogle = async (data: LoginRequest) => {
  try {
    cookies.remove('accessToken', { path: '/' });

    const response = await api.post('/auth/link/google', data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('계정 통합 실패:', error);
    throw error;
  }
};
