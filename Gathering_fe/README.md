<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" />

## 📕 배운점 [노션 바로가기](https://diligent-cloudberry-302.notion.site/1fa45ef4e68380088a02e2a1fa1aa23b?pvs=74)
<!--📕 정규표현식으로 닉네임 유효성 검사-->
<details>
<summary>🔹 정규표현식으로 닉네임 유효성 검사</summary>

- **상황**
    - 닉네임 입력값이 한글 1~6자리인지를 정규표현식을 이용하여 확인

- **코드**

    ```tsx
    const regex = /^[가-힣]{1,6}$/;
    if (!regex.test(newNickname)) {
        // 실패 메시지
    } else {
        // 닉네임 변경 로직
    }
    ```

- **코드 설명**
    - `^` : 문자열의 시작
    - `$` : 문자열의 끝
    - `/.../` : 정규표현식 리터럴
    - `[가-힣]` : 한글 문자 범위
    - `{1,6}` : 1자 이상 6자 이하
    - `regex.test()` : 해당 문자열이 정규식에 부합하는지 여부 반환
</details>

<!--📕 자연스러운 색채움-->
<details>
<summary>🔹 자연스러운 색채움</summary>

- tailwind css에서 버튼 hover시 자연스럽게 색이 채워지는 애니메이션을 통해 UX를 향상시키는 코드
    - hover:bg-blue-600 transition-colors duration-300 ease-in-out

- **코드**

    ```tsx
    <button
      className="self-end bg-[#3387E5] text-white font-semibold px-6 py-2 rounded-[30px] hover:bg-blue-600 transition-colors duration-300 ease-in-out"
    >
      프로필 저장
    </button>
    ```
</details>

<!--📕 다크모드-->
<details>
<summary>🔹 다크모드</summary>

- tailwind.config.js 파일에서 moudle.exports에 darkMode 설정을 넣지 않으면 다크모드 관련 유틸리티 클래스를 생성하지 않으므로 다크모드가 적용되지 않는다.

- darkMode의 값을 "media"로 설정하면 시스템 다크모드 설정에 따라 자동으로 적용된다.
  
- darkMode의 값을 "class"로 설정하면 클래스를 루트 요소나 특정 요소에 수동으로 붙여서 다크모드를 적용하게 된다.

- darkMode의 값을 "selector" darkMode.selector를 직접 지정하여 다크 모드 토글 기준을 커스터마이징할 수 있다. (Tailwind CSS 3.4 이상에서 도입된 방식)
</details>

<!--📕 배포방법-->
<details>
<summary>🔹 배포방법</summary>

<details>
<summary>전체 배포 흐름 개요</summary>
  
- 프론트엔드 → 빌드 → 정적 파일 생성 → 서버(EC2) 내 Nginx가 정적 파일 서빙

- 백엔드 → JAR/WAR 빌드 → 서버(EC2)에서 실행

- 도메인 구매 및 DNS 설정 → 도메인 연결 → Nginx에서 프론트/백엔드 요청 분기 처리
  
- HTTPS 인증서 (Let’s Encrypt) 적용
</details>

<details>
  <summary>프론트엔드 배포 준비 작업</summary>
  
  1. React 앱 빌드 : npm run build로 프로덕션용 정적 파일 생성
  
  2. EC2 서버에 build/ 폴더 전체를 업로드 (scp, rsync, FTP 사용)
      
      ```tsx
      scp -r build/ ubuntu@ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com:/home/ubuntu/myapp/frontend/
      ```
      
  3. Nginx 설정 - 정적 파일 서비스 : EC2 내 Nginx 정적 설정 파일 (`/etc/nginx/sites-available/default` 또는 커스텀 설정)에 React 정적 파일 경로 추가
  (React SPA라 `try_files $uri /index.html;`로 SPA 라우팅 처리)
      
      ```tsx
      server {
          listen 80;
          server_name your-domain.com;
      
          root /home/ubuntu/myapp/frontend/build;  # 빌드 폴더 경로
          index index.html index.htm;
      
          location / {
              try_files $uri /index.html;
          }
      
          # API 요청 프록시 (백엔드)
          location /api/ {
              proxy_pass http://localhost:8080;  # 백엔드 서버 주소
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }
      }
      
      ```
      
  4. Nginx 재시작
      
      ```tsx
      sudo nginx -t  # 설정 테스트
      sudo systemctl reload nginx
      ```
</details>
<details>
  <summary>도메인 연결</summary>

- 도메인 구매 후 DNS 관리 페이지에서
  - A 레코드에 EC2 퍼블릭 IP 설정
  - (필요시) CNAME 설정 등 추가
    
- 도메인 네임이 EC2 IP를 가리키도록 설정 확인
</details>
</details>

