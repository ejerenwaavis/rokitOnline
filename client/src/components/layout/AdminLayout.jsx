import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, Images, BookOpen,
  Settings, Users, Menu, X, LogOut, ChevronRight,
  MessageSquare, Star
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Images },
  { to: '/admin/tutorials', label: 'Tutorials', icon: BookOpen },
  { to: '/admin/services', label: 'Services', icon: Settings },
  { to: '/admin/clients', label: 'Clients', icon: Star },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-rokit-dark flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rokit-mid-dark">
          <NavLink to="/" className="flex items-center">
            <img src="/assets/images/rokit-logo-white.png" alt="Rokit Media" className="h-8"
              onError={(e) => { e.target.style.display='none'; }}
            />
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-5 py-3 bg-rokit-orange/10 border-b border-rokit-mid-dark">
          <p className="text-xs text-rokit-orange font-semibold uppercase tracking-widest">Admin Panel</p>
          <p className="text-sm text-white font-medium truncate">{user?.name}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((navItem) => {
            const NavIcon = navItem.icon;
            return (
            <NavLink
              key={navItem.to}
              to={navItem.to}
              end={navItem.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 mb-1 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-rokit-orange text-white'
                    : 'text-gray-400 hover:text-white hover:bg-rokit-mid-dark'
                }`
              }
            >
              <NavIcon size={18} />
              {navItem.label}
              <ChevronRight size={14} className="ml-auto" />
            </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-rokit-mid-dark pt-3">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white mb-1">
            <MessageSquare size={18} /> View Site
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-rokit-mid-dark transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:text-rokit-orange">
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-rokit-dark">Admin Panel</h1>
          <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
