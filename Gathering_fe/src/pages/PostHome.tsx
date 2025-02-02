import PostList from '@/components/PostList';
import { getAllPosting } from './../services/postApi';
import { useState, useEffect } from 'react';
import { approxPostInfo } from './../types/post';

const PostHome: React.FC = () => {
  const [post, setPost] = useState<approxPostInfo[]>([]);

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
    <div>
      <PostList data={post} />
    </div>
  );
};

export default PostHome;
