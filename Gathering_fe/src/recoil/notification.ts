import { atom } from 'recoil';
import { NotificationType } from '@/types/notification';

/**
 * @description 전체 알림 목록을 담는 상태
 */
export const notificationState = atom<NotificationType[]>({
  key: 'notificationState',
  default: []
});

/**
 * @description 읽지 않은 알림의 개수를 담는 상태
 */
export const unreadCountState = atom<number>({
  key: 'unreadCountState',
  default: 0
});
