export interface MultiSelectionProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (selected: string[]) => void;
}
