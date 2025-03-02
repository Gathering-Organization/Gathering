import { api } from '@/services/api';
import { AxiosError } from 'axios';
import { ApplyInfo } from '@/types/apply';

export const setApply = async (applyInfo: ApplyInfo) => {
  try {
    console.log('보낼 데이터:', applyInfo);
    const response = await api.post('/application', { ...applyInfo });

    console.log('응답 데이터:', response.data);

    if (response.data.status === 201) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('지원서 제출 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
