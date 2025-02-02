import Viewer from '../components/Viewer';
import { useState, useEffect } from 'react';
import { partPostInfo } from '@/types/post';
import { getPartPosting, modifyPosting, deletePosting } from '@/services/postApi';
import { useNavigate } from 'react-router-dom';

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<partPostInfo | null>(null);
  const nav = useNavigate();

  const onClickDelete = () => {
    if (window.confirm('모집글을 삭제하시겠습니까?')) {
      deletePosting(1);
      nav('/', { replace: true });
    }
  };

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

  return (
    <div className="pb-10">
      {post ? <Viewer data={post} /> : <p>로딩 중...</p>}
      <section className="grid grid-cols-2 gap-4">
        <button
          onClick={() => nav('/posting')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          수정하기
        </button>
        <button
          onClick={onClickDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          삭제하기
        </button>
      </section>
    </div>
  );
};

export default ViewPost;
