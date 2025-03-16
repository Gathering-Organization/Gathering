import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="select-none">
      <Header />
      <Outlet />
      <div className="pb-[120px]"></div>
      <Footer />
    </div>
  );
};

export default Layout;
