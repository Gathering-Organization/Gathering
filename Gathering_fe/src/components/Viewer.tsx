import { PartPostInfo } from '@/types/post';
import { getStringedDate } from '@/utils/get-stringed-date';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { positionData } from '@/utils/position-data';
import { getStackImage } from '@/utils/get-stack-image';
import { useOtherProfile } from '@/hooks/UseOtherProfile';
import OtherUserProfileModal from './OtherUserProfileModal';
import { getUserProfile } from '@/services/profileApi';
import deleteButton from '@/assets/otherIcons/post_delete_button.png';
import editButton from '@/assets/otherIcons/post_edit_button.png';
import { useProfile } from '@/contexts/ProfileStateContext';
import { deletePosting } from '@/services/postApi';
import { setPublic } from '@/services/postApi';
import { durationOptions } from '@/utils/post-options';
import eye from '@/assets/otherIcons/eye.png';
import OtherApplicationModal from '@/components/OtherApplicationModal';
import { getMyApplication, getOtherApplication } from '@/services/applicationApi';
import { ApplyDetails, ApplyInfo } from '@/types/apply';
import ApplyModal from './ApplyModal';
import { techStacks } from '@/utils/tech-stacks';
import ApplyResultModal from './ApplyResultModal';
import { useToast } from '@/contexts/ToastContext';
import { projectType } from '@/utils/project-and-apply-type';
import { projectModeOptions } from '@/utils/post-options';
import { ProfileAllInfo } from '@/types/profile';

interface Position {
  id: string;
  title: string;
}

