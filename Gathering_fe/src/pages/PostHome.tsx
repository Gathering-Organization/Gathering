import PostList from '@/components/PostList';
import { getAllPosting } from '@/services/postApi';
import { useState, useEffect } from 'react';
import { approxPostInfo } from '@/types/post';
import { useNavigate } from 'react-router-dom';
import { projectType } from '@/utils/project-type';
import SearchBar from '@/components/SearchBar';
import MultiLevelDropdown from '@/components/MultiLevelDropdown';
import { stackData } from '@/utils/stack-data';
import { positionData } from '@/utils/position-data';

const PostHome: React.FC = () => {
  const [post, setPost] = useState<approxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const nav = useNavigate();

  const filteredPosts =
    selectedType === 'ALL' ? post : post.filter(p => p.projectType === selectedType);

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const result = await getAllPosting();

        if (result?.success) {
          alert('전체 모집글 조회가 완료되었습니다.');
          console.log(result.data);
          setPost(result.data); // 배열로 저장
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
        <section className="text-[24px] font-bold space-x-8 flex">
          {projectType.map(item => (
            <button
              onClick={() => setSelectedType(item.projectType)}
              key={item.projectTypeId}
              className={`${selectedType === item.projectType ? 'text-black' : 'text-[#B4B4B4]'}`}
            >
              {item.projectTypeName}
            </button>
          ))}
        </section>

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
          <button>관심글 모아보기</button>
          <button>모집완료 제외하기</button>
        </section>
        <section>최신순</section>
      </div>
      <div className="z-0">
        <PostList data={filteredPosts} />
      </div>
    </div>
  );
};

export default PostHome;
