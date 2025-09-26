import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { DropdownProvider } from '@/contexts/DropdownContext';
import { useProfile } from '@/contexts/ProfileStateContext';
import { unreadCountState } from '@/recoil/notification';
import { useSetRecoilState } from 'recoil';
import { getNotificationUnread } from '@/services/notificationApi';

const Layout: React.FC = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/apply/view'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  const { myProfile } = useProfile();
  const nickname = myProfile?.nickname;
  const setUnreadCount = useSetRecoilState(unreadCountState);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!nickname) return;
    const fetchInitialUnreadCount = async () => {
      try {
        const result = await getNotificationUnread(nickname);
        if (result?.success) {
          setUnreadCount(result.data);
        }
      } catch (error) {
        console.error('초기 안 읽은 알림 개수 조회 실패', error);
      }
    };
    fetchInitialUnreadCount();
  }, [nickname, setUnreadCount]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DropdownProvider>
      <div className="flex flex-col min-h-screen select-none">
        {!shouldHideHeader ? <Header /> : <div className="h-[56px] sm:h-[64px] md:h-[72px]" />}
        <main
          className={`flex-grow ${!shouldHideHeader ? 'pt-[56px] sm:pt-[64px] md:pt-[72px]' : ''} 
        min-h-[calc(150vh-56px)] sm:min-h-[calc(150vh-64px)] md:min-h-[calc(150vh-72px)]`}
        >
          <Outlet />
        </main>
        <div className="pt-20 sm:pt-24 lg:pt-32" />
        <Footer />
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-[#3387E5] text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300"
            aria-label="맨 위로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </DropdownProvider>
  );
};

export default Layout;