const Viewer: React.FC<{ data: PartPostInfo | null }> = ({ data }) => {
  const [isToggleOn, setIsToggleOn] = useState(data?.closed);
  const { myProfile, isMyProfileLoading } = useProfile();
  const params = useParams();
  const nav = useNavigate();
  const userNickname = myProfile?.nickname;
  const [applyInfo, setApplyInfo] = useState<ApplyInfo>();
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [positionList] = useState<Position[]>([...positionData]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [teamProfiles, setTeamProfiles] = useState<{ [key: string]: string }>({});
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [isPositionTooltipOpen, setIsPositionTooltipOpen] = useState(false);
  const [isTechTooltipOpen, setIsTechTooltipOpen] = useState(false);
  // const {
  //   profile: teamMemberProfile,
  //   isLoading: teamMemberLoading,
  //   error: teamMemberError
  // } = useOtherProfile(selectedTeamMember);
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<ApplyDetails[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (data?.author.nickname === userNickname) {
          const result = await getOtherApplication(Number(params.id));
          if (result?.success) {
            setApplications(result.data);
          }
        }
      } catch (error) {
        console.error('지원서 조회 실패:', error);
      }
    };

    if (params.id) {
      fetchApplications();
    }
  }, [params.id]);

  useEffect(() => {
    const toastRaw = localStorage.getItem('toastMessage');
    if (toastRaw) {
      try {
        const toast = JSON.parse(toastRaw);
        if (toast.message) {
          showToast(toast.message, toast.isSuccess);
        }
      } catch (err) {
        console.error('Invalid toast data:', err);
      }
      localStorage.removeItem('toastMessage');
    }
  }, []);

  const fetchApplicationData = async () => {
    if (!data) return;
    try {
      if (!applyInfo) {
        const res = await getMyApplication(Number(data.projectId));
        if (res?.success) setApplyInfo(res.data);
      }
    } catch (err) {
      console.error('지원서 조회 실패:', err);
    }
  };

  useEffect(() => {
    const closeTooltips = () => {
      setIsPositionTooltipOpen(false);
      setIsTechTooltipOpen(false);
    };

    document.addEventListener('click', closeTooltips);
    return () => document.removeEventListener('click', closeTooltips);
  }, []);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const onClickDelete = async () => {
    if (params.id && window.confirm('모집글을 삭제하시겠습니까?')) {
      try {
        const result = await deletePosting(Number(params.id));
        if (result.success) {
          showToast('모집글이 성공적으로 삭제되었습니다.', true);
          nav('/', { replace: true });
        } else {
          if (result.message.includes('지원자가 있는 모집글은 삭제할 수 없습니다')) {
            showToast('지원자가 있는 모집글은 삭제할 수 없습니다.', false);
          } else {
            showToast(result.message || '삭제할 수 없습니다.', false);
          }
        }
      } catch (error) {
        showToast('모집글 삭제 중 오류가 발생했습니다.', false);
      }
    }
  };

  const onClickUpdate = () => {
    if (params.id && window.confirm('모집글을 수정하시겠습니까?')) {
      nav(`/postEdit/${params.id}`);
    }
  };

  const openTeamMemberModal = (nickname: string) => {
    setSelectedTeamMember(nickname);
  };
  const closeTeamMemberModal = () => {
    setSelectedTeamMember(null);
  };

  if (!data) return <p>데이터를 불러오는 중...</p>;

  const parts = data.author.nickname.split(/(#\d+)/);

  const updateApplicationStatus = (id: number, newStatus: string) => {
    setApplications(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleToggleChange = async (checked: boolean) => {
    setIsToggleOn(checked);

    try {
      const response = await setPublic(Number(params.id));

      if (!response || !response.success) {
        showToast('완료 여부 변경에 실패했습니다.', false);
        setIsToggleOn(!checked);
      }
    } catch (error) {
      showToast('서버 오류가 발생했습니다.', false);
      setIsToggleOn(!checked);
    }
  };

  const isMobile = window.innerWidth < 640;

  const visibleTechStackLimit = isMobile ? 0 : 3;
  const visibleTechStacks = data.techStacks.slice(0, visibleTechStackLimit);
  const extraTechStacksCount = data.techStacks.length - visibleTechStackLimit;

  const visiblePositionLimit = isMobile ? 0 : 2;
  const visiblePositions = data.requiredPositions.slice(0, visiblePositionLimit);
  const extraPositionsCount = data.requiredPositions.length - visiblePositionLimit;

  // 포지션 툴팁 토글
  const togglePositionTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPositionTooltipOpen(prev => {
      const newState = !prev;

      if (newState) {
        setIsTechTooltipOpen(false);
      }
      return newState;
    });
  };

  // 기술스택 툴팁 토글
  const toggleTechTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTechTooltipOpen(prev => {
      const newState = !prev;
      if (newState) {
        setIsPositionTooltipOpen(false);
      }
      return newState;
    });
  };

  const selectedMember = data.teams.find(m => m.nickname === selectedTeamMember) as
    | ProfileAllInfo
    | undefined;

  return (
    <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-48 space-y-2 min-h-screen">
      <section className="bg-white p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-16 justify-between">
          <div className="block select-text me-10 text-justify text-2xl sm:text-3xl md:text-4xl font-extrabold px-2 sm:px-6 break-words">
            {data.title}
          </div>
          {data?.author.nickname === userNickname && (
            <label className="inline-flex items-center cursor-pointer self-end sm:self-auto">
              <input
                type="checkbox"
                value=""
                checked={isToggleOn}
                onChange={e => handleToggleChange(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="relative w-[90px] sm:w-[110px] h-8 sm:h-10 bg-gray-200 peer-focus:outline-none 
                dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                peer-checked:after:translate-x-[60px] sm:peer-checked:after:translate-x-[70px] 
                rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:start-[4px] after:bg-white 
                after:border-gray-300 after:border after:rounded-full after:h-6 sm:after:h-8 after:w-6 sm:after:w-8 
                after:transition-all after:duration-200 dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
              >
                <span
                  className={`absolute inset-y-0 flex items-center text-xs sm:text-sm font-bold ${
                    isToggleOn
                      ? 'left-3 sm:left-4 text-white'
                      : 'right-4 sm:right-6 text-[#000000]/50'
                  }`}
                >
                  {isToggleOn ? '모집 완료' : '모집 중'}
                </span>
              </div>
            </label>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-4 mb-4 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex">
              <button
                onClick={openProfileModal}
                className="flex items-center space-x-2 md:space-x-4 hover:bg-gray-100 py-1 sm:p-2 rounded-lg"
              >
                <div
                  className="w-[20px] sm:w-[30px] h-[20px] sm:h-[30px] rounded-full"
                  style={{ backgroundColor: `#${data.author.profileColor}` }}
                />
                <span className="font-bold text-sm sm:text-lg whitespace-nowrap">{parts[0]}</span>
              </button>
              <div className="ml-auto px-1 flex sm:hidden items-center gap-1 font-bold text-sm text-[#000000]/50">
                <img src={eye} alt="watched" className="w-5 h-5" />
                <div>{data.viewCount}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-base text-[#000000]/50">
              <span className="font-semibold">생성일: {getStringedDate(data.createdAt)}</span>
              <span className="ml-auto font-semibold">
                최종 수정일: {getStringedDate(data.updatedAt)}
              </span>
              <span className="font-semibold">마감일: {getStringedDate(data.deadline)}</span>
              <div className="hidden sm:flex items-center gap-1 font-bold ml-auto sm:ml-0">
                <img src={eye} alt="watched" className="w-5 h-5" />
                <div>{data.viewCount}</div>
              </div>
            </div>
          </div>
          {data?.author.nickname === userNickname && (
            <section className="flex gap-3 sm:gap-4 items-center self-end sm:self-auto">
              <button
                onClick={onClickUpdate}
                className="w-9 sm:w-[50px] h-9 sm:h-[50px] duration-200 ease-in-out hover:scale-110"
              >
                <img src={editButton} alt="edit" />
              </button>
              <button
                onClick={onClickDelete}
                className="w-9 sm:w-[50px] h-9 sm:h-[50px] duration-200 ease-in-out hover:scale-110"
              >
                <img src={deleteButton} alt="delete" />
              </button>
            </section>
          )}
        </div>
        <OtherUserProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
          profile={data.author}
        />
        <hr className="w-full justify-self-center border-[#000000]/60" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4 sm:py-8 mb-4 px-2 sm:px-4">
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">모집 구분</div>

            <label className="block text-[#000000]/50">
              {projectType.find(item => item.projectType === data.projectType)?.projectTypeName ||
                '알 수 없음'}
            </label>
          </div>
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">진행 방식</div>
            <label className="block text-[#000000]/50">
              {projectModeOptions.find(item => item.value === data.projectMode)?.label}
            </label>
          </div>
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">모집 인원</div>
            <label className="block text-[#000000]/50">{data.totalMembers}명</label>
          </div>
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">시작 예정</div>
            <label className="block text-[#000000]/50">{data.startDate}</label>
          </div>
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">팀원 태그</div>
            <div className="flex flex-wrap gap-2">
              {data.teams.map(member => (
                <button
                  key={member.nickname}
                  onClick={() => openTeamMemberModal(member.nickname)}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full"
                    style={{
                      backgroundColor: `#${member.profileColor || ''}`
                    }}
                  />
                  <span className="font-bold text-[14px] whitespace-nowrap">
                    {member.nickname.split(/(#\d+)/)[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-12 text-base sm:text-xl font-bold">
            <div className="w-24 sm:w-28 whitespace-nowrap">예상 기간</div>
            <label className="block text-[#000000]/50">
              {durationOptions.find(option => option.value === data.duration)?.label ||
                '알 수 없음'}
            </label>
          </div>
          <div
            className={`flex items-center space-x-12 text-base sm:text-xl font-bold ${isMobile ? `relative` : ``}`}
          >
            <div className="w-24 sm:w-28 whitespace-nowrap">모집 포지션</div>
            <div className={`flex flex-wrap gap-2 ${isMobile ? `` : `relative`}`}>
              {visiblePositions.map((positionId, index) => {
                const positionTitle =
                  positionList.find(pos => pos.id === positionId)?.title || '알 수 없음';
                return (
                  <div
                    key={index}
                    className="font-bold p-1 px-4 text-xs sm:text-sm text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline-block"
                  >
                    {positionTitle}
                  </div>
                );
              })}
              {extraPositionsCount > 0 && (
                <div className="">
                  <div
                    className="font-bold p-1 px-3 sm:px-4 text-xs sm:text-sm text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] cursor-pointer inline-bloc"
                    onClick={togglePositionTooltip}
                  >
                    +{extraPositionsCount}
                  </div>
                  {isPositionTooltipOpen && (
                    <div className="absolute top-full left-0 -translate-x-1/2 transform mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow w-[300px] overflow-x-auto animate-fadeDown">
                      <div className="flex space-x-2">
                        {data.requiredPositions.slice(2).map((positionId, index) => {
                          const positionTitle =
                            positionList.find(pos => pos.id === positionId)?.title || '알 수 없음';
                          return positionTitle ? (
                            <div
                              key={index}
                              className="font-bold p-1 px-3 sm:px-4 text-xs sm:text-sm text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline-block whitespace-nowrap"
                            >
                              {positionTitle}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className={`flex items-center space-x-12 text-base sm:text-xl font-bold ${isMobile ? 'relative' : ''}`}
          >
            <div className="w-24 sm:w-28 whitespace-nowrap">사용 스택</div>
            <div className={isMobile ? '' : 'relative'}>
              <div className="font-semibold flex flex-wrap gap-4">
                {visibleTechStacks.map((item, index) => {
                  const imageSrc = getStackImage(item.toUpperCase());
                  const tech = techStacks.find(stack => stack.id === item);
                  const techTitle = tech ? tech.title : item;
                  return imageSrc ? (
                    <img
                      key={index}
                      title={techTitle}
                      src={imageSrc}
                      alt={item}
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                  ) : null;
                })}
                {extraTechStacksCount > 0 && (
                  <div className="">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 text-sm sm:text-base font-semibold rounded-[8px] cursor-pointer"
                      onClick={toggleTechTooltip}
                    >
                      +{extraTechStacksCount}
                    </div>
                    {/* 기술스택 툴팁 */}
                    {isTechTooltipOpen && (
                      <div className="absolute top-full left-0 -translate-x-1/2 transform mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow w-[300px] overflow-x-auto animate-fadeDown">
                        <div className="flex space-x-2">
                          {data.techStacks.slice(3).map((item, index) => {
                            const imageSrc = getStackImage(item.toUpperCase());
                            const tech = techStacks.find(stack => stack.id === item);
                            const techTitle = tech ? tech.title : item;
                            return imageSrc ? (
                              <img
                                key={index}
                                title={techTitle}
                                src={imageSrc}
                                alt={item}
                                className="w-8 h-8 sm:w-10 sm:h-10"
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="block font-bold text-lg sm:text-2xl mb-4 px-2 sm:px-4">모집 소개</div>
        <hr className="w-full justify-self-center border-[#000000]/60 py-4" />
        <div
          className="block px-4 select-text cursor-text min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        {data?.author.nickname === userNickname ? (
          <OtherApplicationModal apply={applications} onStatusChange={updateApplicationStatus} />
        ) : data?.applied ? (
          <ApplyResultModal
            nickname={userNickname}
            position={positionData.find(position => position.id === applyInfo?.position)?.title}
            applyStatus={data?.applyStatus}
            kakaoUrl={data?.kakaoUrl}
            fetchApplication={fetchApplicationData}
          />
        ) : (
          <ApplyModal />
        )}
      </section>
      <OtherUserProfileModal
        isOpen={!!selectedTeamMember}
        onClose={closeTeamMemberModal}
        profile={selectedMember!}
      />
    </div>
  );
};

export default Viewer;
