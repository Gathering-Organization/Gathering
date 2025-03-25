import { ReactNode } from 'react';

type ButtonFilter = {
  title: string;
  option: boolean;
  onClick: () => void;
  icon: ReactNode;
  afterIcon: ReactNode;
};

const FilteringButton: React.FC<ButtonFilter> = ({ title, option, onClick, icon, afterIcon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 border-solid rounded-lg border-2 px-4 py-1 
          ${option ? 'border-[#3387E5] text-[#3387E5]' : 'border-[#B4B4B4]'}`}
    >
      <span>{title}</span>
      <span className="mr-2">{option ? afterIcon : icon}</span>
    </button>
  );
};

export default FilteringButton;
