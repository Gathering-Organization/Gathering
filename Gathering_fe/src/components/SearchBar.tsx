import { useState, useEffect } from 'react';
import { searchPosting, getAllPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';

interface SearchBarProps {
  onSearch: (data: approxPostInfo[]) => void;
}

const searchOptions = [
  { value: 'TITLE', label: '제목' },
  { value: 'CONTENT', label: '내용' },
  { value: 'TITLE_CONTENT', label: '제목+내용' }
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('TITLE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const performSearch = async () => {
        try {
          if (keyword.trim() === '') {
            const result = await getAllPosting();
            console.log('전체 모집글 조회 결과:', result);
            if (result?.success) {
              onSearch(result.data);
            }
          } else {
            const result = await searchPosting(searchType, keyword);
            console.log('검색 결과:', result);
            if (result?.success) {
              onSearch(result.data);
            }
          }
        } catch (error) {
          console.error('검색 중 오류 발생:', error);
        }
      };
      performSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, searchType, onSearch]);

  return (
    <div className="flex items-center max-w-md w-full relative space-x-4">
      {/* 드롭다운 버튼 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {searchOptions.find(option => option.value === searchType)?.label || '옵션 선택'}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
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

        {isDropdownOpen && (
          <div className="z-10 absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {searchOptions.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setSearchType(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 검색창 */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="검색어를 입력하세요."
        />
      </div>
    </div>
  );
};

export default SearchBar;
