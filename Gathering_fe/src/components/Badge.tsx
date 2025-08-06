import React from 'react';

type BadgeProps = {
  count: number;
};

const Badge: React.FC<BadgeProps> = ({ count }) => {
  const displayCount = count > 999 ? '999+' : count.toString();
  const isSingleDigit = displayCount.length === 1;

  return (
    <div
      className={`flex items-center justify-center bg-[#FFFF33] rounded-full text-black font-bold ${
        isSingleDigit
          ? 'w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]'
          : 'min-w-[20px] h-[20px] sm:min-w-[25px] sm:h-[25px] px-[6px] sm:px-2'
      } text-xs sm:text-base`}
    >
      {displayCount}
    </div>
  );
};

export default Badge;
