import { logout } from '@/services/authApi';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result?.success) {
        alert('로그아웃 성공!');
      } else {
        alert(result?.message || '로그아웃에 실패했습니다.');
      }
    } catch {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
