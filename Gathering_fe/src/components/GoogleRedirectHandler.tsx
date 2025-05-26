import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/services/authApi';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/Spinner';
import BeatLoader from 'react-spinners/BeatLoader';

const GoogleRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const params = new URLSearchParams(window.location.hash.substring(1));
  const code = params.get('access_token');

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (code) {
        try {
          const result = await googleLogin(code);

          if (result?.success) {
            showToast('로그인 되었습니다.', true);
            setTimeout(() => {
              window.location.href = '/';
            }, 700);
          } else {
            showToast('로그인에 실패했습니다.', false);
            navigate('/', { replace: true });
          }
        } catch (error) {
          showToast('로그인 처리 중 오류가 발생했습니다.', false);
          navigate('/', { replace: true });
        }
      } else {
        showToast('Google 인증 코드가 없습니다.', false);
        navigate('/', { replace: true });
      }
    };

    handleGoogleLogin();
  }, [code, navigate]);

  return (
    <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
      <BeatLoader color="#3387E5" size={20} />
      <p className="mt-4 text-gray-700 font-semibold">로그인 중입니다...</p>
    </div>

    // <div className="min-h-[600px] flex items-center justify-center">
    //   <Spinner />
    // </div>
  );
};

export default GoogleRedirectHandler;
