// 추후 useReducer를 이용하여 Posting CREATE/UPDATE/DELETE로 통합 예정
import { getPartPosting, modifyPosting, setPosting } from '@/services/postApi';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostingInfo } from '@/types/post';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { getMyProfile } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';
import { positionData } from '@/utils/position-data';
import { techStacks } from '@/utils/tech-stacks';
import SingleSelection from '@/components/SingleSelection';
import TeamTagInput from '@/components/TeamTagInput';
import { useToast } from '@/contexts/ToastContext';
import {
  durationOptions,
  projectModeOptions,
  projectTypeOptions,
  totalMemberOptions
} from '@/utils/post-options';
import ReactQuill from 'react-quill';
import { useProfile } from '@/contexts/ProfileStateContext';
import { motion } from 'framer-motion';
import BeatLoader from 'react-spinners/BeatLoader';

interface Position {
  id: string;
  title: string;
}

interface TechStack {
  id: string;
  title: string;
}

const PostEdit: React.FC = () => {
  const [post, setPost] = useState<PostingInfo>({
    title: '',
    description: '',
    kakaoUrl: '',
    projectType: '',
    projectMode: '',
    totalMembers: 1,
    startDate: '',
    duration: '',
    deadline: '',
    techStacks: [],
    teams: [],
    requiredPositions: []
  });
  const nav = useNavigate();
  const [startDate, setStartDate] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const [deadline, setDeadline] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const params = useParams();
  const [projectType, setProjectType] = useState<string>(post.projectType);
  const [selectedProjectMode, setSelectedProjectMode] = useState<string>(post.projectMode);
  const [selectedTotalMembers, setSelectedTotalMembers] = useState<string>(
    post.totalMembers.toString()
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(post.duration);
  const [positionList] = useState<Position[]>([...positionData]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([...post.requiredPositions]);
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([...post.techStacks]);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const [info, setInfo] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResult = await getPartPosting(Number(params.id));

        if (postResult?.success) {
          const data = postResult.data;
          const teamNicknames = (data.teams || []).map(
            (team: { nickname: string }) => team.nickname
          );

          setPost({
            ...data,
            teams: teamNicknames
          });

          // 날짜 초기화
          setStartDate({
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.startDate ? new Date(data.startDate) : null
          });

          setDeadline({
            startDate: data.deadline ? new Date(data.deadline) : null,
            endDate: data.deadline ? new Date(data.deadline) : null
          });

          // 선택 값 초기화
          setProjectType(data.projectType);
          setSelectedProjectMode(data.projectMode);
          setSelectedTotalMembers(data.totalMembers.toString());
          setSelectedDuration(data.duration);
          setSelectedPositions(data.requiredPositions || []);
          setSelectedStacks(data.techStacks || []);
        } else {
          showToast('모집글 정보를 불러오는 중 오류가 발생했습니다.', false);
        }
      } catch {
        showToast('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.', false);
      }
    };

    fetchData();
  }, [params.id]);

  const isValidKakaoUrl = (url: string) => {
    const kakaoRegex = /^https:\/\/open\.kakao\.com\/o\/[a-zA-Z0-9]+$/;
    return kakaoRegex.test(url);
  };

  const onUpdate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    if (!isValidKakaoUrl(post.kakaoUrl)) {
      showToast('올바른 카카오 오픈채팅 URL을 입력해주세요.', false);
      setIsLoading(false);
      return;
    }
    try {
      const postInfo = {
        title: post.title,
        description: post.description,
        kakaoUrl: post.kakaoUrl,
        projectType: post.projectType,
        projectMode: post.projectMode,
        totalMembers: Number(post.totalMembers),
        startDate: new Date(post.startDate).toISOString(),
        duration: post.duration,
        deadline: new Date(post.deadline).toISOString(),
        techStacks: post.techStacks,
        teams: post.teams,
        requiredPositions: post.requiredPositions
      };

      const result = await modifyPosting(Number(params.id), postInfo);

      if (result?.success) {
        showToast('모집글 수정이 완료되었습니다.', true);
        nav('/', { replace: true });
      } else {
        showToast('모집글 수정 중 오류가 발생했습니다.', false);
      }
    } catch (error) {
      showToast('모집글 수정 중 오류가 발생했습니다.', false);
    }
  };

  const { myProfile, isMyProfileLoading } = useProfile();

  if (isMyProfileLoading) return <div>로딩 중...</div>;
  const MIN_DATE = new Date();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-10 md:px-20 lg:px-48 py-6 space-y-0 sm:space-y-6">
        <section className="p-6">
          <label className="hidden sm:block font-semibold mb-4">제목</label>
          <input
            onChange={e => setPost({ ...post, title: e.target.value })}
            type="text"
            value={post.title}
            name="title"
            className="border border-gray-300 rounded-md w-full p-4 focus:outline-none placeholder:text-sm sm:placeholder:text-base"
            placeholder="모집글의 제목을 입력하세요."
          />
        </section>
        <hr className="w-4/5 sm:w-[1050px] mx-auto border-[#000000]/15" />

        <div className="grid py-4 sm:grid-cols-2 gap-2">
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">모집 구분</label>
            <SingleSelection
              title="모집 구분"
              options={projectTypeOptions}
              selectedValue={projectType}
              setSelectedValue={value => {
                setProjectType(value);
                setPost(prev => ({ ...prev, projectType: value }));
              }}
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">진행 방식</label>
            <SingleSelection
              title="진행 방식"
              options={projectModeOptions}
              selectedValue={selectedProjectMode}
              setSelectedValue={value => {
                setSelectedProjectMode(value);
                setPost(prev => ({ ...prev, projectMode: value }));
              }}
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">시작 날짜</label>
            <DatePicker
              readOnly={true}
              value={startDate}
              onChange={newValue => {
                if (newValue) {
                  setStartDate(newValue);
                  setPost({ ...post, startDate: new Date(newValue.startDate || '').toISOString() });
                }
              }}
              asSingle={true}
              useRange={false}
              inputClassName="text-gray-500 text-sm w-full cursor-pointer bg-gray-50 dark:bg-[#1E2028] border border-gray-300 rounded-[20px] p-3 px-6 pr-10 focus:outline-none"
            />
          </section>

          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">모집 마감 기한</label>
            <DatePicker
              minDate={MIN_DATE}
              readOnly={true}
              value={deadline}
              onChange={newValue => {
                if (newValue) {
                  setDeadline(newValue);
                  setPost({ ...post, deadline: new Date(newValue.endDate || '').toISOString() });
                }
              }}
              asSingle={true}
              useRange={false}
              inputClassName="text-gray-500 text-sm w-full cursor-pointer bg-gray-50 dark:bg-[#1E2028] border border-gray-300 rounded-[20px] p-3 px-6 pr-10 focus:outline-none"
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">모집 인원</label>
            <SingleSelection
              title="모집 인원"
              options={totalMemberOptions}
              selectedValue={selectedTotalMembers}
              setSelectedValue={(value: string) => {
                setSelectedTotalMembers(value);
                setPost(prev => ({ ...prev, totalMembers: Number(value) }));
              }}
            />
          </section>

          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">카카오톡 오픈채팅 URL</label>
            <input
              onChange={e => setPost({ ...post, kakaoUrl: e.target.value })}
              type="text"
              value={post.kakaoUrl}
              name="kakaoUrl"
              className="border border-gray-300 rounded w-full placeholder-gray-500 bg-gray-50 rounded-[20px] p-3 px-6 text-sm focus:outline-none"
              placeholder="카카오톡 오픈채팅 URL"
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">팀원 태그</label>
            <TeamTagInput teams={post.teams} setTeams={teams => setPost({ ...post, teams })} />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">예상 기간</label>
            <SingleSelection
              title="예상 기간"
              options={durationOptions}
              selectedValue={selectedDuration}
              setSelectedValue={value => {
                setSelectedDuration(value);
                setPost(prev => ({ ...prev, duration: value }));
              }}
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">모집 포지션</label>
            <MultiSelection
              title="모집 포지션을 선택하세요."
              options={positionList.map(pos => pos.title)}
              selectedOptions={selectedPositions.map(
                id => positionList.find(pos => pos.id === id)?.title || ''
              )}
              setSelectedOptions={selectedTitles => {
                const selectedIds = positionList
                  .filter(pos => selectedTitles.includes(pos.title))
                  .map(pos => pos.id);

                setSelectedPositions(selectedIds);
                setPost({ ...post, requiredPositions: selectedIds });
              }}
            />
          </section>
          <section className="px-6 py-2">
            <label className="text-sm sm:text-base">사용 스택</label>
            <MultiSelection
              title="사용 스택을 선택하세요."
              options={stackList.map(tech => tech.title)}
              selectedOptions={selectedStacks.map(
                id => stackList.find(tech => tech.id === id)?.title || ''
              )}
              setSelectedOptions={selectedTechs => {
                const selectedIds = stackList
                  .filter(tech => selectedTechs.includes(tech.title))
                  .map(tech => tech.id);
                setSelectedStacks(selectedIds);
                setPost({ ...post, techStacks: selectedIds });
              }}
            />
          </section>
        </div>
        <hr className="w-4/5 sm:w-[1050px] mx-auto border-[#000000]/15" />
        <section className="p-6 mb-4">
          <label className="block font-semibold mb-4">모집 소개</label>
          <div className="h-[350px] md:h-[280px]">
            <ReactQuill
              theme="snow"
              value={post.description}
              onChange={(content: string) => setPost({ ...post, description: content })}
              className="h-[250px] bg-white"
              placeholder="모집 내용을 입력하세요..."
            />
          </div>
        </section>
        <div className="flex justify-center mt-8">
          <button
            disabled={isLoading}
            className={`bg-[#3387E5] text-white font-semibold px-10 py-2 rounded-full hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onUpdate}
          >
            수정완료
          </button>
        </div>
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
            <BeatLoader color="#3387E5" size={20} />
            <p className="mt-4 text-gray-700 font-semibold">모집글을 작성 중입니다...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostEdit;
