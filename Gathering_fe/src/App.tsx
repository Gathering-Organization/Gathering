import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleRedirectHandler from '@/components/GoogleRedirectHandler';
import Header from '@/components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleRedirectHandler />} />
        <Route path="/" element={<Header />} />
      </Routes>
    </Router>
  );
};

export default App;
