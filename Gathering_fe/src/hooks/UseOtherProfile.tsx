import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/profileApi';
import { ProfileAllInfo } from '@/types/profile';

export const useOtherProfile = (userNickname: string | null) => {
  const [profile, setProfile] = useState<ProfileAllInfo>({
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userNickname) {
          setError('Invalid nickname');
          return;
        }

        const response = await getUserProfile(userNickname);

        if (response?.success) {
          setProfile(response.data);
        } else {
          setError(response?.message || 'Profile not found');
        }
      } catch (err) {
        setError('Error fetching profile');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userNickname]);

  return { profile, isLoading, error };
};
