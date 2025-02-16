import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getMyProfile } from '@/services/profileApi';
import { ProfileInfo } from '@/types/profile';
import { Portfolio } from '@/types/profile';
import { WorkExperience } from '@/types/profile';

interface ProfileContextType {
  profile: ProfileInfo;
  isLoading: boolean;
}

export const ProfileStateContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileInfo>({
    nickname: '',
    introduction: '',
    organization: '',
    techStacks: [],
    profileColor: ''
  });
  const [uploadedFile, setUploadedFile] = useState<Portfolio | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workExperiences, setWorkExperiences] = useState<Array<WorkExperience>>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getMyProfile();
        if (result?.success) {
          console.log('Profile fetched:', result.data);
          setIsPublic(result.data.public);
          if (result.data.portfolio) {
            setUploadedFile(result.data.portfolio);
          }
          setProfile({
            nickname: result.data.nickname || '',
            introduction: result.data.introduction || '',
            organization: result.data.organization || '',
            techStacks: result.data.techStacks || [],
            profileColor: result.data.profileColor || ''
          });
          setWorkExperiences(result.data.workExperiences || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const value = useMemo(
    () => ({ profile, isPublic, workExperiences, uploadedFile, isLoading }),
    [profile, isPublic, workExperiences, uploadedFile, isLoading]
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
