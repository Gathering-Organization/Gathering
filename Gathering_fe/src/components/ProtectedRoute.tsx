// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileStateContext';
import { useState } from 'react';
import LoginInModal from './LoginInModal';
import { LoginRequest } from '@/types/auth';
import { login } from '@/services/authApi';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const { myProfile, isMyProfileLoading, updateProfileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const nav = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setIsEmailLogin(false);
    nav('/');
  };

  const handleGoogle = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    closeModal();
  };

  const handleEmailLoginMode = () => {
    setIsEmailLogin(true);
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
        alert('로그인 되었습니다.');
        setActiveModal(null);
      } else {
        alert(result?.message || '로그인에 실패했습니다.');
      }
    } catch {
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 로그인이 되어 있지 않다면 로그인 모달창 켜기
  if (myProfile.nickname === '') {
    return (
      <div>
        <LoginInModal
          closeModal={closeModal}
          isEmailLogin={isEmailLogin}
          handleGoogle={handleGoogle}
          handleEmailLoginMode={handleEmailLoginMode}
          handleLogin={handleLogin}
          handleInputChange={handleInputChange}
          formData={formData}
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
