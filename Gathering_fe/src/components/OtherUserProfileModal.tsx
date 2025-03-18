import React from 'react';
import { ProfileAllInfo } from '@/types/profile';
import { getStackImage } from '@/utils/get-stack-image';

interface OtherUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileAllInfo;
}

const OtherUserProfileModal: React.FC<OtherUserProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen) return null;
  const parts = profile.nickname.split(/(#\d+)/);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative p-6 w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">{profile.nickname}의 프로필</h3>
          <button className="text-gray-400 hover:text-gray-900 rounded-lg p-2" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">소개</h4>
            <p className="text-gray-600">{profile.introduction || '작성된 소개가 없습니다.'}</p>

            <div className="flex items-center gap-4">
              <span className="font-semibold">소속:</span>
              <p>{profile.organization || '미입력'}</p>
            </div>
          </div>

          {/* 기술 스택 섹션 */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">기술 스택</h4>
            <div className="flex flex-wrap gap-2">
              {profile.techStacks.map((stack, index) => (
                <img
                  key={index}
                  src={getStackImage(stack.toUpperCase()) ?? ''}
                  alt={stack}
                  className="w-10 h-10"
                />
              ))}
              {profile.techStacks.length === 0 && (
                <p className="text-gray-500">등록된 기술 스택이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 경력 섹션 */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">활동 경력</h4>
            {profile.workExperiences?.map((experience, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-medium">{experience.activityName}</div>
                <div className="text-sm text-gray-500">
                  {experience.startDate} ~ {experience.endDate}
                </div>
                <p className="mt-2 text-gray-600">{experience.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {experience.techStacks?.map((stack, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {profile.workExperiences?.length === 0 && (
              <p className="text-gray-500">등록된 활동 경력이 없습니다.</p>
            )}
          </div>

          {/* 포트폴리오 섹션 */}
          {profile.portfolio && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg">포트폴리오</h4>
              <a
                href={profile.portfolio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.portfolio.url}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfileModal;
