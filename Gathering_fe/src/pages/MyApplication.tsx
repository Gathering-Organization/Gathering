import { useState, useEffect } from 'react';
import PostList from '@/components/PostList';
import { getMyPosting, getPartPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import { ProfileAllInfo } from '@/types/profile';
import { ProfileCacheContext } from '@/contexts/ProfileCacheContext';
import Pagination from '@/components/Pagination';
import { useProfile } from '@/contexts/ProfileStateContext';
import { useLocation } from 'react-router-dom';
import { getMyApplication } from '@/services/applicationApi';
import { ApplyDetails } from '@/types/apply';
import { getUserProfile } from '@/services/profileApi';

const MyApplication: React.FC = () => {
  const location = useLocation();
  const { filter: postingFilter = '' } = location.state || {};
  const [page, setPage] = useState(1);
  const [post, setPost] = useState<approxPostInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>(String(postingFilter));
  const [totalPages, setTotalPages] = useState<number>(1);
  const [profileCache, setProfileCache] = useState<{ [nickname: string]: ProfileAllInfo }>({});
  const [info, setInfo] = useState<ProfileAllInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: '',
    public: false,
    portfolio: null,
    workExperiences: [],
    totalProjects: 0,
    openedProjects: 0,
    closedProjects: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const { myProfile } = useProfile();

  useEffect(() => {
    if (myProfile) {
      setInfo(myProfile);
    }
  }, [myProfile]);

  const nickname = info.nickname;

  useEffect(() => {
    if (nickname) {
      const fetchPostsAndProfiles = async () => {
        try {
          window.scrollTo(0, 0);

          const myApplicationResult = await getMyApplication(page, selectedType);

          if (myApplicationResult?.success) {
            const applicationList: ApplyDetails[] = myApplicationResult.data;

            const statusMap: Record<number, string> = {};
            applicationList.forEach(app => {
              statusMap[app.projectId] = app.status;
            });

            // const projectIds = applicationList.map(item => item.projectId);
            // const projectInfos = await Promise.all(
            //   projectIds.map((id: number) => getPartPosting(id))
            // );

            // const validProjects = projectInfos
            //   .filter(p => p && p.success)
            //   .map(p => p?.data as approxPostInfo);

            // const projectsWithStatus = validProjects.map(project => ({
            //   ...project,
            //   status: statusMap[project.projectId] || undefined
            // }));

            // setPost(projectsWithStatus);
            setPost(myApplicationResult.data);
            setTotalPages(myApplicationResult.data.totalPages);

            const newCache: { [nickname: string]: ProfileAllInfo } = {};
            // const uniqueNicknames = [...new Set(validProjects.map(post => post.authorNickname))];

            // await Promise.all(
            //   uniqueNicknames.map(async nick => {
            //     try {
            //       const result = await getUserProfile(nick);
            //       if (result?.success) {
            //         newCache[nick] = result.data;
            //       }
            //     } catch (err) {
            //       console.error(`프로필 정보 불러오기 실패: ${nick}`);
            //     }
            //   })
            // );

            setProfileCache(prev => ({ ...prev, ...newCache }));
          } else {
            console.error(myApplicationResult?.message || '지원서 조회 중 오류 발생');
          }
        } catch (error) {
          console.error('지원서 조회 실패:', error);
        }
      };

      fetchPostsAndProfiles();
    }
  }, [nickname, page, selectedType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ProfileCacheContext.Provider value={{ profileCache }}>
      <div className="mx-28 space-y-6">
        <div className="mx-6 flex justify-between items-center">
          <ProjecTypeFilter
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            filterCategory={'myApply'}
          />
        </div>
        <div className="z-0 space-y-24">
          <PostList data={post} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </ProfileCacheContext.Provider>
  );
};

export default MyApplication;
