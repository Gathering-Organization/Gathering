import React, { useState, KeyboardEvent, ChangeEvent, MouseEvent, useRef, useEffect } from 'react';

import { getUserProfile } from '@/services/profileApi';
import { useToast } from '@/contexts/ToastContext';

interface TeamTagInputProps {
  teams: string[];
  setTeams: (teams: string[]) => void;
}

const TeamTagInput: React.FC<TeamTagInputProps> = ({ teams, setTeams }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
  //     if (e.key === 'Enter') {
  //       e.preventDefault();
  //       const trimmedValue: string = inputValue.trim();
  //       if (trimmedValue !== '') {
  //         setTeams([...teams, trimmedValue]);
  //         setInputValue('');
  //       }
  //     }
  //   };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue: string = inputValue.trim();
      if (trimmedValue === '') return;

      if (teams.includes(trimmedValue)) {
        showToast('프로필 저장이 완료되었습니다.', false);
        return;
      }

      try {
        const response = await getUserProfile(trimmedValue);

        if (response && response.success) {
          setTeams([...teams, trimmedValue]);
          setInputValue('');
        } else {
          showToast('존재하지 않는 유저입니다.', false);
        }
      } catch (err) {
        console.error(err);
        showToast('유저 정보를 불러오는 중 오류가 발생했습니다.', false);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const removeTag = (index: number): void => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full text-left cursor-pointer bg-gray-50 dark:bg-[#1E2028] border border-gray-300 text-gray-500 text-sm rounded-[20px] p-3 px-6 pr-10 focus:outline-none"
      >
        <div className="flex flex-wrap gap-1 max-h-12 overflow-auto items-center">
          {teams.length === 0 ? (
            <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              {`팀원을 태그하세요. (선택)`}
            </span>
          ) : (
            teams.map((tag, idx) => (
              <span
                onClick={(e: MouseEvent<HTMLSpanElement>) => {
                  e.stopPropagation();
                  removeTag(idx);
                }}
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs lg:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400"
              >
                {tag}
                <span
                  role="button"
                  aria-label="Remove option"
                  className="ml-1 inline-flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
            ))
          )}
        </div>
        <span
          className={`absolute inset-y-0 right-3 flex items-center transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-lg overflow-hidden animate-fadeDown">
          <div className="sticky top-0 p-2 bg-white dark:bg-[#1E2028] border-gray-200 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              name="teams"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="팀원 태그 (입력 후 Enter) ex) 게더링#546931"
              className="w-full px-3 py-1.5 text-xs lg:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 focus:outline-none dark:border-gray-700 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTagInput;
