import celebrateIcon from '@/assets/otherIcons/Celebrate.png';
import { useNavigate } from 'react-router-dom';

const SignUpCelebrate: React.FC = () => {
  const nav = useNavigate();

  return (
    <div className="text-center mt-10 px-4">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0 py-10 sm:py-20">
        <img className="w-12 h-12 sm:w-14 sm:h-14" src={celebrateIcon} alt="축하" />
        <div className="font-bold text-xl sm:text-[30px]">Gathering 가입을 축하합니다!</div>
      </div>
      <div className="space-y-4 text-[#000000]/50 text-base sm:text-[18px] font-medium">
        <p>회원가입이 완료되었습니다.</p>
        <p>Gathering을 통해 팀원을 모집하고 참여해보세요!</p>
      </div>
      <div className="mt-12 sm:mt-20">
        <button
          onClick={() => nav('/')}
          className="w-full sm:w-auto font-semibold text-white rounded-[20px] text-base sm:text-[18px] px-6 sm:px-12 py-3 bg-[#3387E5] hover:bg-blue-700"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default SignUpCelebrate;
