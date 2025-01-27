import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import LogoutButton from '@/components/LogoutButton';

const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);
  const [cookies] = useCookies(['accessToken']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!cookies.accessToken);
  }, [cookies.accessToken]);

  return (
    <header>
      <Link to="/">Gathering</Link>

      <div>
        {isLoggedIn && <button onClick={() => navigate('/profile')}>프로필</button>}

        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <button onClick={() => setActiveModal('login')}>로그인</button>
        )}
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
