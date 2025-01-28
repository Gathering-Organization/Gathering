export interface WorkExperience {
  startDate: string;
  endDate: string;
  activityName: string;
  jobDetail: string;
  description: string;
}

export interface ProfileInfo {
  profileColor: string;
  nickname: string;
  introduction: string;
  techStacks: string[];
  organization: string;
}

export interface Portfolio {
  url: string;
  fileName: string;
}
