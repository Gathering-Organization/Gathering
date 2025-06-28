import { useState } from 'react';
import {} from '@/services/api';
import { LoginRequest } from '@/types/auth';
import { login } from '@/services/authApi';
import useModalBodyLock from '@/hooks/UseModalBodyLock';
import LoginInModal from './LoginInModal';
import { useToast } from '@/contexts/ToastContext';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignupClick }) => {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const { showToast } = useToast();
  useModalBodyLock(isModalOpen);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setIsEmailLogin(false);
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
        showToast('로그인 되었습니다.', true);
        window.location.reload();
        onClose();
      } else {
        showToast('로그인에 실패했습니다.', false);
      }
    } catch {
      showToast('로그인 중 오류가 발생했습니다. 다시 시도해주세요.', false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    closeModal();
  };

  const handleEmailLoginMode = () => {
    setIsEmailLogin(true);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="relative px-4 bg-[#202123] rounded-[30px] transition-all ease-in-out duration-300 hover:scale-[1.02] transform-gpu"
      >
        <div className="flex will-change-transform py-1">
          <div className="text-[#FFFFFF] font-bold text-[16px]">로그인</div>
        </div>
      </button>

      {isModalOpen && (
        <LoginInModal
          closeModal={closeModal}
          isEmailLogin={isEmailLogin}
          handleGoogle={handleGoogle}
          handleEmailLoginMode={handleEmailLoginMode}
          handleLogin={handleLogin}
          handleInputChange={handleInputChange}
          formData={formData}
        />
      )}
    </div>
  );
};

export default LoginModal;
