import { api } from '@/services/api';
import { PostingInfo } from '@/types/post';
import { AxiosError } from 'axios';

export const getNotification = async (nickname: string) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await api.get(`/notification?nickname=${encodedNickname}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('알림 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const getNotificationUnread = async (nickname: string) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await api.get(`/notification/unread-count?nickname=${encodedNickname}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('미확인 알림 개수 조회 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const readNotification = async (nickname: string, notificationId: number) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await api.patch(
      `/notification/${notificationId}/read?nickname=${encodedNickname}`
    );

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('알림 확인 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};

export const readAllNotification = async (nickname: string) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await api.patch(`/notification/read-all?nickname=${encodedNickname}`);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message, data: response.data.data };
    }
  } catch (error: unknown) {
    console.error('알림 확인 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
