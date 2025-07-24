import React, { useState, useRef, useEffect, useContext } from 'react';
import { MultiLevelDropdownProps } from '@/types/menu';
import { DropdownDispatchContext } from '@/pages/PostHome';
import { techStacks, TechStack } from '@/utils/tech-stacks';
import { getStackImage } from '@/utils/get-stack-image';

const OptionalDropdown: React.FC<MultiLevelDropdownProps> = ({
  menuData,
  label = '기술 스택',
  buttonClassName = '',
  align = 'left'
}) => {
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  const [activeSubmenuId2, setActiveSubmenuId2] = useState<string | null>(null);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContext = useContext(DropdownDispatchContext);

  if (!dropdownContext) {
    throw new Error('DropdownDispatchContext가 제공되지 않았습니다.');
  }

  const { setSelectedStack } = dropdownContext;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMainDropdownOpen(false);
        setActiveSubmenuId(null);
        setActiveSubmenuId2(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMainDropdown = () => {
    setIsMainDropdownOpen(!isMainDropdownOpen);
  };

  const handleItemClick = (newId: string, label: string) => {
    setSelectedItems(prev => {
      let updatedItems;
      if (prev.includes(newId)) {
        updatedItems = prev.filter(item => item !== newId);
      } else {
        updatedItems = [...prev, newId];
      }

      setSelectedLabels(prevLabels => {
        if (prevLabels.includes(label)) {
          return prevLabels.filter(item => item !== label);
        } else {
          return [...prevLabels, label];
        }
      });

      setSelectedStack(updatedItems);
      return updatedItems;
    });
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prevItems => {
      const updatedItems = prevItems.filter(item => item !== id);

      setSelectedStack(updatedItems);

      return updatedItems;
    });

    setSelectedLabels(prevLabels => {
      // 삭제된 ID와 연관된 label을 제거
      const updatedLabels = prevLabels.filter((_, index) => selectedItems[index] !== id);

      return updatedLabels;
    });
  };

  useEffect(() => {
    if (selectedItems.length > 0) {
      // console.log('API 호출: 선택된 항목들:', selectedItems);
    } else {
      // console.log('선택된 항목이 없습니다.');
    }
  }, [selectedItems]);

  return (
    <div className="relative inline-block text-left select-none" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        className={`inline-flex items-center justify-between min-w-[150px] sm:min-w-[150px] px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none ${buttonClassName}`}
        onClick={toggleMainDropdown}
      >
        <span className="truncate">{label}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isMainDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isMainDropdownOpen && (
        <div
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-[330px] sm:max-w-[450px] md:max-w-[550px] lg:w-[600px] rounded-lg shadow-lg bg-white dark:bg-[#1E2028] ring-1 ring-black ring-opacity-5 overflow-hidden animate-fadeDown`}
        >
          <div className="grid grid-cols-3">
            {/* 1단계 메뉴 */}
            <div className="border-r border-gray-300 dark:border-gray-600 py-1">
              {menuData.map(item => (
                <div
                  key={item.id}
                  className={`px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                    activeSubmenuId === item.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => {
                    const newId = activeSubmenuId === item.id ? null : item.id;
                    setActiveSubmenuId(newId);
                    if (newId !== activeSubmenuId) {
                      setActiveSubmenuId2(null);
                    }
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>

            {/* 2단계 메뉴 */}
            <div className="border-r border-gray-300 dark:border-gray-600 py-1">
              {activeSubmenuId &&
                menuData
                  .find(item => item.id === activeSubmenuId)
                  ?.items?.map(subItem => (
                    <div
                      key={subItem.id}
                      className={`px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                        activeSubmenuId2 === subItem.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                      }`}
                      onClick={() =>
                        setActiveSubmenuId2(activeSubmenuId2 === subItem.id ? null : subItem.id)
                      }
                    >
                      {subItem.label}
                    </div>
                  ))}
            </div>

            {/* 3단계 메뉴 */}
            <div className="py-1">
              {activeSubmenuId2 &&
                menuData
                  .find(item => item.id === activeSubmenuId)
                  ?.items?.find(subItem => subItem.id === activeSubmenuId2)
                  ?.subItems?.map(subItem => {
                    const iconSrc = getStackImage(subItem.id.toUpperCase());

                    return (
                      <div
                        key={subItem.id}
                        onClick={() => handleItemClick(subItem.id, subItem.label)}
                        className={`flex items-center px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm text-black dark:text-white cursor-pointer
                          ${
                            selectedItems.includes(subItem.id)
                              ? 'bg-[#3387E5] text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        {/* 스택 아이콘 표시 */}
                        {iconSrc && (
                          <img
                            src={iconSrc}
                            alt={subItem.label}
                            className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2 object-contain"
                          />
                        )}
                        {subItem.label}
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* 선택된 항목을 드롭다운 하단에 고정 */}
          <div className="p-2 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
            <span className="ms-2 text-sm font-lg text-gray-700 dark:text-gray-300">
              선택된 항목:
            </span>
            <div className="flex flex-wrap mt-1">
              {selectedLabels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleRemoveItem(selectedItems[index])}
                  className="flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded-full m-1 hover:bg-blue-300 transition text-xs"
                >
                  <span className="text-xs sm:text-sm">{label}</span>
                  <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">✕</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionalDropdown;
