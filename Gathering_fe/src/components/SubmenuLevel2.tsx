import React, { useState } from 'react';
import { getStackImage } from '@/utils/get-stack-image';

interface SubmenuLevel2Props {
  id: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  title: string;
  items: { id: string; label: string; subItems?: { id: string; label: string }[] }[];
  onItemClick: (label: string) => void;
}

const SubmenuLevel2: React.FC<SubmenuLevel2Props> = ({
  id,
  title,
  items,
  isActive,
  onToggle,
  onItemClick
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setIsSubmenuOpen(prev => !prev);
    onToggle(id);
  };

  return (
    <div className="relative">
      <div
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        onClick={toggleSubmenu}
      >
        <span>{title}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {isActive && (
        <div className="absolute left-full top-0 mt-0 ml-0.5 w-48 rounded-lg shadow-lg bg-white dark:bg-[#1E2028] ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map(item => {
              const iconSrc = getStackImage(item.id.toUpperCase());
              return (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => onItemClick(item.label)}
                  className="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {iconSrc && <img src={iconSrc} alt={item.label} className="w-6 h-6 mr-2" />}
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmenuLevel2;
