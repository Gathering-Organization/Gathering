import { useState, useEffect } from 'react';
import { signup, certEmail, certCode } from '@/services/authApi';
import { SignupRequest } from '@/types/auth';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';

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
  const regexNickname = /[가-힣]{1,6}/;
  const regexPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{8,}$/;
  const { showToast } = useToast();

  useEffect(() => {
    if (timer === 0) {
      showToast('인증 시간이 만료되었습니다. 다시 시도해주세요.', false);
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
      showToast('이메일을 입력하세요.', false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await certEmail(formData.email);
      if (result?.success) {
        showToast('인증 메일 전송 완료', true);
        setIsEmailSent(true);
        setTimer(300);
      } else {
        showToast('전송에 실패했습니다.', false);
      }
    } catch (error) {
      // alert(
      //   axios.isAxiosError(error)
      //     ? error.response?.data?.message || '이메일 전송 오류 발생'
      //     : '전송 오류 발생'
      // );
      showToast(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '이메일 전송 오류 발생'
          : '전송 오류 발생',
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.code.trim()) {
      showToast('인증번호를 입력해주세요.', false);
      return;
    }

    try {
      const result = await certCode(formData.email, formData.code);
      if (result?.success) {
        showToast('인증 성공', true);
        setIsEmailVerified(true);
        setTimer(null);
      } else {
        showToast('인증 실패', false);
      }
    } catch (error) {
      showToast(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '인증 오류 발생'
          : '인증 오류 발생',
        false
      );
      // alert(
      //   axios.isAxiosError(error)
      //     ? error.response?.data?.message || '인증 오류 발생'
      //     : '인증 오류 발생'
      // );
    }
  };

  const handleSignUp = async () => {
    if (!isEmailVerified) {
      showToast('이메일 인증을 완료해주세요.', false);
      return;
    }

    if (!regexNickname.test(formData.name)) {
      showToast('한글 6자 이하의 닉네임으로 설정해주세요.', false);
      return;
    }

    if (!regexPass.test(formData.password)) {
      showToast('8자리 이상 영문, 숫자, 특수문자 포함한 패스워드로 설정해주세요.', false);
      return;
    }

    try {
      const result = await signup(formData);
      if (result?.success) {
        showToast('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.', true);
        setStep(3);
      } else {
        showToast('회원가입에 실패했습니다.', false);
      }
    } catch (error) {
      showToast(
        axios.isAxiosError(error)
          ? error.response?.data?.message || '회원가입 오류 발생'
          : '회원가입 오류 발생',
        false
      );
      // alert(
      //   axios.isAxiosError(error)
      //     ? error.response?.data?.message || '회원가입 오류 발생'
      //     : '회원가입 오류 발생'
      // );
    }
  };

  return (
    <div className="text-center">
      <div>
        <div className="text-[24px] font-bold my-6">정보 입력</div>
        <div className="text-[14px] text-[#C7C7C7] mb-8">
          이메일 인증은 유효 메일 확인 이외의 용도로 사용되지 않습니다.
          <br />
          (받은 이메일에 인증 메일이 없다면 스팸 메일함을 확인해주세요.)
        </div>
      </div>
      <section>
        <div className="border-2 rounded-[30px] border-[#D9D9D9] p-6 sm:p-8 space-y-6 max-w-lg mx-auto">
          {isEmailVerified ? (
            <div className="text-[#3387E5] font-bold text-sm sm:text-base">
              {formData.email} 인증 완료
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-24 font-bold text-[#202123] text-sm sm:text-base shrink-0">
                  이메일 인증
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm focus:outline-none rounded-lg w-full p-2.5"
                  placeholder="이메일을 입력하세요."
                />
                <button
                  onClick={handleSendEmail}
                  className="text-[#3387E5] font-bold border-2 border-[#3387E5] px-4 mt-2 py-1 sm:mt-0 sm:py-2 rounded-[16px] w-full sm:w-auto flex justify-center items-center min-h-[40px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                  ) : (
                    '전송'
                  )}
                </button>
              </div>

              {isEmailSent && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-24 font-bold text-[#202123] text-sm sm:text-base shrink-0">
                      인증번호
                    </label>
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg  w-full p-2.5"
                      placeholder="인증번호를 입력하세요."
                    />
                    <button
                      onClick={handleVerifyCode}
                      className="text-[#3387E5] font-bold border-2 border-[#3387E5] px-4 py-2 rounded-[16px] w-full sm:w-auto"
                    >
                      인증
                    </button>
                  </div>
                  {timer !== null && (
                    <div className="mt-2 text-red-500 font-semibold text-sm sm:text-base">
                      남은 시간: {timer}초
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-24 font-bold text-[#202123] text-sm sm:text-base shrink-0">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm focus:outline-none rounded-lg w-full p-2.5"
              placeholder="8자리 이상 영문, 숫자, 특수문자 포함"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-24 font-bold text-[#202123] text-sm sm:text-base shrink-0">
              닉네임
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm focus:outline-none rounded-lg w-full p-2.5"
              placeholder="한글 6자 이하의 닉네임"
            />
          </div>
        </div>
      </section>

      <div className="my-10 px-4">
        <button
          onClick={handleSignUp}
          className="w-full sm:w-auto font-semibold text-[#FFFFFF] rounded-[20px] text-[18px] px-12 py-2 bg-[#3387E5] hover:bg-blue-700"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignUpCertEmail;
