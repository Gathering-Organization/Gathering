import { approxPostInfo } from './../types/post';
import { useNavigate } from 'react-router-dom';

const PostItem: React.FC<approxPostInfo> = ({
  title,
  closed,
  authorNickname,
  projectType,
  createdAt,
  deadline,
  techStacks,
  requiredPositions
}) => {
  const nav = useNavigate();

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <button onClick={() => nav(`/viewPost/${1}`)} className="block font-semibold mb-2">
          제목 : {title}
        </button>
        <label className="block font-semibold mb-2">모집완료 : {String(closed)}</label>
        <label className="block font-semibold mb-2">작성자 : {authorNickname}</label>
        <label className="block font-semibold mb-2">모집 타입: {projectType}</label>
        <label className="block font-semibold mb-2">생성일 : {createdAt}</label>
        <label className="block font-semibold mb-2">마감일 : {deadline}</label>
        <label className="block font-semibold mb-2">사용 기술 스택 : {techStacks}</label>
        <label className="block font-semibold mb-2">모집 포지션 : {requiredPositions}</label>
      </section>
    </div>
  );
};

export default PostItem;
