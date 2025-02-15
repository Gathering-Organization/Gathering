import { projectType } from '@/utils/project-type';

type ProjecTypeFilterProps = {
  selectedType: string;
  setSelectedType: (type: string) => void;
};

const ProjecTypeFilter: React.FC<ProjecTypeFilterProps> = ({ selectedType, setSelectedType }) => {
  return (
    <div className="text-[24px] font-bold space-x-8 flex">
      {projectType.map(item => (
        <button
          onClick={() => setSelectedType(item.projectType)}
          key={item.projectTypeId}
          className={`${selectedType === item.projectType ? 'text-black' : 'text-[#B4B4B4]'}`}
        >
          {item.projectTypeName}
        </button>
      ))}
    </div>
  );
};

export default ProjecTypeFilter;
