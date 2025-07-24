import { useState } from 'react';

interface SignUpAgreeProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SignUpAgree: React.FC<SignUpAgreeProps> = ({ setStep }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  const handleNextStep = () => {
    if (isAgreed) {
      setStep(2);
    }
  };

  return (
    <div className="text-center px-4 sm:px-0">
      <div>
        <div className="text-[24px] font-bold my-6">안내 사항</div>
        <div className="text-[14px] text-[#C7C7C7] mb-8">
          아래 사항을 모두 읽고 약관에 동의해주세요.
        </div>
      </div>
      <section>
        <div className="text-justify border-[2px] rounded-[6px] border-[#D9D9D9] px-4 py-6 sm:p-8 h-48 sm:h-64 overflow-y-scroll space-y-4 text-[12px] sm:text-[14px]">
          <p>
            제 1 장 총칙 제 1조 (목적) 본 약관은 서비스(이하 "회사"라 한다)는 홈페이지에서 제공하는
            서비스(이하 "서비스"라 한다)를 제공함에 있어 회사와 이용자의 권리, 의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>
          <p>제 2조 (용어의 정의)</p>
          <p>
            1. 본 약관에서 사용하는 용어의 정의는 다음과 같습니다. '서비스'란 회사가 이용자에게
            서비스를 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 구성한 가상의 공간을
            의미하며, 서비스 자체를 의미하기도 합니다. '회원(이하 "회원"이라 한다)'이란 개인정보를
            제공하여 회원등록을 한 자로서 홈페이지의 정보를 지속적으로 제공받으며 홈페이지가
            제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다. '아이디(이하 "ID"라 한다)'란
            회원의 식별과 회원의 서비스 이용을 위하여 회원이 선정하고 회사가 승인하는 회원 고유의
            계정 정보를 의미합니다. '비밀번호'란 회원이 부여 받은 ID와 일치된 회원임을 확인하고,
            회원의 개인정보를 보호하기 위하여 회원이 정한 문자와 숫자의 조합을 의미합니다.
            '회원탈퇴(이하 "탈퇴"라 한다)'란 회원이 이용계약을 해지하는 것을 의미합니다.
          </p>
          <p>
            2. 본 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 관계법령 및
            서비스 별 안내에서 정하는 바에 의합니다.
          </p>
          <p>제 3조 (이용약관의 효력 및 변경)</p>
          <p>
            1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 각 서비스 사이트의 초기 서비스화면에
            게시합니다.
          </p>
          <p>
            2. 회사는 약관의 규제에 관한 법률, 전자거래기본법, 전자 서명법, 정보통신망 이용촉진 및
            정보보호 등에 관한 법률 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
          </p>
          <p>
            3. 회사는 본 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께
            회사가 제공하는 서비스 사이트의 초기 화면에 그 적용일자 7일 이전부터 적용일자 전일까지
            공지합니다. 다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전
            유예기간을 두고 공지합니다. 이 경우 회사는 개정 전 내용과 개정 후 내용을 명확하게
            비교하여 회원이 알기 쉽도록 표시합니다.
          </p>
          <p>
            4. 회원은 개정된 약관에 대해 거부할 권리가 있습니다. 회원은 개정된 약관에 동의하지 않을
            경우 서비스 이용을 중단하고 회원등록을 해지할 수 있습니다. 단, 개정된 약관의 효력 발생일
            이후에도 서비스를 계속 이용할 경우에는 약관의 변경사항에 동의한 것으로 간주합니다.
          </p>
          <p>
            5. 변경된 약관에 대한 정보를 알지 못해 발생하는 회원 피해는 회사가 책임지지 않습니다.
          </p>
        </div>
        <div className="mt-4 flex items-start sm:items-center justify-start sm:justify-end gap-2">
          <input
            type="checkbox"
            id="agree"
            className="mt-1 sm:mt-0 w-4 h-4"
            checked={isAgreed}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor="agree"
            className="text-[13px] sm:text-[14px] text-[#202123] leading-tight"
          >
            위 안내 사항을 확인하였고 개인정보 수집에 동의합니다.
          </label>
        </div>
      </section>
      <div className="my-8 sm:my-10">
        <button
          disabled={!isAgreed}
          onClick={handleNextStep}
          className={`w-full sm:w-auto font-semibold text-white rounded-[20px] text-[16px] sm:text-[18px] px-6 sm:px-12 py-2 sm:py-2 text-center focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ${
            isAgreed ? 'bg-[#3387E5] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          다음단계
        </button>
      </div>
    </div>
  );
};

export default SignUpAgree;
