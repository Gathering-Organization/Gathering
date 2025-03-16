import { useState, useRef, useEffect } from 'react';

interface SingleSelectionProps {
  title: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const SingleSelection: React.FC<SingleSelectionProps> = ({
  title,
  options,
  selectedValue,
  setSelectedValue
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || title;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full text-left cursor-pointer bg-gray-50 dark:bg-[#1E2028] border border-gray-300 text-gray-500 text-sm rounded-[20px] p-3 px-6 pr-10 focus:outline-none"
      >
        {selectedLabel}
      </button>
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
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-[#1E2028] border border-gray-300 rounded-[20px] shadow-lg overflow-hidden">
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => {
                setSelectedValue(option.value);
                setIsOpen(false);
              }}
              className="cursor-pointer px-6 py-2 text-sm text-gray-500 dark:text-white hover:bg-[#3387E5]/20 dark:hover:bg-gray-800"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelection;
