import React, { useState, useContext } from 'react';
import SubmenuLevel2 from '@/components/SubmenuLevel2';
import { DropdownDispatchContext } from '@/pages/PostHome';

interface SubmenuLevel1Props {
  title: string;
  items: { id: string; label: string; subItems?: { id: string; label: string }[] }[];
  onItemClick: (label: string) => void; // 클릭 이벤트 추가
}

const SubmenuLevel1: React.FC<SubmenuLevel1Props> = ({ title, items, onItemClick }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <div className="relative group" onMouseEnter={toggleSubmenu} onMouseLeave={toggleSubmenu}>
      <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
        <span>{title}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isSubmenuOpen && (
        <div className="absolute left-full top-0 mt-0 ml-0.5 w-48 rounded-lg shadow-lg bg-white dark:bg-[#1E2028] ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map(item =>
              item.subItems ? (
                <SubmenuLevel2
                  key={item.id}
                  title={item.label}
                  items={item.subItems}
                  onItemClick={onItemClick}
                />
              ) : (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => {
                    console.log(item.id);
                    onItemClick(item.label);
                  }} // 클릭 시 label 변경
                  className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmenuLevel1;
