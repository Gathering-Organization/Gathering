import { useState, useEffect } from 'react';
import PostList from '@/components/PostList';
import { getMyPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';
import ProjecTypeFilter from '@/components/ProjectTypeFilter';
import { getUserProfile } from '@/services/profileApi';
import { ProfileAllInfo } from '@/types/profile';
import { ProfileCacheContext } from '@/contexts/ProfileCacheContext';
import Pagination from '@/components/Pagination';
import { useProfile } from '@/contexts/ProfileStateContext';
import { useLocation } from 'react-router-dom';

const MyPostHome: React.FC = () => {
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
    workExperiences: []
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
      const fetchPosts = async () => {
        try {
          window.scrollTo(0, 0);
          const result = await getMyPosting(nickname, page, selectedType);
          if (result?.success) {
            setPost(result.data);
            setTotalPages(result.pagination.totalPages);
          } else {
            console.error(result?.message || '게시글 조회 중 오류 발생');
          }
        } catch (error) {
          console.error('게시글 조회 실패:', error);
        }
      };
      fetchPosts();
    }
  }, [nickname, page, selectedType]);

  // useEffect(() => {
  //   if (post.length > 0) {
  //     const uniqueAuthors = Array.from(new Set(post.map(p => p.authorNickname)));
  //     const fetchProfiles = async () => {
  //       const newCache = { ...profileCache };
  //       await Promise.all(
  //         uniqueAuthors.map(async authorNickname => {
  //           if (!newCache[authorNickname]) {
  //             try {
  //               const result = await getUserProfile(authorNickname);
  //               if (result?.success) {
  //                 newCache[authorNickname] = result.data as ProfileAllInfo;
  //               }
  //             } catch (error) {
  //               console.error(`프로필 정보 불러오기 실패: ${authorNickname}`);
  //             }
  //           }
  //         })
  //       );
  //       setProfileCache(newCache);
  //     };
  //     fetchProfiles();
  //   }

  // }, [post]);

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
            filterCategory={'myProject'}
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

export default MyPostHome;
