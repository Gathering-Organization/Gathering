import {
  deletePortfolio,
  getMyProfile,
  setMyProfile,
  toggleProfileVisibility,
  uploadPortfolio
} from '@/services/profileApi';
import { Portfolio, ProfileAllInfo, WorkExperience } from '@/types/profile';
import { useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import { techStacks } from '@/utils/tech-stacks';
import MultiSelection from '@/components/MultiSelection';
import WorkExperienceModal from '@/components/WorkExperienceModal';
import NicknameModal from '@/components/NicknameModal';
import ProfileColorModal from '@/components/ProfileColorModal';
import WorkExperienceItem from '@/components/WorkExperienceItem';
import { useNavigate } from 'react-router-dom';
import { getMyPosting } from '@/services/postApi';
import { approxPostInfo } from '@/types/post';

interface TechStack {
  id: string;
  title: string;
}

const Profile: React.FC = () => {
  const nav = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<Portfolio | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [projectCounts, setProjectCounts] = useState({
    all: 0,
    recruiting: 0,
    completed: 0
  });
  const [post, setPost] = useState<approxPostInfo[]>([]);
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
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    activityName: '',
    startDate: '',
    endDate: '',
    description: '',
    techStacks: []
  });
  const stacks = [...techStacks];
  const filteredStacks = stacks.filter(stack => !info.techStacks.includes(stack.title));

  // useEffect(() => {
  //   const handleMyProfile = async () => {
  //     try {
  //       const result = await getMyProfile();

  //       if (result?.success) {
  //         alert('내 정보 불러오기 성공!' + result.data);
  //         console.log(result.data);
  //         setIsPublic(result.data.public);
  //         if (result.data.portfolio) {
  //           setUploadedFile(result.data.portfolio);
  //         }
  //         setInfo({
  //           nickname: result.data.nickname || '',
  //           introduction: result.data.introduction || '',
  //           organization: result.data.organization || '',
  //           techStacks: result.data.techStacks || [],
  //           profileColor: result.data.profileColor || ''
  //         });
  //         setWorkExperiences(result.data.workExperiences || []);
  //       } else {
  //         alert(result?.message || '내 정보 불러오기에 실패했습니다.');
  //       }
  //     } catch {
  //       alert('내 정보 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   };

  //   handleMyProfile();
  // }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedInfo = {
        nickname: info?.nickname || '',
        introduction: info?.introduction || '',
        organization: info?.organization || '',
        techStacks: info?.techStacks || [],
        profileColor: info.profileColor,
        public: isPublic
      };
      console.log(updatedInfo, workExperiences);
      const result = await setMyProfile(updatedInfo, workExperiences);

      if (result?.success) {
        alert('프로필 저장 성공!');
        updateProfileData({ ...updatedInfo, workExperiences });
      } else {
        alert(result?.message || '프로필 저장 중 문제가 발생했습니다.');
      }
    } catch {
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const handleFileSelect = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadPortfolio(formData);

      if (result?.success) {
        alert('파일 업로드 성공!');

        const profileResult = await getMyProfile();
        if (profileResult?.success) {
          setUploadedFile(profileResult.data.portfolio);
        } else {
          alert(profileResult?.message || '프로필 갱신 중 문제가 발생했습니다.');
        }
      }
    } catch {
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile) {
      alert('삭제할 파일이 없습니다.');
      return;
    }

    try {
      const result = await deletePortfolio();

      if (result?.success) {
        alert('파일 삭제 성공!');
        setSelectedFile(null);
        setUploadedFile(null);
      }
    } catch {
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggle = async () => {
    try {
      const result = await toggleProfileVisibility();

      if (result?.success) {
        const updatedPublic = !info.public;
        setIsPublic(prev => !prev);
        updateProfileData({ public: updatedPublic });
      }
    } catch {
      alert('프로필 공개 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleStackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    const updatedTechStacks = [...new Set([...selectedOptions, ...info.techStacks])];

    setInfo(prevInfo => ({
      ...prevInfo,
      techStacks: updatedTechStacks
    }));

    console.log(updatedTechStacks);
  };

  const handleStackRemove = (stack: string) => {
    const updatedTechStacks = info.techStacks.filter(tech => tech !== stack);

    setInfo(prevInfo => ({
      ...prevInfo,
      techStacks: updatedTechStacks
    }));
  };

  const handleAddExperience = (experience: WorkExperience) => {
    if (
      !experience.activityName ||
      !experience.startDate ||
      !experience.endDate ||
      !experience.description
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setWorkExperiences(prev => [...prev, experience]);
  };

  const handleDeleteExperience = (index: number) => {
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (info.nickname) {
      const fetchPosts = async () => {
        try {
          window.scrollTo(0, 0);
          const [allResult, recruitingResult, completedResult] = await Promise.all([
            getMyPosting(info.nickname, 1, ''),
            getMyPosting(info.nickname, 1, false),
            getMyPosting(info.nickname, 1, true)
          ]);
          if (allResult?.success && recruitingResult?.success && completedResult?.success) {
            setProjectCounts({
              all: allResult.pagination.totalElements,
              recruiting: recruitingResult.pagination.totalElements,
              completed: completedResult.pagination.totalElements
            });
          } else {
            console.error('게시글 조회 중 오류 발생');
          }
        } catch (error) {
          console.error('게시글 조회 실패:', error);
        }
      };
      fetchPosts();
    }
  }, [info.nickname]);

  const { myProfile, isMyProfileLoading, updateProfileData } = useProfile();
  useEffect(() => {
    if (myProfile) {
      window.scrollTo(0, 0);
      setInfo(myProfile);
      setIsPublic(myProfile.public);
    }
  }, [myProfile, isPublic]);

  if (isMyProfileLoading) return <div>로딩 중...</div>;
  return (
    <div className="mx-60 space-y-6">
      <div className="border-[#000000]/20 border-2 rounded-xl p-4 px-20 min-h-screen">
        <section className="p-6 flex flex-col items-center text-center">
          <h1 className="text-[30px] font-bold mb-8">기본 프로필</h1>
          <ProfileColorModal profileColor={info.profileColor} />
          <NicknameModal nickname={info.nickname || ''} />
          <button
            onClick={handleUpdateProfile}
            className="self-end bg-[#3387E5] text-white font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600"
          >
            프로필 저장
          </button>
        </section>

        <section className="bg-white p-6 mb-4">
          <div className="flex items-center justify-between mb-10">
            <label htmlFor="organization" className="text-[18px] font-semibold">
              소속
            </label>
            <input
              id="organization"
              type="text"
              value={info.organization || ''}
              placeholder="소속을 입력해주세요. ex) OO회사 OO 부서, OO대학교 OO학과"
              onChange={e => setInfo({ ...info, organization: e.target.value })}
              className="self-end w-[650px] p-3 px-6 border bg-gray-50 placeholder-gray-500 border-[#000000]/20 rounded-[30px] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="tech-stack" className="text-[18px] font-semibold">
              사용 기술 스택
            </label>
            <div className="w-[650px]">
              <MultiSelection
                title="기술 스택을 선택하세요."
                options={stackList.map(tech => tech.title)}
                selectedOptions={stackList
                  .filter(tech => info.techStacks.includes(tech.id))
                  .map(tech => tech.title)}
                setSelectedOptions={(selectedTitles: string[]) => {
                  const selectedIds = stackList
                    .filter(tech => selectedTitles.includes(tech.title))
                    .map(tech => tech.id);
                  setInfo(prev => ({
                    ...prev,
                    techStacks: selectedIds
                  }));
                }}
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 mb-4">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-semibold">활동 경력</h3>
            <WorkExperienceModal onSave={handleAddExperience} />
          </div>
          <div className="space-y-4">
            {workExperiences.map((experience, index) => (
              <WorkExperienceItem key={`new-${index}`} {...experience} />
            ))}
            {info.workExperiences.map((experience, index) => (
              <WorkExperienceItem key={`info-${index}`} {...experience} />
            ))}
          </div>
        </section>

        <section className="bg-white p-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">간단 자기소개</h3>
          <textarea
            value={info.introduction || ''}
            placeholder="300자 이내로 자신을 소개해 보세요!"
            onChange={e => setInfo({ ...info, introduction: e.target.value })}
            className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[250px] p-4 px-6 h-24 resize-none focus:outline-none"
          ></textarea>
        </section>
        <section className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">포트폴리오</h3>
          <div className="items-center flex border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-6 h-24">
            <div className="w-[600px]">
              {uploadedFile ? (
                <a
                  href={uploadedFile.url}
                  download={uploadedFile.fileName}
                  className="font-semibold text-blue-500 hover:underline ml-4"
                >
                  {uploadedFile.fileName}
                </a>
              ) : (
                <span className="text-gray-500 ml-4">선택된 파일 없음</span>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex space-x-4">
              <button
                onClick={handleFileSelect}
                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#3387E5] text-white hover:bg-blue-600"
              >
                업로드
              </button>

              <button
                onClick={handleDelete}
                disabled={!uploadedFile}
                className={`text-[12px] font-bold px-6 py-2 rounded-[20px] ${
                  uploadedFile
                    ? 'bg-[#F24E1E] text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                삭제
              </button>
            </div>
          </div>
        </section>

        <section className="mt-20 p-6 flex flex-col items-center text-center">
          <h1 className="text-[30px] font-bold mb-8">상세 프로필</h1>

          <div className="self-end space-x-2 inline-flex items-center cursor-pointer">
            <span className="ms-3 text-sm font-semibold text-[#B4B4B4] dark:text-gray-300">
              상세 프로필 공개 여부
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleToggle}
                value=""
                className="sr-only peer"
              />

              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </section>
        <section className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">모집 현황</h3>
          <div className="flex items-center justify-between border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-28 h-24">
            <button
              className="flex flex-col items-center"
              onClick={() => nav('/myPostHome', { state: { filter: '' } })}
            >
              <div className="font-bold text-[20px]">{projectCounts.all}</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">전체</div>
            </button>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <button
              className="flex flex-col items-center"
              onClick={() => nav('/myPostHome', { state: { filter: false } })}
            >
              <div className="font-bold text-[20px]">{projectCounts.recruiting}</div>
              <div className="font-semibold text-[#B4B4B4] text-[12px]">모집중</div>
            </button>

            <hr className="w-[1px] h-12 bg-[#B4B4B4] border-none" />

            <button
              className="flex flex-col items-center"
              onClick={() => nav('/myPostHome', { state: { filter: true } })}
            >
              <div className="font-bold text-[20px]">{projectCounts.completed}</div>
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

export default Profile;
