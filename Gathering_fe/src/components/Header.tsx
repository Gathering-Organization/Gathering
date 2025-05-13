import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import LogoutButton from '@/components/LogoutButton';
import gatheringLogo from '/gathering_home.svg';

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
        <div className="px-24 ms-8 flex justify-between py-4 items-center">
          <img className="cursor-pointer" src={gatheringLogo} onClick={onLogoClick} />

          <section className="flex items-center text-[#3f3f3f] text-[20px] font-bold space-x-4">
            <button
              className="border-[#000000]/20 border-[1px] text-[16px] font-bold border-solid rounded-[20px] px-4 py-1 hover:bg-[#B4B4B4]/30"
              onClick={onClickPostingButton}
            >
              모집글 작성하기
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

        <SignupModal
          isOpen={activeModal === 'signup'}
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal('login')}
        />
      </div>
    </header>
  );
};

export default Header;
