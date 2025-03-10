import celebrateIcon from '@/assets/otherIcons/Celebrate.png';
import { useNavigate } from 'react-router-dom';

const SignUpCelebrate: React.FC = () => {
  const nav = useNavigate();

  return (
    <div className="text-center mt-10">
      <div className="flex justify-center items-center space-x-4 py-20">
        <img className="w-14 h-14" src={celebrateIcon} />
        <div className="font-bold text-[30px]">Gathering 가입을 축하합니다!</div>
      </div>
      <div className="space-y-6 text-[#000000]/50 text-[18px] font-medium">
        <p>회원가입이 완료되었습니다.</p>
        <p>Gathering을 통해 팀원을 모집하고 참여해보세요!</p>
      </div>
      <div className="mt-20">
        <button
          onClick={() => {
            nav('/posthome');
          }}
          className="font-semibold text-[#FFFFFF] rounded-[20px] text-[18px] px-12 py-2 bg-[#3387E5] hover:bg-blue-700"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default SignUpCelebrate;
