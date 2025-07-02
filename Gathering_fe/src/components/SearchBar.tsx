import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (params: { searchType: string; keyword: string }) => void;
}
const searchOptions = [
  { value: 'TITLE', label: '제목' },
  { value: 'CONTENT', label: '내용' },
  { value: 'TITLE_CONTENT', label: '제목+내용' }
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('TITLE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch({ searchType, keyword });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, searchType, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
      className="max-w-lg w-full"
    >
      <div className="flex relative">
        {/* 드롭다운 버튼 */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="shrink-0 z-20 w-[120px] inline-flex items-center justify-between py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
        >
          {searchOptions.find(option => option.value === searchType)?.label || '옵션 선택'}
          <svg
            className="w-2.5 h-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute mt-12 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 z-20 animate-fadeDown"
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {searchOptions.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setSearchType(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 검색창 */}
        <div className="relative w-full">
          <input
            type="search"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-e-lg focus:outline-none"
            placeholder="검색어를 입력하세요..."
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
