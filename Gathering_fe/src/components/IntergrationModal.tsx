import gatheringLogo from '/gathering_home.svg';
import { useNavigate } from 'react-router-dom';

interface IntergrationModalProps {
  closeModal: () => void;
  onClick: () => void;
}

const IntergrationModal: React.FC<IntergrationModalProps> = ({ closeModal, onClick }) => {
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
          <div>
            현재 구글 계정과 동일한 아이디로 이메일 계정이 있습니다. 구글 로그인과 통합하시겠습니까?
          </div>
          <div className="flex flex-col items-center space-y-4 pt-4">
            <button
              type="submit"
              onClick={onClick}
              className="bg-[#3387E5] font-semibold text-[#FFFFFF] rounded-[16px] text-[18px] w-full max-w-xs px-4 py-1.5 text-center hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none"
            >
              예
            </button>
            <button
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="bg-[#000000]/20 font-semibold text-[#FFFFFF] rounded-[16px] text-[18px] w-full max-w-xs px-4 py-1.5 text-center hover:bg-[#000000]/30 transition-colors duration-300 ease-in-out focus:outline-none"
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntergrationModal;
