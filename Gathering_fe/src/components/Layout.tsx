import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();

  const hideHeaderPaths = ['/apply/view'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen select-none">
      {!shouldHideHeader ? <Header /> : <div className="h-[100px]" />}
      <main
        className={`flex-grow ${!shouldHideHeader ? 'pt-[72px]' : ''} min-h-[calc(150vh-72px)]`}
      >
        <Outlet />
      </main>
      <div className="pt-[120px]" />
      <Footer />
    </div>
  );
};

export default Layout;
