import React, { useEffect } from 'react';
import { ProfileAllInfo } from '@/types/profile';
import useModalBodyLock from '@/hooks/UseModalBodyLock';

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
  useModalBodyLock(isOpen);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-full max-w-2xl min-h-[500px] bg-white rounded-[30px] shadow-lg overflow-hidden flex flex-col">
        <div className="h-1/2 bg-[#D9D9D9]/40 flex flex-col pt-[60px] items-center justify-center p-6 relative">
          <button
            className="absolute top-8 right-8 text-gray-400 font-bold hover:text-gray-900 rounded-lg p-2"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="justify-items-center mt-4">
            <div
              className="w-24 h-24 rounded-full mb-4"
              style={{ backgroundColor: `#${profile.profileColor}` }}
            ></div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              {profile.nickname}의 프로필
            </h3>
          </div>
        </div>
        <div className="h-1/2 flex flex-col items-center justify-center p-6">
          <p className="text-center text-[18px] text-[#000000]/70">{profile.introduction}</p>
          <button
            className="px-10 py-2 fixed bottom-[150px] bg-[#202123] rounded-full text-white font-semibold"
            onClick={onClose}
          >
            프로필 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfileModal;