<!--📕 버튼 중복 클릭 방지 (API 중복 호출)-->
<details>
<summary>🔹 버튼 중복 클릭 방지 (API 중복 호출)</summary>

1. UX적인 중복 방지
    - BeatLoader를 이용하여 사용자에게 버튼을 누르고 두 번 연속으로 누르지 않도록 사용자 경험 개선
    - fixed가 아닌 absolute를 사용할 경우 부모 태그에 relative를 넣어서 최상위 태그 기준으로 BeatLoader를 위치시켜도 되는데 주로 **전체 페이지를 덮는 오버레이에는 fixed를 사용**하는게 좋다.
    
    ```tsx
    {isLoading && (
      <div className="fixed inset-0 z-50 bg-white bg-opacity-70 flex flex-col justify-center items-center">
        <BeatLoader color="#3387E5" size={20} />
        <p className="mt-4 text-gray-700 font-semibold">모집글을 작성중입니다...</p>
      </div>
    )}
    ```
    
2. UI적인 중복 방지
    - 버튼에 disabled를 걸고 값이 true일 때 버튼이 비활성화가 되도록하여 중복 클릭을 방지
    - 백틱을 통해 isLoading의 값이 true일 때 클릭 불가 커서가 되도록하는 등의 UI 변경
    
    ```tsx
    <button
      disabled={isLoading}
      className={`bg-[#3387E5] font-bold px-10 py-2 text-white justify-items-center rounded-[30px] hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onCreate}
    >
      작성하기
    </button>
    ```

</details>

<!--📕 새로운 기능 브랜치 만들기-->
<details>
<summary>🔹 새로운 기능 브랜치 만들기</summary>

- **상황**
    - fe/feat/project에서 개발하던 중 관리자 모드를 개발하기 위해 fe/feat/admin을 만들어서 기능별 브랜치 분리를 하고 싶다.
    - 현재 혼자 개발중이다.

- **방법**
  
1. 현재 작업 중인 브랜치 (fe/feat/project) 작업 커밋 여부 확인
   ```
    // 현재 작업까지 커밋하는 방식
    git status
    git add -A
    git commit -m "커밋할 메시지"

    // 임시저장 방식
    git stash
   ```

2. 새 브랜치 만들고 이동
   ```
   git checkout -b fe/feat/admin
   ```
   
3. 작업 완료 후 커밋 & 푸쉬
    ```
    git add -A
    git commit -m "커밋할 메시지"
    git push origin fe/feat/admin
    ```
    
4. fe/feat/admin 브랜치 작업을 fe/feat/project에 반영
   ```
   git checkout fe/feat/project
   git merge fe/feat/admin
   ```

</details>

<!--📕API 작성 방법-->
<details>
<summary>🔹 API 작성 방법</summary>

<details>
<summary>GET</summary>

- 정적 경로 호출

    ```jsx
    export const getMembersCountAdmin = async () => {
      try {
        const response = await api.get('/admin/members/count');
        console.log('응답 데이터:', response.data.data);
    
        if (response.data.status === 200) {
          return { success: true, message: response.data.message, data: response.data.data };
        }
      } catch (error: unknown) {
        console.error('회원수 조회 실패:', error);
    
        if (error instanceof AxiosError) {
          console.error('서버 응답:', error.response?.data);
        }
    
        throw error;
      }
    };
    ```

- 동적 쿼리 파라미터가 포함된 경로 호출
  
    ```jsx
    export const getPaginationAdmin = async (page: number, keyword: string) => {
      try {
    	  // 인코딩하여 URL-safe한 문자열로 변환
        const keywordParam = encodeURIComponent(keyword);
        const response = await api.get(`/admin/project/pagination?page=${page}&sort=-createdAt&position=ALL&type=ALL&mode=ALL&keyword=${keywordParam}`);
    
        console.log('응답 데이터:', response.data.data);
    		
    		// 메타데이터를 받아오는 방법
        if (response.data.status === 200) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data.content,
            pagination: {
              totalPages: response.data.data.totalPages,
              totalElements: response.data.data.totalElements,
              currentPage: response.data.data.number,
              pageSize: response.data.data.size
            }
          };
        }
      } catch (error: unknown) {
        console.error('내 지원서 조회 실패:', error);
    
        if (error instanceof AxiosError) {
          console.error('서버 응답:', error.response?.data);
        }
    
        throw error;
      }
    };
    ```

</details>

<details>
<summary>POST</summary>

```jsx
export const setPosting = async (postInfo: PostingInfo) => {
  try {
    console.log('보낼 데이터:', postInfo);
    const response = await api.post('/project', { ...postInfo });

    console.log('응답 데이터:', response.data);

    if (response.data.status === 201) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('모집글 작성 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
```

</details>

<details>
<summary>DELETE</summary>

```jsx
export const deleteProjectAdmin = async (projectId: number) => {
  try {
    const response = await api.delete(`/admin/project/${projectId}`);

    console.log('응답 데이터:', response.data);

    if (response.data.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error: unknown) {
    console.error('프로젝트 삭제 실패:', error);

    if (error instanceof AxiosError) {
      console.error('서버 응답:', error.response?.data);
    }

    throw error;
  }
};
```

</details>
</details>

<!--📕array.some(callback) -->
<details>
<summary>🔹 array.some(callback)</summary>

- 배열에서 특정 조건을 만족하는 요소가 하나라도 있는지 판단하는 메서드

    ```jsx
      if (myProfile && !adminList.some(user => user.nickname === myProfile.nickname)) {
        return <div className="text-center mt-20 text-xl font-semibold">접근 권한이 없습니다.</div>;
      }
    ```
</details>

<!--📕Vercel 프론트엔드 배포 방법-->
<details>
<summary>🔹 Vercel 프론트엔드 배포 방법</summary>

1. 배포된 프론트엔드 URL 확인하기

    - Vercel DashBoard -> [프로젝트 클릭] -> Domains 탭
      
        - ex) https://gathering-work.vercel.app/
     
2. Redirect URL 확인 (OAuth 로그인 등에 사용)
   
    - 배포 URL + 로그인 콜백 경로 조합
      
        - ex) https://gathering-work.vercel.app/login/callback

3. 환경변수 설정, API 요청 도메인 (API URL 등) (보안 상 노출해도 되는 것만)

    - Vercel DashBoard -> [프로젝트 클릭] -> Settings -> Environment Variables

4. CORS 관련 협의 항목 (백엔드 설정 필요)

    - 백엔드의 CORS 설정에 Origin 주소 필요
      
        - https://gathering-work.vercel.app/

5. 발생 오류들
   
    - 모노레포라서 Vercel의 Settings에서 Root Directory를 [Gathering_fe]로 설정 실수를 하여 오류가 발생 -> 모노레포 전체의 Root Directory에 vercel.json 파일 이동
      
    - Framework Settings에서 Other을 Vite로 변경
      
    - tsconfig.app.json에서 제한 해제를 위해 아래 코드 수정 (빌드할땐 app.json을 참조)
      
        ```
        "noUnusedLocals": false,
        "noUnusedParameters": false
        ```
        
    - spinner 같은 패키지를 Gathering_fe 위치에서 설치
      
</details>

<!--📕Google의 Authorization Code Flow ↔ OAuth 2.0 Implicit Flow (파싱 방식)-->
<details>
<summary>🔹 Google의 Authorization Code Flow ↔ OAuth 2.0 Implicit Flow (파싱 방식)</summary>

```jsx
// access_token을 해시(#)에서 읽는 방식 (최근 보안상 권장 X)
// const params = new URLSearchParams(window.location.hash.substring(1));
// const code = params.get('access_token');

// const handleGoogle = () => {
//   window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
//   closeModal();
// };

// code 파라미터를 URL 쿼리 문자열에서 받음 (Google 기본 정책)
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

const handleGoogle = () => {
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI;

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const url =
    `https://accounts.google.com/o/oauth2/auth` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=consent`; // refresh_token 받기 위함

  window.location.href = url;
  closeModal();
};

const handleEmailLoginMode = () => {
  setIsEmailLogin(true);
};
```
</details>

<!--📕Open Graph-->
<details>
<summary>🔹 Open Graph</summary>

- 콘텐츠의 요약 내용이 SNS에 게시되는데 최적화된 데이터를 가지고 갈 수 있도록 설정하는 것이다.

<details>
<summary>사진 설명</summary>
<img width="1280" height="970" alt="Image" src="https://github.com/user-attachments/assets/12579fbd-43d6-4dab-abab-aee28796e899" />

</details>

```html
<meta property="og:image" content="https://gathering.work/gathering.svg" /> // 썸네일 (크롤러가 외부에서 접근하므로 절대 URL을 이용)
<meta property="og:site_name" content="게더링(Gathering)" /> // 제목 미리보기
<meta property="og:description" content="IT 초심자를 위한 팀원 모집 웹서비스" /> // 내용

// 정보를 더 잘 노출시키기 위한 추가 태그
<meta property="og:title" content="게더링(Gathering)" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://gathering.work" />
```

</details>

<!--📕캐러셀 라이브러리 이용 방법 (슬라이딩 배너)-->
<details>
<summary>🔹 캐러셀 라이브러리 이용 방법 (슬라이딩 배너)</summary>

1. Embla Carousel 라이브러리 설치
    
    ```
    npm install embla-carousel
    ```
    
2. 슬라이더 컴포넌트 작성 (Typescript)

<details>
<summary>코드 스니펫</summary>

```tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import EmblaCarousel, { EmblaOptionsType } from 'embla-carousel';

interface EmblaCarouselProps {
  options?: EmblaOptionsType;
  slides: React.ReactNode[];
}

const EmblaCarouselComponent: React.FC<EmblaCarouselProps> = ({ options, slides }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaRef.current?.scrollPrev();
  }, []);

  const scrollNext = useCallback(() => {
    emblaRef.current?.scrollNext();
  }, []);

  const scrollTo = (index: number) => {
    emblaRef.current?.scrollTo(index);
  };

  const onSelect = useCallback(() => {
    if (!emblaRef.current) return;
    setSelectedIndex(emblaRef.current.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      emblaRef.current = EmblaCarousel(viewportRef.current, options);
      emblaRef.current.on('select', onSelect);
      onSelect();
    }

    return () => {
      emblaRef.current?.destroy();
    };
  }, [options, onSelect]);

  return (
    <div className="relative w-full">
      {/* Viewport */}
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full px-2">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md p-3 rounded-full transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md p-3 rounded-full transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaCarouselComponent;
```
    
</details>

3. 원하는 위치에서 사용 (예시 App.tsx)

<details>
<summary>코드 스니펫</summary>

```tsx
import EmblaCarouselComponent from './EmblaCarousel'

const slides = [
  <div className="h-64 bg-blue-300 flex items-center justify-center text-3xl text-white rounded-xl">
    Slide 1
  </div>,
  <div className="h-64 bg-blue-400 flex items-center justify-center text-3xl text-white rounded-xl">
    Slide 2
  </div>,
  <div className="h-64 bg-blue-500 flex items-center justify-center text-3xl text-white rounded-xl">
    Slide 3
  </div>
];

export default function App() {
  return (
    <div className="pb-4">
      <EmblaCarouselComponent slides={slides} options={{ loop: true }} />
    </div>
  )
}
```

</details>

</details>

<!--📕public 폴더와 assets 폴더의 차이-->
<details>
<summary>🔹 `public` 폴더와 `assets` 폴더의 차이</summary>

<details>
<summary>용어 정리</summary>

- 번들링(Bundling) : 개발 중에 여러 개의 파일(JS, CSS, 이미지 등)을 하나 또는 몇 개로 묶어 최적화하는 과정이다. (로딩 속도 개선, 캐싱 최적화, 코드 난독화)

- 번들링이 필요한 이미지 : JS/TS 파일에서 버튼 등으로 상호작용에 사용되는 이미지는 번들링이 필요하고 단순히 보여주기만 하는 이미지는 번들링 과정이 필요 없다.

- 번들링 도구 : Vite, Webpack, Rollup 등

- 정적 리소스(Static Resources) : 런타임 중 서버에서 변하지 않고 클라이언트가 그대로 받아서 쓰는 파일이다. (이미지, 폰트, HTML 파일, favicon.ico 등)
  
</details>

- `public` 폴더

    - 목적
 
        - **정적 파일**을 직접 브라우저에서 접근할 수 있도록 제공하는 폴더이다.
          
        - **Vite나 Webpack의 번들링 대상이 아니기 때문에 경로가 그대로 유지**된다.
     
    - 특징
      
        - `public/hello.jpg` -> 실제 접근 경로 : `http://localhost:3000/hello.jpg`
     
        - 이미지나 폰트, PDF, OG 이미지, favicon 등 **직접 URL로 접근되어야 하는 정적 리소스**를 넣는다.
 
    - 예시
      
        - 파일 위치 : `public/images/banner1.jpg`
     
            ```tsx
            <img src="/images/banner1.jpg" />
            ```

- `src/assets` 폴더

    - 목적

        - 코드에서 **`import`해서 사용하는 리소스를 위한 폴더**이다.
     
        - Vite/Webpack이 번들링해서 파일명을 해시 처리한 뒤, 최적화해준다.
     
        - JS/TS 코드 안에서 모듈처럼 사용해야 할 리소스 (예 : 컴포넌트 내부에서 쓰는 아이콘, 로고 등)에 적합하다.
 
    - 특징
 
        - 파일을 `import`로 불러와야 사용 가능하다.
     
        - 정적 리소스 URL로는 직접 접근할 수 없다.
     
        - 코드가 많아질수록 유지보수에 좋다.
 
    - 예시
 
        ```tsx
        import banner` from '@/assets/banner1.jpg';

        <img src={banner`} alt="배너1" />;
        ```
 
- 슬라이딩 배너(캐러셀)에 들어가는 이미지는 단순히 보여주는 슬라이드 배너 이미지이므로 `public`에 들어가면 된다. (굳이 JS/TS 번들링 대상이 아니기 때문이다.)
</details>

<!--📕구글 애널리틱스 (GA) 설정 방법 (접속자 수, 가입자 수 지표)-->
<details>
<summary>🔹 구글 애널리틱스 (GA) 설정 방법 (접속자 수, 가입자 수 지표)</summary>

1. https://analytics.google.com/analytics/web/ 에서 GA4 속성을 생성한다.

2. 주어진 코드를 `index.html`에 삽입한다. (방문자 수, 페이지별 접속 수가 GA에 자동 수집)

<details>
<summary>코드 스니펫</summary>

```jsx
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxx"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());

  gtag('config', 'G-xxxxxx');
</script>
```

</details>

3. **이메일을 통한 회원가입**은 회원가입 이벤트(함수)가 발생할 때 GA로 이메일 정보를 보내서 가입자 수를 확인할 수 있게 한다. (가입자 수는 수동을 전송해야 한다.)

4. **구글 소셜 로그인을 통한 회원가입**은 백엔드로부터 로그인과 회원가입을 구분하여 정보를 제공받고 이를 통해 회원가입일 때 GA로 이메일 정보를 보내서 가입자 수를 확인할 수 있게 한다.

- 이메일 정보를 보낼 때는 보안 상 해시 처리 등으로 이메일 정보를 직접적으로 저장하지 않도록 한다.


</details>

<!--📕모노레포의 프론트엔드 라이브러리 의존성 주입 위치-->
<details>
<summary>🔹 모노레포의 프론트엔드 라이브러리 의존성 주입 위치</summary>

- `/Gathering/package.json`이 아닌 `/Gathering/Gathering_fe/package.json`에 주입한다. (`/Gathering/Gathering_fe` 위치에서 npm install을 한다.)

</details>

<!--📕조건문으로 Tailwind css 처리하기-->
<details>
<summary>🔹 조건문으로 Tailwind css 처리하기</summary>

<details>
<summary>코드 스니펫</summary>
    
```jsx
// 기존 코드
<div className="flex items-center space-x-12 text-[20px] font-bold">
<div className="w-24 sm:w-28 whitespace-nowrap">모집 포지션</div>
<div className="flex flex-wrap gap-2 relative">
  
// 수정 후 코드
// isMobile이 true일 때 상위 태그에 relative를 적용
// isMobile이 false일 때 하위 태그에 relative를 적용
<div className={`flex items-center space-x-12 text-[20px] font-bold ${isMobile ? "relative" : ""}`}>
<div className="w-24 sm:w-28 whitespace-nowrap">모집 포지션</div>
<div className={`flex flex-wrap gap-2 ${isMobile ? "" : "relative"}`}>
```
</details>

</details>

<!--📕카카오톡 오픈 채팅방 모바일 연결-->
<details>
<summary>🔹 카카오톡 오픈 채팅방 모바일 연결</summary>

<details>
<summary>용어 정리</summary>
    
- 딥링크 : 특정 앱의 내부 화면까지 직접 이동할 수 있게 해주는 링크이다.
    - 예시 : `kakaoopen://openchat?url=https://open.kakao.com/o/g1234abc`
- Fallback : 딥링크가 실패했을 때(예: 앱이 설치되어있지 않음 등)를 대비한 대체 행동이다.
</details>

- PC환경 -> 새 탭에서 링크 열기
- 모바일 환경 -> 앱으로 연결하기 위한 카카오톡 딥링크 사용

<details>
<summary>코드 스니펫</summary>

```jsx
const handleOpenChat = () => {
    const url = kakaoUrl.startsWith('http') ? kakaoUrl : `https://${kakaoUrl}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일: location.href로 바꾸면 카카오톡 앱으로 연결 시도
      const now = Date.now();
      // 카카오톡 딥링크 시도
      window.location.href = url.replace(/^https?:\/\//, 'kakaoopen://');
    
      // fallback: 앱이 실행되지 않으면 웹 링크로 이동
      setTimeout(() => {
        const elapsed = Date.now() - now;
        if (elapsed < 2000) {
          // 앱이 실행되지 않은 경우로 간주
          window.location.href = url;
        }
      }, 1500);
    } else {
      // PC: 새 탭에서 열기
      window.open(url, '_blank', 'noopener,noreferrer');
    }
};
```
</details>

</details>

<!--📕드롭다운 종속 관계 전역으로 관리하기-->
<details>
<summary>🔹 드롭다운 종속 관계 전역으로 관리하기</summary>

- 문제 상황
    - PostHome 내에서 드롭다운이 열렸는지 useState로 상태를 관리하고 그것을 컴포넌트(SearchBar)에게 Props로 넘겨주는 방식이었다.
    - 하지만 Header에 속하는 컴포넌트(LogoutButton)에서도 드롭다운의 상태를 종속적으로 관리해야하는데 (독립적으로 관리하면 각 드롭다운을 모두 켤 수 있어서 UX에 좋지 않다.) Layout에 속하는 Header, PostHome 간에 서로 넘겨주는 것은 비효율적이다. (Props Drilling의 문제가 발생한다.)
- 해결 방법
    - 전역 상태를 Context로 관리하면 필요한 드롭다운끼리 종속적으로 열리도록 할 수 있어서 효율적이다.
    - `contexts/DropdownContext.tsx`
        <details>
        <summary>코드 스니펫</summary>
    
        ```tsx
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
        ```
        </details>
    - `Layout.tsx`
        <details>
        <summary>코드 스니펫</summary>
 
        ```tsx
        import { Outlet, useLocation } from 'react-router';
        import Header from './Header';
        import Footer from './Footer';
        import { useEffect, useState } from 'react';
        import { DropdownProvider } from '@/contexts/DropdownContext'; // 추가
        
        const Layout: React.FC = () => {
          const location = useLocation();
          const hideHeaderPaths = ['/apply/view'];
          const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
        
          const [showScrollTop, setShowScrollTop] = useState(false);
        
          useEffect(() => {
            const handleScroll = () => {
              setShowScrollTop(window.scrollY > 200);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
          }, []);
        
          const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };
        
          return (
            <DropdownProvider> // 추가
              <div className="flex flex-col min-h-screen select-none">
                {!shouldHideHeader ? <Header /> : <div className="h-[56px] sm:h-[64px] md:h-[72px]" />}
                <main
                  className={`flex-grow ${
                    !shouldHideHeader ? 'pt-[56px] sm:pt-[64px] md:pt-[72px]' : ''
                  } min-h-[calc(150vh-56px)] sm:min-h-[calc(150vh-64px)] md:min-h-[calc(150vh-72px)]`}
                >
                  <Outlet />
                </main>
                <div className="pt-20 sm:pt-24 lg:pt-32" />
                <Footer />
                {showScrollTop && (
                  <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 bg-[#3387E5] text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300"
                    aria-label="맨 위로 이동"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </DropdownProvider>
          );
        };
        
        export default Layout;
        ```
        </details>
    - `PostHome.tsx`
        <details>
        <summary>코드 스니펫</summary>
    
        ```tsx
        import { useDropdown } from '@/contexts/DropdownContext'; // 추가
    
        // 내부 코드
        const { activeDropdown, setActiveDropdown } = useDropdown();
        
        // 드롭다운의 성격에 따라서 sort, search 등으로 설정
        const isOpen = activeDropdown === 'sort';
        ```
        </details>

</details>

<!--📕GIF 캡쳐 & 배속 설정-->
<details>
<summary>🔹 GIF 캡쳐 & 배속 설정</summary>

1. ScreenToGIF로 화면 캡쳐
2. [배속 조절 사이트](https://ezgif.com/speed/)에서 배속 설정
</details>

<!--📕서버-전송 이벤트(Server-Sent Events, SSE)-->
<details>
<summary>🔹 서버-전송 이벤트(Server-Sent Events, SSE)</summary>

- SSE : 서버가 클라이언트에게 실시간으로 데이터를 보내주는 **구독**모델이다.
- SSE
    - 동작 방식 : 클라이언트(브라우저)가 서버의 특정 API에 접속하면 서버는 이 연결을 끊지 않고 계속 유지한다.
    - 실시간 데이터 전송 : 새로운 알림이 발생할 때마다 서버는 이 **통로**를 통해 클라이언트에게 데이터를 즉시 밀어 넣어준다.
    - 클라이언트의 역할 : 클라이언트는 이 통로를 계속 관찰하고 있다가 데이터가 들어오면 받아서 UI에 즉시 반영한다.
        <details>
        <summary>코드 스니펫(문제 코드)</summary>
    
        ```tsx
        export const getNotificationSubscribe = async (nickname: string) => {
          try {
            const encodedNickname = encodeURIComponent(nickname);
            const response = await api.get(`/notification/subscribe?nickname=${encodedNickname}`);
        
            if (response.data.status === 200) {
              return { success: true, message: response.data.message, data: response.data.data };
            }
          } catch (error: unknown) {
            console.error('알림 자동 조회 실패:', error);
        
            if (error instanceof AxiosError) {
              console.error('서버 응답:', error.response?.data);
            }
        
            throw error;
          }
        };
    
        ```
        </details>
- 문제점
    - 현재 코드에 사용된 `axios`는 이런 지속적인 연결을 처리하는 데 적합하지 않다.
    - `axios`는 요청-응답이 한 번에 끝나는 통신을 위한 라이브러리이다.
    - SSE를 위해서는 브라우저에 내장된 `EventSource` API를 사용해야한다.
- 구현 방법
    - 기존 함수 대신 `EventSource`를 사용해서 보통 React의 `useEffect` 훅 안에서 컴포넌트가 마운트될 때 구독을 시작하고 언마운트될 때 구독을 해제하는 방식으로 구현한다.
    - 보통 Recoil, Zustand, Redux 등 상태관리 라이브러리를 활용해 실시간으로 받은 데이터를 전역 상태에 반영하는 것이 일반적이다.
- Recoil 구현 방법
    - `EventSource` 인스턴스를 생성할 때 `api.defaults.baseURL` 등을 활용해 전체 URL을 만들어주어야 한다.
    - 라이브러리 설치는 프론트엔드 폴더에서 `npm install recoil`을 통해서 하고 애플리케이션 최상위 컴포넌트를 `<RecoilRoot>`로 감싼다.
     <details>
    <summary>코드 스니펫(최상위 컴포넌트)</summary>

    ```tsx
    import React from 'react';
    import { RecoilRoot } from 'recoil';
    import MyComponent from './MyComponent';
    
    function App() {
      return (
        <RecoilRoot>
          <MyComponent />
        </RecoilRoot>
      );
    }
    
    export default App;
    ```
    </details>
    <details>
    <summary>코드 스니펫(전역 상태 관리 훅)</summary>

    ```tsx
    import { useEffect } from 'react';
    import { useSetRecoilState } from 'recoil'; // 예시: Recoil 상태 관리
    import { notificationState, unreadCountState } from '@/recoil/notification';
    
    const useNotificationSSE = (nickname: string) => {
      // Recoil, Zustand, Redux 등 상태관리 라이브러리를 활용해
      // 실시간으로 받은 데이터를 전역 상태에 반영하는 것이 일반적입니다.
      const setNotifications = useSetRecoilState(notificationState);
      const setUnreadCount = useSetRecoilState(unreadCountState);
    
      useEffect(() => {
        if (!nickname) return;
    
        const encodedNickname = encodeURIComponent(nickname);
        // EventSource 인스턴스를 생성합니다.
        // 이때 api.defaults.baseURL 등을 활용해 전체 URL을 만들어주어야 합니다.
        const sse = new EventSource(`/api/notification/subscribe?nickname=${encodedNickname}`);
    
        // SSE 연결이 성공했을 때 실행될 로직
        sse.onopen = () => {
          console.log('SSE 연결 성공!');
        };
    
        // 서버로부터 메시지(알림)를 받았을 때 실행될 로직
        sse.onmessage = (event) => {
          const newNotification = JSON.parse(event.data);
          console.log('새로운 알림 도착:', newNotification);
    
          // 여기에 UI 업데이트 로직을 추가합니다.
          // 1. 전체 알림 목록 state의 맨 앞에 새로운 알림을 추가
          setNotifications((prev) => [newNotification, ...prev]);
    
          // 2. 읽지 않은 알림 개수 state를 1 증가
          setUnreadCount((prev) => prev + 1);
          
          // 3. 브라우저 알림 띄우기 등 추가 작업 가능
        };
    
        // 에러 발생 시 실행될 로직
        sse.onerror = (error) => {
          console.error('SSE 에러 발생:', error);
          // 필요하다면 여기서 연결을 닫을 수 있습니다.
          sse.close();
        };
    
        // 컴포넌트가 언마운트될 때 SSE 연결을 반드시 끊어주어야 합니다.
        // 그렇지 않으면 메모리 누수가 발생할 수 있습니다.
        return () => {
          sse.close();
          console.log('SSE 연결 종료.');
        };
      }, [nickname, setNotifications, setUnreadCount]);
    };
    
    export default useNotificationSSE;
    
    // 사용 예시 (특정 페이지나 레이아웃 컴포넌트에서)
    // const MyPage = () => {
    //   const { nickname } = useUser(); // 현재 로그인한 유저 닉네임 가져오기
    //   useNotificationSSE(nickname); // 훅을 호출하여 SSE 구독 시작
    //   ...
    // }
    ```
    </details>
    <details>
    <summary>코드 스니펫(전역 상태 정의)</summary>

    ```tsx
    // src/recoil/notification.ts
    
    import { atom } from 'recoil';
    import { NotificationType } from '@/types/notification'; // 알림 타입 정의 (가상)
    
    //  Atom: 상태의 한 단위 (state piece)
    
    /**
     * @description 전체 알림 목록을 담는 상태
     */
    export const notificationState = atom<NotificationType[]>({
      key: 'notificationState', // key는 앱 전체에서 고유해야 합니다.
      default: [], // 기본값은 빈 배열
    });
    
    /**
     * @description 읽지 않은 알림의 개수를 담는 상태
     */
    export const unreadCountState = atom<number>({
      key: 'unreadCountState', // key는 앱 전체에서 고유해야 합니다.
      default: 0, // 기본값은 0
    });
    ```
    </details>
</details>

<!--📕상태 관리 라이브러리를 사용하는 이유-->
<details>
<summary>🔹 상태 관리 라이브러리를 사용하는 이유</summary>

- 상태관리 라이브러리 예시 : Recoil, Zustand, Redux 등
- `useState`와 상태 관리 라이브러리의 차이점
    - `useState`는 특정 컴포넌트 안에서만 상태를 관리할 때 좋다. 하지만 여러 컴포넌트가 동일한 상태를 공유해야 할 상황에서 문제가 발생한다. -> Props Drilling 문제 등
    - 상태 관리 라이브러리를 사용하면 앱의 모든 컴포넌트가 접근할 수 있는 전역 스토어(Global Store)를 만들어서 직접 상태 정보를 꺼내 쓸 수 있게 된다.
- Redux, Recoil, Zustand 차이점
    - 핵심 컨셉
        - Redux -> 하나의 거대한 객체(Store)
        - Recoil -> 독립적인 데이터 조각, 상태의 한 단위 -> state piece (Atom)
        - Zustand -> 가벼운 객체 기반의 Hook
    - 러닝 커브
        - Redux -> 높음 (개념이 많음)
        - Recoil -> 낮음 (React와 유사)
        - Zustand -> 매우 낮음 (가장 쉬움)
    - 코드량
        - Redux -> 많음 (보일러플레이트, 최소한의 변경으로 여러 곳에서 사용 가능)
        - Recoil -> 적음
        - Zustand -> 적음
- Redux(리덕스)
    - 장점
        - 예측 가능성 : 상태가 변경되는 모든 과정이 매우 엄격한 규칙 (Action -> Reducer)을 따르기 때문에 복잡한 앱에서도 데이터 흐름을 추적하기 쉽다.
        - 강력한 개발 도구 : 리덕스 개발자 도구는 시간 여행(Time-Travel) 디버깅 등 막강한 기능을 제공하여 버그를 잡는데 매우 유용하다.
        - 거대한 생태계 : 가장 오래된 만큼 수많은 자료, 미들웨어(Saga, Thunk 등), 커뮤니티 지원을 받을 수 있다.
    - 단점
        - 보일러플레이트 : 상태 하나를 추가하려 해도 액션 타입, 액션 생성 함수, 리듀서 등 많은 양의 코드를 작성해야 한다. (Redux Toolkit이 해당 부분은 크게 개선함)
        - 높은 학습 곡선 : 리덕스의 개념(불변성, 순수 함수 등)을 이해하는데 시간이 걸린다.
- Recoil(리코일)
    - 장점
        - React 친화적 : `useState`처럼 매우 직관적인 Hook API(`useRecoilState`)를 사용해 React 개발자에게 익숙하다.
        - 적은 코드량 : 리덕스에 비해 보일러플레이트가 거의 없다. atom으로 상태를 정의하고 바로 가져다 쓰면 된다.
        - 동시성 모드 지원 : React의 최신 기능들과 호환성이 좋다.
    - 단점
        - Facebook이 만들었지만 아직 정식 버전이 아니고 안정성에서 아직 실험적이다.
        - 상대적으로 정보에 대한 생태계가 작다.
- Zustand(주스탄트)
    - 장점
        - 극도로 단순하고 적은 코드량 : `create` 함수 하나로 스토어를 만들고 어디서든 Hook으로 꺼내 쓰면 끝이다.
        - 라이브러리 용량이 매우 작아 앱 성능에 미치는 영향이 거의 없다.
        - 리덕스처럼 엄격한 규칙을 강요하지 않아 자유도가 높다.
    - 단점
        - 규칙이 적어서 대규모 프로젝트에서 일관된 패턴을 유지하기 어렵다.
        - 리덕스 개발자 도구와 연동되지만 리덕스만큼의 디버깅 경험을 제공하지 않는다.

</details>

<!--📕개발 서버 재시작 방법-->
<details>
<summary>🔹 개발 서버 재시작 방법</summary>

1. 깃허브에 들어간다.
2. [Actions] 탭에 들어간다.
3. 배포 서버라면 `main`, 개발 서버라면 `dev` 브랜치의 가장 최신 merge에 들어간다.
4. 상단의 [Re-run all jobs]를 누른다.

<img width="426" height="97" alt="Image" src="https://github.com/user-attachments/assets/a8d91094-c7b2-4a2f-832a-c20e18156e80" />

5. 잠시 기다리면 서버가 꺼졌다가 켜지고 백엔드에서 AWS 설정에 따라 데이터가 모두 지워지기도 한다.
</details>

---

## 📕 기술적 고민

<!--📕템플릿
<details>
<summary>🔹 템플릿</summary>

<details>
<summary>템플릿</summary>
</details>

</details>-->


<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=footer" />
