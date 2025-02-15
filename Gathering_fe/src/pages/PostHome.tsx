import PostList from '@/components/PostList';
import { getAllPosting } from '@/services/postApi';
import { useState, useEffect, useRef } from 'react';
import { approxPostInfo } from '@/types/post';
import { useNavigate } from 'react-router-dom';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import SearchBar from '@/components/SearchBar';
import MultiLevelDropdown from '@/components/MultiLevelDropdown';
import { stackData } from '@/utils/stack-data';
import { positionData } from '@/utils/position-data';
import FilteringButton from '@/components/FilteringButton';

const PostHome: React.FC = () => {
  const [post, setPost] = useState<approxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showInterested, setShowInterested] = useState<boolean>(false);
  const [hideClosed, setHideClosed] = useState<boolean>(false);
  const interestRef = useRef(false);
  const nav = useNavigate();

  const filteredPosts = post.filter(p => {
    if (selectedType !== 'ALL' && p.projectType !== selectedType) return false;
    console.log(p.interested);
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

  return (
    <div className="mx-24 space-y-6">
      <div className="flex justify-between items-center">
        <ProjecTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
        <div className="flex justify-end">
          <SearchBar />
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
  );
};

export default PostHome;
