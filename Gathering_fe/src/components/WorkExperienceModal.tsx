import React, { useState } from 'react';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { techStacks } from '@/utils/tech-stacks';
import { WorkExperience } from '@/types/profile';
import { useToast } from '@/contexts/ToastContext';

interface TechStack {
  id: string;
  title: string;
}

interface WorkExperienceModalProps {
  onSave: (experience: WorkExperience) => void;
}

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

const WorkExperienceModal: React.FC<WorkExperienceModalProps> = ({ onSave }) => {
  const [stackList] = useState<TechStack[]>([...techStacks]);
  const { showToast } = useToast();

  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [value, setValue] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: '', endDate: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    activityName: '',
    startDate: '',
    endDate: '',
    description: '',
    techStacks: []
  });
  // const handleDateChange = (newValue: DateRange) => {
  //   const startDate = newValue.startDate
  //     ? new Date(newValue.startDate).toISOString().split('T')[0]
  //     : '';
  //   const endDate = newValue.endDate ? new Date(newValue.endDate).toISOString().split('T')[0] : '';

  //   setDateRange({ startDate, endDate });
  //   setNewExperience(prev => ({
  //     ...prev,
  //     startDate,
  //     endDate
  //   }));
  // };

  const handleAddExperience = () => {
    if (
      !newExperience.activityName ||
      !newExperience.startDate ||
      !newExperience.endDate ||
      !newExperience.description
    ) {
      showToast('모든 필드를 입력해주세요.', false);
      return;
    }

    onSave({ ...newExperience, techStacks: selectedStacks });

    closeModal();
    resetForm();
    showToast('활동 경력을 모두 입력 후 반드시 프로필 저장 버튼을 눌러 저장해주세요.', true);
  };

  const resetForm = () => {
    setNewExperience({
      activityName: '',
      startDate: '',
      endDate: '',
      description: '',
      techStacks: []
    });
    setSelectedStacks([]);
    setValue({ startDate: null, endDate: null });
  };
  //   console.log(newExperience);
  //   setWorkExperiences(prev => [...prev, newExperience]);
  //   setNewExperience({
  //     activityName: '',
  //     startDate: '',
  //     endDate: '',
  //     description: '',
  //     techStacks: []
  //   });
  //   closeModal();
  // };

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
        className="self-end text-sm sm:text-[16px] bg-[#3387E5] text-white font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600 transition-colors duration-300 ease-in-out"
      >
        활동 경력 입력하기
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm p-4 sm:p-6"
          aria-hidden="true"
        >
          <div className="relative md:p-4 w-full max-w-[800px] rounded-[20px] bg-white shadow-lg dark:bg-gray-700 overflow-hidden animate-fadeIn will-change-[opacity]">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                활동 경력을 입력해주세요.
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                {/* <span className="sr-only">Close modal</span> */}
              </button>
            </div>
            <div className="p-4 md:p-6">
              <form
                className="space-y-6"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddExperience();
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <label className="w-full sm:w-36 font-semibold text-gray-700 dark:text-white">
                    활동명
                  </label>
                  <input
                    maxLength={100}
                    onChange={e =>
                      setNewExperience(prev => ({
                        ...prev,
                        activityName: e.target.value
                      }))
                    }
                    type="text"
                    name="nickname"
                    id="nickname"
                    className="w-full py-3 px-4 sm:px-6 pr-10 bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-500 text-sm rounded-[20px] block w-full placeholder:text-xs sm:placeholder:text-sm dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-700 focus:outline-none"
                    placeholder="활동명을 입력하세요."
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <label className="w-full sm:w-36 font-semibold text-gray-700 dark:text-white">
                    활동 기간
                  </label>

                  <DatePicker
                    readOnly={true}
                    startWeekOn="mon"
                    value={value}
                    inputClassName="text-gray-500 text-sm w-full cursor-pointer bg-gray-50 dark:bg-[#1E2028] border border-gray-300 rounded-[20px] py-3 px-4 sm:px-6 pr-10 focus:outline-none"
                    onChange={newValue => {
                      if (newValue) {
                        setValue(newValue);
                        const startDate = newValue.startDate
                          ? new Date(newValue.startDate).toISOString().split('T')[0]
                          : '';
                        const endDate = newValue.endDate
                          ? new Date(newValue.endDate).toISOString().split('T')[0]
                          : '';
                        setNewExperience(prev => ({
                          ...prev,
                          startDate,
                          endDate
                        }));
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <label className="w-full sm:w-36 font-semibold text-gray-700 dark:text-white">
                    사용 기술 스택
                  </label>
                  <MultiSelection
                    title="기술 스택을 선택하세요."
                    options={stackList.map(tech => tech.title)}
                    selectedOptions={selectedStacks.map(
                      id => stackList.find(tech => tech.id === id)?.title || ''
                    )}
                    setSelectedOptions={selectedTechs => {
                      const selectedIds = stackList
                        .filter(tech => selectedTechs.includes(tech.title))
                        .map(tech => tech.id);
                      setSelectedStacks(selectedIds);
                      setNewExperience({
                        ...newExperience,
                        techStacks: selectedIds
                      });
                    }}
                  />
                </div>
                <section className="bg-white">
                  <h3 className="font-semibold mb-4">세부 설명</h3>
                  <textarea
                    onChange={e =>
                      setNewExperience({ ...newExperience, description: e.target.value })
                    }
                    maxLength={500}
                    placeholder="활동 경력에 대해 간략히 설명해주세요!"
                    className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-32 md:h-48 p-4 px-6 text-sm placeholder:text-xs sm:placeholder:text-[16px] resize-none focus:outline-none"
                  ></textarea>
                  <div className="text-right mt-1 text-gray-600 text-xs sm:text-sm">
                    {newExperience.description.length}/500
                  </div>
                </section>
                <div className="flex justify-center">
                  <button
                    onClick={handleAddExperience}
                    type="button"
                    className="w-full sm:w-auto px-8 sm:px-[180px] py-2 bg-[#3387E5] text-white rounded-[20px] font-semibold text-sm sm:text-base hover:bg-blue-600 transition-colors"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceModal;
