import { api } from '@/services/api';
import { AxiosError } from 'axios';

export const setInterest = async (projectId: number) => {
  try {
    const response = await api.post('/project/interest', { projectId });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('관심글 등록 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const getInterestList = async (nickname: string) => {
  try {
    const response = await api.get(`/project/interest/${nickname}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('관심글 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
