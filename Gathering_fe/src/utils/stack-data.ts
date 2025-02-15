import { MenuCategory } from '@/types/menu';

export const stackData: MenuCategory[] = [
  {
    id: 'design',
    title: '디자인',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'tools',
        label: '도구',
        subItems: [
          { id: 'figma', label: 'Figma' },
          { id: 'sketch', label: 'Sketch' }
        ]
      }
    ]
  }
];
