// import { api } from '@/services/api';
// import { AxiosError } from 'axios';
// import { ApplyInfo } from '@/types/apply';

// export const setApply = async (applyInfo: ApplyInfo) => {
//   try {
//     console.log('보낼 데이터:', applyInfo);
//     const response = await api.post('/application', { ...applyInfo });

//     console.log('응답 데이터:', response.data);

//     if (response.data.status === 201) {
//       return { success: true, message: response.data.message };
//     }
//   } catch (error: unknown) {
//     console.error('지원서 제출 실패:', error);

//     if (error instanceof AxiosError) {
//       console.error('서버 응답:', error.response?.data);
//     }

//     throw error;
//   }
// };

// export const getMyApply = async (nickname: string) => {
//   try {
//     const response = await api.get(`/application/${nickname}`);

//     console.log('응답 데이터:', response.data);

//     if (response.data.status === 200) {
//       return { success: true, message: response.data.message, data: response.data.data };
//     }
//   } catch (error: unknown) {
//     console.error('내 지원서 조회 실패:', error);

//     if (error instanceof AxiosError) {
//       console.error('서버 응답:', error.response?.data);
//     }

//     throw error;
//   }
// };

// export const getProjectApply = async (projectId: number) => {
//   try {
//     const response = await api.get(`/application/project/${projectId}`);

//     console.log('응답 데이터:', response.data);

//     if (response.data.status === 200) {
//       return { success: true, message: response.data.message, data: response.data.data };
//     }
//   } catch (error: unknown) {
//     console.error('지원서 조회 실패:', error);

//     if (error instanceof AxiosError) {
//       console.error('서버 응답:', error.response?.data);
//     }

//     throw error;
//   }
// };
