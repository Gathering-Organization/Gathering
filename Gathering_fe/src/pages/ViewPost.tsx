import Viewer from '../components/Viewer';
import { useState, useEffect } from 'react';
import { partPostInfo } from '@/types/post';
import { getPartPosting, modifyPosting, deletePosting } from '@/services/postApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProfile } from '@/services/profileApi';

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<partPostInfo | null>(null);
  const nav = useNavigate();
  const params = useParams();
  const [userNickname, setUserNickname] = useState<string>('');

  const onClickDelete = () => {
    if (params.id && window.confirm('모집글을 삭제하시겠습니까?')) {
      deletePosting(Number(params.id));
      nav('/', { replace: true });
    }
  };

  const onClickUpdate = () => {
    if (params.id && window.confirm('모집글을 수정하시겠습니까?')) {
      modifyPosting(Number(params.id));
    }
  };

  useEffect(() => {
    console.log(params.id);
    const fetchProfile = async () => {
      try {
        const profileResult = await getMyProfile();
        if (profileResult?.success) {
          setUserNickname(profileResult.data.nickname);
        } else {
          alert('프로필 정보를 불러오는 중 오류가 발생했습니다.');
        }
      } catch {
        alert('프로필 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResult = await getPartPosting(Number(params.id));
        if (postResult?.success) {
          setPost(postResult.data);
        } else {
          alert('모집글 정보를 불러오는 중 오류가 발생했습니다.');
        }
      } catch {
        alert('모집글 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPost();
  }, []);

  return (
    <div className="pb-10">
      {post ? <Viewer data={post} /> : <p>로딩 중...</p>}
      {post?.authorNickname === userNickname && (
        <section className="grid grid-cols-2 gap-4">
          <button
            onClick={onClickUpdate}
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
      )}
    </div>
  );
};

export default ViewPost;
