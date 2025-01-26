import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/services/authApi';

const GoogleRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.hash.substring(1));
  const code = params.get('access_token');

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (code) {
        try {
          const result = await googleLogin(code);

          if (result?.success) {
            alert('로그인 성공: ' + result.message);
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          } else {
            alert('로그인 실패: ' + result?.message);
            navigate('/');
          }
        } catch (error) {
          alert('로그인 처리 중 오류가 발생했습니다.');
          console.error(error);
          navigate('/');
        }
      } else {
        alert('Google 인증 코드가 없습니다.');
        navigate('/');
      }
    };

    handleGoogleLogin();
  }, [code, navigate]);

  return <div>Google 로그인 처리 중...</div>;
};

export default GoogleRedirectHandler;
