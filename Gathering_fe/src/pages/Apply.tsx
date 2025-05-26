import { Portfolio, ProfileAllInfo, WorkExperience } from '@/types/profile';
import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import { techStacks } from '@/utils/tech-stacks';
import { ProfileContextType } from '@/contexts/ProfileStateContext';
import { getStackImage } from '@/utils/get-stack-image';
import { positionData } from '@/utils/position-data';
import { useSearchParams } from 'react-router-dom';
import { useOtherProfile } from '@/hooks/UseOtherProfile';
import { useToast } from '@/contexts/ToastContext';
import { ApplyDetails } from '@/types/apply';
import { getMyApplication } from '@/services/applicationApi';

interface TechStack {
  id: string;
  title: string;
}

const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [applyInfo, setApplyInfo] = useState<ApplyDetails | null>(null);
  // const [isPublic, setIsPublic] = useState<boolean>(false);
  // const [stackList] = useState<TechStack[]>([...techStacks]);
  const [isTechTooltipOpen, setIsTechTooltipOpen] = useState<number | null>(null);
  // const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<ProfileAllInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: '',
    portfolio: null,
    public: true,
    workExperiences: [],
    totalProjects: 0,
    openedProjects: 0,
    closedProjects: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);
  const { myProfile, isMyProfileLoading } = useProfile();
  const isOwnProfile = !projectId;
  const isLoadingOverall = isOwnProfile ? isMyProfileLoading : applyInfo === null;

  const { showToast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (projectId) {
          const result = await getMyApplication(Number(projectId));
          if (result?.success) {
            console.log('파파파', result.data, isOwnProfile);
            setApplyInfo(result.data);

            setWorkExperiences(result.data.workExperiences);
          }
        }
      } catch (error) {
        console.error('지원서 조회 실패:', error);
      }
    };

    fetchApplications();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      if (myProfile) {
        setInfo(myProfile);
        setWorkExperiences(myProfile.workExperiences);
      }
    }
  }, [projectId, myProfile]);

  useEffect(() => {
    const closeTooltips = () => setIsTechTooltipOpen(null);
    document.addEventListener('click', closeTooltips);
    return () => document.removeEventListener('click', closeTooltips);
  }, []);
  const needLoading = isLoadingOverall || !info || (!isOwnProfile && !applyInfo);

  if (needLoading) {
    return <div>로딩 중...</div>;
  }

  const portfolioFileName = isOwnProfile
    ? info.portfolio?.fileName
    : applyInfo?.portfolio?.fileName;

  console.log(applyInfo);
  const positionTitle =
    positionData.find(position => position.id === applyInfo?.position)?.title ||
    applyInfo?.position;

  const stackLists = isOwnProfile
    ? info.techStacks.map(id => {
        const stack = techStacks.find(stack => stack.id === id);
        return stack ? stack.title : id;
      })
    : applyInfo?.techStacks.map(id => {
        const stack = techStacks.find(stack => stack.id === id);
        return stack ? stack.title : id;
      });
  const visibleStacks = stackLists?.slice(0, 3);
  const extraStacks = stackLists?.slice(3);
  const extraStacksCount = extraStacks?.length;

  const toggleTechTooltip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTechTooltipOpen(prev => (prev === index ? null : index));
  };

  const onSave = async () => {
    const portfolio = isOwnProfile ? info.portfolio : applyInfo?.portfolio;
    if (!portfolio) return;
    try {
      // 추후 해당 개념 정리 필요 (파일이 외부 서버에 있거나 CORS-정책이 있는 경우 download attribute가 작동하지 않을 수 있다.)
      // 아래는 해당 문제를 우회하여 다운로드 하는 방식이다.
      // 1. 원본 PDF를 fetch로 가져와서 blob으로 변환
      const response = await fetch(portfolio.url, { mode: 'cors' });
      if (!response.ok) throw new Error('파일을 가져오는 데 실패했습니다.');
      const blob = await response.blob();

      // 2. blob을 가리키는 객체 URL 생성
      const blobUrl = window.URL.createObjectURL(blob);

      // 3. 다운로드용 a 태그 만들기
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = portfolio.fileName || 'portfolio.pdf';
      document.body.appendChild(link);
      link.click();

      // 4. 사용한 엘리먼트와 URL 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      showToast('포트폴리오 저장 중 오류가 발생했습니다.', false);
    }
  };
  const onView = () => {
    const portfolio = isOwnProfile ? info.portfolio : applyInfo?.portfolio;
    if (!portfolio) return;
    window.open(portfolio.url, '_blank');
  };

  const handleClose = () => {
    window.close();
  };

  if (isLoadingOverall) {
    return <div className="min-h-[500px]">로딩 중...</div>;
  }

  return (
    <div className="mx-60">
      <div className="border-[#000000]/20 border-2 rounded-xl p-10 px-20 min-h-screen">
        <section className="flex space-x-4 items-center">
          {isOwnProfile ? (
            <div
              className="w-[36px] h-[36px] rounded-full"
              style={{ backgroundColor: `#${info.profileColor}` }}
            ></div>
          ) : (
            <div
              className="w-[36px] h-[36px] rounded-full"
              style={{ backgroundColor: `#${applyInfo?.profileColor}` }}
            ></div>
          )}
          {isOwnProfile ? (
            <div className="text-[24px] font-bold">
              {info.nickname.split(/(#\d+)/)}님의 지원서입니다.
            </div>
          ) : (
            <div className="text-[24px] font-bold">
              {applyInfo?.nickname.split(/(#\d+)/)}님의 지원서입니다.
            </div>
          )}
        </section>

        <div className="mt-16 px-8 text-[28px] font-black">RESUME.</div>
        <hr className="mt-6 w-full h-[2px] bg-[#000000]/60 border-none" />

        <section className="flex space-x-12 p-8 items-center">
          <div className="font-bold text-[20px] w-[200px]">지원 포지션</div>
          <div className="text-[18px]">{positionTitle}</div>
        </section>
        <hr className="w-full h-[1px] bg-[#000000]/60 border-none" />
        <div className="">
          <section className="flex space-x-12 p-8 items-center">
            <div className="font-bold text-[20px] w-[200px]">소속</div>
            {isOwnProfile ? (
              <div className="text-[18px]">{info.organization}</div>
            ) : (
              <div className="text-[18px]">{applyInfo?.organization}</div>
            )}
          </section>
          <section className="flex space-x-12 p-8 items-center">
            <div className="font-bold text-[20px] w-[200px]">사용 기술 스택</div>
            <div className="text-[18px]">
              {
                <div className="flex items-center space-x-4">
                  {visibleStacks?.map((item, index) => {
                    const imageSrc = getStackImage(item.toUpperCase());
                    return imageSrc ? (
                      <img key={index} src={imageSrc} alt={item} className="w-8 h-8" />
                    ) : null;
                  })}

                  {typeof extraStacksCount === 'number' && extraStacksCount > 0 && (
                    <div className="relative">
                      <div
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-[16px] font-semibold rounded-[8px] cursor-pointer"
                        onClick={e => toggleTechTooltip(9999, e)}
                      >
                        +{extraStacksCount}
                      </div>

                      {isTechTooltipOpen === 9999 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow w-[300px] overflow-x-auto">
                          <div className="flex space-x-2">
                            {extraStacks?.map((item, i) => {
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
              }
            </div>
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
                    <div className="font-semibold text-[18px]">
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

          <hr className="mt-6 w-full h-[1px] bg-[#000000]/60 border-none" />
          <section className="flex space-x-12 p-8 items-center font-inter">
            <div className="font-bold text-[20px] w-[200px]">간단 자기 어필</div>
            <div className="text-[#202123] max-w-[550px] break-words text-balance whitespace-pre-line text-[18px]">
              {applyInfo?.message}
            </div>
          </section>
          <hr className="w-full h-[2px] bg-[#000000]/60 border-none" />
          <div className="p-8 text-[28px] font-black font-inter">PORTFOLIO.</div>
          <hr className="w-full h-[2px] bg-[#000000]/60 border-none" />
          <section className="flex justify-between m-10 items-center">
            <div className="font-bold text-[18px] w-[200px]">{portfolioFileName}</div>

            <div className="flex space-x-8">
              <button
                onClick={onSave}
                className="px-8 py-2 bg-[#000000] text-[#FFFFFF] rounded-[16px] font-semibold"
              >
                저장
              </button>
              <button
                onClick={onView}
                className="px-8 py-2 bg-[#000000]/10 text-[#202123] rounded-[16px] font-semibold"
              >
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
