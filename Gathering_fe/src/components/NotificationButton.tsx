import { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { notificationState, unreadCountState } from '@/recoil/notification';
import { useProfile } from '@/contexts/ProfileStateContext';
import { useDropdown } from '@/contexts/DropdownContext';
import { getNotification, readNotification, readAllNotification } from '@/services/notificationApi';
import { NotificationType } from '@/types/notification';
import alarmIcon from '@/assets/otherIcons/Alarm.png';
import { useToast } from '@/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const NotificationButton: React.FC = () => {
  const { myProfile } = useProfile();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { activeDropdown, setActiveDropdown, registerRef } = useDropdown();

  const [notifications, setNotifications] = useRecoilState(notificationState);
  const [unreadCount, setUnreadCount] = useRecoilState(unreadCountState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    registerRef('notification', dropdownRef);
  }, [registerRef]);

  const isOpen = activeDropdown === 'notification';
  const nickname = myProfile?.nickname;

  const handleToggleDropdown = async () => {
    const nextState = !isOpen;
    setActiveDropdown(nextState ? 'notification' : null);

    if (nextState && nickname) {
      setIsLoading(true);
      try {
        const result = await getNotification(nickname);
        if (result?.success) {
          setNotifications(result.data);
          setUnreadCount(result.data.filter((n: NotificationType) => !n.read).length);
        }
      } catch (error) {
        showToast('알림 목록을 불러오는데 실패했습니다.', false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReadNotification = async (notificationId: number) => {
    if (!nickname) return;

    try {
      await readNotification(nickname, notificationId);
      setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, read: true } : n)));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      showToast('알림을 읽음 처리하는데 실패했습니다.', false);
    }
  };

  // 모든 알림 읽음 처리
  const handleReadAll = async () => {
    if (!nickname || unreadCount === 0) return;

    try {
      await readAllNotification(nickname);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast('모든 알림을 확인했습니다.', true);
    } catch (error) {
      showToast('알림을 처리하는 중 오류가 발생했습니다.', false);
    }
  };

  const handleNotificationClick = (item: NotificationType) => {
    if (!item.read) {
      handleReadNotification(item.id);
    }
    // API URL에서 게시글 ID를 추출
    try {
      const urlParts = item.relatedUrl.split('/');
      const postId = urlParts[urlParts.length - 1];

      if (postId) {
        navigate(`/viewPost/${postId}`);
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error('URL 파싱 실패:', error);
      showToast('연결된 페이지로 이동하는데 실패했습니다.', false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 bg-[#B4B4B4] rounded-full hover:bg-gray-400 focus:outline-none"
      >
        <img src={alarmIcon} alt="알림" className="h-7 w-7" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden animate-fadeDown">
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-bold text-gray-700">알림</h3>
            <button
              onClick={handleReadAll}
              className="text-sm text-blue-500 hover:underline disabled:text-gray-400"
              disabled={unreadCount === 0}
            >
              모두 읽음
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">불러오는 중...</div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 20).map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 border-b border-gray-100 flex items-start space-x-3 cursor-pointer ${!item.read ? 'bg-blue-50 cursor-pointer hover:bg-blue-100' : 'bg-white'}`}
                >
                  {!item.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  )}
                  <div className={`flex-grow ${item.read ? 'pl-5' : ''}`}>
                    <p className={`text-sm ${item.read ? 'text-gray-400' : 'text-gray-800'}`}>
                      {item.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">새로운 알림이 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
