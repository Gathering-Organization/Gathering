import forwardIcon from '@/assets/otherIcons/Forward.png';
import googleScholarIcon from '@/assets/otherIcons/Google Scholar.png';
import activeGoogleScholarIcon from '@/assets/otherIcons/Active Google Scholar.png';
import circleEnvelopeIcon from '@/assets/otherIcons/Circled Envelope.png';
import activeCircleEnvelopeIcon from '@/assets/otherIcons/Active Circled Envelope.png';
import checkMarkIcon from '@/assets/otherIcons/Check Mark.png';
import activeCheckMarkIcon from '@/assets/otherIcons/Active Check Mark.png';
import React from 'react';

const SignUpOrder: React.FC<{ order: number }> = ({ order }) => {
  const steps = [
    {
      label: '이용약관 동의',
      activeIcon: activeGoogleScholarIcon,
      defaultIcon: googleScholarIcon
    },
    {
      label: '이메일 인증',
      activeIcon: activeCircleEnvelopeIcon,
      defaultIcon: circleEnvelopeIcon
    },
    {
      label: '가입 완료',
      activeIcon: activeCheckMarkIcon,
      defaultIcon: checkMarkIcon
    }
  ];

  return (
    <div className="text-center mx-4 sm:mx-40">
      <div className="text-xl sm:text-[24px] font-bold mt-6 sm:mt-[40px] mb-10 sm:mb-[60px]">
        회원가입
      </div>
      <section className="grid grid-cols-5 items-center justify-items-center gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <img
                className="w-10 h-10 sm:w-[80px] sm:h-[80px]"
                src={order === index + 1 ? step.activeIcon : step.defaultIcon}
                alt={step.label}
              />
              <div
                className={`font-bold ${
                  order === index + 1 ? 'text-[#3387E5]' : 'text-black/50'
                } text-[10px] sm:text-[16px]`}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <img className="h-6 sm:h-[60px]" src={forwardIcon} alt="forward" />
            )}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
};

export default SignUpOrder;
