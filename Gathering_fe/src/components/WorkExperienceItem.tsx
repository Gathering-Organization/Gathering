import { WorkExperience } from '@/types/profile';

const WorkExperienceItem: React.FC<WorkExperience> = ({
  startDate,
  endDate,
  activityName,
  description,
  techStacks
}) => {
  return (
    <div>
      <section className="bg-white py-3">
        <div className="items-center flex border-[#000000]/50 border border-e-[3px] border-b-[3px] rounded-[10px] w-full p-4 px-6 h-24">
          <div className="w-[600px]">
            <div className="font-bold pb-2">{activityName}</div>
            <div className="text-[#000000]/50 text-[12px]">
              활동일 | {startDate} ~ {endDate}
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="text-[12px] bg-[#000000] font-bold px-6 py-2 rounded-[20px] text-white whitespace-nowrap">
              보기
            </button>

            <button
              className={
                'text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E] text-white hover:bg-red-600 whitespace-nowrap'
              }
            >
              삭제
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkExperienceItem;
