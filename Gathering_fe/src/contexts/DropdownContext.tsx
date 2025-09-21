import { createContext, useContext, useState, useRef, useEffect } from 'react';

type DropdownContextType = {
  activeDropdown: string | null;
  setActiveDropdown: (key: string | null) => void;
  registerRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const refs = useRef<Record<string, React.RefObject<HTMLElement>>>({});

  const registerRef = (key: string, ref: React.RefObject<HTMLElement>) => {
    refs.current[key] = ref;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!activeDropdown) return;

      const activeRef = refs.current[activeDropdown];
      if (activeRef && activeRef.current?.contains(event.target as Node)) {
        return;
      }

      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  return (
    <DropdownContext.Provider value={{ activeDropdown, setActiveDropdown, registerRef }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('useDropdown must be used within a DropdownProvider');
  return context;
};
