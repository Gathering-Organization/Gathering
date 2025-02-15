import { setPosting } from '@/services/postApi';
import { useState, useEffect } from 'react';
import { PostingInfo } from '@/types/post';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { getMyProfile } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';
import { positionData } from '@/utils/position-data';
import { techStacks } from '@/utils/tech-stacks';

interface Position {
  id: string;
  title: string;
}

interface TechStack {
  id: string;
  title: string;
}

const Posting: React.FC = () => {
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
  console.log(...techStacks);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
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

  const [info, setInfo] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
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

  useEffect(() => {
    const handleMyProfile = async () => {
      try {
        const result = await getMyProfile();

        if (result?.success) {
          alert('내 정보 불러오기 성공!' + result.data);
          console.log(result.data);
          setInfo({
            nickname: result.data.nickname || '',
            introduction: result.data.introduction || '',
            organization: result.data.organization || '',
            techStacks: result.data.techStacks || [],
            profileColor: result.data.profileColor || ''
          });
        } else {
          alert(result?.message || '내 정보 불러오기에 실패했습니다.');
        }
      } catch {
        alert('내 정보 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    handleMyProfile();
  }, []);
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">
          #{info.profileColor} {info.nickname}
        </label>
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">제목</label>
        <input
          onChange={e => setPost({ ...post, title: e.target.value })}
          type="text"
          name="title"
          className="border rounded w-full p-2"
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 구분</label>
        <select
          onChange={e => setPost({ ...post, projectType: e.target.value })}
          id="countries"
          className="bg-white dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option selected>모집 구분</option>
          <option value="PROJECT">프로젝트</option>
          <option value="CONTEST">대회</option>
          <option value="STUDY">스터디</option>
          <option value="OTHER">기타</option>
        </select>
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">진행 방식</label>
        <select
          onChange={e => setPost({ ...post, projectMode: e.target.value })}
          id="countries"
          className="bg-white dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option selected>진행 방식</option>
          <option value="ONLINE">온라인</option>
          <option value="OFFLINE">오프라인</option>
          <option value="BLENDED">온+오프라인</option>
        </select>
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 인원</label>
        <input
          onChange={e => setPost({ ...post, totalMembers: Number(e.target.value) })}
          type="text"
          name="title"
          className="border rounded w-full p-2"
        />
      </section>

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">시작 예정</label>
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

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">마감 날짜</label>
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
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">카카오톡 오픈채팅 URL</label>
        <input
          onChange={e => setPost({ ...post, kakaoUrl: e.target.value })}
          type="text"
          name="kakaoUrl"
          className="border rounded w-full p-2"
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">팀원 태그</label>
        <input
          onChange={e => {
            const teamNicknames = e.target.value.split(',').map(nickname => nickname.trim());
            setPost({ ...post, teams: teamNicknames });
          }}
          type="text"
          name="teams"
          className="border rounded w-full p-2"
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">예상 기간</label>
        <select
          onChange={e => setPost({ ...post, duration: e.target.value })}
          id="countries"
          className="bg-white dark:bg-[#1E2028] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option selected>진행 방식</option>
          <option value="ONE">1개월</option>
          <option value="TWO">2개월</option>
          <option value="THR">3개월</option>
        </select>
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 분야</label>
        <MultiSelection
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
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">사용 스택</label>
        <MultiSelection
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
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 소개</label>
        <input
          onChange={e => setPost({ ...post, description: e.target.value })}
          type="text"
          name="title"
          className="border rounded w-full p-2"
        />
      </section>
      <button
        className="bg-blue-500 p-10 text-white w-full rounded hover:bg-blue-600"
        onClick={onCreate}
      >
        작성하기
      </button>
    </div>
  );
};

export default Posting;
