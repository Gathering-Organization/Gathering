import {
  deletePortfolio,
  getMyProfile,
  setMyProfile,
  toggleProfileVisibility,
  uploadPortfolio
} from '@/services/profileApi';
import { Portfolio, ProfileInfo, WorkExperience } from '@/types/profile';
import { useEffect, useState } from 'react';

const Profile: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<Portfolio | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [info, setInfo] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
  });
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    activityName: '',
    startDate: '',
    endDate: '',
    jobDetail: '',
    description: ''
  });
  const stecks = ['React', 'Node.js', 'Vue', 'Django', 'Express'];
  const filteredStecks = stecks.filter(stack => !info.techStacks.includes(stack));

  useEffect(() => {
    const handleMyProfile = async () => {
      try {
        const result = await getMyProfile();

        if (result?.success) {
          alert('내 정보 불러오기 성공!' + result.data);
          console.log(result.data);
          setIsPublic(result.data.public);
          if (result.data.portfolio) {
            setUploadedFile(result.data.portfolio);
          }
          setInfo({
            nickname: result.data.nickname || '',
            introduction: result.data.introduction || '',
            organization: result.data.organization || '',
            techStacks: result.data.techStacks || [],
            profileColor: result.data.profileColor || ''
          });
          setWorkExperiences(result.data.workExperiences || []);
        } else {
          alert(result?.message || '내 정보 불러오기에 실패했습니다.');
        }
      } catch {
        alert('내 정보 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    handleMyProfile();
  }, []);

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

      const result = await setMyProfile(updatedInfo, workExperiences);

      if (result?.success) {
        alert('프로필 저장 성공!');
      } else {
        alert(result?.message || '프로필 저장 중 문제가 발생했습니다.');
      }
    } catch {
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const result = await uploadPortfolio(formData);

      if (result?.success) {
        alert('파일 업로드 성공!');

        const profileResult = await getMyProfile();

        if (profileResult?.success) {
          alert('프로필 갱신 성공' + profileResult.data);
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
        setIsPublic(prev => !prev);
      }
    } catch {
      alert('프로필 공개 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSteckChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    const updatedTechStacks = [...new Set([...selectedOptions, ...info.techStacks])];

    setInfo(prevInfo => ({
      ...prevInfo,
      techStacks: updatedTechStacks
    }));

    console.log(updatedTechStacks);
  };

  const handleSteckRemove = (stack: string) => {
    const updatedTechStacks = info.techStacks.filter(tech => tech !== stack);

    setInfo(prevInfo => ({
      ...prevInfo,
      techStacks: updatedTechStacks
    }));
  };

  const handleAddExperience = () => {
    if (
      !newExperience.activityName ||
      !newExperience.startDate ||
      !newExperience.endDate ||
      !newExperience.jobDetail ||
      !newExperience.description
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setWorkExperiences(prev => [...prev, newExperience]);
    setNewExperience({
      activityName: '',
      startDate: '',
      endDate: '',
      jobDetail: '',
      description: ''
    });
  };

  const handleDeleteExperience = (index: number) => {
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="checkbox"
          id="profile-toggle"
          className="toggle-input"
          checked={isPublic}
          onChange={handleToggle}
        />
        <label htmlFor="profile-toggle" className="cursor-pointer">
          {isPublic ? '공개' : '비공개'}
        </label>
      </div>
      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <h1 className="text-xl font-semibold mb-4">기본 프로필</h1>
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          프로필 저장
        </button>
      </section>

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <p className="mb-2">
          프로필 색상: <span className="text-blue-500">{info.profileColor}</span>
        </p>
        <label className="block font-semibold mb-2">닉네임:</label>
        <input
          type="text"
          name="nickname"
          value={info.nickname || ''}
          disabled={!info}
          onChange={e => setInfo({ ...info, nickname: e.target.value })}
          className="border rounded w-full p-2"
        />
      </section>

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="organization" className="text-sm font-medium text-gray-700">
            소속
          </label>
          <input
            id="organization"
            type="text"
            value={info.organization || ''}
            placeholder="소속을 입력해주세요. ex) OO회사 OO 부서, OO대학교 OO학과"
            onChange={e => setInfo({ ...info, organization: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="tech-stack" className="text-sm font-medium text-gray-700">
            사용 기술 스택
          </label>
          <select
            id="tech-stack"
            multiple
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleSteckChange}
            value={info.techStacks}
          >
            <option value="" disabled>
              사용 기술 스택을 선택하세요.
            </option>
            {filteredStecks.map((stack, index) => (
              <option key={index} value={stack}>
                {stack}
              </option>
            ))}
          </select>
          <div>
            <h4>선택된 기술 스택:</h4>
            <ul>
              {info.techStacks.map((stack, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{stack}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleSteckRemove(stack)}
                  >
                    선택 취소
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-4">활동 경력</h3>
        <div className="space-y-4">
          {workExperiences.map((experience, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{experience.activityName}</p>
                <p className="text-sm text-gray-600">
                  활동일 | {experience.startDate} ~ {experience.endDate}
                </p>
              </div>
              <button
                onClick={() => handleDeleteExperience(index)}
                className="text-red-500 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="활동 제목"
            value={newExperience.activityName}
            onChange={e => setNewExperience({ ...newExperience, activityName: e.target.value })}
            className="border rounded w-full p-2"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              value={newExperience.startDate}
              onChange={e => setNewExperience({ ...newExperience, startDate: e.target.value })}
              className="border rounded w-full p-2"
            />
            <input
              type="date"
              value={newExperience.endDate}
              onChange={e => setNewExperience({ ...newExperience, endDate: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
          <input
            type="text"
            placeholder="직무"
            value={newExperience.jobDetail}
            onChange={e => setNewExperience({ ...newExperience, jobDetail: e.target.value })}
            className="border rounded w-full p-2"
          />
          <input
            type="text"
            placeholder="세부설명"
            value={newExperience.description}
            onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
            className="border rounded w-full p-2"
          />
          <button
            onClick={handleAddExperience}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            추가
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-4">간단 자기소개</h3>
        <textarea
          value={info.introduction || ''}
          placeholder="300자 이내로 자신을 소개해 보세요!"
          onChange={e => setInfo({ ...info, introduction: e.target.value })}
          className="border rounded w-full p-2 h-24"
        ></textarea>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">포트폴리오</h3>
        <div className="space-y-2">
          <input
            type="file"
            accept=".pdf"
            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-4 py-2 rounded ${
                selectedFile
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              업로드
            </button>
            <button
              onClick={handleDelete}
              disabled={!uploadedFile}
              className={`px-4 py-2 rounded ${
                uploadedFile
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              삭제
            </button>
          </div>
          {uploadedFile && (
            <a
              href={uploadedFile.url}
              download={uploadedFile.fileName}
              className="text-blue-500 hover:underline"
            >
              {uploadedFile.fileName}
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
