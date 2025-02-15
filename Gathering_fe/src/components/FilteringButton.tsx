type ButtonFilter = {
  title: string;
  option: boolean;
  onClick: () => void;
};

const FilteringButton: React.FC<ButtonFilter> = ({ title, option, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`border-[#B4B4B4] border-solid rounded-[20px] border-2 px-4 py-1 
          ${option ? 'border-[#3387E5] border-solid text-[#3387E5] font-semibold' : 'hover:bg-[#B4B4B4]/30'}`}
    >
      {title}
    </button>
  );
};

export default FilteringButton;
