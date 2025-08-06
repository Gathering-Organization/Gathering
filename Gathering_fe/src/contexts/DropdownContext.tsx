import { createContext, useContext, useState } from 'react';

type DropdownContextType = {
  activeDropdown: string | null;
  setActiveDropdown: (key: string | null) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <DropdownContext.Provider value={{ activeDropdown, setActiveDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('useDropdown must be used within a DropdownProvider');
  return context;
};
