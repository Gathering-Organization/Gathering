import { Portfolio, ProfileAllInfo, WorkExperience } from '@/types/profile';
import { useEffect, useState } from 'react';
import { techStacks } from '@/utils/tech-stacks';
import MultiSelection from '@/components/MultiSelection';
import WorkExperienceItem from '@/components/WorkExperienceItem';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOtherProfile } from '@/hooks/UseOtherProfile';
import MoreWorkExperiencesModal from '@/components/MoreWorkExperiencesModal';

interface TechStack {
  id: string;
  title: string;
}

const OtherUserProfile: React.FC = () => {
  const location = useLocation();
  const { nickname: userNickname = '' } = location.state || {};
  const { profile, isLoading, error } = useOtherProfile(userNickname ?? null);
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);

  //   useEffect(() => {
  //     if (info.nickname) {
  //       const fetchPosts = async () => {
  //         try {
  //           window.scrollTo(0, 0);
  //           const [allResult, recruitingResult, completedResult] = await Promise.all([
  //             getMyPosting(info.nickname, 1, ''),
  //             getMyPosting(info.nickname, 1, false),
  //             getMyPosting(info.nickname, 1, true)
  //           ]);
  //           if (allResult?.success && recruitingResult?.success && completedResult?.success) {
  //             setProjectCounts({
  //               all: allResult.pagination.totalElements,
  //               recruiting: recruitingResult.pagination.totalElements,
  //               completed: completedResult.pagination.totalElements
  //             });
  //           } else {
  //             console.error('게시글 조회 중 오류 발생');
  //           }
  //         } catch (error) {
  //           console.error('게시글 조회 실패:', error);
  //         }
  //       };
  //       fetchPosts();
  //     }
  //   }, [info.nickname]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  } else {
    console.log('이게 찐임', profile);
  }
  const parts = profile.nickname.split(/(#\d+)/);
  return (
    <div className="mx-60 space-y-6">
      <div className="border-[#000000]/20 border-2 rounded-xl p-4 px-20 min-h-screen">
        <section className="p-6 flex flex-col items-center text-center">
          <h1 className="text-[30px] font-bold mb-8">기본 프로필</h1>
          <div
            className="w-[100px] h-[100px] rounded-full mb-8 relative"
            style={{ backgroundColor: `#${profile.profileColor}` }}
          ></div>
          <div className="text-[24px] font-bold mb-8 relative left-4 inline-block">
            <span className="pr-8">
              {parts[0]}
              <span className="text-[#B4B4B4]">{parts[1]}</span>
            </span>
          </div>
        </section>

        <section className="bg-white p-6 mb-4">
          <div className="flex items-center justify-between mb-10">
            <div className="text-[18px] font-semibold">소속</div>
            <div
              className={`self-end w-[650px] p-3 px-6 border bg-gray-50 border-[#000000]/20 rounded-[30px] focus:outline-none ${profile.techStacks.length === 0 ? 'text-gray-500' : 'text-black'}`}
            >
              {profile.organization ? profile.organization : '저장된 소속이 없습니다.'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold">사용 기술 스택</div>
            <div
              className={`self-end w-[650px] p-3 px-6 border bg-gray-50 border-[#000000]/20 rounded-[30px] focus:outline-none ${profile.techStacks.length === 0 ? 'text-gray-500' : 'text-black'}`}
            >
              {profile.techStacks.length > 0
                ? stackList
                    .filter(tech => profile.techStacks.includes(tech.id))
                    .map(tech => tech.title)
                    .join(', ')
                : '저장된 기술 스택이 없습니다.'}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 mb-4">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-semibold">활동 경력</h3>
          </div>
          <div>
            {profile.workExperiences.slice(0, 3).map((experience, index) => (
              <WorkExperienceItem key={`info-${index}`} {...experience} />
            ))}
            {profile.workExperiences.length > 3 && (
              <div className="bg-white py-3">
                <MoreWorkExperiencesModal
                  workExperiences={profile.workExperiences}
                  nickname={parts[0]}
                />
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">간단 자기소개</h3>
          <div className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[250px] p-4 px-6 h-24 resize-none focus:outline-none">
            {profile.introduction}
          </div>
        </section>
        <section className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">포트폴리오</h3>
          <div className="items-center flex border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-6 h-24">
            <div className="w-[600px]">
              {profile.portfolio ? (
                <a
                  href={profile.portfolio.url}
                  download={profile.portfolio.fileName}
                  className="font-semibold text-blue-500 hover:underline ml-4"
                >
                  {profile.portfolio.fileName}
                </a>
              ) : (
                <span className="text-gray-500 ml-4">선택된 파일 없음</span>
              )}
            </div>
            <input id="fileInput" type="file" accept=".pdf" className="hidden" />
          </div>
        </section>

        <section className="mt-20 p-6 flex flex-col items-center text-center">
          <h1 className="text-[30px] font-bold mb-8">상세 프로필</h1>
        </section>
        <section className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">모집 현황</h3>
          <div className="flex items-center justify-between border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-28 h-24">
            <button className="flex flex-col items-center">
              <div className="font-bold text-[20px]">16</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">전체</div>
            </button>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <button className="flex flex-col items-center">
              <div className="font-bold text-[20px]">10</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">모집중</div>
            </button>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <button className="flex flex-col items-center">
              <div className="font-bold text-[20px]">6</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">완료</div>
            </button>
          </div>
        </section>
        <section className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">지원 현황</h3>
          <div className="flex items-center justify-between border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-28 h-24">
            <div className="flex flex-col items-center">
              <div className="font-bold text-[20px]">16</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">전체</div>
            </div>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <div className="flex flex-col items-center">
              <div className="font-bold text-[20px]">10</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">모집중</div>
            </div>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <div className="flex flex-col items-center">
              <div className="font-bold text-[20px] text-[#3387E5]">6</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">승인</div>
            </div>
            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <div className="flex flex-col items-center">
              <div className="font-bold text-[20px] text-[#F24E1E]">6</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">거절</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OtherUserProfile;
