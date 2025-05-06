import { Portfolio, WorkExperience } from '@/types/profile';

export interface TeamInfo {
  introduction: string;
  nickname: string;
  portfolio: Portfolio;
  profileColor: string;
  public: boolean;
  techStacks: string[];
  workExperiences: WorkExperience[];
}

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
  teams: string[]; // 팀원 태그
  requiredPositions: string[]; // 모집 분야
  createdAt?: string; // 생성일
  updatedAt?: string; // 수정일
  closed?: boolean; // 모집 마감 여부
}

export interface GetPostingInfo {
  projectId: number; // 프로젝트 ID
  interested: boolean; // 관심 체크 여부
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
  teams: TeamInfo[]; // 팀원 태그
  requiredPositions: string[]; // 모집 분야
  createdAt?: string; // 생성일
  updatedAt?: string; // 수정일
  closed?: boolean; // 모집 마감 여부
}

export interface approxPostInfo {
  projectId: number; // 프로젝트 아이디 번호
  profileColor: string;
  authorNickname: string;
  closed: boolean;
  interested: boolean;
  title: string;
  projectType: string;
  createdAt: string;
  deadline: string;
  techStacks: string[];
  requiredPositions: string[];
  viewCount: number;
  status?: string;
}

export interface partPostInfo {
  profileColor: string;
  viewCount: number;
  projectId: number;
  authorNickname: string;
  closed: boolean;
  interested: boolean;
  kakaoUrl: string;
  title: string;
  description: string;
  projectMode: string;
  projectType: string;
  duration: string;
  totalMembers: number;
  startDate: string;
  teams: { id: number; nickname: string }[];
  createdAt: string;
  updatedAt: string;
  deadline: string;
  techStacks: string[];
  requiredPositions: string[];
  applied: boolean;
  applyStatus: string | null;
}
