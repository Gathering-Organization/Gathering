import { WorkExperience } from '@/types/profile';
import WorkExperienceViewerModal from './WorkExperienceViewerModal';

interface WorkExperienceItemProps extends WorkExperience {
  onDelete?: (activityName: string) => void;
}

const WorkExperienceItem: React.FC<WorkExperienceItemProps> = ({
  startDate,
  endDate,
  activityName,
  description,
  techStacks,
  onDelete
}) => {
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onDelete) {
      onDelete(activityName);
    }
  };
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
          <div className={`flex ${onDelete ? 'space-x-4' : 'w-full justify-end me-8'}`}>
            <WorkExperienceViewerModal
              startDate={startDate}
              endDate={endDate}
              activityName={activityName}
              description={description}
              techStacks={techStacks}
            />

            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="text-[12px] font-bold px-6 py-2 rounded-[20px] bg-[#F24E1E] text-white hover:bg-red-600 whitespace-nowrap"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkExperienceItem;
