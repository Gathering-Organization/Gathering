<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" />

## 📕 문제 상황 & 해결 과정

<!-- 모집글 리스트 응답 방식 개선 -->
<details>
<summary>🔹 모집글 리스트 응답 방식 개선</summary>

- **문제 상황**
  - 전체 모집글 목록을 불러오는 API에서 모든 데이터를 `List<ProjectSimpleResponse>` 형식으로 한 번에 반환하고 있었음.
  - 데이터가 많아질수록 응답 시간이 길어지고 메모리 사용량 증가로 인한 성능 저하 가능성이 있었음.

- **해결 방안**
  - 대용량 처리를 위해 페이지 번호(`page`)를 입력받아, 해당 `offset`에 맞춰 필요한 개수만큼 잘라 `List`에 담아 반환하도록 구현.
  - 불필요한 전체 데이터 반환을 피하고, 사용자가 요청한 범위의 데이터만 선별적으로 전달 → **응답 속도 및 리소스 사용 최적화**

</details>

---

<!-- 검색/정렬/필터링을 위한 동적 쿼리 구성 방법 선택 -->
<details>
<summary>🔹 검색/정렬/필터링을 위한 동적 쿼리 구성 방법 선택</summary>

- **문제 상황**
  - 필터링 / 검색 / 정렬 기능을 지원해야 함 → 이를 위해 **동적 쿼리 조건 구성** 필요.

- **고려한 방법**
  - `Specification`
  - `QueryDSL`

- **선택 기준**
  - 조건의 복잡성
  - 유지보수 용이성
  - 코드의 안정성 (타입 안정성 등)

- **선택**
  - 가독성, 타입 안정성, 유지보수성 측면에서 뛰어난 **QueryDSL**을 선택.

- **적용**
  - `QueryDSL`을 사용하여 Custom Repository 구현.
  - 동적 쿼리 조건을 구성해 필터링 / 검색 / 정렬 기능을 유연하게 처리.

</details>

---

<!-- Page 응답으로 프론트 페이지네이션 정보 제공 -->
<details>
<summary>🔹 Page 응답으로 프론트 페이지네이션 정보 제공</summary>

- **문제 상황**
  - 백엔드에서 페이지네이션을 적용했지만, 프론트엔드에서 **전체 페이지 수**와 **전체 데이터 수** 등의 정보를 확인할 수 없었음.

- **해결 방안**
  - 기존에는 `List<ProjectSimpleResponse>`만 응답했지만, `Page<ProjectSimpleResponse>`를 그대로 리턴하도록 변경.
  - Spring Data JPA의 `Page` 객체는 `totalPages`, `totalElements`, `number`, `size` 등의 메타데이터를 자동으로 포함.

- **결과**
  - 프론트는 응답 메타데이터를 활용해 **전체 페이지 수**, **현재 페이지 번호**, **다음 페이지 존재 여부** 등을 즉시 확인 가능.
  - 페이지네이션 UI 완전 구현 가능.

</details>

---

<!-- 지원서 작성 시점 프로필 정보 고정(스냅샷) 필요성 -->
<details>
<summary>🔹 지원서 작성 시점 프로필 정보 고정(스냅샷) 필요성</summary>

- **문제 상황**
  - `Application(지원서)` 객체는 작성 당시 사용자의 정보를 참조하기 위해 `Profile` 객체를 포함하고 있음.
  - 하지만 사용자가 지원서 작성 후 `Profile`을 수정하면, **이미 제출된 지원서의 정보까지 변경되는 문제** 발생.
  - 즉, **지원 당시의 프로필 상태**가 보존되지 않고 항상 최신 상태로 보여지는 문제가 있었음.

- **원인 분석**
  - `Application` 객체가 JPA 연관관계를 통해 `Profile`을 직접 참조.
  - `@Transactional` 범위 내에서 지연 로딩된 `Profile` 변경 → 연결된 모든 곳에서 해당 변경 내용 반영.
  - 지원서 제출 이후 지원자가 자신의 프로필을 변경하면, **이미 제출된 지원서 내용도 변경됨**.

- **해결 방안: Profile Snapshot 저장**
  - `Profile` 객체 전체를 **JSON 직렬화**하여 문자열 형태로 저장하도록 변경.
  - `Application` 도메인에 다음 메서드 추가:
    - `private String serializeProfile(Profile profile)`
    - `private Profile getProfileFromSnapshot()`
  - 직렬화/역직렬화에 **Jackson ObjectMapper** 사용:

    ```java
    objectMapper.writeValueAsString(profile); // 직렬화
    objectMapper.readValue(snapshot, Profile.class); // 역직렬화
    ```

<details>
<summary>추가 문제 발생 : 직렬화 시 연관된 필드 issue</summary>

- **문제 상황: @ElementCollection 연관 필드**
  - `Profile`에는 다음과 같은 연관된 컬렉션 필드 존재:
    - `techStacks` (예: 사용 기술 목록)
    - `workExperiences` (예: 경력 사항 등)
  - 이들은 `@ElementCollection`으로 별도 테이블에 저장됨 → **Lazy Loading**으로 인해 직렬화 시 자동 포함되지 않을 수 있음.
  - `ObjectMapper.writeValueAsString(profile)` 호출 시, JPA가 컬렉션을 아직 로딩하지 않았다면 `[]`로 직렬화됨.

- **해결 방안: 직렬화 전 강제 로딩**
  - 직렬화 전에 명시적으로 컬렉션 필드를 강제로 로딩해야 함:

    ```java
    // 직렬화 이전
    profile.getTechStacks().size();
    profile.getWorkExperiences().size();

    ObjectMapper.writeValueAsString(profile); // profile 객체 직렬화
    ```

  - 이렇게 하면 JPA가 컬렉션을 로딩한 상태로, **정확한 스냅샷 저장 가능**.

</details>
</details>

---

관심글 기능 구현

---

포트폴리오 업로드 기능: S3 권한 문제 해결 과정

---

계정 로그인 문제

---

---

<!-- 템플릿 -->
<!-- 
<details>
<summary>🔹 템플릿</summary>

<details>
<summary>템플릿</summary>
</details>

</details>
-->

<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=footer" />
