import React, { useState } from 'react';
import penSquared from '@/assets/otherIcons/Pen Squared.png';
import { setMyNickname } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';
import { useProfile } from '@/contexts/ProfileStateContext';

interface NicknameModalProps {
  nickname: string;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ nickname }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const { profile, updateProfileData } = useProfile();

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
      const result = await setMyNickname(newNickname);
      if (result?.success) {
        console.log(nickname);
        updateProfileData({ nickname: newNickname });
        alert('닉네임이 성공적으로 변경되었습니다!');
        closeModal();
      } else {
        alert(result?.message || '닉네임 변경 중 문제가 발생했습니다.');
      }
    } catch {
      alert('닉네임 변경 중 오류가 발생했습니다.');
    }
  };

  // const handleUpdateNickname = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!nicknameInfo.trim()) {
  //     alert('닉네임을 입력해주세요.');
  //     return;
  //   }

  //   try {
  //     const result = await setMyNickname(nickname);

  //     if (result?.success) {
  //       alert('닉네임 저장 성공!');
  //     } else {
  //       alert(result?.message || '닉네임 저장 중 문제가 발생했습니다.');
  //     }
  //   } catch {
  //     alert('닉네임 저장 중 오류가 발생했습니다.');
  //   }
  // };

  const parts = nickname.split(/(#\d+)/);

  return (
    <div>
      <button
        className="text-[24px] font-bold mb-8 relative left-4 inline-block"
        onClick={openModal}
      >
        <span className="pr-8">
          {parts[0]}
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
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
                    placeholder={parts[0]}
                    onChange={e => setNewNickname(e.target.value)}
                    required
                  />
                </div>
                <button
                  onClick={handleUpdateNickname}
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
