import { getUserProfile } from '@/services/profileApi';
import { useToast } from '@/contexts/ToastContext';

const Main: React.FC = () => {
  const { showToast } = useToast();
  const handleUserProfile = async () => {
    try {
      // 추후에 매개변수 닉네임으로 보내도록 수정
      const result = await getUserProfile('유진');

      if (result?.success) {
        showToast('유저 정보 불러오기를 성공했습니다.', true);
      } else {
        showToast('로그아웃에 실패했습니다.', false);
      }
    } catch {
      showToast('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.', false);
    }
  };

  return <button onClick={handleUserProfile}>다른 유저 프로필 받아오기</button>;
};

export default Main;
