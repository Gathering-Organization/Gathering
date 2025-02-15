import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <header className="px-24 pb-10">
      <div className="flex justify-between py-4 items-center">
        <img className="cursor-pointer" src={gatheringLogo} onClick={() => nav('/postHome')} />

        <section className="text-[18px] font-bold space-x-8">
          <button
            className="bordor-[#000000] border-solid rounded-[20px] border-2 px-4 py-1"
            onClick={onClickPostingButton}
          >
            모집글 작성하기
          </button>
          {isLoggedIn && <button onClick={() => nav('/profile')}>프로필</button>}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <button onClick={() => setActiveModal('login')}>로그인</button>
          )}
        </section>
      </div>

      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal(null)}
        onSignupClick={() => setActiveModal('signup')}
      />

      <SignupModal
        isOpen={activeModal === 'signup'}
        onClose={() => setActiveModal(null)}
        onLoginClick={() => setActiveModal('login')}
      />
    </header>
  );
};

export default Header;
