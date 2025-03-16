import { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import { logout } from '@/services/authApi';
import triangleArrowIcon from '@/assets/otherIcons/Triangle Arrow.png';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { myProfile, isMyProfileLoading } = useProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const userNickname = myProfile?.nickname || '';
  const userColor = myProfile?.profileColor || 'ccc';
  const parts = userNickname.split(/(#\d+)/);

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result?.success) {
        alert('로그아웃 성공!');
      } else {
        alert(result?.message || '로그아웃에 실패했습니다.');
      }
    } catch {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className={`w-48 h-[48px] focus:outline-none border border-transparent border-r-[5px] border-b-[5px] rounded-[10px] ${
          isDropdownOpen ? 'border-[#000000]' : ''
        }`}
        onClick={() => setIsDropdownOpen(prev => !prev)}
      >
        <div className="flex justify-center items-center space-x-3">
          <div
            className="w-[28px] h-[28px] rounded-full"
            style={{ backgroundColor: `#${userColor}` }}
          />
          <div className="font-bold">{parts[0]}</div>
          <img
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            src={triangleArrowIcon}
            alt="Dropdown arrow"
          />
        </div>
      </button>
      {isDropdownOpen && (
        <div className="absolute border-[#000000] right-0 shadow-lg ring-1 ring-black ring-opacity-5 mt-2 w-48 bg-white rounded-[10px] z-50">
          <button
            className="block w-full text-[16px] text-center px-4 py-2 rounded-[10px] hover:bg-gray-100"
            onClick={() => {
              setIsDropdownOpen(false);
              nav('/profile');
            }}
          >
            프로필 보기
          </button>
          <button
            className="block w-full text-[16px] text-center px-4 py-2 rounded-[10px] hover:bg-gray-100"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
