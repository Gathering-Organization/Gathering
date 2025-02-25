import React, { useState } from 'react';
import DatePicker from 'react-tailwindcss-datepicker';
import MultiSelection from '@/components/MultiSelection';
import { techStacks } from '@/utils/tech-stacks';
import { WorkExperience } from '@/types/profile';

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
  const handleDateChange = (newValue: DateRange) => {
    const startDate = newValue.startDate
      ? new Date(newValue.startDate).toISOString().split('T')[0]
      : '';
    const endDate = newValue.endDate ? new Date(newValue.endDate).toISOString().split('T')[0] : '';

    setDateRange({ startDate, endDate });
    setNewExperience(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };

  const handleAddExperience = () => {
    console.log('저장된 경험:', newExperience);
    if (
      !newExperience.activityName ||
      !newExperience.startDate ||
      !newExperience.endDate ||
      !newExperience.description
    ) {
      console.log(newExperience);
      alert('모든 필드를 입력해주세요.');
      return;
    }

    onSave({
      ...newExperience,
      techStacks: selectedStacks
    });
    closeModal();
    resetForm();
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
    setDateRange({ startDate: '', endDate: '' });
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
        className="self-end bg-[#3387E5] text-white font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600"
      >
        활동 경력 입력하기
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          aria-hidden="true"
        >
          <div className="relative p-6 w-full max-w-[800px] max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                활동 경력을 입력해주세요.
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
            <div className="p-6 md:p-7">
              <form
                className="space-y-6"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddExperience();
                }}
              >
                <div className="flex items-center gap-4">
                  <label className="w-36 font-semibold text-gray-700 dark:text-white">활동명</label>
                  <input
                    onChange={e =>
                      setNewExperience(prev => ({
                        ...prev,
                        activityName: e.target.value
                      }))
                    }
                    type="text"
                    name="nickname"
                    id="nickname"
                    className="flex-1 px-6 bg-gray-50 border border-[#000000]/20 text-gray-700 placeholder-gray-500 text-sm rounded-[30px] block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-700 focus:outline-none"
                    placeholder="활동명을 입력하세요."
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-36 font-semibold text-gray-700 dark:text-white">
                    활동 기간
                  </label>
                  <div className="flex-1">
                    <DatePicker
                      startWeekOn="mon"
                      value={value}
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
                      // onChange={newValue => {
                      //   if (newValue) {
                      //     setValue(newValue);
                      //     setNewExperience({
                      //       ...newExperience,
                      //       startDate: new Date(newValue.startDate || '').toISOString(),
                      //       endDate: new Date(newValue.endDate || '').toISOString()
                      //     });
                      //   }
                      // }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-36 font-semibold text-gray-700 dark:text-white">
                    사용 기술 스택
                  </label>
                  <div className="flex-1">
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
                </div>
                <section className="bg-white">
                  <h3 className="font-semibold mb-4">세부 설명</h3>
                  <textarea
                    onChange={e =>
                      setNewExperience({ ...newExperience, description: e.target.value })
                    }
                    placeholder="활동 경력에 대해 간략히 설명해주세요!"
                    className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[180px] p-4 px-6 h-24 resize-none focus:outline-none"
                  ></textarea>
                </section>
                <button
                  onClick={handleAddExperience}
                  type="button"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  저장하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceModal;
