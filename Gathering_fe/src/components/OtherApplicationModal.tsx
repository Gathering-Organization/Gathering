import React, { useEffect, useState } from 'react';
import { ApplyDetails } from '@/types/apply';
import { useParams } from 'react-router-dom';
import { patchApplication } from '@/services/applicationApi';
import useModalBodyLock from '@/hooks/UseModalBodyLock';
import { positionData } from '@/utils/position-data';
import Badge from '@/components/Badge';
import { useToast } from '@/contexts/ToastContext';
import BeatLoader from 'react-spinners/BeatLoader';

type OtherApplicationModalProps = {
  apply: ApplyDetails[];
  onStatusChange: (id: number, newStatus: string) => void;
};

const OtherApplicationModal: React.FC<OtherApplicationModalProps> = ({ apply, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [applyDetails, setApplyDetails] = useState<ApplyDetails>({
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

  useModalBodyLock(isModalOpen);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // const handleSelectedPosition = (value: string) => {
  //   setApplyDetails(prev => ({ ...prev, position: value }));
  // };

  // const handleChangeIntroduction = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setApplyDetails({
  //     ...applyDetails,
  //     message: e.target.value
  //   });
  // };

  const handleApprove = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await patchApplication(id, 'APPROVED');
      if (response?.success) {
        onStatusChange(id, 'APPROVED');
        showToast('승인 처리가 완료되었습니다.', true);
      } else {
        showToast('승인 처리 중 오류가 발생했습니다.', false);
      }
    } catch (error) {
      showToast('승인 처리 중 오류가 발생했습니다.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await patchApplication(id, 'REJECTED');
      if (response?.success) {
        onStatusChange(id, 'REJECTED');
        showToast('거절 처리가 완료되었습니다.', true);
      } else {
        showToast('거절 처리 중 오류가 발생했습니다.', false);
      }
    } catch (error) {
      showToast('거절 처리 중 오류가 발생했습니다.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplication = (item: ApplyDetails) => {
    localStorage.setItem('applyInfo', JSON.stringify(item));
    window.open(`/apply/view?nickname=${encodeURIComponent(item.nickname)}`, '_blank');
    // window.open('/apply/view', '_blank');
  };
  return (
    <div>
      <div>
        <button
          onClick={openModal}
          className="relative flex justify-self-center py-2 px-[100px] mt-10 bg-[#202123] rounded-[30px] transition-all ease-in-out duration-300 hover:scale-[1.02] transform-gpu will-change-transform"
        >
          <div className="flex space-x-4 items-center">
            <div className="text-[#FFFFFF] font-bold text-[20px]">지원자 보기</div>
            <Badge count={apply.length} />
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-[800px] max-h-[90vh] rounded-[20px] bg-white shadow-lg dark:bg-gray-700 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-[20px] font-bold text-gray-900 dark:text-white">지원자 현황</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

            <div className="p-6">
              <div className="mt-3 max-h-[70vh] overflow-y-auto">
                {apply.length > 0 ? (
                  <div className="space-y-4">
                    {apply.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] p-4 px-6 h-24"
                      >
                        <div className="w-[60%]">
                          <div className="font-bold pb-2">
                            {item.nickname.split(/(#\d+)/)[0]}님의 [
                            {positionData.find(position => position.id === item.position)?.title ||
                              item.position}
                            ] 지원서
                          </div>
                        </div>
                        <div className="flex space-x-4 w-[40%] justify-end">
                          <button
                            onClick={() => handleViewApplication(item)}
                            type="button"
                            className="text-[12px] bg-[#2C2C2C] font-bold px-6 py-2 rounded-[20px] text-white hover:bg-[#444] transition-colors duration-300 ease-in-out whitespace-nowrap"
                          >
                            보기
                          </button>
                          {item.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#3387E5] text-white hover:bg-blue-600 hover:bg-blue-600 transition-colors duration-300 ease-in-out whitespace-nowrap"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E] text-white hover:bg-red-600 hover:bg-blue-600 transition-colors duration-300 ease-in-out whitespace-nowrap"
                              >
                                거절
                              </button>
                            </>
                          ) : item.status === 'APPROVED' ? (
                            <div className="cursor-not-allowed text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#3387E5]/60 text-white whitespace-nowrap">
                              승인 상태입니다.
                            </div>
                          ) : item.status === 'REJECTED' ? (
                            <div className="cursor-not-allowed text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E]/60 text-white whitespace-nowrap">
                              거절 상태입니다.
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">지원자가 없습니다!</div>
                )}
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
              <BeatLoader color="#3387E5" size={20} />
              <p className="mt-4 text-gray-700 font-semibold">승인/거절 처리 중입니다...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OtherApplicationModal;
