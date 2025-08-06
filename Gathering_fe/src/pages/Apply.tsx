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
import { ApplyInfo } from '@/types/apply';
import BeatLoader from 'react-spinners/BeatLoader';
import WorkExperienceItem from '@/components/WorkExperienceItem';

interface TechStack {
  id: string;
  title: string;
}

const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [applyInfo, setApplyInfo] = useState<ApplyDetails | null>();

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
  const isOwnProfile = !projectId && !!localStorage.getItem('tempApplyInfo');
  const isLoadingOverall = isOwnProfile ? isMyProfileLoading : applyInfo === null;

  const { showToast } = useToast();
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    if (projectId) {
      // 과거에 쓴 내 지원서 보기 → 서버에서 fetch
      const fetchApplications = async () => {
        try {
          const result = await getMyApplication(Number(projectId));
          if (result?.success) {
            setApplyInfo(result.data);
            setWorkExperiences(result.data.workExperiences);
          }
        } catch (error) {
          console.error('지원서 조회 실패:', error);
        }
      };
      fetchApplications();
    } else {
      // 내 지원서 미리보기 or 남의 지원서 보기 → localStorage or 내 프로필에서 가져옴
      const myStored = localStorage.getItem('tempApplyInfo');
      const otherStored = localStorage.getItem('applyInfo');
      if (myStored && myProfile) {
        setInfo(myProfile);
        setWorkExperiences(myProfile.workExperiences);
      } else if (otherStored) {
        const parsed: ApplyDetails = JSON.parse(otherStored);
        setApplyInfo(parsed);
        setWorkExperiences(parsed.workExperiences);
      }
    }
  }, [projectId, myProfile]);

  // useEffect(() => {
  //   const loadApplyInfo = async () => {
  //     try {
  //       if (!projectId) {
  //         const stored = localStorage.getItem('tempApplyInfo');
  //         if (stored) {
  //           setApplyInfo(JSON.parse(stored));
  //         }
  //       }
  //     } catch (error) {
  //       console.error('지원서 조회 실패:', error);
  //     }
  //   };
  //   loadApplyInfo();
  // }, [projectId]);

  // useEffect(() => {
  //   const fetchApplications = async () => {
  //     try {
  //       if (projectId) {
  //         const result = await getMyApplication(Number(projectId));
  //         if (result?.success) {
  //           setApplyInfo(result.data);
  //           setWorkExperiences(result.data.workExperiences);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('지원서 조회 실패:', error);
  //     }
  //   };

  //   fetchApplications();
  // }, [projectId]);

  // useEffect(() => {
  //   if (!projectId) {
  //     if (myProfile) {
  //       setInfo(myProfile);
  //       setWorkExperiences(myProfile.workExperiences);
  //     }
  //   }
  // }, [projectId, myProfile]);

  useEffect(() => {
    const closeTooltips = () => setIsTechTooltipOpen(null);
    document.addEventListener('click', closeTooltips);
    return () => document.removeEventListener('click', closeTooltips);
  }, []);
  const needLoading = isLoadingOverall || !info || (!isOwnProfile && !applyInfo);

  if (needLoading) {
    return (
      <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
        <BeatLoader color="#3387E5" size={20} />
        <p className="mt-4 text-gray-700 font-semibold">지원서 조회 중입니다...</p>
      </div>
    );
  }

  const portfolioFileName = isOwnProfile
    ? info.portfolio?.fileName
    : applyInfo?.portfolio?.fileName;

  const positionTitle =
    positionData.find(position => position.id === applyInfo?.position)?.title ||
    applyInfo?.position;

  const stackLists =
    (isOwnProfile ? info : applyInfo)?.techStacks.map(id => {
      const stack = techStacks.find(stack => stack.id === id);
      return stack ? stack.title : id;
    }) || [];

  const visibleTechStackLimit = isMobile ? 0 : 3;

  const visibleStacks = stackLists.slice(0, visibleTechStackLimit);
  const extraStacks = stackLists.slice(visibleTechStackLimit);
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
    localStorage.removeItem('tempApplyInfo');
    window.close();
  };

  if (isLoadingOverall) {
    return <div className="min-h-[500px]">로딩 중...</div>;
  }

  return (
    <div className="px-4 mx-auto sm:px-10 md:px-20 lg:px-60 py-6 space-y-0 sm:space-y-6">
      <div className="border-[#000000]/20 border-2 rounded-xl py-4 sm:p-8 lg:p-10 min-h-screen">
        <section className="flex p-2 px-6 sm:p-0 space-x-2 sm:space-x-4 items-center">
          {isOwnProfile ? (
            <div
              className="w-6 h-6 md:w-[36px] md:h-[36px] rounded-full"
              style={{ backgroundColor: `#${info.profileColor}` }}
            ></div>
          ) : (
            <div
              className="w-6 h-6 md:w-[36px] md:h-[36px] rounded-full"
              style={{ backgroundColor: `#${applyInfo?.profileColor}` }}
            ></div>
          )}
          {isOwnProfile ? (
            <div className="text-base sm:text-2xl font-bold truncate">
              {info.nickname.split(/(#\d+)/)}님의 지원서입니다.
            </div>
          ) : (
            <div className="text-base sm:text-2xl font-bold truncate">
              {applyInfo?.nickname.split(/(#\d+)/)}님의 지원서입니다.
            </div>
          )}
        </section>

        <div className="mt-8 sm:mt-16 px-6 sm:px-8 text-lg sm:text-[28px] font-black">RESUME.</div>
        <hr className="mt-4 sm:mt-6 w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[2px] bg-[#000000]/60 border-none" />

        <section className="flex space-x-12 p-8 items-center">
          <div className="font-bold text-sm sm:text-xl sm:w-[200px]">지원 포지션</div>
          <div className="text-sm sm:text-lg">{positionTitle}</div>
        </section>
        <hr className="w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[1px] bg-[#000000]/60 border-none" />
        <div className="">
          <section className="flex space-x-12 px-8 py-4 sm:p-8 items-center">
            <div className="font-bold text-sm sm:text-xl sm:w-[200px]">사용 기술 스택</div>
            <div className="text-sm sm:text-lg">
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
                              const cleanedItem = item.replace(/[^a-zA-Z0-9]/g, '');
                              const imageSrc = getStackImage(cleanedItem.toUpperCase());
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
          <section className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-12 px-8 py-4 sm:p-8">
            <div className="font-bold text-sm sm:text-xl sm:w-[200px]">소속</div>
            {isOwnProfile ? (
              <div className="text-sm sm:text-lg">{info.organization}</div>
            ) : (
              <div className="text-sm sm:text-lg">{applyInfo?.organization}</div>
            )}
          </section>

          <section className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-12 sm:p-8 font-inter">
            <div className="font-bold text-sm sm:text-xl sm:w-[200px] px-8 py-2 sm:px-0">
              활동 내역
            </div>
            <div className="flex-grow px-6 sm:px-0">
              {isOwnProfile ? (
                <div>
                  {info.workExperiences.slice(0, 3).map((experience, index) => (
                    <WorkExperienceItem key={`experience-${index}`} {...experience} />
                  ))}
                </div>
              ) : (
                <div>
                  {applyInfo?.workExperiences
                    .slice(0, 3)
                    .map((experience, index) => (
                      <WorkExperienceItem key={`experience-${index}`} {...experience} />
                    ))}
                </div>
              )}
            </div>
          </section>

          <hr className="mt-4 sm:mt-6 w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[1px] bg-[#000000]/60 border-none" />
          <section className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-12 sm:p-8 px-8 py-4 font-inter">
            <div className="font-bold text-sm sm:text-xl sm:w-[200px]">간단 자기 어필</div>
            <div className="text-[#202123] max-w-[550px] break-words text-balance whitespace-pre-line text-sm sm:text-lg">
              {applyInfo?.message}
            </div>
          </section>
          <hr className="w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[2px] bg-[#000000]/60 border-none" />
          <div className="px-8 py-4 sm:p-8 text-lg sm:text-[28px] font-black font-inter">
            PORTFOLIO.
          </div>
          <hr className="w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[2px] bg-[#000000]/60 border-none" />
          <section className="flex justify-between m-10 items-center">
            <div className="font-bold text-sm sm:text-lg sm:w-[200px]">{portfolioFileName}</div>

            <div className="flex text-xs sm:text-sm space-x-2 sm:space-x-8">
              <button
                onClick={onSave}
                className="px-4 py-1 sm:px-8 sm:py-2 bg-[#000000] hover:bg-[#444] transition-colors duration-300 ease-in-out text-[#FFFFFF] rounded-[16px] font-semibold"
              >
                저장
              </button>
              <button
                onClick={onView}
                className="px-4 py-1 sm:px-8 sm:py-2 bg-[#000000]/10 hover:bg-[#000000]/20 transition-colors duration-300 ease-in-out text-[#202123] rounded-[16px] font-semibold"
              >
                보기
              </button>
            </div>
          </section>
          <hr className="w-[calc(100%-2rem)] mx-4 sm:mx-0 sm:w-full h-[2px] bg-[#000000]/60 border-none" />
          <section className="text-xs sm:text-base justify-self-center py-10">
            <button
              onClick={handleClose}
              className="px-6 py-1.5 sm:px-10 sm:py-2 bg-[#000000] hover:bg-[#444] transition-colors duration-300 ease-in-out text-[#FFFFFF] rounded-[20px] font-semibold"
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
