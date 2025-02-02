import Viewer from '../components/Viewer';
import { useState, useEffect } from 'react';
import { partPostInfo } from '@/types/post';
import { getPartPosting } from '@/services/postApi';

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<partPostInfo | null>(null);

  useEffect(() => {
    const getPartPost = async () => {
      try {
        const result = await getPartPosting(1);

        if (result?.success) {
          alert('모집글 상세 조회가 완료되었습니다.');
          console.log(result.data);
          setPost(result.data);
        } else {
          alert(result?.message || '모집글 상세 조회 중 오류가 발생했습니다.');
        }
      } catch {
        alert('모집글 상세 조회 중 오류가 발생했습니다.');
      }
    };
    getPartPost();
  }, []);

  return <div>{post ? <Viewer data={post} /> : <p>로딩 중...</p>}</div>;
};

export default ViewPost;
