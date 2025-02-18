export interface MenuItem {
  id: string;
  label: string;
  subItems?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  items?: MenuItem[];
}

export interface MultiLevelDropdownProps {
  menuData: MenuCategory[];
  label?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
  // onItemClick: (value: string) => void;
}
