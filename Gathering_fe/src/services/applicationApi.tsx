import { api } from '@/services/api';
import { AxiosError } from 'axios';

export const postApplication = async (projectId: number, position: string, message: string) => {
  try {
    const response = await api.post('/application', { projectId, position, message });

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
    const response = await api.get(`/application/received/project/${projectId}`);

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

export const getMyAllApplication = async (page: number, status: string) => {
  try {
    const response = await api.get(`/application/my?page=${page}&status=${status}`);

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

export const getMyApplication = async (projectId: number) => {
  try {
    const response = await api.get(`/application/my/project/${projectId}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('내 단일 지원서 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const patchApplication = async (applicationId: number, status: string) => {
  try {
    const response = await api.patch(`/application/${applicationId}/status?status=${status}`);

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
