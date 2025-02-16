import { useState, useEffect, useRef } from 'react';

interface MultiSelectionProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (selected: string[]) => void;
}

const MultiSelection: React.FC<MultiSelectionProps> = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    const newSelection = new Set(selectedOptions);
    if (newSelection.has(option)) {
      newSelection.delete(option);
    } else {
      newSelection.add(option);
    }
    setSelectedOptions(Array.from(newSelection));
  };

  const toggleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options);
    }
  };

  const removeSelection = (option: string) => {
    const newSelection = selectedOptions.filter(selected => selected !== option);
    setSelectedOptions(newSelection);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
        className="relative w-full text-left bg-white dark:bg-[#1E2028] p-3 px-6 border border-[#000000]/20 rounded-[18px] dark:border-gray-700 rounded-[20px] px-4 py-2.5 focus:outline-none"
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap gap-1 min-h-6">
          {selectedOptions.length === 0 ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          ) : (
            selectedOptions.map(option => (
              <span
                key={option}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400"
              >
                {option}
                <button
                  type="button"
                  className="ml-1 inline-flex items-center justify-center"
                  onClick={e => {
                    e.stopPropagation();
                    removeSelection(option);
                  }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>

        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="sticky top-0 p-2 bg-white dark:bg-[#1E2028] border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="Search options..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="max-h-60 overflow-auto py-1" role="listbox">
            <li className="relative px-2">
              <label className="flex items-center px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                  checked={selectedOptions.length === options.length}
                  onChange={toggleSelectAll}
                />
                <span className="ml-2 text-black dark:text-white">모두 선택</span>
              </label>
            </li>

            {filteredOptions.map(option => (
              <li key={option} className="relative px-2">
                <label className="flex items-center px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleSelect(option)}
                  />
                  <span className="ml-2 text-black dark:text-white">{option}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="sticky bottom-0 p-2 bg-white dark:bg-[#1E2028] border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            {selectedOptions.length} items selected
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelection;
