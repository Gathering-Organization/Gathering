import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { setPosting } from '@/services/postApi';
import { useState, useEffect, useContext } from 'react';
import { PostingInfo } from '@/types/post';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { useProfile } from '@/contexts/ProfileStateContext';
import { positionData } from '@/utils/position-data';
import { techStacks } from '@/utils/tech-stacks';
import SingleSelection from '@/components/SingleSelection';
import { useNavigate } from 'react-router-dom';
import {
  projectTypeOptions,
  projectModeOptions,
  durationOptions,
  totalMemberOptions
} from '@/utils/post-options';
import TeamTagInput from '@/components/TeamTagInput';
import { useToast } from '@/contexts/ToastContext';

interface Position {
  id: string;
  title: string;
}

interface TechStack {
  id: string;
  title: string;
}

const Posting: React.FC = () => {
  const nav = useNavigate();
  const [projectType, setProjectType] = useState<string>('');
  const [selectedTotalMembers, setSelectedTotalMembers] = useState<string>('0');

  const [startDate, setStartDate] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [deadline, setDeadline] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [positionList] = useState<Position[]>([...positionData]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedProjectMode, setSelectedProjectMode] = useState<string>('');
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

  const { showToast } = useToast();

  const onCreate = async () => {
    console.log('최종 저장 데이터: ', post);
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

      const result = await setPosting(postInfo);

      if (result?.success) {
        showToast('모집글 작성이 완료되었습니다.', true);
        nav('/');
      } else {
        showToast('모집글 작성 중 오류가 발생했습니다.', false);
      }
    } catch (error) {
      showToast('모집글 작성 중 오류가 발생했습니다.', false);
      console.error(error);
    }
  };

  const { myProfile, isMyProfileLoading } = useProfile();

  if (isMyProfileLoading) return <div>로딩 중...</div>;

  return (
    <div className="mx-48 space-y-2">
      <section className="p-6">
        <label className="block font-semibold mb-4">제목</label>
        <input
          onChange={e => setPost({ ...post, title: e.target.value })}
          type="text"
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
          <label className="block mb-2">모집 마감 기한</label>
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
          onClick={onCreate}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default Posting;
