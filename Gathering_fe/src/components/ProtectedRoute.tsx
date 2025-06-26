// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileStateContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { myProfile, isMyProfileLoading, updateProfileData } = useProfile();

  // 로그인이 되어 있지 않다면 postHome으로 이동
  if (myProfile.nickname === '') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
