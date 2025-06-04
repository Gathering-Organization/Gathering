export interface WorkExperience {
  startDate: string;
  endDate: string;
  activityName: string;
  description: string;
  techStacks: string[];
}

export interface ProfileInfo {
  profileColor: string;
  nickname: string;
  introduction: string;
  techStacks: string[];
  organization: string;
}

export interface ProfileAllInfo {
  profileColor: string;
  nickname: string;
  introduction: string;
  techStacks: string[];
  portfolio?: Portfolio | null;
  public: boolean;
  workExperiences: WorkExperience[];
  organization: string;
  totalProjects: number;
  openedProjects: number;
  closedProjects: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface Portfolio {
  url: string;
  fileName: string;
}
