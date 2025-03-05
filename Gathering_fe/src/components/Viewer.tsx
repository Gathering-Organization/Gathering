import { partPostInfo } from '@/types/post';
import { getStringedDate } from '@/utils/get-stringed-date';
import { useState } from 'react';
import { positionData } from '@/utils/position-data';
import { getStackImage } from '@/utils/get-stack-image';

interface Position {
  id: string;
  title: string;
}

const Viewer: React.FC<{ data: partPostInfo | null }> = ({ data }) => {
  const [positionList] = useState<Position[]>([...positionData]);

  if (!data) return <p>데이터를 불러오는 중...</p>;
  const parts = data.authorNickname.split(/(#\d+)/);

  return (
    <div className="mx-48 space-y-2 min-h-screen">
      <section className="bg-white p-6 mb-4">
        <div className="flex items-center">
          <button className="block text-[36px] font-[1000] mb-20 px-4">{data.title}</button>
        </div>

        <div className="flex items-center mb-4 px-4">
          <label className="block font-bold text-[20px] me-6">{parts[0]}</label>
          <div className="flex p-2 space-x-4 text-[#000000]/50">
            <label className="block font-semibold">
              생성일 : {getStringedDate(data.createdAt)}
            </label>
            <label className="block font-semibold">
              최종 수정일 : {getStringedDate(data.updatedAt)}
            </label>
            <label className="block font-semibold">마감일 : {getStringedDate(data.deadline)}</label>
          </div>
        </div>
        <hr className="w-full justify-self-center border-[#000000]/60" />

        <div className="grid grid-cols-2 gap-6 py-10 mb-4 px-4">
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">모집 구분</div>
            <label className="block text-[#000000]/50">{data.projectType}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">진행 방식</div>
            <label className="block text-[#000000]/50">{data.projectMode}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">모집 인원</div>
            <label className="block text-[#000000]/50">{data.totalMembers}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">시작 예정</div>
            <label className="block text-[#000000]/50">{data.startDate}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">팀원 태그</div>
            <label className="block text-[#000000]/50">{data.teams.join(', ')}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">예상 기간</div>
            <label className="block text-[#000000]/50">{data.startDate}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">모집 포지션</div>
            <div className="flex flex-wrap gap-2">
              {data.requiredPositions.map((positionId, index) => {
                const positionTitle =
                  positionList.find(pos => pos.id === positionId)?.title || '알 수 없음';

                return (
                  <div
                    key={index}
                    className="font-bold p-1 px-4 text-[14px] text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline-block"
                  >
                    {positionTitle}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="">사용 스택</div>
            <div className="font-semibold py-4">
              <div className="font-semibold py-2 flex flex-wrap gap-2">
                {data.techStacks
                  .map(item => getStackImage(item.toUpperCase()))
                  .filter(Boolean)
                  .map((src, index) => (
                    <img
                      key={index}
                      src={src!}
                      alt={data.techStacks[index]}
                      className="w-10 h-10"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="block font-bold text-[24px] mb-4 px-4">모집 소개</div>
        <hr className="w-full justify-self-center border-[#000000]/60 py-4" />
        <label className="block px-4">{data.description}</label>
      </section>
    </div>
  );
};

export default Viewer;
