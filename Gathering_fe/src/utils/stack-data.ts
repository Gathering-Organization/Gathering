import { MenuCategory } from '@/types/menu';

export const stackData: MenuCategory[] = [
  {
    id: 'FRONTEND',
    title: 'Frontend',
    items: [
      { id: 'ALLFRONTEND', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVASCRIPT', label: 'JavaScript' },
          { id: 'TYPESCRIPT', label: 'TypeScript' },
          { id: 'HTML', label: 'HTML' },
          { id: 'CSS', label: 'CSS' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크 & 라이브러리',
        subItems: [
          { id: 'REACT', label: 'React' },
          { id: 'VUE', label: 'Vue.js' },
          { id: 'ANGULAR', label: 'Angular' },
          { id: 'SVELTE', label: 'Svelte' },
          { id: 'NEXTJS', label: 'Next.js' },
          { id: 'NUXTJS', label: 'Nuxt.js' }
        ]
      },
      {
        id: 'STYLING',
        label: '스타일링',
        subItems: [
          { id: 'SASS', label: 'Sass' },
          { id: 'TAILWINDCSS', label: 'Tailwind CSS' },
          { id: 'EMOTION', label: 'Emotion' }
        ]
      },
      {
        id: 'TOOLS',
        label: '도구',
        subItems: [
          { id: 'VITE', label: 'Vite' },
          { id: 'GRAPHQL', label: 'GraphQL' }
          // Cloudflare, Git, Vercel은 Cloud 카테고리로 분류
        ]
      }
    ]
  },
  {
    id: 'BACKEND',
    title: 'Backend',
    items: [
      { id: 'ALLBACKEND', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'JAVA', label: 'Java' },
          { id: 'KOTLIN', label: 'Kotlin' },
          { id: 'PYTHON', label: 'Python' },
          { id: 'PHP', label: 'PHP' },
          { id: 'RUST', label: 'Rust' },
          { id: 'C', label: 'C' },
          { id: 'CPP', label: 'C++' },
          { id: 'CS', label: 'C#' },
          { id: 'FORTRAN', label: 'Fortran' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'SPRING', label: 'Spring' },
          { id: 'NESTJS', label: 'NestJS' },
          { id: 'DJANGO', label: 'Django' },
          { id: 'FLASK', label: 'Flask' },
          { id: 'FASTAPI', label: 'FastAPI' },
          { id: 'LARAVEL', label: 'Laravel' },
          { id: 'EXPRESSJS', label: 'Express.js' }
        ]
      },
      {
        id: 'RUNTIME',
        label: '런타임',
        subItems: [{ id: 'NODEJS', label: 'Node.js' }]
      }
    ]
  },
  {
    id: 'MOBILE',
    title: 'Mobile',
    items: [
      { id: 'ALLMOBILE', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '언어',
        subItems: [
          { id: 'SWIFT', label: 'Swift' },
          { id: 'DART', label: 'Dart' },
          { id: 'KOTLIN', label: 'Kotlin' }
        ]
      },
      {
        id: 'FRAMEWORK',
        label: '프레임워크',
        subItems: [
          { id: 'FLUTTER', label: 'Flutter' },
          { id: 'UNITY', label: 'Unity' },
          { id: 'UNREALENGINE', label: 'Unreal Engine' }
        ]
      }
    ]
  },
  {
    id: 'DATABASE',
    title: 'Database',
    items: [
      { id: 'ALLDATABASE', label: '전체' },
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
      { id: 'ALLCLOUD', label: '전체' },
      {
        id: 'CLOUD_SERVICES',
        label: '클라우드 서비스',
        subItems: [
          { id: 'AWS', label: 'AWS' },
          { id: 'GCP', label: 'Google Cloud' },
          { id: 'AZURE', label: 'Azure' },
          { id: 'CLOUDFLARE', label: 'Cloudflare' }
        ]
      },
      {
        id: 'DEVOPS',
        label: 'DevOps 도구',
        subItems: [
          { id: 'DOCKER', label: 'Docker' },
          { id: 'KUBERNETES', label: 'Kubernetes' },
          { id: 'POSTMAN', label: 'Postman' },
          { id: 'GIT', label: 'Git' },
          { id: 'VERCEL', label: 'Vercel' }
        ]
      }
    ]
  },
  {
    id: 'DESIGN',
    title: 'Design',
    items: [
      { id: 'ALLDESIGN', label: '전체' },
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
  },
  {
    id: 'ETC',
    title: '기타',
    items: [
      { id: 'ALLETC', label: '전체' },
      {
        id: 'LANGUAGE',
        label: '기타 언어',
        subItems: [
          { id: 'R', label: 'R' },
          { id: 'MATLAB', label: 'Matlab' }
        ]
      }
    ]
  }
];
