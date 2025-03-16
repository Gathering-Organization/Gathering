// 다른 항목을 입력하면 사용 스택에도 리렌더링이 발생해서 최적화가 필요함
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { setPosting } from '@/services/postApi';
import { useState, useEffect, useContext } from 'react';
import { PostingInfo } from '@/types/post';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { useProfile } from '@/contexts/ProfileStateContext';
import { ProfileInfo } from '@/types/profile';
import { positionData } from '@/utils/position-data';
import { techStacks } from '@/utils/tech-stacks';
import SingleSelection from '@/components/SingleSelection';

interface Position {
  id: string;
  title: string;
}

interface TechStack {
  id: string;
  title: string;
}

const Posting: React.FC = () => {
  const [projectType, setProjectType] = useState('');

  const projectTypeOptions = [
    { label: '프로젝트', value: 'PROJECT' },
    { label: '대회', value: 'CONTEST' },
    { label: '스터디', value: 'STUDY' },
    { label: '기타', value: 'OTHER' }
  ];

  const projectModeOptions = [
    { label: '온라인', value: 'ONLINE' },
    { label: '오프라인', value: 'OFFLINE' },
    { label: '온+오프라인', value: 'BLENDED' }
  ];

  const durationOptions = [
    { label: '1개월', value: 'ONE' },
    { label: '2개월', value: 'TWO' },
    { label: '3개월', value: 'THERR' },
    { label: '4개월', value: 'FOUR' },
    { label: '5개월', value: 'FIVE' },
    { label: '6개월 이상', value: 'SIX' }
  ];

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
  const [selectedDuration, setSelectedDuration] = useState('');
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

  // const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setPost(prev => ({ ...prev, [name]: value }));
  // };

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
        alert('모집글 작성이 완료되었습니다.');
      } else {
        alert(result?.message || '모집글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('모집글 작성 중 오류가 발생했습니다.');
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
      {/* <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">
          #{profile.profileColor} {profile.nickname}
        </label>
      </section> */}

      <div className="grid grid-cols-2 gap-2 py-10">
        <section className="px-6 py-2">
          <label className="block mb-2">모집 구분</label>
          <SingleSelection
            title="모집 구분"
            options={projectTypeOptions}
            selectedValue={projectType}
            setSelectedValue={setProjectType}
          />
          {/* <label className="block mb-2">모집 구분</label>
          <div className="relative w-full">
            <select
              onChange={e => setPost({ ...post, projectType: e.target.value })}
              id="countries"
              className="appearance-none bg-gray-50 dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-10 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option selected>모집 구분</option>
              <option value="PROJECT">프로젝트</option>
              <option value="CONTEST">대회</option>
              <option value="STUDY">스터디</option>
              <option value="OTHER">기타</option>
            </select>

            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div> */}
        </section>
        <section className="px-6 py-2">
          <label className="block mb-2">진행 방식</label>
          <SingleSelection
            title="진행 방식"
            options={projectModeOptions}
            selectedValue={projectType}
            setSelectedValue={setProjectType}
          />
          {/* <select
            onChange={e => setPost({ ...post, projectMode: e.target.value })}
            id="countries"
            className="bg-gray-50 dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option selected>진행 방식</option>
            <option value="ONLINE">온라인</option>
            <option value="OFFLINE">오프라인</option>
            <option value="BLENDED">온+오프라인</option>
          </select> */}
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
          />
        </section>
        <section className="px-6 py-2">
          <label className="block mb-2">모집 인원</label>
          <input
            onChange={e => setPost({ ...post, totalMembers: Number(e.target.value) })}
            type="text"
            name="title"
            className="border border-gray-300 rounded w-full placeholder-gray-500 bg-gray-50 rounded-[20px] p-3 px-6 text-sm"
            placeholder="모집 인원"
          />
        </section>

        <section className="px-6 py-2">
          <label className="block mb-2">카카오톡 오픈채팅 URL</label>
          <input
            onChange={e => setPost({ ...post, kakaoUrl: e.target.value })}
            type="text"
            name="kakaoUrl"
            className="border border-gray-300 rounded w-full placeholder-gray-500 bg-gray-50 rounded-[20px] p-3 px-6 text-sm"
            placeholder="카카오톡 오픈채팅 URL"
          />
        </section>
        <section className="px-6 py-2">
          <label className="block mb-2">팀원 태그</label>
          <input
            onChange={e => {
              const teamNicknames = e.target.value.split(',').map(nickname => nickname.trim());
              setPost({ ...post, teams: teamNicknames });
            }}
            type="text"
            name="teams"
            className="border border-gray-300 rounded w-full placeholder-gray-500 bg-gray-50 rounded-[20px] p-3 px-6 text-sm"
            placeholder="팀원 태그 ex) @게더링#248834, @게더링하이#546931"
          />
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
          {/* <select
            onChange={e => setPost({ ...post, duration: e.target.value })}
            id="countries"
            className="bg-white dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option selected>진행 방식</option>
            <option value="ONE">1개월</option>
            <option value="TWO">2개월</option>
            <option value="THR">3개월</option>
          </select> */}
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
