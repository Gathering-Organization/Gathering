import { useState } from 'react';
import Modal from '@/components/Modal';
import { SignupRequest } from '@/types/auth';
import { signup } from '@/services/authApi';

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
};

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    name: '',
    password: '',
    code: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const result = await signup(formData);

      if (result?.success) {
        alert('회원가입 성공!\n' + `${result}`);
        onClose();
      } else {
        alert(result?.message);
      }
    } catch {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="회원가입">
      <form onSubmit={handleSignup}>
        <div>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
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
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>

      <button onClick={onLoginClick}>로그인하러가기</button>
    </Modal>
  );
};

export default SignupModal;
