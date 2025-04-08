import { api } from '@/services/api';
import { AxiosError } from 'axios';

export const postApplication = async (projectId: number, position: string, message: string) => {
  try {
    const response = await api.post('/application', { projectId, position, message });

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

export const getOtherApplication = async (projectId: number) => {
  try {
    const response = await api.get(`/application/project/${projectId}`);

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('지원서 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const getMyApplication = async (nickname: string, page: number, status: string) => {
  try {
    const nicknameParam = encodeURIComponent(nickname);
    const response = await api.get(
      `/application/my-apply?nickname=${nicknameParam}&page=${page}&status=${status}`
    );
    console.log(
      '요청 API:',
      `/application/my-apply?nickname=${nicknameParam}&page=${page}&status=${status}`
    );

    console.log('응답 데이터:', response.data.data);

    if (response.data.status === 200) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data.content,
        pagination: {
          totalPages: response.data.data.totalPages,
          totalElements: response.data.data.totalElements,
          currentPage: response.data.data.number,
          pageSize: response.data.data.size
        }
      };
    }
  } catch (error: unknown) {
    console.error('내 지원서 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const patchApplication = async (applicationId: number, status: string) => {
  try {
    const response = await api.patch(`/application/${applicationId}/status?status=${status}`);

    console.log(`/application/${applicationId}/status`);
    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('승인/거절 여부 변경 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const deleteApplication = async (applicationId: number) => {
  try {
    const response = await api.delete(`/application/${applicationId}`);

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('지원서 삭제 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
