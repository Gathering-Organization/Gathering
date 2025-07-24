import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getMyProfile, getUserProfile } from '@/services/profileApi';
import { ProfileAllInfo } from '@/types/profile';

export interface ProfileContextType {
  myProfile: ProfileAllInfo;
  isMyProfileLoading: boolean;
  updateProfileData: (updatedData: Partial<ProfileAllInfo>) => void;
}

export const ProfileStateContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myProfile, setProfile] = useState<ProfileAllInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: '',
    public: false,
    portfolio: null,
    workExperiences: [],
    totalProjects: 0,
    openedProjects: 0,
    closedProjects: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [isMyProfileLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const result = await getMyProfile();
      if (result?.success) {
        setProfile({
          nickname: result.data.nickname || '',
          introduction: result.data.introduction || '',
          organization: result.data.organization || '',
          techStacks: result.data.techStacks || [],
          profileColor: result.data.profileColor || '',
          public: result.data.public || false,
          portfolio: result.data.portfolio || null,
          workExperiences: result.data.workExperiences || [],
          totalProjects: result.data.totalProjects,
          openedProjects: result.data.openedProjects,
          closedProjects: result.data.closedProjects,
          totalApplications: result.data.totalApplications,
          pendingApplications: result.data.pendingApplications,
          approvedApplications: result.data.approvedApplications,
          rejectedApplications: result.data.rejectedApplications
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = useCallback((updatedData: Partial<ProfileAllInfo>) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const value = useMemo(
    () => ({ myProfile, isMyProfileLoading, updateProfileData }),
    [myProfile, isMyProfileLoading, updateProfileData]
  );

  return <ProfileStateContext.Provider value={value}>{children}</ProfileStateContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileStateContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
