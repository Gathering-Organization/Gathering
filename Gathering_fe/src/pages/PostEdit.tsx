// 추후 useReducer를 이용하여 Posting CREATE/UPDATE/DELETE로 통합 예정
import { getPartPosting, modifyPosting, setPosting } from './../services/postApi';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostingInfo, GetPostingInfo } from './../types/post';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from './../components/MultiSelection';
import { getMyProfile } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';

const PostEdit: React.FC = () => {
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
  const [positionList] = useState<string[]>(['프론트엔드', '백엔드', '디자이너']);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [stackList] = useState<string[]>(['React', 'Spring', 'TypeScript']);
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResult = await getPartPosting(Number(params.id));

        if (postResult?.success) {
          console.log('찐최종:', postResult.data);
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
        alert('모집글 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPost();
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
          value={post.title}
          type="text"
          name="title"
          className="border rounded w-full p-2"
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 구분</label>
        <select
          value={post.projectType}
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
          value={post.projectMode}
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
          value={post.totalMembers}
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
          value={post.kakaoUrl}
          onChange={e => setPost({ ...post, kakaoUrl: e.target.value })}
          type="text"
          name="kakaoUrl"
          className="border rounded w-full p-2"
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">팀원 태그</label>
        <input
          value={post.teams.join(', ')}
          onChange={e => {
            setPost({
              ...post,
              teams: e.target.value.split(', ').map(nickname => nickname.trim())
            });
          }}
          onBlur={() => {
            setPost(prev => ({
              ...prev,
              teams: prev.teams.filter(nickname => nickname !== '') // 포커스를 벗어나면 빈 값 삭제
            }));
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
          options={positionList}
          selectedOptions={selectedPositions}
          setSelectedOptions={selectedOptions => {
            setSelectedPositions(selectedOptions);
            setPost({ ...post, requiredPositions: selectedOptions });
          }}
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">사용 스택</label>
        <MultiSelection
          options={stackList}
          selectedOptions={selectedStacks}
          setSelectedOptions={selectedOptions => {
            setSelectedStacks(selectedOptions);
            setPost({ ...post, techStacks: selectedOptions });
          }}
        />
      </section>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <label className="block font-semibold mb-2">모집 소개</label>
        <input
          value={post.description}
          onChange={e => setPost({ ...post, description: e.target.value })}
          type="text"
          name="title"
          className="border rounded w-full p-2"
        />
      </section>
      <button
        className="bg-blue-500 p-10 text-white w-full rounded hover:bg-blue-600"
        onClick={onUpdate}
      >
        수정하기
      </button>
    </div>
  );
};

export default PostEdit;
