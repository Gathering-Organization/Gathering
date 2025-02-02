export interface PostingInfo {
  title: string; // 제목
  description: string; // 설명
  kakaoUrl: string; // 카카오톡 오픈채팅 URL
  projectType: string; // 프로젝트 유형 (PROJECT, HACKATHON, STUDY)
  projectMode: string; // 진행 방식 (ONLINE, OFFLINE, BLENDED)
  totalMembers: number; // 총 모집 인원
  startDate: string; // 시작 날짜 (ISO 문자열)
  duration: string; // 예상 기간 (예: "1개월", "2개월")
  deadline: string; // 마감 날짜 (ISO 문자열)
  techStacks: string[]; // 기술 스택 (예: ["React", "Spring"])
  teams: { id: number; nickname: string }[]; // 팀원 태그
  requiredPositions: string[]; // 모집 분야 (예: ["프론트엔드", "백엔드"])
  createdAt?: string; // 생성일 (옵셔널, 백엔드에서 처리 가능)
  updatedAt?: string; // 수정일 (옵셔널, 백엔드에서 처리 가능)
  closed?: boolean; // 모집 마감 여부 (옵셔널, 기본값 false)
}

export interface approxPostInfo {
  authorNickname: string;
  closed: boolean;
  title: string;
  projectType: string;
  createdAt: string;
  deadline: string;
  techStacks: string[];
  requiredPositions: string[];
}
