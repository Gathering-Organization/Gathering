import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleRedirectHandler from '@/components/GoogleRedirectHandler';
import Profile from './components/Profile';
import Main from './components/Main';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleRedirectHandler />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
