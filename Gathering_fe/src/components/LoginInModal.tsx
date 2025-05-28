import gatheringLogo from '/gathering_home.svg';
import googleIcon from '@/assets/otherIcons/Google.png';
import loginIcon from '@/assets/otherIcons/Login.png';
import { LoginRequest } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

type LoginInModalProps = {
  closeModal: () => void;
  isEmailLogin: boolean;
  handleGoogle: () => void;
  handleEmailLoginMode: () => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: LoginRequest;
};

const LoginInModal: React.FC<LoginInModalProps> = ({
  closeModal,
  isEmailLogin,
  handleGoogle,
  handleEmailLoginMode,
  handleLogin,
  handleInputChange,
  formData
}) => {
  const nav = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="relative p-4 w-full max-w-md bg-white rounded-[50px] shadow-lg dark:bg-gray-700 animate-fadeIn">
        <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
          <button
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeModal}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <img className="w-[300px] mb-8" src={gatheringLogo} alt="Gathering Logo" />

          {!isEmailLogin ? (
            <div className="space-y-4 w-full flex flex-col items-center font-inter">
              <div className="font-semibold text-[22px] text-[#202123] py-4">
                Gathering에 오신 것을 환영합니다!
              </div>
              <div className="font-normal mx-8 text-[16px] text-[#202123] text-center pt-4 pb-8">
                IT 초보와 고수가 모두 모이는 GATHERING을 통해 팀원을 찾아보세요!
              </div>
              <button
                onClick={handleGoogle}
                type="button"
                className="flex font-inter space-x-4 justify-center items-center w-[300px] border border-[#000000]/20 font-semibold rounded-[100px] text-[20px] px-4 py-3 text-center hover:bg-gray-200 transition-colors duration-300 ease-in-out focus:outline-none"
              >
                <img className="w-8 h-8" src={googleIcon} alt="google login" />
                <div>Google로 로그인하기</div>
              </button>
              <button
                onClick={handleEmailLoginMode}
                type="button"
                className="flex font-inter space-x-4 justify-center items-center w-[300px] bg-gray-200 font-semibold rounded-[100px] text-[20px] px-4 py-3 text-center hover:bg-gray-300 transition-colors duration-300 ease-in-out focus:outline-none"
              >
                <img className="w-8 h-8" src={loginIcon} alt="login Icon" />
                <div>이메일로 로그인하기</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 w-full max-w-80 mx-auto pt-4">
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 mb-4 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="이메일을 입력하세요."
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 mb-8 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="비밀번호를 입력하세요."
                />
              </div>
              <div className="flex flex-col items-center space-y-4 pt-4">
                <button
                  type="submit"
                  className="bg-[#3387E5] font-semibold text-[#FFFFFF] rounded-[16px] text-[18px] w-full max-w-xs px-4 py-1.5 text-center hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => {
                    nav('/signup');
                    closeModal();
                  }}
                  className="bg-[#000000]/20 font-semibold text-[#FFFFFF] rounded-[16px] text-[18px] w-full max-w-xs px-4 py-1.5 text-center hover:bg-[#000000]/30 transition-colors duration-300 ease-in-out focus:outline-none"
                >
                  회원가입
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginInModal;
