import { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import { logout } from '@/services/authApi';
import { useNavigate } from 'react-router-dom';
import triangleArrowIcon from '@/assets/otherIcons/Triangle Arrow.png';
import { useToast } from '@/contexts/ToastContext';
import { useDropdown } from '@/contexts/DropdownContext';

const LogoutButton: React.FC = () => {
  const { myProfile, isMyProfileLoading } = useProfile();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const { showToast } = useToast();

  const { activeDropdown, setActiveDropdown, registerRef } = useDropdown();

  useEffect(() => {
    registerRef('menu', dropdownRef);
  }, [registerRef]);

  const isOpen = activeDropdown === 'menu';

  const userNickname = myProfile?.nickname || '';
  const userColor = myProfile?.profileColor || 'ccc';
  const parts = userNickname.split(/(#\d+)/);

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result?.success) {
        localStorage.setItem(
          'toastMessage',
          JSON.stringify({
            message: '로그아웃 되었습니다.',
            isSuccess: true
          })
        );
        window.location.href = '/';
      } else {
        showToast('로그아웃에 실패했습니다.', false);
      }
    } catch {
      showToast('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.', false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  };

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside);
  //   return () => document.removeEventListener('click', handleClickOutside);
  // }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className={`h-[48px] px-3 sm:px-4 focus:outline-none border border-transparent ${
          isOpen ? 'border-[#000000]' : ''
        }`}
        onClick={() => setActiveDropdown(activeDropdown === 'menu' ? null : 'menu')}
      >
        <div className="flex justify-center items-center space-x-3">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `#${userColor}` }} />
          <div className="font-bold hidden sm:block">{parts[0]}</div>
          <img
            className={`w-4 h-4 transition-transform duration-200 translate-y-[-1.5px] ${isOpen ? 'rotate-180' : ''}`}
            src={triangleArrowIcon}
            alt="Dropdown arrow"
          />
        </div>
      </button>
      {isOpen && (
        <div className="absolute border-[#000000] right-0 shadow-lg ring-1 ring-black ring-opacity-5 mt-2 w-48 bg-white rounded-[10px] z-50 overflow-hidden animate-fadeDown">
          <button
            className="block w-full text-[16px] text-center px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setActiveDropdown(null);
              nav('/profile');
            }}
          >
            프로필 보기
          </button>
          <button
            className="block w-full text-[16px] text-center px-4 py-2 hover:bg-gray-100"
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
