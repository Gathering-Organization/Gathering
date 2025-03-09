import forwardIcon from '@/assets/otherIcons/Forward.png';
import googleScholarIcon from '@/assets/otherIcons/Google Scholar.png';
import activeGoogleScholarIcon from '@/assets/otherIcons/Active Google Scholar.png';
import circleEnvelopeIcon from '@/assets/otherIcons/Circled Envelope.png';
import activeCircleEnvelopeIcon from '@/assets/otherIcons/Active Circled Envelope.png';
import checkMarkIcon from '@/assets/otherIcons/Check Mark.png';
import activeCheckMarkIcon from '@/assets/otherIcons/Active Check Mark.png';

const SignUpOrder: React.FC<{ order: number }> = ({ order }) => {
  return (
    <div className="text-center mx-40">
      {order === 1 && (
        <div>
          <div className="text-[24px] font-bold mt-[40px] mb-[60px]">회원가입</div>
          <section className="grid grid-cols-5 items-center justify-items-center gap-4">
            <div className="flex flex-col items-center space-y-4">
              <img
                className="w-[80px] h-[80px]"
                src={activeGoogleScholarIcon}
                alt="이용약관 동의"
              />
              <div className="text-[16px] font-bold text-[#3387E5]">이용약관 동의</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={circleEnvelopeIcon} alt="이메일 인증" />
              <div className="text-[16px] font-bold text-[#000000]/50">이메일 인증</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={checkMarkIcon} alt="가입 완료" />
              <div className="text-[16px] font-bold text-[#000000]/50">가입 완료</div>
            </div>
          </section>
        </div>
      )}
      {order === 2 && (
        <div>
          <div className="text-[24px] font-bold mt-[40px] mb-[60px]">회원가입</div>
          <section className="grid grid-cols-5 items-center justify-items-center gap-4">
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={googleScholarIcon} alt="이용약관 동의" />
              <div className="text-[16px] font-bold text-[#000000]/50">이용약관 동의</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={activeCircleEnvelopeIcon} alt="이메일 인증" />
              <div className="text-[16px] font-bold text-[#3387E5]">이메일 인증</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={checkMarkIcon} alt="가입 완료" />
              <div className="text-[16px] font-bold text-[#000000]/50">가입 완료</div>
            </div>
          </section>
        </div>
      )}
      {order === 3 && (
        <div>
          <div className="text-[24px] font-bold mt-[40px] mb-[60px]">회원가입</div>
          <section className="grid grid-cols-5 items-center justify-items-center gap-4">
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={googleScholarIcon} alt="이용약관 동의" />
              <div className="text-[16px] font-bold text-[#000000]/50">이용약관 동의</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={circleEnvelopeIcon} alt="이메일 인증" />
              <div className="text-[16px] font-bold text-[#000000]/50">이메일 인증</div>
            </div>
            <img className="h-[60px]" src={forwardIcon} alt="forward" />
            <div className="flex flex-col items-center space-y-4">
              <img className="w-[80px] h-[80px]" src={activeCheckMarkIcon} alt="가입 완료" />
              <div className="text-[16px] font-bold text-[#3387E5]">가입 완료</div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SignUpOrder;
