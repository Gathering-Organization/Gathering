import { useCallback, useState, useEffect, useRef, createContext } from 'react';
import PostList from '@/components/PostList';
import { getAllPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import SearchBar from '@/components/SearchBar';
import MultiLevelDropdown from '@/components/MultiLevelDropdown';
import { stackData } from '@/utils/stack-data';
import { positionData } from '@/utils/position-data';
import FilteringButton from '@/components/FilteringButton';
import eye from '@/assets/otherIcons/eye.png';
import heart from '@/assets/otherIcons/heart.png';
import { getUserProfile } from '@/services/profileApi';
import { ProfileAllInfo } from '@/types/profile';
import { ProfileCacheContext } from '@/contexts/ProfileCacheContext';
import Pagination from '@/components/Pagination';

interface DropdownDispatchContextType {
  setSelectedStack: (value: string) => void;
  setSelectedPosition: (value: string) => void;
}

export const DropdownDispatchContext = createContext<DropdownDispatchContextType | null>(null);

const PostHome: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('-createdAt');
  const [post, setPost] = useState<approxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStack, setSelectedStack] = useState<string>('전체');
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [showInterested, setShowInterested] = useState<boolean>(false);
  const [hideClosed, setHideClosed] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchType, setSearchType] = useState('TITLE');
  const [keyword, setKeyword] = useState('');

  const [profileCache, setProfileCache] = useState<{ [nickname: string]: ProfileAllInfo }>({});

  const filteredPosts = post.filter(p => {
    // if (selectedType !== 'ALL' && p.projectType !== selectedType) return false;
    // if (selectedStack !== '전체' && !p.techStacks.includes(selectedStack)) return false;
    // if (selectedPosition !== '전체' && !p.requiredPositions.includes(selectedPosition))
    //   return false;
    if (showInterested && !p.interested) return false;
    // if (hideClosed && p.closed) return false;
    return true;
  });

  const updatePostInterest = (projectId: number, newInterest: boolean) => {
    setPost(prevPosts =>
      prevPosts.map(post =>
        post.projectId === projectId ? { ...post, interested: newInterest } : post
      )
    );
  };

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const result = await getAllPosting(
          page,
          sortType,
          selectedPosition !== '전체' ? selectedPosition : '',
          selectedStack !== '전체' ? [selectedStack] : [],
          selectedType !== 'ALL' ? selectedType : '',
          '',
          hideClosed,
          searchType,
          keyword
        );
        if (result?.success) {
          alert('전체 모집글 조회가 완료되었습니다.');
          console.log(result.data);
          setPost(result.data);
        } else {
          alert(result?.message || '전체 모집글 조회 중 오류가 발생했습니다.');
        }
      } catch (error) {
        alert('전체 모집글 조회 중 오류가 발생했습니다.');
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

  useEffect(() => {
    if (post.length > 0) {
      const uniqueAuthors = Array.from(new Set(post.map(p => p.authorNickname)));
      const fetchProfiles = async () => {
        const newCache = { ...profileCache };
        await Promise.all(
          uniqueAuthors.map(async nickname => {
            if (!newCache[nickname]) {
              try {
                const result = await getUserProfile(nickname);
                if (result?.success) {
                  newCache[nickname] = result.data as ProfileAllInfo;
                }
              } catch (error) {
                console.error(`프로필 정보 불러오기 실패: ${nickname}`);
              }
            }
          })
        );
        setProfileCache(newCache);
      };
      fetchProfiles();
    }
  }, [post]);

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

  // const getSortedDate = () => {
  //   return filteredPosts.slice().sort((a, b) => {
  //     if (sortType === 'most') {
  //       return b.viewCount - a.viewCount;
  //     } else {
  //       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  //     }
  //   });
  // };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const displayedPosts = filteredPosts;

  return (
    <ProfileCacheContext.Provider value={{ profileCache }}>
      <DropdownDispatchContext.Provider value={{ setSelectedStack, setSelectedPosition }}>
        <div className="mx-28 space-y-6">
          <div className="flex justify-between items-center">
            <ProjecTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
            <div className="flex justify-end w-[600px]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <div className="flex justify-between items-center relative">
            <section className="flex text-[16px] font-bold space-x-8 text-[#B4B4B4] pb-4 z-10">
              <MultiLevelDropdown
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
              />
              <FilteringButton
                title="모집완료 제외하기"
                option={hideClosed}
                onClick={() => setHideClosed(prev => !prev)}
                icon={<img src={eye} alt="Eye" className="w-5 h-5" />}
              />
            </section>
            {/* 정렬 옵션을 선택하는 드롭다운 버튼 */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="shrink-0 z-10 w-[120px] inline-flex items-center justify-between py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              {sortType === '-createdAt'
                ? '최신순'
                : sortType === 'createdAt'
                  ? '오래된순'
                  : '인기순'}
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
                className="absolute top-full right-0 mt-1 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 z-20"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={() => onChangeSortType('최신순')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      최신순
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onChangeSortType('오래된순')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      오래된순
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onChangeSortType('인기순')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      인기순
                    </button>
                  </li>
                </ul>
              </div>
            )}
            {/* <select
            onChange={onChangeSortType}
            className="border-[#B4B4B4] border-solid text-[16px] font-bold text-[#B4B4B4] z-10 rounded-[20px] border-2 px-4 py-1 border-[#3387E5] border-solid cursor-pointer"
          >
            <option value={'latest'}>최신순</option>
            <option value={'most'}>인기순</option>
          </select> */}
          </div>
          <div className="z-0">
            <PostList data={displayedPosts} onInterestToggle={updatePostInterest} />
            <Pagination currentPage={page} totalPages={10} onPageChange={handlePageChange} />
          </div>
        </div>
      </DropdownDispatchContext.Provider>
    </ProfileCacheContext.Provider>
  );
};

export default PostHome;
