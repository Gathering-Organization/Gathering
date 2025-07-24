import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import LoginModal from '@/components/LoginModal';
import SignUpModal from '@/components/SignUpModal';
import LogoutButton from '@/components/LogoutButton';
import gatheringLogo from '/gathering_home.svg';
import writeLogo from '@/assets/otherIcons/post_edit_button.png';

const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);
  const [cookies] = useCookies(['accessToken']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nav = useNavigate();
  const onClickPostingButton = () => {
    nav('/posting');
  };

  useEffect(() => {
    setIsLoggedIn(!!cookies.accessToken);
  }, [cookies.accessToken]);

  const onLogoClick = () => {
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      nav('/');
    }
  };

  return (
    <header className="pb-10">
      <div className="z-[49] fixed top-0 left-0 w-full bg-white border-b border-b-[#E7E7E7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between py-4 items-center">
          <img
            className="cursor-pointer h-6 sm:h-8 md:h-10"
            src={gatheringLogo}
            onClick={onLogoClick}
          />

          <section className="flex items-center text-[#3f3f3f] text-base sm:text-lg font-bold space-x-2 sm:space-x-4">
            <button
              className="bg-[#3387E5] text-white font-bold border-solid rounded-[20px] 
                         transition-all ease-in-out duration-300 hover:scale-[1.02] will-change-transform focus:outline-none
                         flex items-center justify-center 
                         px-0.5 py-0.5 sm:px-1.5 sm:py-1.5 md:px-4 md:py-1.5"
              onClick={onClickPostingButton}
            >
              {/* 작은 화면 (md 브레이크포인트 미만)에서 표시될 이미지 아이콘 */}
              <span className="block md:hidden">
                <img src={writeLogo} alt="모집글 작성" className="h-7 w-7" />{' '}
                {/* SVG를 writeLogo 이미지로 대체 */}
              </span>
              {/* 중간 화면 (md 브레이크포인트 이상)에서 표시될 전체 텍스트 */}
              <span className="hidden md:block text-sm sm:text-base">모집글 작성하기</span>
            </button>
            {/* {isLoggedIn && <button onClick={() => nav('/profile')}>프로필</button>} */}
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <LoginModal
                isOpen={activeModal === 'login'}
                onClose={() => setActiveModal(null)}
                onSignupClick={() => setActiveModal('signup')}
              />
            )}
          </section>
        </div>

        <SignUpModal
          isOpen={activeModal === 'signup'}
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal('login')}
        />
      </div>
    </header>
  );
};

export default Header;
