import React, { useState } from 'react';
import { techStacks } from '@/utils/tech-stacks';
import { WorkExperience } from '@/types/profile';

interface TechStack {
  id: string;
  title: string;
}

const WorkExperienceViewerModal: React.FC<WorkExperience> = ({
  startDate,
  endDate,
  activityName,
  description,
  techStacks: selectedTechStacks
}) => {
  const stackList = selectedTechStacks.map(id => {
    const stack = techStacks.find(stack => stack.id === id);
    return stack ? stack.title : id;
  });
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

  // const [newExperience, setNewExperience] = useState<WorkExperience>({
  //   activityName: '',
  //   startDate: '',
  //   endDate: '',
  //   description: '',
  //   techStacks: []
  // });

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="text-[9px] sm:text-[12px] bg-[#000000] font-bold px-4 sm:px-6 py-1 sm:py-2 rounded-[20px] text-white whitespace-nowrap"
      >
        보기
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
          aria-hidden="true"
        >
          <div className="relative sm:overflow-hidden p-4 w-full max-w-[800px] max-h-[90vh] rounded-[20px] bg-white shadow-lg dark:bg-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                활동 경력을 확인하세요.
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
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 md:p-7">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="sm:w-36 font-semibold text-gray-700 dark:text-white">
                    활동명
                  </label>
                  <div className="flex-1 px-6 bg-gray-50 border border-[#000000]/20 text-gray-700 placeholder-gray-500 text-sm rounded-[30px] block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-700 focus:outline-none">
                    {activityName}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="sm:w-36 font-semibold text-gray-700 dark:text-white">
                    활동 기간
                  </label>
                  <div className="flex-1 px-6 bg-gray-50 border border-[#000000]/20 text-gray-700 placeholder-gray-500 text-sm rounded-[30px] block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-700 focus:outline-none">
                    {startDate} ~ {endDate}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="sm:w-36 font-semibold text-gray-700 dark:text-white">
                    사용 기술 스택
                  </label>
                  <div className="flex-1 px-6 bg-gray-50 border border-[#000000]/20 text-gray-700 placeholder-gray-500 text-sm rounded-[30px] block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-700 focus:outline-none max-h-24 overflow-y-auto">
                    {stackList?.length ? (
                      stackList.join(', ')
                    ) : (
                      <span className="text-gray-500">사용된 기술 없음</span>
                    )}
                  </div>
                </div>
                <section className="bg-white">
                  <h3 className="font-semibold mb-4 text-gray-700">세부 설명</h3>
                  <div className="border-[#000000]/50 text-base border border-e-[3px] border-b-[3px] rounded-[10px] w-full min-h-[180px] p-4 px-6 resize-none focus:outline-none">
                    {description || '설명이 없습니다.'}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceViewerModal;
