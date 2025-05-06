import { partPostInfo } from '@/types/post';
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
import { getOtherApplication } from '@/services/applicationApi';
import { ApplyDetails, ApplyInfo } from '@/types/apply';
import ApplyModal from './ApplyModal';
import { techStacks } from '@/utils/tech-stacks';
import ApplyResultModal from './ApplyResultModal';
import { useToast } from '@/contexts/ToastContext';

interface Position {
  id: string;
  title: string;
}

const Viewer: React.FC<{ data: partPostInfo | null }> = ({ data }) => {
  const [isToggleOn, setIsToggleOn] = useState(data?.closed);
  const { myProfile, isMyProfileLoading } = useProfile();
  const params = useParams();
  const nav = useNavigate();
  const userNickname = myProfile?.nickname;
  const [positionList] = useState<Position[]>([...positionData]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { profile, isLoading, error } = useOtherProfile(data?.authorNickname ?? null);
  const [teamProfiles, setTeamProfiles] = useState<{ [key: string]: string }>({});
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [isPositionTooltipOpen, setIsPositionTooltipOpen] = useState(false);
  const [isTechTooltipOpen, setIsTechTooltipOpen] = useState(false);
  const {
    profile: teamMemberProfile,
    isLoading: teamMemberLoading,
    error: teamMemberError
  } = useOtherProfile(selectedTeamMember);
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<ApplyDetails[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (data?.authorNickname === userNickname) {
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
    const closeTooltips = () => {
      setIsPositionTooltipOpen(false);
      setIsTechTooltipOpen(false);
    };

    document.addEventListener('click', closeTooltips);
    return () => document.removeEventListener('click', closeTooltips);
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!data?.teams.length) return;

      setLoading(true);

      try {
        const profilesData: { [key: string]: string } = {};

        const profilePromises = data.teams.map(async member => {
          const response = await getUserProfile(member.nickname);
          if (response?.success) {
            profilesData[member.nickname] = response.data.profileColor;
          }
        });

        await Promise.all(profilePromises);
        setTeamProfiles(profilesData);
      } catch (error) {
        console.error('Error fetching team profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [data?.teams]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const onClickDelete = () => {
    if (params.id && window.confirm('모집글을 삭제하시겠습니까?')) {
      deletePosting(Number(params.id));
      nav('/', { replace: true });
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

  if (error) return <p>{error}</p>;

  const parts = data.authorNickname.split(/(#\d+)/);

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

  const visibleTechStacks = data.techStacks.slice(0, 3);
  const extraTechStacksCount = data.techStacks.length - 3;

  const visiblePositions = data.requiredPositions.slice(0, 2);
  const extraPositionsCount = data.requiredPositions.length - 2;

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
  return (
    <div className="mx-48 space-y-2 min-h-screen">
      <section className="bg-white p-6 mb-4">
        <div className="flex items-center mb-16 justify-between">
          <div className="block select-text me-10 text-justify text-[36px] font-extrabold px-6">
            {data.title}
          </div>
          {data?.authorNickname === userNickname && (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                checked={isToggleOn}
                onChange={e => handleToggleChange(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="relative w-[110px] h-10 bg-gray-200 peer-focus:outline-none 
  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
  peer-checked:after:translate-x-[70px] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
  after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:start-[4px] after:bg-white 
  after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all after:duration-200
  dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
              >
                <span
                  className={`absolute inset-y-0 flex items-center text-sm font-bold ${
                    isToggleOn ? 'left-4 text-white' : 'right-6 text-[#000000]/50'
                  }`}
                >
                  {isToggleOn ? '모집 완료' : '모집 중'}
                </span>
              </div>
            </label>
          )}
        </div>

        <div className="flex items-center justify-between p-4 mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={openProfileModal}
              className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg"
            >
              <div
                className="w-[30px] h-[30px] rounded-full"
                style={{ backgroundColor: `#${data.profileColor}` }}
              />
              <span className="font-bold text-[20px] whitespace-nowrap">{parts[0]}</span>
            </button>
            <div className="flex space-x-4 text-[#000000]/50">
              <span className="font-semibold">생성일: {getStringedDate(data.createdAt)}</span>
              <span className="font-semibold">최종 수정일: {getStringedDate(data.updatedAt)}</span>
              <span className="font-semibold">마감일: {getStringedDate(data.deadline)}</span>
              <div className="flex items-center space-x-1 font-bold">
                <img src={eye} alt="watched" className="w-[24px] h-[24px]" />
                <div>{data.viewCount}</div>
              </div>
            </div>
          </div>
          {data?.authorNickname === userNickname && (
            <section className="flex gap-4 items-center">
              <button
                onClick={onClickUpdate}
                className="w-[50px] h-[50px] duration-200 ease-in-out hover:scale-110"
              >
                <img src={editButton} alt="edit" />
              </button>
              <button
                onClick={onClickDelete}
                className="w-[50px] h-[50px] duration-200 ease-in-out hover:scale-110"
              >
                <img src={deleteButton} alt="delete" />
              </button>
            </section>
          )}
        </div>
        <OtherUserProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
          profile={profile}
        />
        <hr className="w-full justify-self-center border-[#000000]/60" />

        <div className="grid grid-cols-2 gap-6 py-10 mb-4 px-4">
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">모집 구분</div>
            <label className="block text-[#000000]/50">{data.projectType}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">진행 방식</div>
            <label className="block text-[#000000]/50">{data.projectMode}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">모집 인원</div>
            <label className="block text-[#000000]/50">{data.totalMembers}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">시작 예정</div>
            <label className="block text-[#000000]/50">{data.startDate}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">팀원 태그</div>
            <div className="flex flex-wrap gap-2">
              {data.teams.map((teamNickname, index) => (
                <button
                  key={index}
                  onClick={() => openTeamMemberModal(teamNickname.nickname)}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full"
                    style={{
                      backgroundColor: `#${teamProfiles[teamNickname.nickname] || ''}`
                    }}
                  />
                  <span className="font-bold text-[14px] whitespace-nowrap">
                    {teamNickname.nickname.split(/(#\d+)/)[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">예상 기간</div>
            <label className="block text-[#000000]/50">
              {durationOptions.find(option => option.value === data.duration)?.label ||
                '알 수 없음'}
            </label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">모집 포지션</div>
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
                <div className="relative">
                  <div
                    className="font-bold p-1 px-4 text-[14px] text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] cursor-pointer inline-bloc"
                    onClick={togglePositionTooltip}
                  >
                    +{extraPositionsCount}
                  </div>
                  {isPositionTooltipOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow max-w-[300px] overflow-x-auto">
                      <div className="flex space-x-2">
                        {data.requiredPositions.slice(2).map((positionId, index) => {
                          const positionTitle =
                            positionList.find(pos => pos.id === positionId)?.title || '알 수 없음';
                          return positionTitle ? (
                            <div
                              key={index}
                              className="font-bold p-1 px-4 text-[14px] text-[#3387E5] bg-[#3387E5]/15 rounded-[30px] inline-block whitespace-nowrap"
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
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">사용 스택</div>
            <div className="">
              <div className="font-semibold py-2 flex flex-wrap gap-4">
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
                      className="w-10 h-10"
                    />
                  ) : null;
                })}
                {extraTechStacksCount > 0 && (
                  <div className="relative">
                    <div
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 text-[16px] font-semibold rounded-[8px] cursor-pointer"
                      onClick={toggleTechTooltip}
                    >
                      +{extraTechStacksCount}
                    </div>
                    {/* 기술스택 툴팁 */}
                    {isTechTooltipOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 p-2 bg-white border border-gray-300 rounded shadow max-w-[300px] overflow-x-auto">
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
                                className="w-10 h-10"
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
        <div className="block font-bold text-[24px] mb-4 px-4">모집 소개</div>
        <hr className="w-full justify-self-center border-[#000000]/60 py-4" />
        <div
          className="block px-4 select-text cursor-text min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        {data?.authorNickname === userNickname ? (
          <OtherApplicationModal apply={applications} onStatusChange={updateApplicationStatus} />
        ) : data?.applied ? (
          <ApplyResultModal
            nickname={userNickname}
            position={'후롱트'}
            applyStatus={data?.applyStatus}
            kakaoUrl={data?.kakaoUrl}
          />
        ) : (
          <ApplyModal />
        )}

        {/* <div>
          <button className="flex justify-self-center space-x-4 items-center py-2 px-[100px] mt-10 bg-[#202123] rounded-[30px]">
            <div className="text-[#FFFFFF] font-bold text-[20px]">지원자 보기</div>
            <div className="flex items-center justify-center min-w-[24px] h-[24px] px-2 bg-[#FFFF33] rounded-full text-black font-bold">
              999+
            </div>
          </button>
        </div> */}
      </section>
      <OtherUserProfileModal
        isOpen={!!selectedTeamMember}
        onClose={closeTeamMemberModal}
        profile={teamMemberProfile}
      />
    </div>
  );
};

export default Viewer;
