import { ProfileInfo, WorkExperience } from '@/types/profile';
import { api } from './api';
import { AxiosError } from 'axios';

export const getMyProfile = async () => {
  try {
    const response = await api.get('/profile');

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error) {
    console.error('프로필 조회 API 요청 실패:', error);
    throw error;
  }
};

// export const getUserProfile = async (nickname: string) => {
//   try {
//     const encodedNickname = encodeURIComponent(nickname);
//     const response = await api.get(`/profile/nickname/${encodedNickname}`);

//     if (response.data.status === 200) {
//       console.log('getUserProfile API : ', response.data.data);
//       return { success: true, message: response.data.message, data: response.data.data };
//     }
//   } catch (error) {
//     console.error('다른 유저 프로필 조회 API 요청 실패:', error);
//     throw error;
//   }
// };

export const getUserProfile = async (nickname: string) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await api.get(`/profile/nickname/${encodedNickname}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }

    return { success: false, message: response.data.message };
  } catch (error: unknown) {
    const err = error as AxiosError;

    if (err.response?.status === 404) {
      return { success: false, message: '존재하지 않는 유저입니다.' };
    }

    console.error('다른 유저 프로필 조회 API 요청 실패:', error);
    throw error;
  }
};

export const setMyProfile = async (profileData: ProfileInfo, workExperiences: WorkExperience[]) => {
  try {
    const response = await api.put('/profile', { ...profileData, workExperiences });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('프로필 수정 API 요청 실패:', error);
    throw error;
  }
};

export const setMyNickname = async (nickname: string) => {
  try {
    const response = await api.put('/profile', { nickname });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('프로필 수정 API 요청 실패:', error);
    throw error;
  }
};

export const setMyProfileColor = async (profileColor: string) => {
  try {
    const response = await api.put('/profile', { profileColor });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('프로필 수정 API 요청 실패:', error);
    throw error;
  }
};

export const toggleProfileVisibility = async () => {
  try {
    const response = await api.put('/profile/visibility');

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('공개/비공개 변경 API 요청 실패:', error);
    throw error;
  }
};

export const uploadPortfolio = async (file: FormData) => {
  try {
    const response = await api.post('profile/portfolio', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('포트폴리오 업로드 API 요청 실패:', error);
    throw error;
  }
};

export const deletePortfolio = async () => {
  try {
    const response = await api.delete('profile/portfolio');

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('포트폴리오 삭제 API 요청 실패:', error);
    throw error;
  }
};
