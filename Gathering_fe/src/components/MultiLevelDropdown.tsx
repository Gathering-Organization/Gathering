import React, { useState, useRef, useEffect, useContext } from 'react';
import { MultiLevelDropdownProps } from '@/types/menu';
import { DropdownDispatchContext } from '@/pages/PostHome';
import { positionData, Position } from '@/utils/position-data';

const MultiLevelDropdown: React.FC<MultiLevelDropdownProps> = ({
  menuData,
  label = '포지션',
  buttonClassName = '',
  align = 'left'
}) => {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContext = useContext(DropdownDispatchContext);

  if (!dropdownContext) {
    throw new Error('DropdownDispatchContext가 제공되지 않았습니다.');
  }

  const { setSelectedPosition } = dropdownContext;

  const toggleMainDropdown = () => {
    setIsMainDropdownOpen(!isMainDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMainDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (newLabel: string) => {
    setSelectedLabel(newLabel);
    setIsMainDropdownOpen(false);

    let selectedItem: Position | undefined;

    if (newLabel !== '전체') {
      selectedItem = positionData.find(item => item.title === newLabel);
      if (selectedItem) {
        setSelectedPosition(selectedItem.id);
      }
    } else if (newLabel === '전체') {
      setSelectedPosition('전체');
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex items-center justify-between min-w-[160px] px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none ${buttonClassName}`}
        onClick={toggleMainDropdown}
      >
        <span className="truncate">{selectedLabel}</span> {/* 선택된 항목 텍스트 */}
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isMainDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isMainDropdownOpen && (
        <div
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-[#1E2028] ring-1 ring-black ring-opacity-5`}
        >
          <div className="py-1">
            <a
              href="#"
              onClick={() => {
                handleItemClick('전체');
              }}
              className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              전체
            </a>
            {menuData.map(item => {
              if (!item.items) {
                return (
                  <a
                    key={item.id}
                    href="#"
                    onClick={() => {
                      handleItemClick(item.title);
                    }}
                    className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.title}
                  </a>
                );
              } else {
                return (
                  <div key={item.id}>
                    <a
                      href="#"
                      onClick={() => handleItemClick(item.title)}
                      className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {item.title}
                    </a>
                    <div className="pl-4">
                      {item.items.map(subItem => (
                        <a
                          key={subItem.id}
                          href="#"
                          onClick={() => handleItemClick(subItem.label)}
                          className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLevelDropdown;
