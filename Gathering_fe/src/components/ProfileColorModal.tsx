import React, { useState } from 'react';
import changeMark from '@/assets/otherIcons/Change Mark.png';
import { setMyProfileColor } from '@/services/profileApi';
import { useProfile } from '@/contexts/ProfileStateContext';
import { profileColorCollection } from '@/utils/profile-color';

interface ProfileColorModalProps {
  profileColor: string;
}

const ProfileColorModal: React.FC<ProfileColorModalProps> = ({ profileColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile, updateProfileData } = useProfile();
  const [selectedColor, setSelectedColor] = useState(profileColor);

  const openModal = () => {
    setSelectedColor(profileColor);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleUpdateProfileColor = async () => {
    try {
      const result = await setMyProfileColor(selectedColor);
      if (result?.success) {
        updateProfileData({ profileColor: selectedColor });
        alert('프로필 컬러가 성공적으로 변경되었습니다!');
      } else {
        alert(result?.message || '프로필 컬러 변경 중 문제가 발생했습니다.');
      }
    } catch {
      alert('프로필 컬러 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <button
        className="w-[100px] h-[100px] rounded-full mb-8 relative"
        onClick={openModal}
        style={{ backgroundColor: `#${profileColor}` }}
      >
        <img src={changeMark} alt="Edit" className="w-8 h-8 absolute bottom-1 right-1" />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                프로필 컬러 변경
              </h3>
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
                <div className="p-4 grid grid-cols-5 gap-4">
                  {profileColorCollection.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      className={`w-14 h-14 rounded-full relative flex items-center justify-center 
        ${selectedColor === color.color ? 'outline outline-4 outline-[#3387E5] outline-offset-2' : ''}`}
                      style={{ backgroundColor: `#${color.color}` }}
                      onClick={e => {
                        e.preventDefault();
                        setSelectedColor(color.color);
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleUpdateProfileColor}
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

export default ProfileColorModal;
