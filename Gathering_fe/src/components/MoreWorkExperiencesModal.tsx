import React, { useEffect, useState } from 'react';
import { techStacks } from '@/utils/tech-stacks';
import { WorkExperience } from '@/types/profile';
import moreIcon from '@/assets/otherIcons/More.png';
import WorkExperienceItem from '@/components/WorkExperienceItem';

interface TechStack {
  id: string;
  title: string;
}

interface MoreWorkExperiencesModalProps {
  workExperiences: WorkExperience[];
  nickname: string;
  onDelete?: (activityName: string) => void;
}

const MoreWorkExperiencesModal: React.FC<MoreWorkExperiencesModalProps> = ({
  workExperiences,
  nickname,
  onDelete
}) => {
  // const [stackList] = useState<TechStack[]>([...techStacks]);
  // const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  // const [value, setValue] = useState<{ startDate: Date | null; endDate: Date | null }>({
  //   startDate: null,
  //   endDate: null
  // });
  // const [dateRange, setDateRange] = useState<{
  //   startDate: string;
  //   endDate: string;
  // }>({ startDate: '', endDate: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="flex items-center space-x-2 justify-center border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full py-1 px-6"
      >
        <div className="text-xs sm:text-base">더보기</div>
        <img src={moreIcon} className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-[800px] max-h-[90vh] rounded-[20px] bg-white shadow-lg dark:bg-gray-700 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-[20px] font-bold text-gray-900 dark:text-white">
                {nickname}님의 활동 경력입니다.
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
            <div className="mt-3 max-h-[70vh] overflow-y-auto p-6 md:p-7">
              {workExperiences.map((experience, index) => (
                <WorkExperienceItem
                  key={`experience-${index}`}
                  {...experience}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreWorkExperiencesModal;
