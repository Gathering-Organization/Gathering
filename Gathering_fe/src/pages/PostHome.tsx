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
import { useDropdown } from '@/contexts/DropdownContext';
import { ProfileAllInfo } from '@/types/profile';
import { ProfileCacheContext } from '@/contexts/ProfileCacheContext';
import Pagination from '@/components/Pagination';
import OptionalDropdown from '@/components/OptionalDropdown';
import { useToast } from '@/contexts/ToastContext';
import EmblaCarouselComponent from '@/components/BannerCarousel';
import banner1 from '/banner1.png';
import banner2 from '/banner2.png';
import banner3 from '/banner3.png';

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
  const [totalPages, setTotalPages] = useState<number>(1);
  const closedOption = hideClosed ? false : '';
  const [searchType, setSearchType] = useState('TITLE');
  const [keyword, setKeyword] = useState('');

  const { activeDropdown, setActiveDropdown } = useDropdown();

  const isOpen = activeDropdown === 'sort';

  const [profileCache, setProfileCache] = useState<{ [nickname: string]: ProfileAllInfo }>({});

  const filteredPosts = post.filter(p => {
    if (showInterested && !p.interested) return false;
    return true;
  });

  const slides = [
    <div
      onClick={() =>
        window.open(
          'https://diligent-cloudberry-302.notion.site/2a745ef4e68380c78e13d191347bdf7b?pvs=74',
          '_blank'
        )
      }
      className="relative cursor-pointer h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg group transform transition-transform duration-300 hover:scale-[1.005] will-change-transform"
    >
      <div className="hidden sm:block absolute inset-0">
        <img src={banner3} alt="사용 설명서 배너" className="w-full h-full object-cover" />
      </div>
      <div className="block sm:hidden w-full h-full bg-[#FFD94D]" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-16 md:px-20 text-[#fafbfc] text-left">
        <h2 className="text-sm sm:text-2xl md:text-3xl font-semibold md:font-bold">
          게더링(Gathering) 최고의 팀 리더 찾기 이벤트
        </h2>
        <p className="text-xs sm:text-sm md:text-lg mt-2 font-normal md:font-medium">
          이벤트 페이지 보러가기 &gt;&gt;
        </p>
      </div>
    </div>,
    <div
      onClick={() =>
        window.open(
          'https://diligent-cloudberry-302.notion.site/Gathering-25545ef4e6838014a912cd391552ab99?source=copy_link',
          '_blank'
        )
      }
      className="relative cursor-pointer h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg group transform transition-transform duration-300 hover:scale-[1.005] will-change-transform"
    >
      <div className="hidden sm:block absolute inset-0">
        <img src={banner2} alt="사용 설명서 배너" className="w-full h-full object-cover" />
      </div>
      <div className="block sm:hidden w-full h-full bg-[#3387E5]" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-16 md:px-20 text-[#fafbfc] text-left">
        <h2 className="text-sm sm:text-2xl md:text-3xl font-semibold md:font-bold">
          사용 방법을 배우면 프로젝트의 매칭 확률이 올라가요!
        </h2>
        <p className="text-xs sm:text-sm md:text-lg mt-2 font-normal md:font-medium">
          게더링 서비스의 사용설명서 보러가기 &gt;&gt;
        </p>
      </div>
    </div>,

    <div
      onClick={() => window.open('https://github.com/Gathering-Organization/Gathering', '_blank')}
      className="relative cursor-pointer h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg group transform transition-transform duration-300 hover:scale-[1.005] will-change-transform"
    >
      <div className="hidden sm:block absolute inset-0">
        <img src={banner1} alt="깃허브 배너" className="w-full h-full object-cover" />
      </div>
      <div className="block sm:hidden w-full h-full bg-[#24292E]" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-16 md:px-20 text-[#fafbfc] text-left">
        <h2 className="text-sm sm:text-2xl md:text-3xl font-semibold md:font-bold">
          IT 초심자를 위한 팀원 모집 웹서비스, 게더링
        </h2>
        <p className="text-xs sm:text-sm md:text-lg mt-2 font-normal md:font-medium">
          게더링 서비스의 오픈소스 보러가기 &gt;&gt;
        </p>
      </div>
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
        setActiveDropdown(null);
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
    setActiveDropdown(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const displayedPosts = filteredPosts;

  return (
    <ProfileCacheContext.Provider value={{ profileCache }}>
      <DropdownDispatchContext.Provider value={{ setSelectedStack, setSelectedPosition }}>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8">
          <div className="pb-4">
            <EmblaCarouselComponent slides={slides} options={{ loop: true }} />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 px-2 sm:px-0 xl:mx-4">
            <ProjecTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
            <div className="w-full md:w-auto md:max-w-xl flex justify-end xl:w-[600px]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10 px-0 xl:mx-4">
            <section className="w-full flex flex-wrap mb-3 justify-center lg:justify-start gap-3 sm:gap-4 text-base font-bold text-[#B4B4B4] xl:space-x-4">
              <div className="relative z-20">
                <OptionalDropdown
                  menuData={stackData}
                  label="기술 스택"
                  align="left"
                  buttonClassName="custom-button-class"
                />
              </div>
              <div className="relative z-20">
                <MultiLevelDropdown
                  menuData={positionData}
                  label="포지션"
                  align="left"
                  buttonClassName="custom-button-class"
                />
              </div>
              <FilteringButton
                title="관심글 모아보기"
                option={showInterested}
                onClick={() => setShowInterested(prev => !prev)}
                icon={<img src={heart} alt="Heart" className="w-5 h-5" />}
                afterIcon={<img src={blueHeart} alt="BlueHeart" className="w-5 h-5" />}
              />
              <FilteringButton
                title="완료글 제외하기"
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
                setActiveDropdown(activeDropdown === 'sort' ? null : 'sort');
              }}
              className="inline-flex items-center justify-between w-full lg:w-auto min-w-[160px] px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
            >
              {sortType === '-createdAt'
                ? '최신순'
                : sortType === 'createdAt'
                  ? '오래된순'
                  : '인기순'}
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 right-0 lg:left-auto lg:right-0 w-full lg:w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700 z-20 animate-fadeDown"
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
          <div className="z-0 space-y-24 sm:space-y-20 pt-0 px-0 xl:pt-4 xl:mx-4">
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
