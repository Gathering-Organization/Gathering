import React, { useState } from 'react';
import { setApply } from '@/services/applyApi';
import { ApplyInfo } from '@/types/apply';
import { useParams } from 'react-router-dom';
import { patchApplication } from '@/services/applicationApi';
import useModalBodyLock from '@/hooks/UseModalBodyLock';

type OtherApplicationModalProps = {
  title: string;
  apply: ApplyInfo[];
};

const OtherApplicationModal: React.FC<OtherApplicationModalProps> = ({ title, apply }) => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyInfo, setApplyInfo] = useState<ApplyInfo>({
    projectId: Number(params.id),
    position: '',
    message: ''
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
    setApplyInfo(prev => ({ ...prev, position: value }));
  };

  const handleChangeIntroduction = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplyInfo({
      ...applyInfo,
      message: e.target.value
    });
  };

  const handleApprove = async () => {
    try {
      const response = await patchApplication(applyInfo.projectId, 'APPROVED');
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
      const response = await patchApplication(applyInfo.projectId, 'REJECTED');
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
          <div className="relative p-6 w-full max-w-[800px] max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div>
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-[30px] font-black text-gray-900 dark:text-white">{title}</h3>
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

              <div>
                <div className="my-10 ms-6 text-[20px] font-bold">지원자 현황</div>
                <div>
                  <div className="items-center flex border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-6 h-24">
                    {/* <div className="w-[600px]">
                      {uploadedFile ? (
                        <a
                        //   href={uploadedFile.url}
                        //   download={uploadedFile.fileName}
                          className="font-semibold text-blue-500 hover:underline ml-4"
                        >
                          {`차무식님의 [${applyInfo.position}] 지원서`}
                        </a>
                      ) : (
                        <span className="text-gray-500 ml-4">선택된 파일 없음</span>
                      )}
                    </div> */}
                    {apply.length > 0 ? (
                      <div className="p-4">
                        {apply.map((item, index) => (
                          <div>
                            <div key={index} className="mb-4 border p-4 rounded">
                              <div>Project ID: {item.projectId}</div>
                              <div>Position: {item.position}</div>
                              <div>Message: {item.message}</div>
                            </div>
                            <div className="flex space-x-4">
                              <button
                                onClick={handleApprove}
                                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#3387E5] text-white hover:bg-blue-600"
                              >
                                승인
                              </button>
                              <button
                                onClick={handleReject}
                                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E] text-white hover:bg-red-600"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherApplicationModal;
