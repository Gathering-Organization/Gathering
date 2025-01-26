import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import LogoutButton from '@/components/LogoutButton';
import { test } from '@/services/authApi';

const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);
  const [cookies] = useCookies(['accessToken']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!cookies.accessToken);
  }, [cookies.accessToken]);

  const handleRefresh = async () => {
    try {
      const result = await test();

      if (result?.success) {
        alert('테스트 성공!');
      } else {
        alert(result?.message || '테스트에 실패했습니다.');
      }
    } catch {
      alert('테스트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton />
      ) : (
        <button onClick={() => setActiveModal('login')}>로그인</button>
      )}

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

      <button onClick={handleRefresh}>refresh 테스트 버튼</button>
    </div>
  );
};

export default Header;
