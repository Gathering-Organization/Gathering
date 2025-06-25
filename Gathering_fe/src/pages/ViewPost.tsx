import Viewer from '@/components/Viewer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { partPostInfo } from '@/types/post';
import { getPartPosting, modifyPosting, deletePosting } from '@/services/postApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProfile } from '@/services/profileApi';
import Spinner from '@/components/Spinner';
import { useToast } from '@/contexts/ToastContext';
import BeatLoader from 'react-spinners/BeatLoader';

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<partPostInfo | null>(null);
  const params = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        window.scrollTo(0, 0);
        const postResult = await getPartPosting(Number(params.id));

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
            <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
              <BeatLoader color="#3387E5" size={20} />
              <p className="mt-4 text-gray-700 font-semibold">로딩 중입니다...</p>
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
