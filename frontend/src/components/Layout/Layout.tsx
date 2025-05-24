import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from '../UI/LoadingSpinner';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
