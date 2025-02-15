import { approxPostInfo } from '@/types/post';
import { useNavigate } from 'react-router-dom';
import { getStackImage } from '@/utils/get-stack-image';
import { getStringedDate } from '@/utils/get-stringed-date';
import { getUserProfile } from '@/services/profileApi';
import { useEffect, useState } from 'react';
import { ProfileInfo } from '@/types/profile';
import { projectType as projectEachType } from '@/utils/project-type';
import { positionData } from '@/utils/position-data';

// function changeDate(date: string) {
//   const newDate = new Date(date);
//   const year = newDate.getFullYear();
//   const month = ('0' + newDate.getMonth()).slice(-2);
//   const day = ('0' + newDate.getDate()).slice(-2);
//   const dateStr = `${year}-${month}-${day}`;

//   return dateStr;
// }
interface Position {
  id: string;
  title: string;
}

const PostItem: React.FC<approxPostInfo> = ({
  projectId,
  title,
  closed,
  authorNickname,
  projectType,
  createdAt,
  deadline,
  techStacks,
  requiredPositions
}) => {
  const [positionList] = useState<Position[]>([...positionData]);

  const nav = useNavigate();
  const [info, setInfo] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getUserProfile(authorNickname);

        if (result?.success) {
          setInfo({
            nickname: result.data.nickname || '',
            introduction: result.data.introduction || '',
            organization: result.data.organization || '',
            techStacks: result.data.techStacks || [],
            profileColor: result.data.profileColor || ''
          });
        } else {
          alert(result?.message || '내 정보 불러오기에 실패했습니다.');
        }
      } catch {
        alert('내 정보 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      onClick={() => nav(`/viewPost/${projectId}`)}
      className="relative transform transition duration-200 ease-in-out hover:scale-105 cursor-pointer select-none w-85"
    >
      <section className="border-[2px] border-[#B4B4B4] bg-white rounded-[30px] relative">
        {/* <div className="block font-semibold pb-2">모집완료 : {String(closed)}</div> */}
        <label
          className="absolute right-6 top-4 cursor-pointer"
          onClick={e => e.stopPropagation()} // 부모 div의 onClick 이벤트 전파 방지
        >
          <input type="checkbox" hidden className="peer" />
          <svg
            className="w-8 h-10 transition-all duration-200 ease-in-out fill-gray-300 peer-checked:fill-red-500 peer-checked:scale-110"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M742.4 101.12A249.6 249.6 0 0 0 512 256a249.6 249.6 0 0 0-230.72-154.88C143.68 101.12 32 238.4 32 376.32c0 301.44 416 546.56 480 546.56s480-245.12 480-546.56c0-137.92-111.68-275.2-249.6-275.2z" />
          </svg>
        </label>

        <section className="px-8">
          <div className="w-[110px] bg-[#3387E5] rounded-b-[20px] justify-items-center">
            <div className="font-semibold py-2 text-[#FFFFFF] items-center text-[20px]">
              {projectEachType.map(item =>
                item.projectType === projectType ? item.projectTypeName : ''
              )}
            </div>
          </div>

          <section className="py-8 text-[#B4B4B4] text-[12px]">
            <div className="font-semibold pb-0.1">생성일 | {getStringedDate(createdAt)}</div>
            <div className="font-semibold">마감일 | {getStringedDate(deadline)}</div>
          </section>

          <div className="font-bold pb-6 bg-transparent border-none text-left text-[20px]">
            {title}
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredPositions.map((positionId, index) => {
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
          {/* <div className="font-bold p-1 px-4 text-[14px] text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline">
            {requiredPositions.map(item => item)}
          </div> */}
          <div className="font-semibold py-4">
            <div className="font-semibold py-2 flex flex-wrap gap-2">
              {techStacks
                .map(item => getStackImage(item.toUpperCase()))
                .filter(Boolean)
                .map((src, index) => (
                  <img key={index} src={src!} alt={techStacks[index]} className="w-10 h-10" />
                ))}
            </div>
            {/* <img src={techStacks.map(item => getStackImage(item.toUpperCase()))} /> */}
            {/* 사용 기술 스택 : {techStacks.map(item => getStackImage(item.toUpperCase()))} */}
          </div>
        </section>

        <hr className="w-full border-[#B4B4B4]" />
        <section className="flex justify-between items-center p-2 px-6">
          <div className="flex font-semibold p-4 items-center gap-4">
            <div
              className="w-8 h-8 rounded-[30px]"
              style={{ backgroundColor: `#${info.profileColor}` }}
            ></div>
            <div>{authorNickname}</div>
          </div>
          <div className="font-semibold p-4">클릭수</div>
        </section>
      </section>
    </div>
  );
};

export default PostItem;
