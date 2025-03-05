import { ReactNode } from 'react';

type ButtonFilter = {
  title: string;
  option: boolean;
  onClick: () => void;
  icon: ReactNode;
};

const FilteringButton: React.FC<ButtonFilter> = ({ title, option, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 border-[#B4B4B4] border-solid rounded-[20px] border-2 px-4 py-1 
          ${option ? 'border-[#3387E5] border-solid text-[#3387E5] font-semibold' : 'hover:bg-[#B4B4B4]/30'}`}
    >
      <span>{title}</span>
      {icon && <span className="mr-2">{icon}</span>}
    </button>
  );
};

export default FilteringButton;
