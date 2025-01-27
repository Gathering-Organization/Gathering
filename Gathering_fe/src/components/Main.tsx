import { getUserProfile } from '@/services/profileApi';

const Main: React.FC = () => {
  const handleUserProfile = async () => {
    try {
      // 추후에 매개변수 닉네임으로 보내도록 수정
      const result = await getUserProfile('유진');

      if (result?.success) {
        alert('유저 정보 불러오기 성공!' + result.data);
        console.log(result.data);
      } else {
        alert(result?.message || '로그아웃에 실패했습니다.');
      }
    } catch {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return <button onClick={handleUserProfile}>다른 유저 프로필 받아오기</button>;
};

export default Main;
