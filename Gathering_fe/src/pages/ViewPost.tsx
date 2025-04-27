import Viewer from '@/components/Viewer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { partPostInfo } from '@/types/post';
import { getPartPosting, modifyPosting, deletePosting } from '@/services/postApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProfile } from '@/services/profileApi';
import Spinner from '@/components/Spinner';
import { useToast } from '@/contexts/ToastContext';

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<partPostInfo | null>(null);
  const nav = useNavigate();
  const params = useParams();
  const [userNickname, setUserNickname] = useState<string>('');
  const { showToast } = useToast();

  // const onClickDelete = () => {
  //   if (params.id && window.confirm('모집글을 삭제하시겠습니까?')) {
  //     deletePosting(Number(params.id));
  //     nav('/', { replace: true });
  //   }
  // };

  // const onClickUpdate = () => {
  //   if (params.id && window.confirm('모집글을 수정하시겠습니까?')) {
  //     nav(`/postEdit/${params.id}`);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        window.scrollTo(0, 0);
        const [profileResult, postResult] = await Promise.all([
          getMyProfile(),
          getPartPosting(Number(params.id))
        ]);

        if (profileResult?.success) {
          setUserNickname(profileResult.data.nickname);
        } else {
          showToast('프로필 정보를 불러오는 중 오류가 발생했습니다.', false);
        }

        if (postResult?.success) {
          setPost(postResult.data);
        } else {
          showToast('모집글 정보를 불러오는 중 오류가 발생했습니다.', false);
        }
      } catch {
        showToast('데이터를 불러오는 중 오류가 발생했습니다.', false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <motion.div
      className="flex flex-col min-h-screen pb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col min-h-screen pb-10">
        <div className="flex-grow">
          {post ? (
            <Viewer data={post} />
          ) : (
            <div className="min-h-[600px] flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
        {/* {post?.authorNickname === userNickname && (
        <section className="flex gap-4 mt-4 justify-center">
          <button onClick={onClickUpdate} className="duration-200 ease-in-out hover:scale-110">
            <img src={editButton} alt="edit" className="" />
          </button>
          <button onClick={onClickDelete} className="duration-200 ease-in-out hover:scale-110">
            <img src={deleteButton} alt="delete" className="" />
          </button>
        </section>
      )} */}
      </div>
    </motion.div>
  );
};

export default ViewPost;
