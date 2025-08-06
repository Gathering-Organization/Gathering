import { useState } from 'react';
import SignUpOrder from '@/components/SignUpOrder';
import SignUpAgree from '@/components/SignUpAgree';
import SignUpCertEmail from '@/components/SignUpCertEmail';
import SignUpCelebrate from '@/components/SignUpCelebrate';

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="mx-4 sm:mx-20 md:mx-40 lg:mx-60">
      {step === 1 && (
        <div className="space-y-20">
          <SignUpOrder order={step} />
          <SignUpAgree setStep={setStep} />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-20">
          <SignUpOrder order={step} />
          <SignUpCertEmail setStep={setStep} />
        </div>
      )}
      {step === 3 && (
        <div>
          <SignUpOrder order={step} />
          <SignUpCelebrate />
        </div>
      )}
    </div>
  );
};

export default SignUp;
