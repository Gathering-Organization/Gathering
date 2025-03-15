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

  return (
    <header className="px-24 pb-10">
      <div className="flex justify-between py-4 items-center">
        <img className="cursor-pointer" src={gatheringLogo} onClick={() => nav('/')} />

        <section className="flex items-center text-[20px] font-bold space-x-4">
          <button
            className="bordor-[#000000] border-solid rounded-[20px] px-4 py-1 hover:bg-[#B4B4B4]/30"
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
    </header>
  );
};

export default Header;
