import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/services/authApi';
import { useToast } from '@/contexts/ToastContext';
import BeatLoader from 'react-spinners/BeatLoader';
import IntergrationModal from '@/components/IntergrationModal';
import LoginInModal from '@/components/LoginInModal';

const GoogleRedirectHandler: React.FC = () => {
  const nav = useNavigate();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const params = new URLSearchParams(window.location.hash.substring(1));
  const code = params.get('access_token');
  const didRunRef = useRef(false);

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    nav('/');
  };

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const handleGoogleLogin = async () => {
      if (code) {
        try {
          const result = await googleLogin(code);

          if (result?.code === 'AU010') {
            setIsModalOpen(true);
            document.body.style.overflow = 'hidden';
          } else if (result?.success) {
            localStorage.setItem(
              'toastMessage',
              JSON.stringify({
                message: '로그인 되었습니다.',
                isSuccess: true
              })
            );
            window.location.href = '/';
          } else {
            showToast('로그인에 실패했습니다.', false);
            nav('/', { replace: true });
          }
        } catch (error) {
          showToast('로그인 처리 중 오류가 발생했습니다.', false);
          nav('/', { replace: true });
        }
      } else {
        showToast('Google 인증 코드가 없습니다.', false);
        nav('/', { replace: true });
      }
    };

    handleGoogleLogin();
  }, [code, nav]);

  return (
    <div>
      <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
        <BeatLoader color="#3387E5" size={20} />
        <p className="mt-4 text-gray-700 font-semibold">로그인 중입니다...</p>
      </div>
      {isModalOpen && (
        <IntergrationModal closeModal={closeModal} onClick={() => setIsLoginModalOpen(true)} />
      )}
      {isLoginModalOpen && (
        <LoginInModal
          closeModal={() => setIsLoginModalOpen(false)}
          type="통합하기"
          formData={{ email: '', password: '' }}
          handleInputChange={() => {}}
          handleLogin={async () => {
            // 통합 처리 API 호출
            setIsLoginModalOpen(false);
            nav('/');
          }}
        />
      )}
    </div>
  );
};

export default GoogleRedirectHandler;
