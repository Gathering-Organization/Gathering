import React, { useState } from 'react';
import MultiLevelDropdown from './MultiLevelDropdown';
import { positionData } from '@/utils/position-data';
import { postApplication } from '@/services/applicationApi';
import { ApplyDetails } from '@/types/apply';
import { DropdownDispatchContext } from '@/pages/PostHome';
import { useParams } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';

type ApplyResultProps = {
  fetchApplication: () => void;
  nickname: string;
  position?: string;
  applyStatus: string | null;
  kakaoUrl: string;
};

const ApplyResultModal: React.FC<ApplyResultProps> = ({
  fetchApplication,
  nickname,
  position,
  applyStatus,
  kakaoUrl
}) => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [status, setStatus] = useState('');
  const { showToast } = useToast();
  const [applyInfo, setApplyInfo] = useState<ApplyDetails>({
    id: 0,
    projectId: Number(params.id),
    nickname: '',
    position: '',
    message: '',
    status: '',
    profileColor: '',
    workExperiences: [],
    organization: '',
    portfolio: null,
    techStacks: []
  });

  const openModal = () => {
    setIsModalOpen(true);
    fetchApplication();
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
      const response = await postApplication(
        applyInfo.projectId,
        applyInfo.position,
        applyInfo.message
      );
      if (response?.success) {
        showToast('지원서 제출이 완료되었습니다.', true);
        closeModal();
      } else {
        showToast('지원서 제출 중 오류가 발생했습니다.', false);
      }
    } catch (error) {
      showToast('지원서 제출 중 오류가 발생했습니다.', false);
    }
  };

  const handleViewApplication = () => {
    const projectId = params.id;
    window.open(`/apply/view?projectId=${projectId}`, '_blank');
  };

  const dropdownContextValue = {
    setSelectedStack: dummySetSelectedStack,
    setSelectedPosition: handleSelectedPosition
  };

  const handleOpenChat = () => {
    const url = kakaoUrl.startsWith('http') ? kakaoUrl : `https://${kakaoUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const parts = nickname.split(/(#\d+)/);

  return (
    <DropdownDispatchContext.Provider value={dropdownContextValue}>
      <div className="flex flex-col items-center mt-10">
        <div className="flex gap-4">
          <button
            onClick={applyStatus === 'PENDING' ? undefined : openModal}
            disabled={applyStatus === 'PENDING'}
            className={`mx-auto w-[200px] justify-center text-white text-[18px] font-semibold px-6 py-2 rounded-[30px] ${
              applyStatus === 'PENDING'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#3387E5] hover:bg-blue-600'
            }`}
          >
            결과보기
          </button>
          <button
            onClick={handleViewApplication}
            type="button"
            className="mx-auto w-[200px] bg-[#3387E5] justify-center text-white text-[18px] font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600 transition-colors duration-300 ease-in-out"
          >
            지원서 보기
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
            aria-hidden="true"
          >
            <div className="relative p-4 w-full max-w-[800px] max-h-full bg-white rounded-[20px] shadow-lg dark:bg-gray-700 overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-[20px] font-bold text-gray-900 dark:text-white">
                  지원 결과 안내
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
                  <section className="bg-white">
                    <div className="border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full h-[250px] p-4 px-6 resize-none focus:outline-none">
                      {applyStatus === 'APPROVED' && (
                        <>
                          {`${parts[0]}님은 ${position} 포지션에 합격하셨습니다. 귀하의 소중한 지원에 감사드리며, 최종 합격 소식을 전하게 되어 매우 기쁩니다. 앞으로 함께 성장할 수 있기를 기대합니다. 하단 오픈 채팅 링크를 통해 모집자에게 연락을 해보세요.`}
                        </>
                      )}
                      {applyStatus === 'REJECTED' && (
                        <>
                          {`${parts[0]}님은 아쉽게도 이번 ${position} 포지션 모집에서는 함께하지 못하게 되었습니다. 게더링을 통해 지원해주셔서 진심으로 감사드립니다. 앞으로의 건승을 기원합니다.`}
                        </>
                      )}
                    </div>
                  </section>

                  <button
                    // onClick={handleSubmit}
                    onClick={handleOpenChat}
                    disabled={applyStatus !== 'APPROVED'}
                    type="button"
                    className={`w-full font-medium rounded-lg text-sm px-6 py-3 text-center focus:outline-none ${
                      applyStatus === 'APPROVED'
                        ? 'bg-[#3387E5] hover:bg-blue-800 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                  >
                    오픈 채팅 링크로 이동하기
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

export default ApplyResultModal;
