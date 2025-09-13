import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { notificationState, unreadCountState } from '@/recoil/notification';

const useNotificationSSE = (nickname: string) => {
  const setNotifications = useSetRecoilState(notificationState);
  const setUnreadCount = useSetRecoilState(unreadCountState);

  useEffect(() => {
    if (!nickname) return;

    const encodedNickname = encodeURIComponent(nickname);
    const sse = new EventSource(`/api/notification/subscribe?nickname=${encodedNickname}`);

    sse.onopen = () => {
      console.log('SSE 연결 성공!');
    };

    sse.onmessage = event => {
      const newNotification = JSON.parse(event.data);
      console.log('새로운 알림 도착:', newNotification);

      setNotifications(prev => [newNotification, ...prev]);

      setUnreadCount(prev => prev + 1);

      // 브라우저 알림 띄우기 등 추가 작업 가능
    };

    sse.onerror = error => {
      console.error('SSE 에러 발생:', error);
      sse.close();
    };

    return () => {
      sse.close();
      console.log('SSE 연결 종료.');
    };
  }, [nickname, setNotifications, setUnreadCount]);
};

export default useNotificationSSE;

// 사용 예시 (특정 페이지나 레이아웃 컴포넌트에서)
// const MyPage = () => {
//   const { nickname } = useUser(); // 현재 로그인한 유저 닉네임 가져오기
//   useNotificationSSE(nickname); // 훅을 호출하여 SSE 구독 시작
//   ...
// }
