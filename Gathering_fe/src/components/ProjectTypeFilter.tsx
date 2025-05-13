// import { projectType } from '@/utils/project-and-apply-type';

// type ProjecTypeFilterProps = {
//   selectedType: string;
//   setSelectedType: (type: string) => void;
// };

// const ProjecTypeFilter: React.FC<ProjecTypeFilterProps> = ({ selectedType, setSelectedType }) => {
//   return (
//     <div className="text-[28px] font-bold space-x-8 flex">
//       {projectType.map(item => (
//         <button
//           onClick={() => setSelectedType(item.projectType)}
//           key={item.projectTypeId}
//           className={`${selectedType === item.projectType ? 'text-black' : 'text-[#B4B4B4]'}`}
//         >
//           {item.projectTypeName}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ProjecTypeFilter;
import React from 'react';
import { projectType, myProjectType, myApplyType } from '@/utils/project-and-apply-type';

type FilterCategory = 'project' | 'myProject' | 'myApply';

type ProjecTypeFilterProps = {
  selectedType: string;
  setSelectedType: (type: string) => void;
  filterCategory?: FilterCategory; // 선택적으로 필터 데이터 종류를 지정 (기본값은 'project')
};

const ProjecTypeFilter: React.FC<ProjecTypeFilterProps> = ({
  selectedType,
  setSelectedType,
  filterCategory = 'project'
}) => {
  let filterItems;

  switch (filterCategory) {
    case 'myProject':
      filterItems = myProjectType;
      break;
    case 'myApply':
      filterItems = myApplyType;
      break;
    default:
      filterItems = projectType;
  }

  return (
    <div className="text-[28px] font-bold space-x-8 flex">
      {filterItems.map(item => (
        <button
          style={{ willChange: 'transform' }}
          onClick={() => setSelectedType(String(item.projectType))}
          key={item.projectTypeId}
          className={`transition-all duration-300 transform ${
            selectedType === String(item.projectType)
              ? 'text-black scale-105'
              : 'text-[#B4B4B4] scale-100'
          }`}
        >
          {item.projectTypeName}
        </button>
      ))}
    </div>
  );
};

export default ProjecTypeFilter;
