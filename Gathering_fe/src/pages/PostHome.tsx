import { useCallback, useState, useEffect, createContext } from 'react';
import PostList from '@/components/PostList';
import { getAllPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import SearchBar from '@/components/SearchBar';
import MultiLevelDropdown from '@/components/MultiLevelDropdown';
import { stackData } from '@/utils/stack-data';
import { positionData } from '@/utils/position-data';
import FilteringButton from '@/components/FilteringButton';

interface DropdownDispatchContextType {
  setSelectedStack: (value: string) => void;
  setSelectedPosition: (value: string) => void;
}

export const DropdownDispatchContext = createContext<DropdownDispatchContextType | null>(null);

const PostHome: React.FC = () => {
  const [post, setPost] = useState<approxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStack, setSelectedStack] = useState<string>('전체');
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [showInterested, setShowInterested] = useState<boolean>(false);
  const [hideClosed, setHideClosed] = useState<boolean>(false);

  const filteredPosts = post.filter(p => {
    if (selectedType !== 'ALL' && p.projectType !== selectedType) return false;
    if (selectedStack !== '전체' && !p.techStacks.includes(selectedStack)) return false;
    if (selectedPosition !== '전체' && !p.requiredPositions.includes(selectedPosition))
      return false;
    if (showInterested && !p.interested) return false;
    if (hideClosed && p.closed) return false;
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
        const result = await getAllPosting();
        if (result?.success) {
          alert('전체 모집글 조회가 완료되었습니다.');
          console.log(result.data);
          setPost(result.data);
        } else {
          alert(result?.message || '전체 모집글 조회 중 오류가 발생했습니다.');
        }
      } catch {
        alert('전체 모집글 조회 중 오류가 발생했습니다.');
      }
    };
    getAllPost();
  }, []);

  const handleSearch = useCallback((data: approxPostInfo[]) => {
    setPost(data);
  }, []);

  return (
    <DropdownDispatchContext.Provider value={{ setSelectedStack, setSelectedPosition }}>
      <div className="mx-24 space-y-6">
        <div className="flex justify-between items-center">
          <ProjecTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
          <div className="flex justify-end w-[600px]">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <section className="text-[16px] font-bold space-x-8 text-[#B4B4B4] pb-4 z-10">
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
            />
            <FilteringButton
              title="모집완료 제외하기"
              option={hideClosed}
              onClick={() => setHideClosed(prev => !prev)}
            />
          </section>
          <section>최신순</section>
        </div>
        <div className="z-0">
          <PostList data={filteredPosts} onInterestToggle={updatePostInterest} />
        </div>
      </div>
    </DropdownDispatchContext.Provider>
  );
};

export default PostHome;
