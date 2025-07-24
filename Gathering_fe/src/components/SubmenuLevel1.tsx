import React, { useEffect, useState } from 'react';
import SubmenuLevel2 from '@/components/SubmenuLevel2';

interface SubmenuLevel1Props {
  id: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  title: string;
  items: { id: string; label: string; subItems?: { id: string; label: string }[] }[];
  onItemClick: (label: string) => void;
}

const SubmenuLevel1: React.FC<SubmenuLevel1Props> = ({
  id,
  title,
  items,
  isActive,
  onToggle,
  onItemClick
}) => {
  // const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  const toggleSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setIsSubmenuOpen((prev) => !prev);
    onToggle(id);
  };
  useEffect(() => {
    if (!isActive) {
      setActiveSubmenuId(null);
    }
  }, [isActive]);
  return (
    <div className="relative">
      <button
        onClick={toggleSubmenu}
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span>{title}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isActive && (
        <div className="absolute left-full top-0 mt-0 ml-0.5 w-48 rounded-lg shadow-lg bg-white dark:bg-[#1E2028] ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map(item =>
              item.subItems ? (
                <SubmenuLevel2
                  key={item.id}
                  id={item.id}
                  title={item.label}
                  items={item.subItems || []}
                  isActive={activeSubmenuId === item.id}
                  onToggle={id => setActiveSubmenuId(id === activeSubmenuId ? null : id)}
                  onItemClick={onItemClick}
                />
              ) : (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => {
                    onItemClick(item.label);
                  }}
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
