import { api } from '@/services/api';
import { PostingInfo } from '@/types/post';
import { AxiosError } from 'axios';

export const setPosting = async (postInfo: PostingInfo) => {
  try {
    console.log('보낼 데이터:', postInfo);
    const response = await api.post('/project', { ...postInfo });

    console.log('응답 데이터:', response.data);

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

export const getAllPosting = async () => {
  try {
    const response = await api.get('/project');

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
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

    console.log('응답 데이터:', response.data);

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

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      console.log('모디파이:', response.data.data);
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

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('모집글 삭제 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const searchPosting = async (searchType: string, keyword: string) => {
  try {
    const encodedSearchType = encodeURIComponent(searchType);
    const encodedKeyword = encodeURIComponent(keyword);

    const response = await api.get(
      `/project/search?searchType=${encodedSearchType}&keyword=${encodedKeyword}`
    );

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('모집글 검색 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
