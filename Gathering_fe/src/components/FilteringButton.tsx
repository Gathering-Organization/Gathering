import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ButtonFilter = {
  title: string;
  option: boolean;
  onClick: () => void;
  icon: ReactNode;
  afterIcon: ReactNode;
};

const FilteringButton: React.FC<ButtonFilter> = ({ title, option, onClick, icon, afterIcon }) => {
  return (
    <motion.button
      onClick={onClick}
      style={{ willChange: 'transform' }}
      className={`
        flex items-center space-x-2 border-solid rounded-lg border-2 px-4 py-1
        transition-all duration-300 ease-in-out hover:shadow-md
        ${option ? 'border-[#3387E5] text-[#3387E5] bg-[#EAF3FF]' : 'border-[#B4B4B4] bg-white'}
        active:scale-95
      `}
      whileTap={{ scale: 0.95 }}
    >
      <span className="font-semibold">{title}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={option ? 'afterIcon' : 'icon'}
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          {option ? afterIcon : icon}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default FilteringButton;
