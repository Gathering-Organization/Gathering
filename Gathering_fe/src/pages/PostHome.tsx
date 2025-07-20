import { useCallback, useState, useEffect, useRef, createContext } from 'react';
import PostList from '@/components/PostList';
import { getAllPosting } from '@/services/postApi';
import { ApproxPostInfo } from '@/types/post';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import SearchBar from '@/components/SearchBar';
import MultiLevelDropdown from '@/components/MultiLevelDropdown';
import { stackData } from '@/utils/stack-data';
import { positionData } from '@/utils/position-data';
import FilteringButton from '@/components/FilteringButton';
import eye from '@/assets/otherIcons/eye.png';
import blueEye from '@/assets/otherIcons/Blue_Eye.png';
import blueHeart from '@/assets/otherIcons/Blue_Heart.png';
import heart from '@/assets/otherIcons/heart.png';
import banner1 from '@/assets/stackIcons/react.svg';
import banner2 from '@/assets/stackIcons/react.svg';
import banner3 from '@/assets/stackIcons/react.svg';
import { ProfileAllInfo } from '@/types/profile';
import { ProfileCacheContext } from '@/contexts/ProfileCacheContext';
import Pagination from '@/components/Pagination';
import OptionalDropdown from '@/components/OptionalDropdown';
import { useToast } from '@/contexts/ToastContext';
import EmblaCarouselComponent from '@/components/BannerCarousel';

interface DropdownDispatchContextType {
  setSelectedStack: (value: string[]) => void;
  setSelectedPosition: (value: string) => void;
}

export const DropdownDispatchContext = createContext<DropdownDispatchContextType | null>(null);

const PostHome: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('-createdAt');
  const [post, setPost] = useState<ApproxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStack, setSelectedStack] = useState<string[]>(['전체']);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [showInterested, setShowInterested] = useState<boolean>(false);
  const [hideClosed, setHideClosed] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const closedOption = hideClosed ? false : '';
  const [searchType, setSearchType] = useState('TITLE');
  const [keyword, setKeyword] = useState('');

  const [profileCache, setProfileCache] = useState<{ [nickname: string]: ProfileAllInfo }>({});

  const filteredPosts = post.filter(p => {
    if (showInterested && !p.interested) return false;
    return true;
  });

  const slides = [
    <div className="h-64 bg-blue-300 flex items-center justify-center text-3xl text-white rounded-xl">
      Slide 1
    </div>,
    <div className="h-64 bg-blue-400 flex items-center justify-center text-3xl text-white rounded-xl">
      Slide 2
    </div>,
    <div className="h-64 bg-blue-500 flex items-center justify-center text-3xl text-white rounded-xl">
      Slide 3
    </div>
  ];

  const { showToast } = useToast();

  const updatePostInterest = (projectId: number, newInterest: boolean) => {
    setPost(prevPosts =>
      prevPosts.map(post =>
        post.projectId === projectId ? { ...post, interested: newInterest } : post
      )
    );
  };

  useEffect(() => {
    const toastRaw = localStorage.getItem('toastMessage');
    if (toastRaw) {
      try {
        const toast = JSON.parse(toastRaw);
        if (toast.message) {
          showToast(toast.message, toast.isSuccess);
        }
      } catch (err) {
        console.error('Invalid toast data:', err);
      }
      localStorage.removeItem('toastMessage');
    }
    const getAllPost = async () => {
      try {
        // window.scrollTo(0, 0);
        const result = await getAllPosting(
          page,
          sortType,
          selectedPosition !== '전체' ? selectedPosition : '',
          selectedStack[0] !== '전체' ? selectedStack : [],
          selectedType !== 'ALL' ? selectedType : '',
          '',
          closedOption,
          searchType,
          keyword
        );
        if (result?.success) {
          // showToast('모집글 조회가 완료되었습니다.', true);
          setPost(result.data);
          setTotalPages(result.pagination.totalPages);
        } else {
          showToast('모집글 조회 중 오류가 발생했습니다.', false);
        }
      } catch (error) {
        showToast('모집글 조회 중 오류가 발생했습니다.', false);
      }
    };
    getAllPost();
  }, [
    page,
    sortType,
    selectedPosition,
    selectedStack,
    selectedType,
    hideClosed,
    searchType,
    keyword
  ]);

  const handleSearch = useCallback(
    ({ searchType, keyword }: { searchType: string; keyword: string }) => {
      setSearchType(searchType);
      setKeyword(keyword);
    },
    []
  );

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

  const onChangeSortType = (option: string) => {
    if (option === '최신순') {
      setSortType('-createdAt');
    } else if (option === '오래된순') {
      setSortType('createdAt');
    } else if (option === '인기순') {
      setSortType('viewCount');
    }
    setIsDropdownOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const displayedPosts = filteredPosts;

  return (
    <ProfileCacheContext.Provider value={{ profileCache }}>
      <DropdownDispatchContext.Provider value={{ setSelectedStack, setSelectedPosition }}>
        <div className="mx-36 space-y-6">
          <div className="pb-4">
            <EmblaCarouselComponent slides={slides} options={{ loop: true }} />
          </div>
          <div className="mx-6 flex justify-between items-center pb-4">
            <ProjecTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
            <div className="flex justify-end w-[600px]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <div className="mx-4 flex justify-between items-center relative">
            <section className="flex text-[16px] font-bold space-x-8 text-[#B4B4B4] z-10">
              <OptionalDropdown
                menuData={stackData}
                label="기술 스택"
                align="left"
                buttonClassName="custom-button-class"
              />
              <MultiLevelDropdown
                menuData={positionData}
                label="포지션"
                align="left"
                buttonClassName="custom-button-class"
              />
              <FilteringButton
                title="관심글 모아보기"
                option={showInterested}
                onClick={() => setShowInterested(prev => !prev)}
                icon={<img src={heart} alt="Heart" className="w-5 h-5" />}
                afterIcon={<img src={blueHeart} alt="BlueHeart" className="w-5 h-5" />}
              />
              <FilteringButton
                title="모집완료 제외하기"
                option={hideClosed}
                onClick={() => setHideClosed(prev => !prev)}
                icon={<img src={eye} alt="Eye" className="w-5 h-5" />}
                afterIcon={<img src={blueEye} alt="BlueEye" className="w-5 h-5" />}
              />
            </section>
            {/* 정렬 옵션을 선택하는 드롭다운 버튼 */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="inline-flex items-center justify-between min-w-[160px] px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
            >
              {sortType === '-createdAt'
                ? '최신순'
                : sortType === 'createdAt'
                  ? '오래된순'
                  : '인기순'}
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 right-0 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700 z-20 animate-fadeDown"
              >
                <ul className="py-1 text-sm text-black font-bold text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={() => onChangeSortType('최신순')}
                      className="block w-full text-black text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      최신순
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onChangeSortType('오래된순')}
                      className="block w-full text-black text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      오래된순
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onChangeSortType('인기순')}
                      className="block w-full text-black text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      인기순
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="z-0 mx-4 space-y-24 pt-4">
            <PostList data={displayedPosts} onInterestToggle={updatePostInterest} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </DropdownDispatchContext.Provider>
    </ProfileCacheContext.Provider>
  );
};

export default PostHome;
