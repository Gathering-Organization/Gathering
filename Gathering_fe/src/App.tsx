import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './contexts/ProfileStateContext';
import GoogleRedirectHandler from '@/components/GoogleRedirectHandler';
import Profile from '@/pages/Profile';
import Main from '@/components/Main';
import Layout from '@/components/Layout';
import PostHome from '@/pages/PostHome';
import Posting from '@/pages/Posting';
import ViewPost from '@/pages/ViewPost';
import PostEdit from '@/pages/PostEdit';
import Notfound from '@/pages/Notfound';
import Apply from '@/pages/Apply';
import SignUp from '@/pages/SignUp';
import MyPostHome from '@/pages/MyPostHome';
import OtherUserProfile from '@/pages/OtherUserProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
import MyApplication from '@/pages/MyApplication';
import { ToastProvider } from '@/contexts/ToastContext';
import Admin from '@/pages/Admin';

// 0. 회원 정보 관련 사이트
// - "/profile" : 회원의 프로필 정보를 조회 및 수정하는 Profile 페이지
// - "/signup" : 회원가입을 할 수 있는 SignUp 페이지

// 1. 모집글 관련 페이지
// - "/postHome" : 모든 모집글들을 조회하는 PostHome 페이지
// - "/posting" : 새로운 모집글을 작성하는 Posting 페이지
// - "/viewPost" : 모집글을 볼 수 있는 ViewPost 페이지
// - "/postEdit" : 모집글을 수정할 수 있는 postEdit 페이지
// - "/myPostHome" : 내 모집글들을 조회하는 MyPostHome 페이지

// 2. 지원서 관련 페이지
// - "/apply" : 지원서를 볼 수 있는 Apply 페이지
// - "/myApplication" : 내 지원서들을 조회하는 MyApplication 페이지

// 3. 프로필 관련 페이지
// - "/profile" : 내 프로필을 조회 및 수정하는 Profile 페이지
// - "/otherUserProfile" : 타인의 프로필을 조회하는 OtherUserProfile 페이지

// 4. 관리자 관련 페이지
// - "/admin" : 유저 수, 멤버 id 조회, 멤버 역할 전환, 모집글 search (isDeleted 포함), 모집글 삭제를 할 수 있는 Admin 페이지

const App: React.FC = () => {
  return (
    <>
      <Router>
        <ProfileProvider>
          <ToastProvider>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth/google/callback" element={<GoogleRedirectHandler />} />
              <Route element={<Layout />}>
                {/* <Route path="/" element={<Main />} /> */}
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/" element={<PostHome />} />
                <Route
                  path="/myPostHome"
                  element={
                    <ProtectedRoute>
                      <MyPostHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/myApplication"
                  element={
                    <ProtectedRoute>
                      <MyApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/otherUserProfile/:nickname"
                  element={
                    <ProtectedRoute>
                      <OtherUserProfile />
                    </ProtectedRoute>
                  }
                />
                {/* <Route path="/postHome" element={<PostHome />} /> */}
                <Route
                  path="/posting"
                  element={
                    <ProtectedRoute>
                      <Posting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/viewPost/:id"
                  element={
                    <ProtectedRoute>
                      <ViewPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/postEdit/:id"
                  element={
                    <ProtectedRoute>
                      <PostEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/apply/:id" element={<Apply />} />
                <Route path="*" element={<Notfound />} />
              </Route>
            </Routes>
          </ToastProvider>
        </ProfileProvider>
      </Router>
    </>
  );
};

export default App;
