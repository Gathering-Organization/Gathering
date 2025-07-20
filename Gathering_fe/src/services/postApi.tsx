import { api } from '@/services/api';
import { PostingInfo } from '@/types/post';
import { AxiosError } from 'axios';

export const setPosting = async (postInfo: PostingInfo) => {
  try {
    const response = await api.post('/project', { ...postInfo });

    if (response.data.status === 201) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('모집글 작성 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
export const getAllPosting = async (
  page: number,
  sort: string,
  position: string,
  techStack: string[],
  type: string,
  mode: string,
  isClosed: boolean | string,
  searchType: string,
  keyword: string
) => {
  try {
    const techStackParam = encodeURIComponent(techStack.join(','));

    const response = await api.get(
      `/project/pagination?page=${page}&sort=${sort}&position=${position}&techStack=${techStackParam}&type=${type}&mode=${mode}&isClosed=${isClosed}&searchType=${searchType}&keyword=${keyword}`
    );

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
    console.error('전체 모집글 조회 실패:', error);
    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }
    throw error;
  }
};

export const getPartPosting = async (id: number) => {
  try {
    const response = await api.get(`/project/${id}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('모집글 상세 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const modifyPosting = async (id: number, postInfo: PostingInfo) => {
  try {
    const response = await api.put(`/project/${id}`, { ...postInfo });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('모집글 수정 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const deletePosting = async (id: number) => {
  try {
    const response = await api.delete(`/project/${id}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('모집글 삭제 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || '삭제 중 오류가 발생했습니다.'
      };
    }

    throw error;
  }
};

export const setPublic = async (projectId: number) => {
  try {
    const response = await api.put(`/project/toggle/isClosed/${projectId}`, { projectId });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('완료 여부 변경 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const getMyPosting = async (nickname: string, page: number, isClosed: boolean | string) => {
  try {
    const nicknameParam = encodeURIComponent(nickname);
    const response = await api.get(
      `/project/pagination/my-project?nickname=${nicknameParam}&page=${page}&isClosed=${isClosed}`
    );

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
    console.error('내 모집글 조회 실패:', error);
    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }
    throw error;
  }
};
