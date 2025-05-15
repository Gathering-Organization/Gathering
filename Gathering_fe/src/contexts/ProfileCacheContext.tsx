import { createContext, useContext } from 'react';
import { ProfileAllInfo } from '@/types/profile';

interface ProfileCacheContextType {
  profileCache: { [nickname: string]: ProfileAllInfo };
}

export const ProfileCacheContext = createContext<ProfileCacheContextType>({ profileCache: {} });

export const useProfileCache = () => useContext(ProfileCacheContext);
