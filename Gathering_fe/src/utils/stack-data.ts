import { MenuCategory } from '@/types/menu';
export const stackData: MenuCategory[] = [
  {
    id: 'FRONTEND',
    title: 'Frontend',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVASCRIPT', label: 'JavaScript' },
          { id: 'TYPESCRIPT', label: 'TypeScript' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크 & 라이브러리',
        subItems: [
          { id: 'REACT', label: 'React' },
          { id: 'VUE', label: 'Vue.js' },
          { id: 'NEXTJS', label: 'Next.js' },
          { id: 'NUXTJS', label: 'Nuxt.js' },
          { id: 'ANGULAR', label: 'Angular' },
          { id: 'SVELTE', label: 'Svelte' }
        ]
      }
    ]
  },
  {
    id: 'BACKEND',
    title: 'Backend',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVA', label: 'Java' },
          { id: 'KOTLIN', label: 'Kotlin' },
          { id: 'PYTHON', label: 'Python' },
          { id: 'PHP', label: 'PHP' },
          { id: 'C', label: 'C' },
          { id: 'CPP', label: 'C++' },
          { id: 'CS', label: 'C#' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'SPRING', label: 'Spring' },
          { id: 'NESTJS', label: 'NestJS' },
          { id: 'DJANGO', label: 'Django' },
          { id: 'FASTAPI', label: 'FastAPI' },
          { id: 'FLASK', label: 'Flask' },
          { id: 'LARAVEL', label: 'Laravel' }
        ]
      }
    ]
  },
  {
    id: 'MOBILE',
    title: 'Mobile',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'SWIFT', label: 'Swift' },
          { id: 'FLUTTER', label: 'Flutter' }
        ]
      }
    ]
  },
  {
    id: 'DATABASE',
    title: 'Database',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'DBMS',
        label: '데이터베이스 관리 시스템',
        subItems: [
          { id: 'MYSQL', label: 'MySQL' },
          { id: 'POSTGRESQL', label: 'PostgreSQL' },
          { id: 'MONGODB', label: 'MongoDB' },
          { id: 'SQLITE', label: 'SQLite' },
          { id: 'FIREBASE', label: 'Firebase' },
          { id: 'SUPABASE', label: 'Supabase' }
        ]
      }
    ]
  },
  {
    id: 'CLOUD',
    title: 'Cloud & DevOps',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'CLOUD_SERVICES',
        label: '클라우드 서비스',
        subItems: [
          { id: 'AWS', label: 'AWS' },
          { id: 'GCP', label: 'Google Cloud' },
          { id: 'AZURE', label: 'Azure' }
        ]
      },
      {
        id: 'DEVOPS',
        label: 'DevOps 도구',
        subItems: [
          { id: 'DOCKER', label: 'Docker' },
          { id: 'KUBERNETES', label: 'Kubernetes' }
        ]
      }
    ]
  },
  {
    id: 'DESIGN',
    title: 'Design',
    items: [
      { id: 'all', label: '전체' },
      {
        id: 'TOOLS',
        label: '디자인 도구',
        subItems: [
          { id: 'FIGMA', label: 'Figma' },
          { id: 'PHOTOSHOP', label: 'Photoshop' },
          { id: 'ILLUSTRATOR', label: 'Illustrator' },
          { id: 'PREMIERE', label: 'Premiere Pro' }
        ]
      }
    ]
  }
];
