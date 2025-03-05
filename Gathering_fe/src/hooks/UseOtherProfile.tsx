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
    workExperiences: []
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
