import { approxPostInfo } from '@/types/post';
import { useNavigate } from 'react-router-dom';
import { getStackImage } from '@/utils/get-stack-image';
import { getStringedDate } from '@/utils/get-stringed-date';
import { useProfileCache } from '@/contexts/ProfileCacheContext';
import { useState } from 'react';
import { projectType as projectEachType } from '@/utils/project-and-apply-type';
import { positionData } from '@/utils/position-data';
import { setInterest } from '@/services/interestApi';
import eye from '@/assets/otherIcons/eye.png';

interface Position {
  id: string;
  title: string;
}

const PostItem: React.FC<
  approxPostInfo & { onInterestToggle?: (projectId: number, newValue: boolean) => void }
> = ({
  projectId,
  title,
  closed,
  interested: initialInterested,
  authorNickname,
  projectType,
  createdAt,
  deadline,
  techStacks,
  onInterestToggle,
  requiredPositions,
  viewCount
}) => {
  const [positionList] = useState<Position[]>([...positionData]);
  const [isInterested, setIsInterested] = useState<boolean>(initialInterested);
  const nav = useNavigate();

  const { profileCache } = useProfileCache();

  const profileInfo = profileCache[authorNickname] || {
    profileColor: 'cccccc',
    nickname: authorNickname,
    introduction: '',
    techStacks: [],
    portfolio: null,
    public: false,
    workExperiences: [],
    organization: ''
  };

  const onClickHeart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!projectId) return;

    const prevState = isInterested;
    try {
      setIsInterested(!prevState);
      if (onInterestToggle) onInterestToggle(projectId, !prevState);
      await setInterest(Number(projectId));
    } catch (error) {
      setIsInterested(prevState);
      if (onInterestToggle) onInterestToggle(projectId, prevState);
      alert('관심글 설정에 실패했습니다.');
    }
  };

  const parts = authorNickname.split(/(#\d+)/);
  const visibleTechStacks = techStacks.slice(0, 3);
  const extraTechStacksCount = techStacks.length - 3;

  const visiblePositions = requiredPositions.slice(0, 2);
  const extraPositionsCount = requiredPositions.length - 2;

  return (
    <div
      onClick={() => nav(`/viewPost/${projectId}`)}
      className="relative transform transition duration-200 ease-in-out hover:scale-105 cursor-pointer select-none w-85 will-change-transform"
    >
      <section className="border-[2px] border-[#B4B4B4] bg-white rounded-[30px] relative">
        <label className="absolute right-6 top-4 cursor-pointer" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            onClick={onClickHeart}
            hidden
            checked={isInterested}
            readOnly
            onChange={() => {}}
          />
          <svg
            className={`w-8 h-10 transition-all duration-200 ease-in-out ${
              isInterested ? 'fill-red-500 scale-110' : 'fill-gray-300'
            }`}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M742.4 101.12A249.6 249.6 0 0 0 512 256a249.6 249.6 0 0 0-230.72-154.88C143.68 101.12 32 238.4 32 376.32c0 301.44 416 546.56 480 546.56s480-245.12 480-546.56c0-137.92-111.68-275.2-249.6-275.2z" />
          </svg>
        </label>

        <section className="px-8">
          <div className="w-[110px] bg-[#3387E5] rounded-b-[20px] justify-items-center">
            <div
              className="font-semibold py-2 text-[#FFFFFF] items-center text-[20px]"
              style={{ willChange: 'transform' }}
            >
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
          {/* <div className="flex flex-wrap gap-2">
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
          </div> */}
          <div className="flex flex-wrap gap-2">
            {visiblePositions.map((positionId, index) => {
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
            {extraPositionsCount > 0 && (
              <div className="font-bold p-1 px-4 text-[14px] text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline-block">
                +{extraPositionsCount}
              </div>
            )}
          </div>
          <div className="font-semibold py-4">
            <div className="font-semibold py-2 flex flex-wrap gap-4">
              {visibleTechStacks.map((item, index) => {
                const imageSrc = getStackImage(item.toUpperCase());
                return imageSrc ? (
                  <img key={index} src={imageSrc} alt={item} className="w-10 h-10" />
                ) : null;
              })}
              {extraTechStacksCount > 0 && (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-[16px] font-semibold rounded-[8px]">
                  +{extraTechStacksCount}
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="w-full border-[#B4B4B4]" />
        <section className="flex justify-between items-center p-2 px-6">
          <div className="flex font-semibold p-4 items-center gap-4">
            <div
              className="w-8 h-8 rounded-[30px]"
              style={{ backgroundColor: `#${profileInfo.profileColor}` }}
            ></div>
            <div className="w-[200px] whitespace-nowrap truncate">{parts[0]}</div>
          </div>
          <div className="flex space-x-2 font-semibold text-[#000000]/30 items-center p-4">
            <div>
              <img src={eye} alt="watched" className="w-[24px] h-[24px]" />
            </div>
            <div>{viewCount}</div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default PostItem;
