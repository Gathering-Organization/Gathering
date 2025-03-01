import { partPostInfo } from '@/types/post';
import { getStringedDate } from '@/utils/get-stringed-date';
import { useState, useEffect } from 'react';
import { positionData } from '@/utils/position-data';
import { getStackImage } from '@/utils/get-stack-image';
import { useOtherProfile } from '@/hooks/UseOtherProfile';
import OtherUserProfileModal from './OtherUserProfileModal';
import { getUserProfile } from '@/services/profileApi';

interface Position {
  id: string;
  title: string;
}

const Viewer: React.FC<{ data: partPostInfo | null }> = ({ data }) => {
  const [positionList] = useState<Position[]>([...positionData]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { profile, isLoading, error } = useOtherProfile(data?.authorNickname ?? null);
  const [teamProfiles, setTeamProfiles] = useState<{ [key: string]: string }>({});
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const {
    profile: teamMemberProfile,
    isLoading: teamMemberLoading,
    error: teamMemberError
  } = useOtherProfile(selectedTeamMember);
  const [loading, setLoading] = useState<boolean>(true);

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

  const openTeamMemberModal = (nickname: string) => {
    setSelectedTeamMember(nickname);
  };
  const closeTeamMemberModal = () => {
    setSelectedTeamMember(null);
  };

  if (!data) return <p>데이터를 불러오는 중...</p>;

  // if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const parts = data.authorNickname.split(/(#\d+)/);

  return (
    <div className="mx-48 space-y-2 min-h-screen">
      <section className="bg-white p-6 mb-4">
        <div className="flex items-center">
          <button className="block text-[36px] font-[1000] mb-20 px-6">{data.title}</button>
        </div>

        <div className="flex items-center justify-between p-4 mb-4">
          <button
            onClick={openProfileModal}
            className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg"
          >
            <div
              className="w-[30px] h-[30px] rounded-full"
              style={{ backgroundColor: `#${profile.profileColor}` }}
            />
            <span className="font-bold text-[20px] whitespace-nowrap">{parts[0]}</span>
          </button>

          <div className="flex space-x-4 text-[#000000]/50">
            <span className="font-semibold">생성일: {getStringedDate(data.createdAt)}</span>
            <span className="font-semibold">최종 수정일: {getStringedDate(data.updatedAt)}</span>
            <span className="font-semibold">마감일: {getStringedDate(data.deadline)}</span>
          </div>
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
            {/* <div className="w-28">팀원 태그</div>
            <label className="block text-[#000000]/50">{data.teams.join(', ')}</label> */}
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">예상 기간</div>
            <label className="block text-[#000000]/50">{data.startDate}</label>
          </div>
          <div className="flex items-center space-x-12 text-[20px] font-bold">
            <div className="w-28">모집 포지션</div>
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
      <OtherUserProfileModal
        isOpen={!!selectedTeamMember}
        onClose={closeTeamMemberModal}
        profile={teamMemberProfile}
      />
    </div>
  );
};

export default Viewer;
