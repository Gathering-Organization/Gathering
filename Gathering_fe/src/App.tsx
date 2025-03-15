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

// 1. 모집글 관련 사이트
// - "/postHome" : 모든 모집글들을 조회하는 PostHome 페이지
// - "/posting" : 새로운 모집글을 작성하는 Posting 페이지
// - "/viewPost" : 모집글을 볼 수 있는 ViewPost 페이지
// - "/postEdit" : 모집글을 수정할 수 있는 postEdit 페이지

// 2. 지원서 관련 사이트
// - "/apply" : 지원서를 볼 수 있는 Apply 페이지

const App: React.FC = () => {
  return (
    <>
      <Router>
        <ProfileProvider>
          <Routes>
            <Route path="/auth/google/callback" element={<GoogleRedirectHandler />} />
            <Route element={<Layout />}>
              {/* <Route path="/" element={<Main />} /> */}
              <Route path="/" element={<PostHome />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/postHome" element={<PostHome />} /> */}
              <Route path="/posting" element={<Posting />} />
              <Route path="/viewPost/:id" element={<ViewPost />} />
              <Route path="/postEdit/:id" element={<PostEdit />} />
              <Route path="/apply/:id" element={<Apply />} />
              <Route path="*" element={<Notfound />} />
            </Route>
          </Routes>
        </ProfileProvider>
      </Router>
    </>
  );
};

export default App;
