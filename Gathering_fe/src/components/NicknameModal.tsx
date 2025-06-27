import React, { useState } from 'react';
import penSquared from '@/assets/otherIcons/Pen Squared.png';
import { setMyNickname } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';
import { useProfile } from '@/contexts/ProfileStateContext';
import useModalBodyLock from '@/hooks/UseModalBodyLock';
import { useToast } from '@/contexts/ToastContext';

interface NicknameModalProps {
  nickname: string;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ nickname }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const { myProfile, updateProfileData } = useProfile();
  const { showToast } = useToast();
  const regex = /^[가-힣]{1,6}$/;
  useModalBodyLock(isModalOpen);
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleUpdateNickname = async () => {
    try {
      if (!regex.test(newNickname)) {
        showToast('한글 6자 이하의 닉네임으로 변경해주세요.', false);
      } else {
        const result = await setMyNickname(newNickname);
        if (result?.success) {
          console.log(nickname);
          updateProfileData({ nickname: newNickname });
          showToast('닉네임이 성공적으로 변경되었습니다.', true);
          window.location.reload();
          closeModal();
        } else {
          showToast('닉네임 변경 중 문제가 발생했습니다.', false);
        }
      }
    } catch {
      showToast('닉네임 변경 중 문제가 발생했습니다.', false);
    }
  };

  const parts = nickname.split(/(#\d+)/);

  return (
    <div>
      <button
        className="text-[24px] font-bold mb-8 relative left-4 inline-block"
        onClick={openModal}
      >
        <span className="pr-8">
          <span className="pe-1">{parts[0]}</span>
          <span className="text-[#B4B4B4]">{parts[1]}</span>
        </span>
        <img
          src={penSquared}
          alt="Edit"
          className="w-6 h-6 absolute right-0 top-1/2 -translate-y-1/2"
        />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-[20px] shadow-lg dark:bg-gray-700 animate-fadeIn will-change-[opacity]">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">닉네임 변경</h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#">
                <div>
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder={`${parts[0]} (한글 6자 이하로 변경 가능)`}
                    onChange={e => setNewNickname(e.target.value)}
                    required
                  />
                </div>
                <button
                  onClick={handleUpdateNickname}
                  type="button"
                  className="w-full text-white bg-[#3387E5] hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none font-semibold rounded-[30px] text-sm px-5 py-2.5 text-center"
                >
                  변경하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NicknameModal;
