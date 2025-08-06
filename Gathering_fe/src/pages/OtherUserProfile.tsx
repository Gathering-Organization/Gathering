import { Portfolio, ProfileAllInfo, WorkExperience } from '@/types/profile';
import { useEffect, useState } from 'react';
import { techStacks } from '@/utils/tech-stacks';
import MultiSelection from '@/components/MultiSelection';
import WorkExperienceItem from '@/components/WorkExperienceItem';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOtherProfile } from '@/hooks/UseOtherProfile';
import MoreWorkExperiencesModal from '@/components/MoreWorkExperiencesModal';
import { motion } from 'framer-motion';

interface TechStack {
  id: string;
  title: string;
}

interface LocationState {
  profile: ProfileAllInfo;
}

const OtherUserProfile: React.FC = () => {
  const location = useLocation();
  const { profile } = (location.state as LocationState) || {};
  // const { profile, isLoading, error } = useOtherProfile(userNickname ?? null);
  const [stackList] = useState<TechStack[]>([...techStacks]);
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
  if (!profile) {
    return <p>프로필 정보가 없습니다.</p>;
  }

  const parts = profile.nickname.split(/(#\d+)/);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 mx-auto sm:px-6 md:px-12 lg:px-30 xl:px-60 py-6 space-y-0 sm:space-y-6">
        <div className="border-[#000000]/20 border-2 rounded-xl py-4 sm:p-8 lg:p-10 min-h-screen">
          <section className="pb-6 md:p-6 flex flex-col items-center text-center md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8">기본 프로필</h1>
            <div
              className="w-[80px] md:w-[100px] h-[80px] md:h-[100px] rounded-full mb-8 relative"
              style={{ backgroundColor: `#${profile.profileColor}` }}
            ></div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold mb-8 relative left-4 inline-block">
              <span className="pr-6 md:pr-8">
                <span className="pe-1">{parts[0]}</span>
                <span className="text-[#B4B4B4]">{parts[1]}</span>
              </span>
            </div>
          </section>

          <section className="p-4 sm:p-6 md:mb-4">
            <div className="flex items-center justify-between mb-6 md:mb-10 md:space-x-8">
              <label
                htmlFor="organization"
                className="hidden md:block text-[18px] font-semibold whitespace-nowrap"
              >
                소속
              </label>
              <div
                className={`self-end w-full sm:w-[650px] p-3 px-6 border bg-gray-50 text-xs lg:text-sm border-gray-300 rounded-[20px] focus:outline-none ${profile.techStacks.length === 0 ? 'text-gray-500' : 'text-black'}`}
              >
                {profile.organization ? profile.organization : '저장된 소속이 없습니다.'}
              </div>
            </div>

            <div className="flex items-center justify-between md:space-x-8">
              <label
                htmlFor="tech-stack"
                className="hidden md:block text-[18px] font-semibold whitespace-nowrap"
              >
                사용 기술 스택
              </label>
              <div
                className={`self-end w-full sm:w-[650px] p-3 px-6 border bg-gray-50 text-xs lg:text-sm border-gray-300 rounded-[20px] focus:outline-none ${profile.techStacks.length === 0 ? 'text-gray-500' : 'text-black'}`}
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
            {profile.workExperiences && profile.workExperiences.length > 0 ? (
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
            ) : (
              <div className="flex justify-center items-center h-[96px] bg-gray-50 border border-e-[3px] border-b-[3px] rounded-[10px]">
                <span className="text-gray-500">저장된 활동 경력이 없습니다.</span>
              </div>
            )}
          </section>

          <section className="p-4 sm:p-6 mb-0 md:mb-8 border-t border-gray-100 md:pt-8">
            <h3 className="hidden md:block text-lg font-semibold mb-4">간단 자기소개</h3>
            <div className="border-[#000000]/50 text-gray-500 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[250px] p-4 px-6 h-24 resize-none focus:outline-none">
              {profile.introduction ? profile.introduction : '저장된 자기소개 내용이 없습니다.'}
            </div>
          </section>
          <section className="p-4 sm:p-6 mb-4 md:mb-8 border-t border-gray-100 md:pt-8">
            <h3 className="text-lg font-semibold mb-4">포트폴리오</h3>
            <div className="items-center flex flex-col md:flex-row border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 sm:p-6 min-h-[96px]">
              <div className="flex-grow flex items-center justify-center sm:justify-start">
                {profile.portfolio ? (
                  <a
                    href={profile.portfolio.url}
                    download={profile.portfolio.fileName}
                    className="font-semibold text-blue-500 hover:underline sm:ml-4"
                  >
                    {profile.portfolio.fileName}
                  </a>
                ) : (
                  <span className="text-gray-500 sm:ml-4">선택된 파일 없음</span>
                )}
              </div>
              <input id="fileInput" type="file" accept=".pdf" className="hidden" />
            </div>
          </section>

          <section className="md:mt-20 pt-6 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
              상세 프로필
            </h1>
          </section>
          <section className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">모집 현황</h3>
            <div className="flex items-center justify-between border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-8 md:px-28 h-24">
              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl">{profile.totalProjects}</div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">전체</div>
              </div>

              <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl">{profile.openedProjects}</div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">모집중</div>
              </div>

              <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl">{profile.closedProjects}</div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">완료</div>
              </div>
            </div>
          </section>
          <section className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">지원 현황</h3>
            <div className="flex items-center justify-between border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-8 md:px-28 h-24">
              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl">{profile.totalApplications}</div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">전체</div>
              </div>

              <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl">{profile.pendingApplications}</div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">대기중</div>
              </div>

              <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl text-[#3387E5]">
                  {profile.approvedApplications}
                </div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">승인</div>
              </div>
              <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

              <div className="flex flex-col items-center">
                <div className="font-bold text-lg sm:text-2xl text-[#F24E1E]">
                  {profile.rejectedApplications}
                </div>
                <div className="font-semibold text-[#B4B4B4] text-[10px] sm:text-ms">거절</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default OtherUserProfile;
