import { useState } from 'react';
import Modal from '@/components/Modal';
import {} from '@/services/api';
import { LoginRequest } from '@/types/auth';
import { login } from '@/services/authApi';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignupClick }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login(formData);

      if (result?.success) {
        alert('로그인 성공!');
        onClose();
      } else {
        alert(result?.message || '로그인에 실패했습니다.');
      }
    } catch {
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoogle = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    closeModal();
  };

  return (
    <div>
      <button className="text-[20px] font-bold relative left-4 inline-block" onClick={openModal}>
        <span className="pr-8">로그인</span>
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">로그인</h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
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
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#">
                <form onSubmit={handleLogin}>
                  <div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      className="bg-gray-50 border border-gray-300 text-gray-900 mb-4 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="이메일을 입력하세요."
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      className="bg-gray-50 border border-gray-300 text-gray-900 mb-8 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="비밀번호를 입력하세요."
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    로그인 하기
                  </button>
                </form>

                <button
                  type="button"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={onSignupClick}
                >
                  회원가입 하기
                </button>
                <button onClick={handleGoogle}>
                  <img
                    className="w-14 h-14"
                    src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
                    alt="google login"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    // <Modal isOpen={isOpen} onClose={onClose} title="로그인">
    //   <form onSubmit={handleLogin}>
    //     <div>
    //       <label>이메일</label>
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleInputChange}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label>비밀번호</label>
    //       <input
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleInputChange}
    //         required
    //       />
    //     </div>
    //     <button type="submit">로그인</button>
    //   </form>

    // <button onClick={handleGoogle}>
    //   <img
    //     src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
    //     alt="google login"
    //   />
    // </button>

    //   <button type="button" onClick={onSignupClick}>
    //     회원가입하러가기
    //   </button>
    // </Modal>
  );
};

export default LoginModal;
