import { useState, useEffect } from 'react';
import { signup, certEmail, certCode } from '@/services/authApi';
import { SignupRequest } from '@/types/auth';
import axios from 'axios';

interface SignUpAgreeProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SignUpCertEmail: React.FC<SignUpAgreeProps> = ({ setStep }) => {
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    name: '',
    password: '',
    code: ''
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      alert('인증 시간이 만료되었습니다. 다시 시도하세요.');
      setIsEmailSent(false);
      setTimer(null);
    } else if (timer !== null) {
      const interval = setInterval(() => setTimer(prev => (prev ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async () => {
    if (!formData.email.trim()) {
      alert('이메일을 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await certEmail(formData.email);
      if (result?.success) {
        alert('인증 메일 전송 완료: ' + result.message);
        setIsEmailSent(true);
        setTimer(300);
      } else {
        alert('전송 실패: ' + result?.message);
      }
    } catch (error) {
      alert(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '이메일 전송 오류 발생'
          : '전송 오류 발생'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.code.trim()) {
      alert('인증번호를 입력하세요.');
      return;
    }

    try {
      const result = await certCode(formData.email, formData.code);
      if (result?.success) {
        alert('인증 성공: ' + result.message);
        setIsEmailVerified(true);
        setTimer(null);
      } else {
        alert('인증 실패: ' + result?.message);
      }
    } catch (error) {
      alert(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '인증 오류 발생'
          : '인증 오류 발생'
      );
    }
  };

  const handleSignUp = async () => {
    if (!isEmailVerified) {
      alert('이메일 인증을 완료하세요.');
      return;
    }

    try {
      const result = await signup(formData);
      if (result?.success) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        setStep(3);
      } else {
        alert('회원가입 실패: ' + result?.message);
      }
    } catch (error) {
      alert(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '회원가입 오류 발생'
          : '회원가입 오류 발생'
      );
    }
  };

  return (
    <div className="text-center">
      <div>
        <div className="text-[24px] font-bold my-6">정보 입력</div>
        <div className="text-[14px] text-[#C7C7C7] mb-8">
          이메일 인증은 유효 메일 확인 이외의 용도로 사용되지 않습니다.
        </div>
      </div>
      <section>
        <div className="border-2 rounded-[30px] border-[#D9D9D9] p-8 space-y-4 max-w-lg mx-auto">
          {isEmailVerified ? (
            <div className="text-[#3387E5] font-bold">{formData.email} 인증 완료</div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-24 font-bold text-[#202123]">이메일 인증</div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[250px] p-2.5"
                  placeholder="이메일을 입력하세요."
                />
                <button
                  onClick={handleSendEmail}
                  className="text-[#3387E5] font-bold border-2 border-[#3387E5] px-4 py-2 rounded-[16px] flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    '전송'
                  )}
                </button>
              </div>

              {isEmailSent && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-24 font-bold text-[#202123]">인증번호</div>
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[250px] p-2.5"
                      placeholder="인증번호를 입력하세요."
                    />
                    <button
                      onClick={handleVerifyCode}
                      className="text-[#3387E5] font-bold border-2 border-[#3387E5] px-4 py-2 rounded-[16px]"
                    >
                      인증
                    </button>
                  </div>
                  {/* 타이머를 추가하여 남은 시간을 표시 */}
                  {timer !== null && (
                    <div className="mt-2 text-red-500 font-semibold">남은 시간: {timer}초</div>
                  )}
                </>
              )}
            </>
          )}

          <div className="flex items-center gap-2">
            <div className="w-24 font-bold text-[#202123]">비밀번호</div>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[250px] p-2.5"
              placeholder="비밀번호를 입력하세요."
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 font-bold text-[#202123]">이름</div>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[250px] p-2.5"
              placeholder="이름을 입력하세요."
            />
          </div>
        </div>
      </section>
      <div className="my-10">
        <button
          onClick={handleSignUp}
          className="font-semibold text-[#FFFFFF] rounded-[20px] text-[18px] px-12 py-2 bg-[#3387E5] hover:bg-blue-700"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignUpCertEmail;
