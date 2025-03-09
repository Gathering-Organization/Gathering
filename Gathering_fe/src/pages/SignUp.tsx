import { useState } from 'react';
import SignUpOrder from '@/components/SignUpOrder';
import SignUpAgree from '@/components/SignUpAgree';
import SignUpCertEmail from '@/components/SignUpCertEmail';

const SignUp: React.FC = () => {
  const [step, setStep] = useState(2);

  return (
    <div className="mx-60">
      {step === 1 && (
        <div className="space-y-20">
          <SignUpOrder order={step} />
          <SignUpAgree />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-20">
          <SignUpOrder order={step} />
          <SignUpCertEmail />
        </div>
      )}
      {step === 3 && <SignUpOrder order={step} />}
    </div>
  );
};

export default SignUp;
