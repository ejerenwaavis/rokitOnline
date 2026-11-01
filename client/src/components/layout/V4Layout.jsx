import { Outlet } from 'react-router-dom';
import { RokitSiteHeader } from '@/components/rokit-site-header';
import { RokitSiteFooter } from '@/components/rokit-site-footer';
import CookieBanner from '../ui/CookieBanner';

export default function V4Layout() {
  return (
    <div className="min-h-screen bg-night text-paper font-body selection:bg-signal selection:text-night flex flex-col justify-between">
      <RokitSiteHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <RokitSiteFooter />
      <CookieBanner />
    </div>
  );
}
