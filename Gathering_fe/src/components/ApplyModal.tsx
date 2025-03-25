import React, { useState } from 'react';
import MultiLevelDropdown from './MultiLevelDropdown';
import { positionData } from '@/utils/position-data';
import { setApply } from '@/services/applyApi';
import { ApplyInfo } from '@/types/apply';
import { DropdownDispatchContext } from '@/pages/PostHome';
import { useParams } from 'react-router-dom';

const ApplyModal: React.FC = () => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [applyInfo, setApplyInfo] = useState<ApplyInfo>({
    projectId: Number(params.id),
    position: '',
    message: ''
  });

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleSelectedPosition = (value: string) => {
    setApplyInfo(prev => ({ ...prev, position: value }));
  };

  const dummySetSelectedStack = (value: string[]) => {};

  const handleChangeIntroduction = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplyInfo({
      ...applyInfo,
      message: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await setApply(applyInfo);
      if (response?.success) {
        alert('지원서 제출이 완료되었습니다.');
        closeModal();
      } else {
        alert(response?.message || '지원서 제출 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('지원서 제출 중 오류가 발생했습니다.');
    }
  };

  const handleViewApplication = () => {
    localStorage.setItem('applyInfo', JSON.stringify(applyInfo));
    window.open('/apply/view', '_blank');
  };

  const dropdownContextValue = {
    setSelectedStack: dummySetSelectedStack,
    setSelectedPosition: handleSelectedPosition
  };

  return (
    <DropdownDispatchContext.Provider value={dropdownContextValue}>
      <div className="flex flex-col items-center mt-10">
        <button
          onClick={openModal}
          className="mx-auto w-[160px] bg-[#3387E5] justify-center text-white font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600"
        >
          지원하기
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
            aria-hidden="true"
          >
            <div className="relative p-6 w-full max-w-[800px] max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  지원서를 입력해주세요.
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
                <form className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="w-36 font-semibold dark:text-white">지원 포지션</label>
                    <div className="flex-1 font-bold">
                      <MultiLevelDropdown
                        menuData={positionData}
                        label="포지션"
                        align="left"
                        buttonClassName="custom-button-class"
                      />
                    </div>
                  </div>
                  <section className="bg-white">
                    <h3 className="font-semibold mb-4">모집글에 대한 자기 어필</h3>
                    <textarea
                      value={applyInfo.message}
                      placeholder={
                        '300자 이내로 자신을 어필해 보세요!\n\n첨부할 포트폴리오가 없다면 모집글에 대한 지원자님의 열정을 표현해도 좋아요!'
                      }
                      onChange={handleChangeIntroduction}
                      className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[250px] p-4 px-6 resize-none focus:outline-none"
                    ></textarea>
                  </section>
                  <div className="flex items-center justify-end mb-4">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => setIsChecked(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      지원서를 제출한 이후에는 내용을 수정할 수 없습니다.
                    </label>
                  </div>
                  <button
                    onClick={handleViewApplication}
                    type="button"
                    className="w-full text-white bg-[#3387E5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    내 지원서 보기
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    disabled={!isChecked}
                    className={`w-full font-medium rounded-lg text-sm px-6 py-3 text-center focus:ring-4 focus:outline-none border border-[#3387E5] ${
                      isChecked
                        ? 'bg-[#3387E5] hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                  >
                    제출하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DropdownDispatchContext.Provider>
  );
};

export default ApplyModal;
