import { Outlet } from 'react-router-dom';
import RokitSiteHeader from './RokitSiteHeader';
import RokitSiteFooter from './RokitSiteFooter';
import CookieBanner from '../ui/CookieBanner';

export default function V4Layout() {
  return (
    <div className="min-h-screen bg-night text-paper font-v4-body selection:bg-signal selection:text-night flex flex-col justify-between">
      <RokitSiteHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <RokitSiteFooter />
      <CookieBanner />
    </div>
  );
}
