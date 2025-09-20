import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { notificationState, unreadCountState } from '@/recoil/notification';
import { cookies, refreshAccessToken } from '@/services/api';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const useNotificationSSE = (nickname: string) => {
  const setNotifications = useSetRecoilState(notificationState);
  const setUnreadCount = useSetRecoilState(unreadCountState);

  useEffect(() => {
    if (!nickname) return;

    let controller: AbortController | null = new AbortController();

    const connect = () => {
      // if (!cookies.get('accessToken')) return;

      const accessToken = cookies.get('accessToken');

      // 👇 디버깅을 위해 추가
      console.log('현재 액세스 토큰 값:', accessToken);
      console.log('액세스 토큰 타입:', typeof accessToken);

      if (!accessToken || typeof accessToken !== 'string') {
        console.error('유효하지 않은 액세스 토큰으로 SSE 연결을 시도하지 않습니다.');
        return;
      }

      const sseUrl = `${import.meta.env.VITE_BASE_URL}/api/notification/subscribe?nickname=${encodeURIComponent(nickname)}`;

      fetchEventSource(sseUrl, {
        signal: controller!.signal,
        // headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
        headers: { Authorization: `Bearer ${accessToken}` },
        onopen: async res => {
          if (res.ok) console.log('SSE 연결됨');
          else console.error('SSE 연결 실패', res.status);
        },
        onmessage: event => {
          try {
            const parsed = JSON.parse(event.data);

            // console.groupCollapsed(`새로운 실시간 알림 도착!`); // 그룹 시작 (기본적으로 접혀있음)
            // console.groupEnd(); // 그룹 끝
            setNotifications(prev => [parsed, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch {
            // console.log('SSE 일반 메시지:', event.data);
          }
        },
        // onerror: err => {
        //   console.error('SSE 에러', err);
        //   // 자동 재연결 시도됨
        // }
        onerror: err => {
          console.error('SSE 에러 발생:', err);

          if (err instanceof Response) {
            if (err.status === 401) {
              refreshAccessToken()
                .then(newAccessToken => {
                  if (newAccessToken) {
                    if (controller) controller.abort();
                    controller = new AbortController();
                    connect();
                  } else {
                    console.warn('새로운 액세스 토큰 없음 → 로그인 필요');
                  }
                })
                .catch(refreshErr => {
                  console.error('리프레시 토큰 갱신 실패:', refreshErr);
                });
            } else {
              console.error(`SSE 서버 응답 에러 (status: ${err.status})`);
              setTimeout(() => {
                if (controller) {
                  controller.abort();
                  controller = new AbortController();
                  connect();
                }
              }, 3000);
            }
          } else {
            console.error('SSE 네트워크/기타 오류:', err);
            setTimeout(() => {
              if (controller) {
                controller.abort();
                controller = new AbortController();
                connect();
              }
            }, 3000);
          }
        }
      });
    };

    connect();

    return () => {
      if (controller) {
        controller.abort();
        // console.log('SSE 연결 해제');
        controller = null;
      }
    };
  }, [nickname, setNotifications, setUnreadCount]);
};

export default useNotificationSSE;
