import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <div className="pb-[120px]"></div>
      <Footer />
    </>
  );
};

export default Layout;
