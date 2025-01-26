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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="로그인">
      <form onSubmit={handleLogin}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>

      <button onClick={handleGoogle}>
        <img
          src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
          alt="google login"
        />
      </button>

      <button type="button" onClick={onSignupClick}>
        회원가입하러가기
      </button>
    </Modal>
  );
};

export default LoginModal;
