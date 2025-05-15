import { WorkExperience } from '@/types/profile';
import { Portfolio } from '@/types/profile';

export interface ApplyInfo {
  projectId: number;
  position: string;
  message: string;
}

export interface ApplyDetails {
  id: number;
  nickname: string;
  projectId: number;
  position: string;
  message: string;
  status: string;
  profileColor: string;
  workExperiences: WorkExperience[];
  organization: string;
  portfolio?: Portfolio | null;
  techStacks: string[];
}
