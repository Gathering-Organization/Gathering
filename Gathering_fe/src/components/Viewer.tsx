import { partPostInfo } from './../types/post';

interface ViewerProps {
  data: partPostInfo | null;
}

const Viewer: React.FC<ViewerProps> = ({ data }) => {
  if (!data) return <p>데이터를 불러오는 중...</p>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <button className="block font-semibold mb-2">제목 : {data.title}</button>
        <label className="block font-semibold mb-2">모집완료 : {String(data.closed)}</label>
        <label className="block font-semibold mb-2">작성자 : {data.authorNickname}</label>
        <label className="block font-semibold mb-2">모집 타입: {data.projectType}</label>
        <label className="block font-semibold mb-2">생성일 : {data.createdAt}</label>
        <label className="block font-semibold mb-2">최종 수정일 : {data.updatedAt}</label>
        <label className="block font-semibold mb-2">마감일 : {data.deadline}</label>
        <label className="block font-semibold mb-2">
          사용 기술 스택 : {data.techStacks.join(', ')}
        </label>
        <label className="block font-semibold mb-2">진행 방식 : {data.projectMode}</label>
        <label className="block font-semibold mb-2">전체 인원 : {data.totalMembers}</label>
        <label className="block font-semibold mb-2">시작일 : {data.startDate}</label>
        <label className="block font-semibold mb-2">
          모집 포지션 : {data.requiredPositions.join(', ')}
        </label>
        <label className="block font-semibold mb-2">상세 설명 : {data.description}</label>
      </section>
    </div>
  );
};

export default Viewer;
