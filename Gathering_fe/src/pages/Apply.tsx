import {
  deletePortfolio,
  getMyProfile,
  setMyProfile,
  toggleProfileVisibility,
  uploadPortfolio
} from '@/services/profileApi';
import { Portfolio, ProfileAllInfo, WorkExperience } from '@/types/profile';
import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import { techStacks } from '@/utils/tech-stacks';
import { ProfileContextType } from '@/contexts/ProfileStateContext';
import { getStackImage } from '@/utils/get-stack-image';
import { positionData } from '@/utils/position-data';

interface TechStack {
  id: string;
  title: string;
}

const Apply: React.FC = () => {
  const [applyInfo, setApplyInfo] = useState({ position: '', message: '' });

  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const [isTechTooltipOpen, setIsTechTooltipOpen] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<ProfileAllInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: '',
    portfolio: null,
    public: true,
    workExperiences: []
  });
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    activityName: '',
    startDate: '',
    endDate: '',
    description: '',
    techStacks: []
  });
  const stacks = [...techStacks];
  const filteredStacks = stacks.filter(stack => !info.techStacks.includes(stack.title));

  const { myProfile, isMyProfileLoading } = useProfile();
  useEffect(() => {
    const stored = localStorage.getItem('applyInfo');
    if (stored) {
      setApplyInfo(JSON.parse(stored));
    }
    if (myProfile) {
      console.log(myProfile);
      setInfo(myProfile);
      setWorkExperiences(myProfile.workExperiences);
    }
  }, [myProfile, isPublic]);

  useEffect(() => {
    const closeTooltips = () => {
      setIsTechTooltipOpen(null);
    };

    document.addEventListener('click', closeTooltips);
    return () => document.removeEventListener('click', closeTooltips);
  }, []);

  if (isMyProfileLoading) return <div>로딩 중...</div>;
  const parts = info.nickname.split(/(#\d+)/);

  const toggleTechTooltip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTechTooltipOpen(prev => (prev === index ? null : index));
  };

  const positionTitle =
    positionData.find(position => position.id === applyInfo.position)?.title || applyInfo.position;

  const stackLists = info.techStacks.map(id => {
    const stack = techStacks.find(stack => stack.id === id);
    return stack ? stack.title : id;
  });

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="mx-60">
      <div className="border-[#000000]/20 border-2 rounded-xl p-10 px-20 min-h-screen">
        <section className="flex space-x-4 items-center">
          <div
            className="w-[36px] h-[36px] rounded-full"
            style={{ backgroundColor: `#${info.profileColor}` }}
          ></div>
          <div className="text-[24px] font-bold">{parts[0]}님의 지원서입니다.</div>
        </section>

        <div className="mt-16 px-8 text-[28px] font-black font-inter">RESUME.</div>
        <hr className="mt-6 w-full h-[2px] bg-[#000000]/60 border-none" />

        <section className="flex space-x-12 p-8 items-center font-inter">
          <div className="font-bold text-[20px] w-[200px]">지원 포지션</div>
          <div className="font-semibold">{positionTitle}</div>
        </section>
        <hr className="w-full h-[1px] bg-[#000000]/60 border-none" />
        <div className="">
          <section className="flex space-x-12 p-8 items-center font-inter">
            <div className="font-bold text-[20px] w-[200px]">소속</div>
            <div className="font-semibold">{info.organization}</div>
          </section>
          <section className="flex space-x-12 p-8 items-center font-inter">
            <div className="font-bold text-[20px] w-[200px]">사용 기술 스택</div>
            <div className="font-semibold">{stackLists.join(', ')}</div>
          </section>
          <section className="flex space-x-12 p-8 items-start font-inter">
            <div className="font-bold text-[20px] w-[200px]">활동 내역</div>
            <div className="flex flex-col">
              {workExperiences.map((exp, index) => {
                const visibleTechStacks = exp.techStacks.slice(0, 3); // 상위 3개만 보이기
                const extraTechStacks = exp.techStacks.slice(3); // 나머지 숨김
                const extraTechStacksCount = extraTechStacks.length;

                return (
                  <div key={index}>
                    {index > 0 && (
                      <hr className="w-full h-[1px] bg-[#000000]/20 border-none my-8" />
                    )}
                    <div className="font-bold text-[18px]">
                      {exp.activityName} ({exp.startDate} ~ {exp.endDate})
                    </div>

                    {/* 기술 스택 리스트 */}
                    <div className="flex items-center space-x-4 mt-4">
                      {/* 보이는 기술 스택 */}
                      {visibleTechStacks.map((item, index) => {
                        const imageSrc = getStackImage(item.toUpperCase());
                        return imageSrc ? (
                          <img key={index} src={imageSrc} alt={item} className="w-8 h-8" />
                        ) : null;
                      })}

                      {/* 추가 기술 스택 버튼 */}
                      {extraTechStacksCount > 0 && (
                        <div className="relative">
                          <div
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 text-[16px] font-semibold rounded-[8px] cursor-pointer"
                            onClick={e => toggleTechTooltip(index, e)}
                          >
                            +{extraTechStacksCount}
                          </div>

                          {/* 기술 스택 툴팁 */}
                          {isTechTooltipOpen === index && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow w-[300px] overflow-x-auto">
                              <div className="flex space-x-2">
                                {extraTechStacks.map((item, i) => {
                                  const imageSrc = getStackImage(item.toUpperCase());
                                  return imageSrc ? (
                                    <img key={i} src={imageSrc} alt={item} className="w-8 h-8" />
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-10 text-[#202123]">{exp.description}</div>
                  </div>
                );
              })}
            </div>
          </section>
          {/* <hr className="w-full h-[1px] bg-[#000000]/60 border-none" /> */}

          <hr className="mt-6 w-full h-[1px] bg-[#000000]/60 border-none" />
          <section className="flex space-x-12 p-8 items-center font-inter">
            <div className="font-bold text-[20px] w-[200px]">간단 자기어필</div>
            <div className="text-[#202123]">{applyInfo.message}</div>
          </section>
          <hr className="w-full h-[2px] bg-[#000000]/60 border-none" />
          <div className="p-8 text-[28px] font-black font-inter">PORTFOLIO.</div>
          <hr className="w-full h-[2px] bg-[#000000]/60 border-none" />
          <section className="flex justify-between m-10 items-center">
            <div className="font-bold text-[18px] w-[200px]">{info.portfolio?.fileName}</div>
            <div className="flex space-x-8">
              <button className="px-8 py-2 bg-[#000000] text-[#FFFFFF] rounded-[16px] font-semibold">
                저장
              </button>
              <button className="px-8 py-2 bg-[#000000]/10 text-[#202123] rounded-[16px] font-semibold">
                보기
              </button>
            </div>
          </section>
          <hr className="w-full h-[2px] bg-[#000000]/60 border-none" />
          <section className="justify-self-center py-10">
            <button
              onClick={handleClose}
              className="px-10 py-2 bg-[#000000] text-[#FFFFFF] rounded-[20px] font-semibold"
            >
              닫기
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Apply;
