<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" />

## 📕 배운점
<details>
<summary>🔹 정규표현식으로 닉네임 유효성 검사</summary>

- **상황**
    - 간단한 설명 또는 발생한 문제
    - (예: 닉네임 입력값이 한글 1~6자리인지 검증이 필요했음)

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

<details>
<summary>🔹 다크모드</summary>

- tailwind.config.js 파일에서 module.exports에 darkMode 설정을 넣지 않으면 다크모드 관련 유틸리티 클래스를 생성하지 않으므로 다크모드가 적용되지 않는다.
- darkMode의 값을 **“media”** 로 설정하면 시스템 다크 모드 설정에 따라 자동으로 적용된다.
- darkMode의 값을 **“class”** 로 설정하면 클래스를 루트 요소나 특정 요소에 수동으로 붙여서 다크 모드를 적용하게 된다.
- darkMode의 값을 **“selector”** darkMode.selector를 직접 지정하여 다크 모드 토글 기준을 커스터마이징할 수 있다. (Tailwind CSS 3.4 이상에서 도입된 방식)

</details>

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

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=footer" />
