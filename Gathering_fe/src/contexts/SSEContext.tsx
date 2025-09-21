import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { notificationState, unreadCountState } from '@/recoil/notification';
import { cookies, refreshAccessToken } from '@/services/api';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useProfile } from '@/contexts/ProfileStateContext';

interface NotificationSSEContextType {
  connected: boolean;
}

const NotificationSSEContext = createContext<NotificationSSEContextType>({ connected: false });

export const NotificationSSEProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const setNotifications = useSetRecoilState(notificationState);
  const setUnreadCount = useSetRecoilState(unreadCountState);
  const [connected, setConnected] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const { myProfile } = useProfile();

  useEffect(() => {
    const nickname = myProfile?.nickname;
    const accessToken = cookies.get('accessToken');

    // 닉네임이 없거나(로그아웃 상태) 토큰이 없으면 연결 시도 안 함
    if (!nickname || !accessToken) {
      // 기존 연결이 있다면 종료
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
        setConnected(false);
        console.log('⛔ SSE 연결 해제 (로그아웃 또는 정보 없음)');
      }
      return;
    }
    if (controllerRef.current) return; // 이미 연결됨

    controllerRef.current = new AbortController();

    const handleBeforeUnload = () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        console.log('페이지 언로드 직전 SSE 연결 해제');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const connect = (token?: string) => {
      const tokenToUse = token ?? accessToken;
      const sseUrl = `${import.meta.env.VITE_BASE_URL}/api/notification/subscribe?nickname=${encodeURIComponent(
        nickname
      )}`;

      fetchEventSource(sseUrl, {
        signal: controllerRef.current!.signal,
        headers: {
          Authorization: `Bearer ${encodeURIComponent(tokenToUse)}`, // 안전하게 인코딩
          Accept: 'text/event-stream'
        },
        onopen: async res => {
          if (res.ok) {
            console.log('✅ SSE 연결됨');
            setConnected(true);
          }
        },
        onmessage: event => {
          try {
            const parsed = JSON.parse(event.data);
            setNotifications(prev => [parsed, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch {
            console.log('SSE 메시지:', event.data);
          }
        },
        onerror: err => {
          console.error('SSE 에러 발생:', err);
          setConnected(false);

          if (err instanceof Response && err.status === 401) {
            refreshAccessToken()
              .then(newToken => {
                if (newToken) {
                  controllerRef.current?.abort();
                  controllerRef.current = new AbortController();
                  connect(newToken);
                }
              })
              .catch(console.error);
          } else {
            setTimeout(() => {
              controllerRef.current?.abort();
              controllerRef.current = new AbortController();
              connect();
            }, 3000);
          }
        }
      });
    };

    connect();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // 메모리 누수 방지를 위해 리스너 제거

      if (controllerRef.current) {
        controllerRef.current.abort();
        setConnected(false);
        controllerRef.current = null;
        console.log('useEffect cleanup: SSE 연결 해제');
      }
    };
  }, [myProfile, setNotifications, setUnreadCount]);

  return (
    <NotificationSSEContext.Provider value={{ connected }}>
      {children}
    </NotificationSSEContext.Provider>
  );
};

export const useNotificationSSEContext = () => useContext(NotificationSSEContext);
