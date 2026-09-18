import { Outlet } from 'react-router-dom';

import { Footer } from './Footer.jsx';
import { Navbar } from './Navbar.jsx';
import { ScrollToTop } from '../common/ScrollToTop.jsx';
import { ServerWakeNotice } from '../common/ServerWakeNotice.jsx';
import { useServerHealth } from '../../hooks/useServerHealth.js';

export function StoreLayout() {
  const serverStatus = useServerHealth();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ServerWakeNotice status={serverStatus} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
