export interface PostingInfo {
  title: string; // 제목
  description: string; // 설명
  kakaoUrl: string; // 카카오톡 오픈채팅 URL
  projectType: string; // 프로젝트 유
  projectMode: string; // 진행 방식
  totalMembers: number; // 총 모집 인원
  startDate: string; // 시작 날짜 (ISO 문자열)
  duration: string; // 예상 기간
  deadline: string; // 마감 날짜 (ISO 문자열)
  techStacks: string[]; // 기술 스택
  teams: { id: number; nickname: string }[]; // 팀원 태그
  requiredPositions: string[]; // 모집 분야
  createdAt?: string; // 생성일
  updatedAt?: string; // 수정일
  closed?: boolean; // 모집 마감 여부
}

export interface approxPostInfo {
  projectId: number; // 프로젝트 아이디 번호
  authorNickname: string;
  closed: boolean;
  title: string;
  projectType: string;
  createdAt: string;
  deadline: string;
  techStacks: string[];
  requiredPositions: string[];
}

export interface partPostInfo {
  projectId: number;
  authorNickname: string;
  closed: boolean;
  title: string;
  description: string;
  projectMode: string;
  projectType: string;
  totalMembers: number;
  startDate: string;
  teams: { id: number; nickname: string }[];
  createdAt: string;
  updatedAt: string;
  deadline: string;
  techStacks: string[];
  requiredPositions: string[];
}
