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
}

export interface Portfolio {
  url: string;
  fileName: string;
}
