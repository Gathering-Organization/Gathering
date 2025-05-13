import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();

  const hideHeaderPaths = ['/apply/view'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <div className="select-none">
      {!shouldHideHeader ? <Header /> : <div className="h-[100px]" />}
      <div className="pt-[72px]"></div>
      <Outlet />
      <div className="pb-[120px]"></div>
      <Footer />
    </div>
  );
};

export default Layout;
