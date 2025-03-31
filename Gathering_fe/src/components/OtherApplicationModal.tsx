import React, { useState } from 'react';
import { postApplication } from '@/services/applicationApi';
import { ApplyDetails } from '@/types/apply';
import { useParams } from 'react-router-dom';
import { patchApplication } from '@/services/applicationApi';
import useModalBodyLock from '@/hooks/UseModalBodyLock';
import { positionData } from '@/utils/position-data';

type OtherApplicationModalProps = {
  title: string;
  apply: ApplyDetails[];
};

const OtherApplicationModal: React.FC<OtherApplicationModalProps> = ({ title, apply }) => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyDetails, setApplyDetails] = useState<ApplyDetails>({
    id: 0,
    projectId: Number(params.id),
    nickname: '',
    position: '',
    message: '',
    status: ''
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

  const handleSelectedPosition = (value: string) => {
    setApplyDetails(prev => ({ ...prev, position: value }));
  };

  const handleChangeIntroduction = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplyDetails({
      ...applyDetails,
      message: e.target.value
    });
  };

  const handleApprove = async () => {
    try {
      const response = await patchApplication(applyDetails.projectId, 'APPROVED');
      if (response?.success) {
        alert('승인이 완료되었습니다.');
        closeModal();
      } else {
        alert(response?.message || '승인 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async () => {
    try {
      const response = await patchApplication(applyDetails.projectId, 'REJECTED');
      if (response?.success) {
        alert('거절 처리가 완료되었습니다.');
        closeModal();
      } else {
        alert(response?.message || '거절 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('거절 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={openModal}
          className="flex justify-self-center space-x-4 items-center py-2 px-[100px] mt-10 bg-[#202123] rounded-[30px]"
        >
          <div className="text-[#FFFFFF] font-bold text-[20px]">지원자 보기</div>
          <div className="flex items-center justify-center min-w-[24px] h-[24px] px-2 bg-[#FFFF33] rounded-full text-black font-bold">
            999+
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-[800px] max-h-[90vh] rounded-[20px] bg-white shadow-lg dark:bg-gray-700 overflow-hidden">
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
                            {item.nickname}님의 [
                            {positionData.find(position => position.id === item.position)?.title ||
                              item.position}
                            ] 지원서
                          </div>
                        </div>
                        <div className="flex space-x-4 w-[40%] justify-end">
                          <button
                            onClick={handleApprove}
                            className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#3387E5] text-white hover:bg-blue-600 whitespace-nowrap"
                          >
                            승인
                          </button>
                          <button
                            onClick={handleReject}
                            className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E] text-white hover:bg-red-600 whitespace-nowrap"
                          >
                            거절
                          </button>
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
        </div>
      )}
    </div>
  );
};

export default OtherApplicationModal;
