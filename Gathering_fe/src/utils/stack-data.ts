import { MenuCategory } from '@/types/menu';
export const stackData: MenuCategory[] = [
  {
    id: 'FRONTEND',
    title: '프론트엔드',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVASCRIPT', label: '자바스크립트' },
          { id: 'TYPESCRIPT', label: '타입스크립트' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'REACT', label: '리액트' },
          { id: 'VUE', label: '뷰' },
          { id: 'NEXTJS', label: 'Next.js' },
          { id: 'NODEJS', label: 'Node.js' }
        ]
      }
    ]
  },
  {
    id: 'BACKEND',
    title: '백엔드',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVA', label: '자바' },
          { id: 'KOTLIN', label: '코틀린' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'SPRING', label: '스프링' },
          { id: 'NESTJS', label: 'NestJS' }
        ]
      }
    ]
  },
  {
    id: 'DESIGN',
    title: '디자인',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'TOOLS',
        label: '도구',
        subItems: [{ id: 'FIGMA', label: '피그마' }]
      }
    ]
  }
];
