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
import {
  durationOptions,
  projectModeOptions,
  projectTypeOptions,
  totalMemberOptions
} from '@/utils/post-options';
import ReactQuill from 'react-quill';

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

  const [info, setInfo] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
  });
  useEffect(() => {
    if (post.startDate) {
      const parsedStart = new Date(`${post.startDate}T00:00:00`);
      if (!isNaN(parsedStart.getTime())) {
        setStartDate({ startDate: parsedStart, endDate: parsedStart });
      }
    }

    if (post.deadline) {
      const parsedDeadline = new Date(post.deadline);
      if (!isNaN(parsedDeadline.getTime())) {
        setDeadline({ startDate: parsedDeadline, endDate: parsedDeadline });
      }
    }
  }, [post.startDate, post.deadline]);
  useEffect(() => {
    if (post) {
      setProjectType(post.projectType);
      setSelectedProjectMode(post.projectMode);
      setSelectedTotalMembers(post.totalMembers.toString());
      setSelectedDuration(post.duration);
      setSelectedPositions(post.requiredPositions);
      setSelectedStacks(post.techStacks);
    }
  }, [post]);

  const onUpdate = async () => {
    console.log('최종 저장 닉네임: ', post.teams);
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

      console.log('변환된 데이터: ', postInfo);

      const result = await modifyPosting(Number(params.id), postInfo);

      if (result?.success) {
        alert('모집글 수정이 완료되었습니다.');
        nav('/', { replace: true });
      } else {
        alert(result?.message || '모집글 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('모집글 수정 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResult, postResult] = await Promise.all([
          getMyProfile(),
          getPartPosting(Number(params.id))
        ]);

        // 내 프로필 불러오기
        if (profileResult?.success) {
          alert('내 정보 불러오기 성공!' + profileResult.data);
          console.log(profileResult.data);
          setInfo({
            nickname: profileResult.data.nickname || '',
            introduction: profileResult.data.introduction || '',
            organization: profileResult.data.organization || '',
            techStacks: profileResult.data.techStacks || [],
            profileColor: profileResult.data.profileColor || ''
          });
        } else {
          alert(profileResult?.message || '내 정보 불러오기에 실패했습니다.');
        }

        // 모집글 정보 불러오기
        if (postResult?.success) {
          const teamNicknames = ((postResult.data.teams as { nickname: string }[]) || []).map(
            team => team.nickname
          );
          setPost({ ...postResult.data, teams: teamNicknames });
          setSelectedPositions(postResult.data.requiredPositions || []);
          setSelectedStacks(postResult.data.techStacks || []);

          setStartDate({
            startDate: postResult.data.startDate ? new Date(postResult.data.startDate) : null,
            endDate: null
          });

          setDeadline({
            startDate: null,
            endDate: postResult.data.deadline ? new Date(postResult.data.deadline) : null
          });

          console.log('불러온 날짜:', {
            startDate: postResult.data.startDate,
            deadline: postResult.data.deadline
          });
        } else {
          alert('모집글 정보를 불러오는 중 오류가 발생했습니다.');
        }
      } catch {
        alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mx-48 space-y-2">
      <section className="p-6">
        <label className="block font-semibold mb-4">제목</label>
        <input
          onChange={e => setPost({ ...post, title: e.target.value })}
          type="text"
          value={post.title}
          name="title"
          className="border border-gray-300 rounded w-full p-4 mb-4 focus:outline-none"
          placeholder="모집글의 제목을 입력하세요."
        />
      </section>
      <hr className="w-[1050px] justify-self-center border-[#000000]/15" />

      <div className="grid grid-cols-2 gap-2 py-10">
        <section className="px-6 py-2">
          <label className="block mb-2">모집 구분</label>
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
          <label className="block mb-2">진행 방식</label>
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
          <label className="block mb-2">시작 예정</label>
          <DatePicker
            value={startDate}
            onChange={newValue => {
              console.log(startDate);
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
          <label className="block mb-2">마감 날짜</label>
          <DatePicker
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
          <label className="block mb-2">모집 인원</label>
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
          <label className="block mb-2">카카오톡 오픈채팅 URL</label>
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
          <label className="block mb-2">팀원 태그</label>
          <TeamTagInput teams={post.teams} setTeams={teams => setPost({ ...post, teams })} />
        </section>
        <section className="px-6 py-2">
          <label className="block mb-2">예상 기간</label>
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
          <label className="block mb-2">모집 포지션</label>
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
          <label className="block mb-2">사용 스택</label>
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
      <hr className="w-[1050px] justify-self-center border-[#000000]/15" />
      <section className="p-6 mb-4">
        <label className="block font-semibold mb-4">모집 소개</label>
        <div className="h-[280px]">
          <ReactQuill
            theme="snow"
            value={post.description}
            onChange={(content: string) => setPost({ ...post, description: content })}
            className="h-[240px] bg-white"
            placeholder="모집 내용을 입력하세요..."
          />
        </div>
      </section>
      <div className="flex justify-center mt-6">
        <button
          className="bg-[#3387E5] font-bold px-10 py-2 text-white justify-items-center rounded-[30px] hover:bg-blue-600"
          onClick={onUpdate}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default PostEdit;
