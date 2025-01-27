import { Outlet } from 'react-router';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
