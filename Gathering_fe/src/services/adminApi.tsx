import { api } from '@/services/api';
import { AxiosError } from 'axios';

export const getMembersAdmin = async () => {
  try {
    const response = await api.get(`/admin/members`);

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

export const getPaginationAdmin = async (page: number, searchType: string, keyword: string) => {
  try {
    const keywordParam = encodeURIComponent(keyword);
    const response = await api.get(
      `/admin/project/pagination?page=${page}&sort=-createdAt&position=ALL&type=ALL&mode=ALL&searchType=${searchType}&keyword=${keywordParam}`
    );

    console.log('응답 데이터:', response.data.data);

    if (response.data.status === 200) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data.content,
        totalPages: response.data.data.totalPages,
        totalElements: response.data.data.totalElements
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

export const getMembersCountAdmin = async () => {
  try {
    const response = await api.get('/admin/members/count');
    console.log('응답 데이터:', response.data.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('회원수 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const patchRoleAdmin = async (memberId: number, newRole: string) => {
  try {
    const response = await api.patch(`/admin/members/${memberId}/role`, { newRole });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('멤버 역할 변경 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const deleteProjectAdmin = async (projectId: number) => {
  try {
    const response = await api.delete(`/admin/project/${projectId}`);

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('프로젝트 삭제 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
