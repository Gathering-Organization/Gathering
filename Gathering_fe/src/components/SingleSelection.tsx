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
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <select
        ref={selectRef}
        onChange={e => setSelectedValue(e.target.value)}
        onClick={() => setIsOpen(prev => !prev)}
        className="appearance-none bg-gray-50 dark:bg-[#1E2028] border border-gray-300 text-gray-500 text-sm rounded-[20px] focus:outline-none block w-full p-3 px-6 pr-10 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      >
        <option value="">{title}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
    </div>
  );
};

export default SingleSelection;
